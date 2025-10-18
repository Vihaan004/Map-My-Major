import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/auth-options';
import { supabaseAdmin } from '@/lib/db/supabase-admin';
import { z } from 'zod';

// Validation schema for updating a class
const updateClassSchema = z.object({
  semester_id: z.string().optional(),
  course_id: z.string().optional(),
  class_code: z.string().min(1).max(20).optional(),
  class_subject: z.string().min(1).max(10).optional(),
  class_number: z.string().min(1).max(10).optional(),
  class_name: z.string().min(1).max(255).optional(),
  class_credits: z.number().min(0).max(20).optional(),
  class_prerequisites: z.array(z.string()).optional(),
  class_corequisites: z.array(z.string()).optional(),
  class_requirement_tags: z.array(z.string()).optional(),
  index: z.number().int().min(0).optional(),
  status: z.enum(['PLANNED', 'IN_PROGRESS', 'COMPLETED', 'DROPPED']).optional(),
  grade: z.string().optional(),
});

// Validation schema for moving a class to a different semester
const moveClassSchema = z.object({
  semester_id: z.string().min(1, 'Target semester ID is required'),
  index: z.number().int().min(0).optional(),
});

// Helper function to verify class ownership through map
async function verifyClassOwnership(classId: string, userId: string) {
  const { data: classData, error } = await supabaseAdmin
    .from('classes')
    .select('*, maps(user_id)')
    .eq('id', classId)
    .single();

  if (error || !classData) {
    return { owned: false, class: null };
  }

  // TypeScript doesn't know the nested structure, so cast it
  const classWithMap = classData as any;
  const owned = classWithMap.maps?.user_id === userId;

  return { owned, class: owned ? classData : null };
}

// GET /api/classes/[id] - Get a single class
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { owned, class: classData } = await verifyClassOwnership(params.id, session.user.id);

    if (!owned || !classData) {
      return NextResponse.json(
        { error: 'Class not found or access denied' },
        { status: 404 }
      );
    }

    return NextResponse.json({ class: classData });
  } catch (error) {
    console.error('Unexpected error in GET /api/classes/[id]:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT /api/classes/[id] - Update a class
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { owned, class: existingClass } = await verifyClassOwnership(
      params.id,
      session.user.id
    );

    if (!owned || !existingClass) {
      return NextResponse.json(
        { error: 'Class not found or access denied' },
        { status: 404 }
      );
    }

    const body = await request.json();
    const validation = updateClassSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: 'Invalid class data', details: validation.error.issues },
        { status: 400 }
      );
    }

    // If updating semester_id, verify new semester belongs to same map
    if (validation.data.semester_id) {
      const { data: newSemester, error: semesterError } = await supabaseAdmin
        .from('semesters')
        .select('*')
        .eq('id', validation.data.semester_id)
        .eq('map_id', existingClass.map_id)
        .single();

      if (semesterError || !newSemester) {
        return NextResponse.json(
          { error: 'Semester not found in this map' },
          { status: 404 }
        );
      }
    }

    // If updating course_id, verify course exists
    if (validation.data.course_id) {
      const { data: course, error: courseError } = await supabaseAdmin
        .from('courses')
        .select('id')
        .eq('id', validation.data.course_id)
        .single();

      if (courseError || !course) {
        return NextResponse.json(
          { error: 'Course not found' },
          { status: 404 }
        );
      }
    }

    // Update the class
    const updateData = {
      ...validation.data,
      updated_at: new Date().toISOString(),
    };

    const { data: classData, error } = await supabaseAdmin
      .from('classes')
      .update(updateData)
      .eq('id', params.id)
      .select()
      .single();

    if (error) {
      console.error('Error updating class:', error);
      return NextResponse.json(
        { error: 'Failed to update class' },
        { status: 500 }
      );
    }

    return NextResponse.json({ class: classData });
  } catch (error) {
    console.error('Unexpected error in PUT /api/classes/[id]:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE /api/classes/[id] - Delete a class
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { owned, class: classData } = await verifyClassOwnership(params.id, session.user.id);

    if (!owned || !classData) {
      return NextResponse.json(
        { error: 'Class not found or access denied' },
        { status: 404 }
      );
    }

    // Delete the class
    const { error } = await supabaseAdmin
      .from('classes')
      .delete()
      .eq('id', params.id);

    if (error) {
      console.error('Error deleting class:', error);
      return NextResponse.json(
        { error: 'Failed to delete class' },
        { status: 500 }
      );
    }

    return NextResponse.json({ message: 'Class deleted successfully' });
  } catch (error) {
    console.error('Unexpected error in DELETE /api/classes/[id]:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PATCH /api/classes/[id] - Move class to a different semester
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { owned, class: existingClass } = await verifyClassOwnership(
      params.id,
      session.user.id
    );

    if (!owned || !existingClass) {
      return NextResponse.json(
        { error: 'Class not found or access denied' },
        { status: 404 }
      );
    }

    const body = await request.json();
    const validation = moveClassSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: 'Invalid move data', details: validation.error.issues },
        { status: 400 }
      );
    }

    const { semester_id, index } = validation.data;

    // Verify new semester belongs to same map
    const { data: newSemester, error: semesterError } = await supabaseAdmin
      .from('semesters')
      .select('*')
      .eq('id', semester_id)
      .eq('map_id', existingClass.map_id)
      .single();

    if (semesterError || !newSemester) {
      return NextResponse.json(
        { error: 'Semester not found in this map' },
        { status: 404 }
      );
    }

    // Move the class
    const moveData: any = {
      semester_id,
      updated_at: new Date().toISOString(),
    };

    if (index !== undefined) {
      moveData.index = index;
    }

    const { data: classData, error } = await supabaseAdmin
      .from('classes')
      .update(moveData)
      .eq('id', params.id)
      .select()
      .single();

    if (error) {
      console.error('Error moving class:', error);
      return NextResponse.json(
        { error: 'Failed to move class' },
        { status: 500 }
      );
    }

    return NextResponse.json({ class: classData });
  } catch (error) {
    console.error('Unexpected error in PATCH /api/classes/[id]:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
