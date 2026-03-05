import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { StudentProfile } from '@/components/dashboard/student/profile-form'

export default async function StudentProfilePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  const { data: skills } = await supabase
    .from('user_skills')
    .select('*, skills(*)')
    .eq('user_id', user.id)

  return (
    <StudentProfile
      profile={profile}
      skills={skills || []}
      userEmail={user.email || ''}
    />
  )
}
