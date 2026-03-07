import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { ResumeGenerator } from '@/components/dashboard/student/resume-generator'

export default async function StudentResumePage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) redirect('/auth/login')

    const { data: profile } = await supabase
        .from('profiles').select('*').eq('id', user.id).single()

    const { data: skills } = await supabase
        .from('skills').select('*').eq('user_id', user.id)

    const { data: badges } = await supabase
        .from('user_badges').select('*, badges(*)').eq('user_id', user.id)

    const { data: recommendations } = await supabase
        .from('recommendations').select('*')
        .eq('student_id', user.id)
        .order('created_at', { ascending: false })

    return (
        <div className="mx-auto max-w-5xl">
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-foreground">Генератор резюме</h1>
                <p className="mt-1 text-sm text-muted-foreground">Создай профессиональное резюме за пару кликов</p>
            </div>
            <ResumeGenerator
                profile={profile}
                skills={skills ?? []}
                achievements={badges ?? []}
                recommendations={recommendations ?? []}
                userEmail={user.email ?? ''}
            />
        </div>
    )
}