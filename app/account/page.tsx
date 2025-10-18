import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth/session';
import { supabaseAdmin } from '@/lib/db/supabase-admin';
import AccountClient from './AccountClient';

export default async function AccountPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect('/login');
  }

  // Get full user data from Supabase
  const { data: userData } = await supabaseAdmin
    .from('users')
    .select('*')
    .eq('id', user.id)
    .single();

  // Get user's maps
  const { data: maps } = await supabaseAdmin
    .from('maps')
    .select('*')
    .eq('user_id', user.id);

  // Get all semesters for user's maps
  const mapIds = maps?.map(m => m.id) || [];
  const { data: semesters } = await supabaseAdmin
    .from('semesters')
    .select('*')
    .in('map_id', mapIds);

  // Get all classes for user's semesters
  const semesterIds = semesters?.map(s => s.id) || [];
  const { data: classes } = await supabaseAdmin
    .from('classes')
    .select('*')
    .in('semester_id', semesterIds);

  // Calculate statistics
  const totalMaps = maps?.length || 0;
  const activeMaps = maps?.filter(m => m.status === 'ACTIVE').length || 0;
  const totalClasses = classes?.length || 0;
  const totalCredits = classes?.reduce((sum, cls) => sum + (cls.class_credits || 0), 0) || 0;

  return (
    <AccountClient
      user={{
        id: user.id,
        name: user.name,
        email: user.email,
        created_at: userData?.created_at || new Date().toISOString(),
      }}
      stats={{
        totalMaps,
        activeMaps,
        totalClasses,
        totalCredits,
      }}
    />
  );
}
