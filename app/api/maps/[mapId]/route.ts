import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/auth-options';
import { supabaseAdmin } from '@/lib/db/supabase-admin';
import { z } from 'zod';

// Validation schema for updating a map
const updateMapSchema = z.object({
  map_name: z.string().min(1).max(100).optional(),
  map_university: z.string().optional(),
  map_degree: z.string().optional(),
  map_requirements: z.record(z.string(), z.any()).optional(),
  start_term: z.enum(['FALL', 'SPRING', 'SUMMER']).optional(),
  start_year: z.number().int().min(2000).max(2100).optional(),
  status: z.enum(['ACTIVE', 'ARCHIVED', 'COMPLETED']).optional(),
});

/**
 * GET /api/maps/[mapId]
 * Get a specific map by ID
 */
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ mapId: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { mapId } = await params;

    const { data: map, error } = await supabaseAdmin
      .from('maps')
      .select('*')
      .eq('id', mapId)
      .eq('user_id', session.user.id)
      .single();

    if (error || !map) {
      return NextResponse.json(
        { error: 'Map not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ map });
  } catch (error) {
    console.error('Unexpected error in GET /api/maps/[mapId]:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/maps/[mapId]
 * Update a specific map
 */
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ mapId: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { mapId } = await params;

    const body = await req.json();
    
    // Validate request body
    const validation = updateMapSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: 'Invalid request data', details: validation.error.issues },
        { status: 400 }
      );
    }

    const updateData = validation.data;

    // Check if map exists and belongs to user
    const { data: existingMap } = await supabaseAdmin
      .from('maps')
      .select('id')
      .eq('id', mapId)
      .eq('user_id', session.user.id)
      .single();

    if (!existingMap) {
      return NextResponse.json(
        { error: 'Map not found' },
        { status: 404 }
      );
    }

    // Update the map
    const { data: map, error } = await supabaseAdmin
      .from('maps')
      .update({
        ...updateData,
        map_requirements: updateData.map_requirements as any,
        updated_at: new Date().toISOString(),
      })
      .eq('id', mapId)
      .select()
      .single();

    if (error) {
      console.error('Error updating map:', error);
      return NextResponse.json(
        { error: 'Failed to update map' },
        { status: 500 }
      );
    }

    return NextResponse.json({ map });
  } catch (error) {
    console.error('Unexpected error in PUT /api/maps/[mapId]:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/maps/[mapId]
 * Delete a specific map
 */
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ mapId: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { mapId } = await params;

    // Check if map exists and belongs to user
    const { data: existingMap } = await supabaseAdmin
      .from('maps')
      .select('id')
      .eq('id', mapId)
      .eq('user_id', session.user.id)
      .single();

    if (!existingMap) {
      return NextResponse.json(
        { error: 'Map not found' },
        { status: 404 }
      );
    }

    // Delete the map (cascading delete will handle semesters and classes)
    const { error } = await supabaseAdmin
      .from('maps')
      .delete()
      .eq('id', mapId);

    if (error) {
      console.error('Error deleting map:', error);
      return NextResponse.json(
        { error: 'Failed to delete map' },
        { status: 500 }
      );
    }

    return NextResponse.json({ message: 'Map deleted successfully' });
  } catch (error) {
    console.error('Unexpected error in DELETE /api/maps/[mapId]:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
