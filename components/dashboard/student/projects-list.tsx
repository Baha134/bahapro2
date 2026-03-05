'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'
import { Plus, ExternalLink, CheckCircle, Clock, X } from 'lucide-react'
import { useRouter } from 'next/navigation'

interface Project {
  id: string
  title: string
  description: string
  url: string | null
  status: string
  created_at: string
}

const statusConfig: Record<string, { label: string; icon: React.ElementType; color: string }> = {
  draft: { label: 'Черновик', icon: Clock, color: 'text-muted-foreground' },
  pending: { label: 'На проверке', icon: Clock, color: 'text-[#FDCB6E]' },
  verified: { label: 'Верифицирован', icon: CheckCircle, color: 'text-accent' },
  rejected: { label: 'Отклонён', icon: X, color: 'text-destructive-foreground' },
}

export function ProjectsList({ projects: initialProjects, userId }: { projects: Project[]; userId: string }) {
  const [showForm, setShowForm] = useState(false)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [url, setUrl] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    const supabase = createClient()

    const { error } = await supabase.from('projects').insert({
      user_id: userId,
      title,
      description,
      url: url || null,
      status: 'pending',
    })

    if (error) {
      toast.error('Ошибка создания проекта')
    } else {
      toast.success('Проект отправлен на верификацию!')
      setTitle('')
      setDescription('')
      setUrl('')
      setShowForm(false)
      router.refresh()
    }
    setIsSubmitting(false)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Мои проекты</h1>
          <p className="mt-1 text-muted-foreground">Портфолио с верификацией преподавателей</p>
        </div>
        <Button
          onClick={() => setShowForm(!showForm)}
          className="bg-gradient-to-r from-[#6C5CE7] to-[#00B894] text-white hover:opacity-90"
        >
          <Plus className="mr-2 h-4 w-4" />
          Добавить проект
        </Button>
      </div>

      {/* New project form */}
      {showForm && (
        <div className="rounded-xl border border-primary/30 bg-card p-6">
          <h2 className="mb-4 text-lg font-bold text-foreground">Новый проект</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid gap-2">
              <Label>Название</Label>
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Мой крутой проект"
                required
                className="bg-background/50"
              />
            </div>
            <div className="grid gap-2">
              <Label>Описание</Label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Опишите проект, технологии и свою роль..."
                required
                rows={4}
                className="w-full rounded-lg border border-input bg-background/50 px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
            <div className="grid gap-2">
              <Label>Ссылка (GitHub, сайт)</Label>
              <Input
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://github.com/..."
                className="bg-background/50"
              />
            </div>
            <div className="flex gap-3">
              <Button type="submit" disabled={isSubmitting} className="bg-gradient-to-r from-[#6C5CE7] to-[#00B894] text-white hover:opacity-90">
                {isSubmitting ? 'Отправляем...' : 'Отправить на проверку'}
              </Button>
              <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
                Отмена
              </Button>
            </div>
          </form>
        </div>
      )}

      {/* Projects list */}
      <div className="grid gap-4 sm:grid-cols-2">
        {(initialProjects.length > 0 ? initialProjects : demoProjects).map((project) => {
          const status = statusConfig[project.status] || statusConfig.draft
          const StatusIcon = status.icon
          return (
            <div key={project.id} className="rounded-xl border border-border/50 bg-card p-5">
              <div className="flex items-start justify-between">
                <h3 className="font-bold text-foreground">{project.title}</h3>
                <span className={cn('flex items-center gap-1 text-xs font-medium', status.color)}>
                  <StatusIcon className="h-3.5 w-3.5" />
                  {status.label}
                </span>
              </div>
              <p className="mt-2 text-sm text-muted-foreground line-clamp-2">
                {project.description}
              </p>
              {project.url && (
                <a
                  href={project.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline"
                >
                  <ExternalLink className="h-3 w-3" />
                  Открыть проект
                </a>
              )}
              <p className="mt-3 text-xs text-muted-foreground">
                {new Date(project.created_at).toLocaleDateString('ru-RU')}
              </p>
            </div>
          )
        })}
      </div>
    </div>
  )
}

const demoProjects: Project[] = [
  { id: '1', title: 'E-commerce платформа', description: 'Полнофункциональный интернет-магазин на Next.js + Supabase с корзиной, оплатой и админкой', url: 'https://github.com/demo', status: 'verified', created_at: '2026-02-15' },
  { id: '2', title: 'AI Чат-бот', description: 'Чат-бот на базе GPT-4 с RAG и векторным поиском по документации', url: 'https://github.com/demo', status: 'pending', created_at: '2026-02-28' },
  { id: '3', title: 'Мобильное приложение', description: 'React Native приложение для трекинга привычек с уведомлениями', url: null, status: 'draft', created_at: '2026-03-01' },
]
