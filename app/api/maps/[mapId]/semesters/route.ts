import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/auth-options';
import { supabaseAdmin } from '@/lib/db/supabase-admin';
import { z } from 'zod';
import { nanoid } from 'nanoid';

// Validation schema for creating a semester
const createSemesterSchema = z.object({
  term: z.enum(['FALL', 'SPRING', 'SUMMER']),
  year: z.number().int().min(2000).max(2100),
  index: z.number().int().min(0),
});

// POST /api/maps/[mapId]/semesters - Create a new semester in a map
export async function POST(
  request: NextRequest,
  { params }: { params: { mapId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Verify map exists and user owns it
    const { data: map, error: mapError } = await supabaseAdmin
      .from('maps')
      .select('*')
      .eq('id', params.mapId)
      .eq('user_id', session.user.id)
      .single();

    if (mapError || !map) {
      return NextResponse.json(
        { error: 'Map not found or access denied' },
        { status: 404 }
      );
    }

    const body = await request.json();
    const validation = createSemesterSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: 'Invalid semester data', details: validation.error.issues },
        { status: 400 }
      );
    }

    const { term, year, index } = validation.data;

    // Check if a semester with same term+year already exists in this map
    const { data: existingSemester } = await supabaseAdmin
      .from('semesters')
      .select('id')
      .eq('map_id', params.mapId)
      .eq('term', term)
      .eq('year', year)
      .single();

    if (existingSemester) {
      return NextResponse.json(
        { error: 'A semester with this term and year already exists in this map' },
        { status: 409 }
      );
    }

    // Create the semester
    const newSemester = {
      id: nanoid(),
      map_id: params.mapId,
      term,
      year,
      index,
    };

    const { data: semester, error } = await supabaseAdmin
      .from('semesters')
      .insert(newSemester)
      .select()
      .single();

    if (error) {
      console.error('Error creating semester:', error);
      return NextResponse.json(
        { error: 'Failed to create semester' },
        { status: 500 }
      );
    }

    return NextResponse.json({ semester }, { status: 201 });
  } catch (error) {
    console.error('Unexpected error in POST /api/maps/[mapId]/semesters:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// GET /api/maps/[mapId]/semesters - List all semesters in a map
export async function GET(
  request: NextRequest,
  { params }: { params: { mapId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Verify map exists and user owns it
    const { data: map, error: mapError } = await supabaseAdmin
      .from('maps')
      .select('*')
      .eq('id', params.mapId)
      .eq('user_id', session.user.id)
      .single();

    if (mapError || !map) {
      return NextResponse.json(
        { error: 'Map not found or access denied' },
        { status: 404 }
      );
    }

    // Get all semesters for this map
    const { data: semesters, error } = await supabaseAdmin
      .from('semesters')
      .select('*')
      .eq('map_id', params.mapId)
      .order('index', { ascending: true });

    if (error) {
      console.error('Error fetching semesters:', error);
      return NextResponse.json(
        { error: 'Failed to fetch semesters' },
        { status: 500 }
      );
    }

    return NextResponse.json({ semesters });
  } catch (error) {
    console.error('Unexpected error in GET /api/maps/[mapId]/semesters:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
