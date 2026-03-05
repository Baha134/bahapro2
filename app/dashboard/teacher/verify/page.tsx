import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { VerificationCenter } from '@/components/dashboard/teacher/verification-center'

export default async function VerifyPage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) redirect('/auth/login')

    // Get all pending skill verifications
    const { data: pendingSkills } = await supabase
        .from('user_skills')
        .select('*, profiles!user_skills_user_id_fkey(full_name, university), skills(name, category)')
        .eq('verified', false)
        .order('created_at', { ascending: false })

    // Get pending projects
    const { data: pendingProjects } = await supabase
        .from('projects')
        .select('*, profiles!projects_user_id_fkey(full_name)')
        .eq('status', 'pending')
        .order('created_at', { ascending: false })

    return (
        <VerificationCenter
            pendingSkills={pendingSkills || []}
            pendingProjects={pendingProjects || []}
        />
    )
}
