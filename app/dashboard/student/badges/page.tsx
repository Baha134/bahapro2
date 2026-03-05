import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { BadgesCollection } from '@/components/dashboard/student/badges-collection'

export default async function StudentBadgesPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const { data: userBadges } = await supabase
    .from('user_badges')
    .select('*, badges(*)')
    .eq('user_id', user.id)

  const { data: allBadges } = await supabase
    .from('badges')
    .select('*')

  return (
    <BadgesCollection
      userBadges={userBadges || []}
      allBadges={allBadges || []}
    />
  )
}
