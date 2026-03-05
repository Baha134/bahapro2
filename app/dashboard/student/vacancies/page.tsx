import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { VacanciesSearch } from '@/components/dashboard/student/vacancies-search'

export default async function StudentVacanciesPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const { data: vacancies } = await supabase
    .from('vacancies')
    .select('*, profiles!vacancies_employer_id_fkey(full_name, avatar_url)')
    .eq('status', 'active')
    .order('created_at', { ascending: false })

  return <VacanciesSearch vacancies={vacancies || []} userId={user.id} />
}
