import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/auth-options';
import { supabaseAdmin } from '@/lib/db/supabase-admin';
import { z } from 'zod';
import { nanoid } from 'nanoid';

// Validation schema for creating a class
const createClassSchema = z.object({
  semester_id: z.string().min(1, 'Semester ID is required'),
  course_id: z.string().optional(),
  class_code: z.string().min(1, 'Class code is required').max(20),
  class_subject: z.string().min(1, 'Subject is required').max(10),
  class_number: z.string().min(1, 'Class number is required').max(10),
  class_name: z.string().min(1, 'Class name is required').max(255),
  class_credits: z.number().min(0).max(20),
  class_prerequisites: z.array(z.string()).optional(),
  class_corequisites: z.array(z.string()).optional(),
  class_requirement_tags: z.array(z.string()).optional(),
  index: z.number().int().min(0),
  status: z.enum(['PLANNED', 'IN_PROGRESS', 'COMPLETED', 'DROPPED']).optional(),
  grade: z.string().optional(),
});

// POST /api/maps/[mapId]/classes - Create a new class in a map
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ mapId: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { mapId } = await params;

    // Verify map exists and user owns it
    const { data: map, error: mapError } = await supabaseAdmin
      .from('maps')
      .select('*')
      .eq('id', mapId)
      .eq('user_id', session.user.id)
      .single();

    if (mapError || !map) {
      return NextResponse.json(
        { error: 'Map not found or access denied' },
        { status: 404 }
      );
    }

    const body = await request.json();
    const validation = createClassSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: 'Invalid class data', details: validation.error.issues },
        { status: 400 }
      );
    }

    const {
      semester_id,
      course_id,
      class_code,
      class_subject,
      class_number,
      class_name,
      class_credits,
      class_prerequisites,
      class_corequisites,
      class_requirement_tags,
      index,
      status,
      grade,
    } = validation.data;

    // Verify semester belongs to this map
    const { data: semester, error: semesterError } = await supabaseAdmin
      .from('semesters')
      .select('*')
      .eq('id', semester_id)
      .eq('map_id', mapId)
      .single();

    if (semesterError || !semester) {
      return NextResponse.json(
        { error: 'Semester not found in this map' },
        { status: 404 }
      );
    }

    // If course_id is provided, verify it exists
    if (course_id) {
      const { data: course, error: courseError } = await supabaseAdmin
        .from('courses')
        .select('id')
        .eq('id', course_id)
        .single();

      if (courseError || !course) {
        return NextResponse.json(
          { error: 'Course not found' },
          { status: 404 }
        );
      }
    }

    // Create the class
    const newClass = {
      id: nanoid(),
      map_id: mapId,
      semester_id,
      course_id: course_id || null,
      class_code,
      class_subject,
      class_number,
      class_name,
      class_credits,
      class_prerequisites: class_prerequisites || null,
      class_corequisites: class_corequisites || null,
      class_requirement_tags: class_requirement_tags || null,
      index,
      status: status || 'PLANNED',
      grade: grade || null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    const { data: classData, error } = await supabaseAdmin
      .from('classes')
      .insert(newClass)
      .select()
      .single();

    if (error) {
      console.error('Error creating class:', error);
      return NextResponse.json(
        { error: 'Failed to create class' },
        { status: 500 }
      );
    }

    return NextResponse.json({ class: classData }, { status: 201 });
  } catch (error) {
    console.error('Unexpected error in POST /api/maps/[mapId]/classes:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// GET /api/maps/[mapId]/classes - List all classes in a map
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ mapId: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { mapId } = await params;

    // Verify map exists and user owns it
    const { data: map, error: mapError } = await supabaseAdmin
      .from('maps')
      .select('*')
      .eq('id', mapId)
      .eq('user_id', session.user.id)
      .single();

    if (mapError || !map) {
      return NextResponse.json(
        { error: 'Map not found or access denied' },
        { status: 404 }
      );
    }

    // Optional: filter by semester
    const { searchParams } = new URL(request.url);
    const semesterId = searchParams.get('semester_id');

    let query = supabaseAdmin
      .from('classes')
      .select('*')
      .eq('map_id', mapId);

    if (semesterId) {
      query = query.eq('semester_id', semesterId);
    }

    query = query.order('index', { ascending: true });

    const { data: classes, error } = await query;

    if (error) {
      console.error('Error fetching classes:', error);
      return NextResponse.json(
        { error: 'Failed to fetch classes' },
        { status: 500 }
      );
    }

    return NextResponse.json({ classes });
  } catch (error) {
    console.error('Unexpected error in GET /api/maps/[mapId]/classes:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
