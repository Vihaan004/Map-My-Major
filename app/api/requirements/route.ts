import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/auth-options';
import { supabaseAdmin } from '@/lib/db/supabase-admin';
import { z } from 'zod';
import { nanoid } from 'nanoid';

// Validation schema for creating a requirement
const createRequirementSchema = z.object({
  tag: z.string().min(1, 'Tag is required').max(50),
  name: z.string().min(1, 'Name is required').max(255),
  description: z.string().optional(),
  type: z.enum(['CREDIT_HOURS', 'CLASS_COUNT']),
  category: z.string().optional(),
  is_custom: z.boolean().optional(),
});

// Validation schema for querying requirements
const queryRequirementSchema = z.object({
  search: z.string().optional(),
  type: z.string().optional(),
  category: z.string().optional(),
  is_custom: z.string().optional(),
});

// GET /api/requirements - List all requirements
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Parse query parameters
    const { searchParams } = new URL(request.url);
    const queryValidation = queryRequirementSchema.safeParse({
      search: searchParams.get('search') || undefined,
      type: searchParams.get('type') || undefined,
      category: searchParams.get('category') || undefined,
      is_custom: searchParams.get('is_custom') || undefined,
    });

    if (!queryValidation.success) {
      return NextResponse.json(
        { error: 'Invalid query parameters', details: queryValidation.error.issues },
        { status: 400 }
      );
    }

    const { search, type, category, is_custom } = queryValidation.data;

    // Build query
    let query = supabaseAdmin
      .from('requirements')
      .select('*')
      .order('name', { ascending: true });

    // Apply filters
    if (search) {
      query = query.or(`name.ilike.%${search}%,tag.ilike.%${search}%`);
    }

    if (type && (type === 'CREDIT_HOURS' || type === 'CLASS_COUNT')) {
      query = query.eq('type', type as 'CREDIT_HOURS' | 'CLASS_COUNT');
    }

    if (category) {
      query = query.eq('category', category);
    }

    if (is_custom) {
      query = query.eq('is_custom', is_custom === 'true');
    }

    const { data: requirements, error } = await query;

    if (error) {
      console.error('Error fetching requirements:', error);
      return NextResponse.json(
        { error: 'Failed to fetch requirements' },
        { status: 500 }
      );
    }

    return NextResponse.json({ requirements });
  } catch (error) {
    console.error('Unexpected error in GET /api/requirements:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST /api/requirements - Create a new requirement
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const validation = createRequirementSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: 'Invalid requirement data', details: validation.error.issues },
        { status: 400 }
      );
    }

    const { tag, name, description, type, category, is_custom } = validation.data;

    // Check if a requirement with the same tag already exists
    const { data: existingRequirement } = await supabaseAdmin
      .from('requirements')
      .select('id')
      .eq('tag', tag)
      .single();

    if (existingRequirement) {
      return NextResponse.json(
        { error: 'A requirement with this tag already exists' },
        { status: 409 }
      );
    }

    // Create the requirement
    const newRequirement = {
      id: nanoid(),
      tag,
      name,
      description: description || null,
      type,
      category: category || null,
      is_custom: is_custom !== undefined ? is_custom : true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    const { data: requirement, error } = await supabaseAdmin
      .from('requirements')
      .insert(newRequirement)
      .select()
      .single();

    if (error) {
      console.error('Error creating requirement:', error);
      return NextResponse.json(
        { error: 'Failed to create requirement' },
        { status: 500 }
      );
    }

    return NextResponse.json({ requirement }, { status: 201 });
  } catch (error) {
    console.error('Unexpected error in POST /api/requirements:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
