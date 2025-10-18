import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth/session';
import { supabaseAdmin } from '@/lib/db/supabase-admin';
import CourseBankClient from './CourseBankClient';

export default async function CourseBankPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect('/login');
  }

  // Get all courses
  const { data: courses } = await supabaseAdmin
    .from('courses')
    .select('*')
    .order('course_code', { ascending: true });

  // Get all requirements for tag reference
  const { data: requirements } = await supabaseAdmin
    .from('requirements')
    .select('*')
    .order('name', { ascending: true });

  return (
    <CourseBankClient
      user={user}
      courses={courses || []}
      requirements={requirements || []}
    />
  );
}
