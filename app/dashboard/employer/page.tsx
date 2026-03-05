import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { EmployerOverview } from '@/components/dashboard/employer/overview'

export default async function EmployerDashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  const { data: vacancies } = await supabase
    .from('vacancies')
    .select('*')
    .eq('employer_id', user.id)

  const { data: applications } = await supabase
    .from('applications')
    .select('*, vacancies!inner(*)')
    .eq('vacancies.employer_id', user.id)

  return (
    <EmployerOverview
      profile={profile}
      vacancies={vacancies || []}
      applications={applications || []}
    />
  )
}
