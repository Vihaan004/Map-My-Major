import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth/session';
import { supabaseAdmin } from '@/lib/db/supabase-admin';
import MapClient from './MapClient';

export default async function MapPage({ params }: { params: Promise<{ mapId: string }> }) {
  const user = await getCurrentUser();

  if (!user) {
    redirect('/login');
  }

  // Await params (Next.js 15 requirement)
  const { mapId } = await params;

  // Fetch map data
  const { data: map, error } = await supabaseAdmin
    .from('maps')
    .select('*')
    .eq('id', mapId)
    .eq('user_id', user.id)
    .single();

  if (error || !map) {
    redirect('/dashboard');
  }

  // Fetch semesters for this map
  const { data: semesters } = await supabaseAdmin
    .from('semesters')
    .select('*')
    .eq('map_id', mapId)
    .order('index', { ascending: true });

  // Fetch classes for this map
  const { data: classes } = await supabaseAdmin
    .from('classes')
    .select('*')
    .eq('map_id', mapId)
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
      map={{
        ...map,
        track_total_credits: map.track_total_credits ?? 0,
        status: map.status ?? 'ACTIVE',
      }}
      initialSemesters={semesters || []}
      initialClasses={(classes || []).map(c => ({
        ...c,
        class_requirement_tags: Array.isArray(c.class_requirement_tags) 
          ? c.class_requirement_tags as string[]
          : null,
        status: c.status ?? 'PLANNED',
      }))}
      allCourses={(courses || []).map(c => ({
        ...c,
        requirement_tags: Array.isArray(c.requirement_tags)
          ? c.requirement_tags as string[]
          : null,
        prerequisites: Array.isArray(c.prerequisites)
          ? c.prerequisites as string[]
          : null,
        corequisites: Array.isArray(c.corequisites)
          ? c.corequisites as string[]
          : null,
      }))}
      allRequirements={(requirements || []).map(r => ({
        ...r,
        is_custom: r.is_custom ?? false,
      }))}
    />
  );
}
