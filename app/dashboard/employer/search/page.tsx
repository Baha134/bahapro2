import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { TalentSearch } from '@/components/dashboard/employer/talent-search'

export default async function EmployerSearchPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  // Get all students with their skills
  const { data: students } = await supabase
    .from('profiles')
    .select('*, user_skills(*, skills(*))')
    .eq('role', 'student')
    .limit(50)

  return <TalentSearch students={students || []} />
}
