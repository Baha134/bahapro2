import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { VacanciesManagement } from '@/components/dashboard/employer/vacancies-management'

export default async function EmployerVacanciesPage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) redirect('/auth/login')

    const { data: vacancies } = await supabase
        .from('vacancies')
        .select('*, applications(count)')
        .eq('employer_id', user.id)
        .order('created_at', { ascending: false })

    return <VacanciesManagement vacancies={vacancies || []} userId={user.id} />
}
