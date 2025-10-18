import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth/session';
import { supabaseAdmin } from '@/lib/db/supabase-admin';
import MapClient from './MapClient';

export default async function MapPage({ params }: { params: { mapId: string } }) {
  const user = await getCurrentUser();

  if (!user) {
    redirect('/login');
  }

  // Fetch map data
  const { data: map, error } = await supabaseAdmin
    .from('maps')
    .select('*')
    .eq('id', params.mapId)
    .eq('user_id', user.id)
    .single();

  if (error || !map) {
    redirect('/dashboard');
  }

  // Fetch semesters for this map
  const { data: semesters } = await supabaseAdmin
    .from('semesters')
    .select('*')
    .eq('map_id', params.mapId)
    .order('index', { ascending: true });

  // Fetch classes for this map
  const { data: classes } = await supabaseAdmin
    .from('classes')
    .select('*')
    .eq('map_id', params.mapId)
    .order('index', { ascending: true });

  // Fetch all courses for the Add Class modal
  const { data: courses } = await supabaseAdmin
    .from('courses')
    .select('*')
    .order('course_code', { ascending: true });

  // Fetch all requirements
  const { data: requirements } = await supabaseAdmin
    .from('requirements')
    .select('*')
    .order('tag', { ascending: true });

  return (
    <MapClient 
      user={user}
      map={map}
      initialSemesters={semesters || []}
      initialClasses={classes || []}
      allCourses={courses || []}
      allRequirements={requirements || []}
    />
  );
}
