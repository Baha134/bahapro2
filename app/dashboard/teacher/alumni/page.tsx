import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { AlumniMap } from '@/components/dashboard/teacher/alumni-map'

export default async function AlumniPage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) redirect('/auth/login')

    // Get alumni (students with employed status)
    const { data: alumni } = await supabase
        .from('profiles')
        .select('*')
        .eq('role', 'student')
        .not('company', 'is', null)
        .order('full_name')

    return <AlumniMap alumni={alumni || []} />
}
