import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { TalentSearch } from '@/components/dashboard/employer/talent-search'

export default async function EmployerSearchPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  // Уточняем запрос, чтобы поля соответствовали нашему компоненту
  const { data: students } = await supabase
    .from('profiles')
    .select(`
      id,
      full_name,
      university,
      level:current_level, 
      xp,
      user_skills (
        level,
        verified,
        skills (
          name,
          category
        )
      )
    `)
    .eq('role', 'student')
    .limit(50)

  // Превращаем данные в формат, который ожидает TalentSearch, 
  // если в базе вдруг лежат null или другие типы
  const formattedStudents = (students || []).map((s: any) => ({
    ...s,
    level: s.level || 1, // дефолтное значение, если в базе null
    user_skills: s.user_skills || []
  }))

  return <TalentSearch students={formattedStudents} />
}