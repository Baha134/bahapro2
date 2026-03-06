import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { EmployerStats } from '@/components/dashboard/employer/employer-stats'
import { TalentFeed } from '@/components/dashboard/employer/talent-feed'

export default async function EmployerDashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  // Все студенты с их навыками
  const { data: students } = await supabase
    .from('profiles')
    .select(`
      id,
      full_name,
      email,
      university,
      faculty,
      location,
      bio,
      gpa,
      year,
      available_for_internship,
      match_score,
      percentile
    `)
    .eq('role', 'student')

  // Для каждого студента считаем кол-во рекомендаций и бейджей
  const { data: recCounts } = await supabase
    .from('recommendations')
    .select('student_id')

  const { data: badgeCounts } = await supabase
    .from('user_badges')
    .select('user_id')

  // Навыки всех студентов
  const { data: allSkills } = await supabase
    .from('skills')
    .select('user_id, name, level')

  // Статистика работодателя
  const { data: employerStats } = await supabase
    .from('employer_stats')
    .select('*')
    .eq('user_id', user.id)
    .single()

  // Собираем данные студентов
  const enrichedStudents = (students ?? []).map(student => {
    const studentSkills = (allSkills ?? []).filter(s => s.user_id === student.id)
    const recsCount = (recCounts ?? []).filter(r => r.student_id === student.id).length
    const badgesCount = (badgeCounts ?? []).filter(b => b.user_id === student.id).length

    return {
      ...student,
      skills: studentSkills,
      recommendations_count: recsCount,
      badges_count: badgesCount,
      avatar_initials: (student.full_name ?? student.email ?? "??")
        .split(" ").map((n: string) => n[0]).join("").slice(0, 2).toUpperCase(),
    }
  })

  return (
    <div className="mx-auto max-w-7xl space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Talent Discovery</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Найдите лучших студентов для ваших позиций
        </p>
      </div>

      <EmployerStats
        totalTalent={students?.length ?? 0}
        viewedProfiles={employerStats?.viewed_profiles ?? 0}
        savedCandidates={employerStats?.saved_candidates ?? 0}
        invitationsSent={employerStats?.invitations_sent ?? 0}
      />

      <TalentFeed students={enrichedStudents} />
    </div>
  )
}