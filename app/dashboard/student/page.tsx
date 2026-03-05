import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { StudentOverview } from '@/components/dashboard/student/overview'

export default async function StudentDashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/auth/login')

  // 1. Получаем профиль (теперь тут есть gpa, xp, role)
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  // 2. Исправляем запрос навыков (в нашей базе таблица называется 'skills')
  // В Joltap нам нужны name, level и category для радара
  const { data: skills } = await supabase
    .from('skills')
    .select('*')
    .eq('user_id', user.id)

  // 3. Проекты (остаются как были)
  const { data: projects } = await supabase
    .from('projects')
    .select('*')
    .eq('user_id', user.id)

  // 4. Бейджи/Достижения (подключаем для виджета достижений)
  const { data: badges } = await supabase
    .from('user_badges')
    .select('*, badges(*)')
    .eq('user_id', user.id)

  return (
    <StudentOverview
      profile={profile}
      skills={skills || []} // Эти данные пойдут в SkillsRadar
      projects={projects || []}
      badges={badges || []}
      userEmail={user.email || ''}
    />
  )
}