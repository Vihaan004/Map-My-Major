import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth/session';
import DashboardClient from './DashboardClient';
import { supabaseAdmin } from '@/lib/db/supabase-admin';

export default async function DashboardPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect('/login');
  }

  // Fetch user's maps
  const { data: maps } = await supabaseAdmin
    .from('maps')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  // Fetch total courses
  const { count: courseCount } = await supabaseAdmin
    .from('courses')
    .select('*', { count: 'exact', head: true });

  // Calculate total credits from all maps
  let totalCredits = 0;
  if (maps && maps.length > 0) {
    for (const map of maps) {
      totalCredits += map.track_total_credits || 0;
    }
  }

  return (
    <DashboardClient 
      user={user} 
      maps={maps || []} 
      courseCount={courseCount || 0}
      totalCredits={totalCredits}
    />
  );
}
