import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { GpaWidget } from '@/components/dashboard/student/gpa-widget'
import { QuickStats } from '@/components/dashboard/student/quick-stats'
import { BalanceRadar } from '@/components/dashboard/student/balance-radar'
import { VerifiedAchievements } from '@/components/dashboard/student/verified-achievements'
import { ActivityTimeline } from '@/components/dashboard/student/activity-timeline'
import { RecommendationsFeed } from '@/components/dashboard/student/recommendations-feed'
import { CareerForecast } from '@/components/dashboard/student/career-forecast'
import { ResumeOptimizer } from '@/components/dashboard/student/resume-optimizer'
import { ProfileQrCode } from '@/components/dashboard/student/profile-qr-code'

export default async function StudentDashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const { data: profile } = await supabase
    .from('profiles').select('*').eq('id', user.id).single()

  const { data: skills } = await supabase
    .from('skills').select('*').eq('user_id', user.id)

  const { data: projects } = await supabase
    .from('projects').select('*').eq('user_id', user.id)

  const { data: badges } = await supabase
    .from('user_badges').select('*, badges(*)').eq('user_id', user.id)

  const { data: recommendations } = await supabase
    .from('recommendations').select('*')
    .eq('student_id', user.id)
    .order('created_at', { ascending: false })

  const { data: activities } = await supabase
    .from('activity_log').select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(8)

  const gpa = profile?.gpa ?? 0

  return (
    <div className="mx-auto max-w-7xl space-y-8">

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            Привет, {profile?.full_name || user.email?.split('@')[0]}!
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">Твой цифровой портфолио</p>
        </div>
        <ProfileQrCode
          userId={user.id}
          fullName={profile?.full_name || user.email?.split('@')[0] || ''}
          specialty={profile?.specialty}
          year={profile?.year}
          university={profile?.university_short}
          location={profile?.location}
        />
      </div>

      <QuickStats
        projects={projects?.length ?? 0}
        achievements={badges?.length ?? 0}
        recommendations={recommendations?.length ?? 0}
      />

      <div className="grid gap-6 lg:grid-cols-5">
        <div className="lg:col-span-1">
          <GpaWidget
            gpa={gpa} maxGpa={4.0}
            semester={profile?.semester ?? "Spring 2025-2026"}
            change={profile?.gpa_change ?? 0}
            credits={profile?.credits}
            deansListStatus={profile?.deans_list ?? false}
          />
        </div>
        <div className="lg:col-span-4">
          <BalanceRadar
            skills={skills ?? []}
            gpa={gpa}
            maxGpa={4.0}
            achievements={badges ?? []}
          />
        </div>
      </div>

      <VerifiedAchievements achievements={badges ?? []} />

      <div className="grid gap-6 lg:grid-cols-2">
        <ActivityTimeline activities={activities ?? []} />
        <RecommendationsFeed recommendations={recommendations ?? []} />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <ResumeOptimizer skills={skills ?? []} />
        <CareerForecast skills={skills ?? []} />
      </div>

    </div>
  )
}