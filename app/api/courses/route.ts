import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/auth-options';
import { supabaseAdmin } from '@/lib/db/supabase-admin';
import { z } from 'zod';
import { nanoid } from 'nanoid';

// Validation schema for creating a course
const createCourseSchema = z.object({
  course_code: z.string().min(1, 'Course code is required').max(20),
  subject: z.string().min(1, 'Subject is required').max(10),
  number: z.string().min(1, 'Course number is required').max(10),
  name: z.string().min(1, 'Course name is required').max(255),
  description: z.string().optional(),
  credit_hours: z.number().min(0).max(20),
  prerequisites: z.array(z.string()).optional(),
  corequisites: z.array(z.string()).optional(),
  requirement_tags: z.array(z.string()).optional(),
});

// Validation schema for querying courses
const queryCourseSchema = z.object({
  search: z.string().optional(), // Search by code or name
  subject: z.string().optional(), // Filter by subject
  credit_hours: z.string().optional(), // Filter by credit hours
  limit: z.string().optional(), // Limit results
  offset: z.string().optional(), // Pagination offset
});

// GET /api/courses - List all courses (with optional filtering)
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Parse query parameters
    const { searchParams } = new URL(request.url);
    const queryValidation = queryCourseSchema.safeParse({
      search: searchParams.get('search') || undefined,
      subject: searchParams.get('subject') || undefined,
      credit_hours: searchParams.get('credit_hours') || undefined,
      limit: searchParams.get('limit') || undefined,
      offset: searchParams.get('offset') || undefined,
    });

    if (!queryValidation.success) {
      return NextResponse.json(
        { error: 'Invalid query parameters', details: queryValidation.error.issues },
        { status: 400 }
      );
    }

    const { search, subject, credit_hours, limit, offset } = queryValidation.data;

    // Build query
    let query = supabaseAdmin
      .from('courses')
      .select('*')
      .order('course_code', { ascending: true });

    // Apply filters
    if (search) {
      query = query.or(`course_code.ilike.%${search}%,name.ilike.%${search}%`);
    }

    if (subject) {
      query = query.eq('subject', subject);
    }

    if (credit_hours) {
      query = query.eq('credit_hours', parseInt(credit_hours));
    }

    // Apply pagination
    const limitNum = limit ? parseInt(limit) : 100;
    const offsetNum = offset ? parseInt(offset) : 0;
    query = query.range(offsetNum, offsetNum + limitNum - 1);

    const { data: courses, error } = await query;

    if (error) {
      console.error('Error fetching courses:', error);
      return NextResponse.json(
        { error: 'Failed to fetch courses' },
        { status: 500 }
      );
    }

    return NextResponse.json({ courses });
  } catch (error) {
    console.error('Unexpected error in GET /api/courses:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST /api/courses - Create a new course
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const validation = createCourseSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: 'Invalid course data', details: validation.error.issues },
        { status: 400 }
      );
    }

    const { course_code, subject, number, name, description, credit_hours, prerequisites, corequisites, requirement_tags } = validation.data;

    // Check if course code already exists
    const { data: existingCourse } = await supabaseAdmin
      .from('courses')
      .select('id')
      .eq('course_code', course_code)
      .single();

    if (existingCourse) {
      return NextResponse.json(
        { error: 'Course with this code already exists' },
        { status: 409 }
      );
    }

    // Create the course
    const newCourse = {
      id: nanoid(),
      course_code,
      subject,
      number,
      name,
      description: description || null,
      credit_hours,
      prerequisites: prerequisites || null,
      corequisites: corequisites || null,
      requirement_tags: requirement_tags || null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    const { data: course, error } = await supabaseAdmin
      .from('courses')
      .insert(newCourse)
      .select()
      .single();

    if (error) {
      console.error('Error creating course:', error);
      return NextResponse.json(
        { error: 'Failed to create course' },
        { status: 500 }
      );
    }

    return NextResponse.json({ course }, { status: 201 });
  } catch (error) {
    console.error('Unexpected error in POST /api/courses:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
