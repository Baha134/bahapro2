import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { StudentProfile } from '@/components/dashboard/student/profile-form'

export default async function StudentProfilePage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) redirect('/auth/login')

    const { data: profile } = await supabase
        .from('profiles').select('*').eq('id', user.id).single()

    return (
        <div className="mx-auto max-w-3xl">
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-foreground">Профиль</h1>
                <p className="mt-1 text-sm text-muted-foreground">Управляй своими данными</p>
            </div>
            <StudentProfile profile={profile} skills={[]} userEmail={user.email ?? ''} />
        </div>
    )
}