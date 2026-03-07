import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { ProjectsList } from '@/components/dashboard/student/projects-list'

export default async function StudentProjectsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const { data: projects } = await supabase
    .from('projects')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  return (
    <div className="mx-auto max-w-4xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground">Проекты</h1>
        <p className="mt-1 text-sm text-muted-foreground">Твои работы и кейсы</p>
      </div>
      <ProjectsList projects={projects ?? []} userId={user.id} />
    </div>
  )
}