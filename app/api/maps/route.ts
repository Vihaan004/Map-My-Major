import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/auth-options';
import { supabaseAdmin } from '@/lib/db/supabase-admin';
import { z } from 'zod';
import { nanoid } from 'nanoid';

// Validation schema for creating a map
const createMapSchema = z.object({
  map_name: z.string().min(1, 'Map name is required').max(100),
  map_university: z.string().optional(),
  map_degree: z.string().optional(),
  map_requirements: z.record(z.string(), z.any()).optional(),
  start_term: z.enum(['FALL', 'SPRING', 'SUMMER']),
  start_year: z.number().int().min(2000).max(2100),
});

/**
 * GET /api/maps
 * Get all maps for the authenticated user
 */
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data: maps, error } = await supabaseAdmin
      .from('maps')
      .select('*')
      .eq('user_id', session.user.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching maps:', error);
      return NextResponse.json(
        { error: 'Failed to fetch maps' },
        { status: 500 }
      );
    }

    return NextResponse.json({ maps });
  } catch (error) {
    console.error('Unexpected error in GET /api/maps:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/maps
 * Create a new map for the authenticated user
 */
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    
    // Validate request body
    const validation = createMapSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: 'Invalid request data', details: validation.error.issues },
        { status: 400 }
      );
    }

    const mapData = validation.data;

    // Create the map
    const { data: map, error } = await supabaseAdmin
      .from('maps')
      .insert({
        id: nanoid(),
        user_id: session.user.id,
        map_name: mapData.map_name,
        map_university: mapData.map_university || null,
        map_degree: mapData.map_degree || null,
        map_requirements: (mapData.map_requirements as any) || null,
        track_total_credits: 0,
        start_term: mapData.start_term,
        start_year: mapData.start_year,
        status: 'ACTIVE',
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating map:', error);
      return NextResponse.json(
        { error: 'Failed to create map' },
        { status: 500 }
      );
    }

    return NextResponse.json({ map }, { status: 201 });
  } catch (error) {
    console.error('Unexpected error in POST /api/maps:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
