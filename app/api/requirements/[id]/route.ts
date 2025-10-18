import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/auth-options';
import { supabaseAdmin } from '@/lib/db/supabase-admin';
import { z } from 'zod';

// Validation schema for updating a requirement
const updateRequirementSchema = z.object({
  tag: z.string().min(1).max(50).optional(),
  name: z.string().min(1).max(255).optional(),
  description: z.string().optional(),
  type: z.enum(['CREDIT_HOURS', 'CLASS_COUNT']).optional(),
  category: z.string().optional(),
  is_custom: z.boolean().optional(),
});

// GET /api/requirements/[id] - Get a single requirement
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data: requirement, error } = await supabaseAdmin
      .from('requirements')
      .select('*')
      .eq('id', params.id)
      .single();

    if (error || !requirement) {
      return NextResponse.json({ error: 'Requirement not found' }, { status: 404 });
    }

    return NextResponse.json({ requirement });
  } catch (error) {
    console.error('Unexpected error in GET /api/requirements/[id]:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT /api/requirements/[id] - Update a requirement
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const validation = updateRequirementSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: 'Invalid requirement data', details: validation.error.issues },
        { status: 400 }
      );
    }

    // Check if requirement exists
    const { data: existingRequirement, error: fetchError } = await supabaseAdmin
      .from('requirements')
      .select('*')
      .eq('id', params.id)
      .single();

    if (fetchError || !existingRequirement) {
      return NextResponse.json({ error: 'Requirement not found' }, { status: 404 });
    }

    // If updating tag, check for conflicts
    if (validation.data.tag && validation.data.tag !== existingRequirement.tag) {
      const { data: conflictingRequirement } = await supabaseAdmin
        .from('requirements')
        .select('id')
        .eq('tag', validation.data.tag)
        .single();

      if (conflictingRequirement) {
        return NextResponse.json(
          { error: 'A requirement with this tag already exists' },
          { status: 409 }
        );
      }
    }

    // Update the requirement
    const updateData = {
      ...validation.data,
      updated_at: new Date().toISOString(),
    };

    const { data: requirement, error } = await supabaseAdmin
      .from('requirements')
      .update(updateData)
      .eq('id', params.id)
      .select()
      .single();

    if (error) {
      console.error('Error updating requirement:', error);
      return NextResponse.json(
        { error: 'Failed to update requirement' },
        { status: 500 }
      );
    }

    return NextResponse.json({ requirement });
  } catch (error) {
    console.error('Unexpected error in PUT /api/requirements/[id]:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE /api/requirements/[id] - Delete a requirement
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if requirement exists
    const { data: existingRequirement, error: fetchError } = await supabaseAdmin
      .from('requirements')
      .select('*')
      .eq('id', params.id)
      .single();

    if (fetchError || !existingRequirement) {
      return NextResponse.json({ error: 'Requirement not found' }, { status: 404 });
    }

    // Only allow deletion of custom requirements (to protect system requirements)
    if (!existingRequirement.is_custom) {
      return NextResponse.json(
        { error: 'Cannot delete system requirements' },
        { status: 403 }
      );
    }

    // Delete the requirement
    const { error } = await supabaseAdmin
      .from('requirements')
      .delete()
      .eq('id', params.id);

    if (error) {
      console.error('Error deleting requirement:', error);
      return NextResponse.json(
        { error: 'Failed to delete requirement' },
        { status: 500 }
      );
    }

    return NextResponse.json({ message: 'Requirement deleted successfully' });
  } catch (error) {
    console.error('Unexpected error in DELETE /api/requirements/[id]:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
