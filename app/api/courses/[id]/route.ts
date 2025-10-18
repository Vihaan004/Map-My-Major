import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/auth-options';
import { supabaseAdmin } from '@/lib/db/supabase-admin';
import { z } from 'zod';

// Validation schema for updating a course
const updateCourseSchema = z.object({
  course_code: z.string().min(1).max(20).optional(),
  subject: z.string().min(1).max(10).optional(),
  number: z.string().min(1).max(10).optional(),
  name: z.string().min(1).max(255).optional(),
  description: z.string().optional(),
  credit_hours: z.number().min(0).max(20).optional(),
  prerequisites: z.array(z.string()).optional(),
  corequisites: z.array(z.string()).optional(),
  requirement_tags: z.array(z.string()).optional(),
});

// GET /api/courses/[id] - Get a single course
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data: course, error } = await supabaseAdmin
      .from('courses')
      .select('*')
      .eq('id', params.id)
      .single();

    if (error || !course) {
      return NextResponse.json({ error: 'Course not found' }, { status: 404 });
    }

    return NextResponse.json({ course });
  } catch (error) {
    console.error('Unexpected error in GET /api/courses/[id]:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT /api/courses/[id] - Update a course
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
    const validation = updateCourseSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: 'Invalid course data', details: validation.error.issues },
        { status: 400 }
      );
    }

    // Check if course exists
    const { data: existingCourse, error: fetchError } = await supabaseAdmin
      .from('courses')
      .select('*')
      .eq('id', params.id)
      .single();

    if (fetchError || !existingCourse) {
      return NextResponse.json({ error: 'Course not found' }, { status: 404 });
    }

    // If updating course code, check if new code already exists
    if (validation.data.course_code && validation.data.course_code !== existingCourse.course_code) {
      const { data: duplicateCourse } = await supabaseAdmin
        .from('courses')
        .select('id')
        .eq('course_code', validation.data.course_code)
        .single();

      if (duplicateCourse) {
        return NextResponse.json(
          { error: 'Course with this code already exists' },
          { status: 409 }
        );
      }
    }

    // Update the course
    const updateData = {
      ...validation.data,
      updated_at: new Date().toISOString(),
    };

    const { data: course, error } = await supabaseAdmin
      .from('courses')
      .update(updateData)
      .eq('id', params.id)
      .select()
      .single();

    if (error) {
      console.error('Error updating course:', error);
      return NextResponse.json(
        { error: 'Failed to update course' },
        { status: 500 }
      );
    }

    return NextResponse.json({ course });
  } catch (error) {
    console.error('Unexpected error in PUT /api/courses/[id]:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE /api/courses/[id] - Delete a course
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if course exists
    const { data: existingCourse, error: fetchError } = await supabaseAdmin
      .from('courses')
      .select('*')
      .eq('id', params.id)
      .single();

    if (fetchError || !existingCourse) {
      return NextResponse.json({ error: 'Course not found' }, { status: 404 });
    }

    // Check if course is used in any classes
    const { data: classes, error: classCheckError } = await supabaseAdmin
      .from('classes')
      .select('id')
      .eq('course_id', params.id)
      .limit(1);

    if (classCheckError) {
      console.error('Error checking course usage:', classCheckError);
      return NextResponse.json(
        { error: 'Failed to verify course usage' },
        { status: 500 }
      );
    }

    if (classes && classes.length > 0) {
      return NextResponse.json(
        { error: 'Cannot delete course that is used in maps' },
        { status: 400 }
      );
    }

    // Delete the course
    const { error } = await supabaseAdmin
      .from('courses')
      .delete()
      .eq('id', params.id);

    if (error) {
      console.error('Error deleting course:', error);
      return NextResponse.json(
        { error: 'Failed to delete course' },
        { status: 500 }
      );
    }

    return NextResponse.json({ message: 'Course deleted successfully' });
  } catch (error) {
    console.error('Unexpected error in DELETE /api/courses/[id]:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
