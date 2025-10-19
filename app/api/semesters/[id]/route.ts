import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/auth-options';
import { supabaseAdmin } from '@/lib/db/supabase-admin';
import { z } from 'zod';

// Validation schema for updating a semester
const updateSemesterSchema = z.object({
  term: z.enum(['FALL', 'SPRING', 'SUMMER']).optional(),
  year: z.number().int().min(2000).max(2100).optional(),
  index: z.number().int().min(0).optional(),
});

// Helper function to verify semester ownership through map
async function verifySemesterOwnership(semesterId: string, userId: string) {
  const { data: semester, error } = await supabaseAdmin
    .from('semesters')
    .select('*, maps(user_id)')
    .eq('id', semesterId)
    .single();

  if (error || !semester) {
    return { owned: false, semester: null };
  }

  // TypeScript doesn't know the nested structure, so cast it
  const semesterWithMap = semester as any;
  const owned = semesterWithMap.maps?.user_id === userId;

  return { owned, semester: owned ? semester : null };
}

// GET /api/semesters/[id] - Get a single semester
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;

    const { owned, semester } = await verifySemesterOwnership(id, session.user.id);

    if (!owned || !semester) {
      return NextResponse.json(
        { error: 'Semester not found or access denied' },
        { status: 404 }
      );
    }

    return NextResponse.json({ semester });
  } catch (error) {
    console.error('Unexpected error in GET /api/semesters/[id]:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT /api/semesters/[id] - Update a semester
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;

    const { owned, semester: existingSemester } = await verifySemesterOwnership(
      id,
      session.user.id
    );

    if (!owned || !existingSemester) {
      return NextResponse.json(
        { error: 'Semester not found or access denied' },
        { status: 404 }
      );
    }

    const body = await request.json();
    const validation = updateSemesterSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: 'Invalid semester data', details: validation.error.issues },
        { status: 400 }
      );
    }

    // If updating term or year, check for conflicts
    if (validation.data.term || validation.data.year) {
      const newTerm = validation.data.term || existingSemester.term;
      const newYear = validation.data.year || existingSemester.year;

      const { data: conflictingSemester } = await supabaseAdmin
        .from('semesters')
        .select('id')
        .eq('map_id', existingSemester.map_id)
        .eq('term', newTerm)
        .eq('year', newYear)
        .neq('id', id)
        .single();

      if (conflictingSemester) {
        return NextResponse.json(
          { error: 'A semester with this term and year already exists in this map' },
          { status: 409 }
        );
      }
    }

    // Update the semester
    const { data: semester, error } = await supabaseAdmin
      .from('semesters')
      .update(validation.data)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating semester:', error);
      return NextResponse.json(
        { error: 'Failed to update semester' },
        { status: 500 }
      );
    }

    return NextResponse.json({ semester });
  } catch (error) {
    console.error('Unexpected error in PUT /api/semesters/[id]:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE /api/semesters/[id] - Delete a semester
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;

    const { owned, semester } = await verifySemesterOwnership(id, session.user.id);

    if (!owned || !semester) {
      return NextResponse.json(
        { error: 'Semester not found or access denied' },
        { status: 404 }
      );
    }

    // Check if semester has any classes
    const { data: classes, error: classCheckError } = await supabaseAdmin
      .from('classes')
      .select('id')
      .eq('semester_id', id)
      .limit(1);

    if (classCheckError) {
      console.error('Error checking semester classes:', classCheckError);
      return NextResponse.json(
        { error: 'Failed to verify semester usage' },
        { status: 500 }
      );
    }

    if (classes && classes.length > 0) {
      return NextResponse.json(
        { error: 'Cannot delete semester that contains classes. Delete classes first.' },
        { status: 400 }
      );
    }

    // Delete the semester
    const { error } = await supabaseAdmin
      .from('semesters')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting semester:', error);
      return NextResponse.json(
        { error: 'Failed to delete semester' },
        { status: 500 }
      );
    }

    return NextResponse.json({ message: 'Semester deleted successfully' });
  } catch (error) {
    console.error('Unexpected error in DELETE /api/semesters/[id]:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
