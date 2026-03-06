import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { EmployerStats } from '@/components/dashboard/employer/employer-stats'
import { TalentFeed } from '@/components/dashboard/employer/talent-feed'

export default async function EmployerDashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const { data: profile } = await supabase
    .from('profiles').select('*').eq('id', user.id).single()

  const { data: students } = await supabase
    .from('profiles')
    .select('*')
    .eq('role', 'student')

  const { data: recCounts } = await supabase
    .from('recommendations').select('student_id')

  const { data: badgeCounts } = await supabase
    .from('user_badges').select('user_id')

  const { data: allSkills } = await supabase
    .from('skills').select('user_id, name, level')

  const { data: employerStats } = await supabase
    .from('employer_stats').select('*').eq('user_id', user.id).single()

  const enrichedStudents = (students ?? []).map(student => ({
    ...student,
    skills: (allSkills ?? []).filter(s => s.user_id === student.id),
    recommendations_count: (recCounts ?? []).filter(r => r.student_id === student.id).length,
    badges_count: (badgeCounts ?? []).filter(b => b.user_id === student.id).length,
    match_score: Math.floor(Math.random() * 30) + 70,
    percentile: Math.floor(Math.random() * 20) + 1,
    avatar_initials: (student.full_name ?? student.email ?? "??")
      .split(" ").map((n: string) => n[0]).join("").slice(0, 2).toUpperCase(),
  }))

  const companyName = profile?.full_name ?? user.email?.split('@')[0] ?? 'Компания'

  return (
    <div className="mx-auto max-w-7xl space-y-8">
      {/* Заголовок */}
      <div className="rounded-2xl border border-border bg-card p-6">
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#00B894]/10 text-lg font-bold text-[#00B894]">
            {companyName[0].toUpperCase()}
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">{companyName}</h1>
            <p className="mt-0.5 text-sm text-muted-foreground">
              Панель работодателя · Поиск талантов
            </p>
          </div>
        </div>
      </div>

      <EmployerStats
        totalTalent={students?.length ?? 0}
        viewedProfiles={employerStats?.viewed_profiles ?? 0}
        savedCandidates={employerStats?.saved_candidates ?? 0}
        invitationsSent={employerStats?.invitations_sent ?? 0}
      />

      <div>
        <h2 className="mb-4 text-lg font-bold text-foreground">Talent Discovery</h2>
        <p className="mb-6 text-sm text-muted-foreground">
          Найдите лучших студентов для ваших позиций
        </p>
        <TalentFeed students={enrichedStudents} />
      </div>
    </div>
  )
}