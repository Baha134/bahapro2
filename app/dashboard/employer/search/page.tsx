import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { TalentSearch } from '@/components/dashboard/employer/talent-search'

export default async function EmployerSearchPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const { data: students } = await supabase
    .from('profiles')
    .select('id, full_name, university, current_level, xp')
    .eq('role', 'student')

  const { data: allSkills } = await supabase
    .from('skills')
    .select('user_id, name, level, category')

  const formattedStudents = (students ?? []).map((s: any) => ({
    id: s.id,
    full_name: s.full_name,
    university: s.university,
    level: s.current_level ?? 1,
    xp: s.xp ?? 0,
    user_skills: (allSkills ?? [])
      .filter(sk => sk.user_id === s.id)
      .map(sk => ({
        level: sk.level,
        verified: false,
        skills: { name: sk.name, category: sk.category ?? 'hard' }
      }))
  }))

  return <TalentSearch students={formattedStudents} />
}