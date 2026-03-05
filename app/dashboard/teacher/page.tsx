import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { TeacherOverview } from '@/components/dashboard/teacher/overview'

export default async function TeacherDashboardPage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) redirect('/auth/login')

    const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

    // Pending verification requests
    const { data: pendingSkills } = await supabase
        .from('user_skills')
        .select('*, profiles!user_skills_user_id_fkey(full_name), skills(name)')
        .eq('verified', false)
        .limit(10)

    // Verified count
    const { count: verifiedCount } = await supabase
        .from('user_skills')
        .select('*', { count: 'exact', head: true })
        .eq('verified', true)

    // Total students
    const { count: studentsCount } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })
        .eq('role', 'student')

    return (
        <TeacherOverview
            profile={profile}
            pendingRequests={pendingSkills || []}
            verifiedCount={verifiedCount || 0}
            studentsCount={studentsCount || 0}
        />
    )
}
