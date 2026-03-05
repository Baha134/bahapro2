'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'
import { CheckCircle, XCircle, Clock, User, Code, FolderOpen, Filter } from 'lucide-react'
import { useRouter } from 'next/navigation'

type TabType = 'skills' | 'projects'

interface VerificationCenterProps {
    pendingSkills: Record<string, unknown>[]
    pendingProjects: Record<string, unknown>[]
}

const demoSkills = [
    { id: 's1', user_id: 'u1', skill_id: '1', level: 7, verified: false, profiles: { full_name: 'Алексей Петров', university: 'МГУ' }, skills: { name: 'React', category: 'Hard Skills' } },
    { id: 's2', user_id: 'u2', skill_id: '2', level: 9, verified: false, profiles: { full_name: 'Мария Иванова', university: 'МФТИ' }, skills: { name: 'Python', category: 'Hard Skills' } },
    { id: 's3', user_id: 'u3', skill_id: '3', level: 6, verified: false, profiles: { full_name: 'Дмитрий Козлов', university: 'ИТМО' }, skills: { name: 'Java', category: 'Hard Skills' } },
    { id: 's4', user_id: 'u4', skill_id: '4', level: 8, verified: false, profiles: { full_name: 'Елена Смирнова', university: 'ВШЭ' }, skills: { name: 'Figma', category: 'Tools' } },
    { id: 's5', user_id: 'u1', skill_id: '5', level: 5, verified: false, profiles: { full_name: 'Алексей Петров', university: 'МГУ' }, skills: { name: 'Teamwork', category: 'Soft Skills' } },
    { id: 's6', user_id: 'u2', skill_id: '6', level: 7, verified: false, profiles: { full_name: 'Мария Иванова', university: 'МФТИ' }, skills: { name: 'Communication', category: 'Soft Skills' } },
]

const demoProjects = [
    { id: 'p1', title: 'E-commerce на Next.js', description: 'Полнофункциональный интернет-магазин', url: 'https://github.com/demo', user_id: 'u1', status: 'pending', profiles: { full_name: 'Алексей Петров' }, created_at: '2026-03-01' },
    { id: 'p2', title: 'AI Чат-бот', description: 'Чат-бот на базе GPT-4 с RAG', url: 'https://github.com/demo', user_id: 'u2', status: 'pending', profiles: { full_name: 'Мария Иванова' }, created_at: '2026-02-28' },
    { id: 'p3', title: 'Мобильное приложение', description: 'React Native трекер привычек', url: null, user_id: 'u3', status: 'pending', profiles: { full_name: 'Дмитрий Козлов' }, created_at: '2026-02-25' },
]

export function VerificationCenter({ pendingSkills: serverSkills, pendingProjects: serverProjects }: VerificationCenterProps) {
    const [activeTab, setActiveTab] = useState<TabType>('skills')
    const [processing, setProcessing] = useState<string | null>(null)
    const router = useRouter()

    const skills = serverSkills.length > 0 ? serverSkills : demoSkills
    const projects = serverProjects.length > 0 ? serverProjects : demoProjects

    const handleVerifySkill = async (skillRecord: Record<string, unknown>, accept: boolean) => {
        const id = skillRecord.id as string
        setProcessing(id)
        const supabase = createClient()

        const { error } = await supabase
            .from('user_skills')
            .update({ verified: accept })
            .eq('id', id)

        if (error) {
            toast.error('Ошибка обработки запроса')
        } else {
            toast.success(accept ? 'Навык подтверждён!' : 'Навык отклонён')
            router.refresh()
        }
        setProcessing(null)
    }

    const handleVerifyProject = async (project: Record<string, unknown>, accept: boolean) => {
        const id = project.id as string
        setProcessing(id)
        const supabase = createClient()

        const { error } = await supabase
            .from('projects')
            .update({ status: accept ? 'verified' : 'rejected' })
            .eq('id', id)

        if (error) {
            toast.error('Ошибка обработки запроса')
        } else {
            toast.success(accept ? 'Проект верифицирован!' : 'Проект отклонён')
            router.refresh()
        }
        setProcessing(null)
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-foreground">Центр верификации</h1>
                <p className="mt-1 text-muted-foreground">Подтверждайте навыки и проекты студентов</p>
            </div>

            {/* Tabs */}
            <div className="flex gap-1 rounded-lg border border-border/50 bg-secondary/30 p-1">
                <button
                    onClick={() => setActiveTab('skills')}
                    className={cn(
                        'flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-colors',
                        activeTab === 'skills'
                            ? 'bg-card text-foreground shadow-sm'
                            : 'text-muted-foreground hover:text-foreground'
                    )}
                >
                    <Code className="h-4 w-4" />
                    Навыки ({skills.length})
                </button>
                <button
                    onClick={() => setActiveTab('projects')}
                    className={cn(
                        'flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-colors',
                        activeTab === 'projects'
                            ? 'bg-card text-foreground shadow-sm'
                            : 'text-muted-foreground hover:text-foreground'
                    )}
                >
                    <FolderOpen className="h-4 w-4" />
                    Проекты ({projects.length})
                </button>
            </div>

            {/* Skills Tab */}
            {activeTab === 'skills' && (
                <div className="space-y-3">
                    {skills.map((skill) => {
                        const studentName = ((skill.profiles as Record<string, unknown>)?.full_name as string) || 'Студент'
                        const university = ((skill.profiles as Record<string, unknown>)?.university as string) || ''
                        const skillName = ((skill.skills as Record<string, unknown>)?.name as string) || 'Навык'
                        const category = ((skill.skills as Record<string, unknown>)?.category as string) || 'Hard Skills'
                        const level = (skill.level as number) || 1
                        const id = skill.id as string
                        const isProcessing = processing === id

                        return (
                            <div key={id} className="rounded-xl border border-border/50 bg-card p-5 transition-colors hover:border-border">
                                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-[#FDCB6E] to-[#F97316] text-white">
                                            <User className="h-6 w-6" />
                                        </div>
                                        <div>
                                            <p className="font-bold text-foreground">{studentName}</p>
                                            {university && <p className="text-xs text-muted-foreground">{university}</p>}
                                            <div className="mt-1 flex items-center gap-2">
                                                <span className="rounded-full border border-primary/20 bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
                                                    {skillName}
                                                </span>
                                                <span className="text-xs text-muted-foreground">Ур. {level}</span>
                                                <span className="rounded-full bg-secondary px-2 py-0.5 text-[10px] text-muted-foreground">
                                                    {category}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <Button
                                            size="sm"
                                            onClick={() => handleVerifySkill(skill, true)}
                                            disabled={isProcessing}
                                            className="bg-gradient-to-r from-[#00B894] to-[#00D2D3] text-white hover:opacity-90"
                                        >
                                            <CheckCircle className="mr-1.5 h-4 w-4" />
                                            Подтвердить
                                        </Button>
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            onClick={() => handleVerifySkill(skill, false)}
                                            disabled={isProcessing}
                                            className="border-destructive/30 text-destructive hover:bg-destructive/10"
                                        >
                                            <XCircle className="mr-1.5 h-4 w-4" />
                                            Отклонить
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                    {skills.length === 0 && (
                        <div className="rounded-xl border border-border/50 bg-card p-12 text-center">
                            <CheckCircle className="mx-auto h-12 w-12 text-accent" />
                            <p className="mt-4 text-lg font-semibold text-foreground">Все навыки проверены!</p>
                            <p className="mt-1 text-muted-foreground">Новых запросов на верификацию нет</p>
                        </div>
                    )}
                </div>
            )}

            {/* Projects Tab */}
            {activeTab === 'projects' && (
                <div className="space-y-3">
                    {projects.map((project) => {
                        const studentName = ((project.profiles as Record<string, unknown>)?.full_name as string) || 'Студент'
                        const title = (project.title as string) || 'Проект'
                        const description = (project.description as string) || ''
                        const url = project.url as string | null
                        const id = project.id as string
                        const isProcessing = processing === id

                        return (
                            <div key={id} className="rounded-xl border border-border/50 bg-card p-5 transition-colors hover:border-border">
                                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                                    <div className="flex items-start gap-4">
                                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-[#6C5CE7] to-[#a855f7] text-white">
                                            <FolderOpen className="h-6 w-6" />
                                        </div>
                                        <div>
                                            <p className="font-bold text-foreground">{title}</p>
                                            <p className="text-sm text-muted-foreground">{studentName}</p>
                                            <p className="mt-1 text-sm text-secondary-foreground line-clamp-2">{description}</p>
                                            {url && (
                                                <a
                                                    href={url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="mt-1 inline-flex text-xs font-medium text-primary hover:underline"
                                                >
                                                    Открыть проект →
                                                </a>
                                            )}
                                        </div>
                                    </div>

                                    <div className="flex shrink-0 items-center gap-2">
                                        <Button
                                            size="sm"
                                            onClick={() => handleVerifyProject(project, true)}
                                            disabled={isProcessing}
                                            className="bg-gradient-to-r from-[#00B894] to-[#00D2D3] text-white hover:opacity-90"
                                        >
                                            <CheckCircle className="mr-1.5 h-4 w-4" />
                                            Принять
                                        </Button>
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            onClick={() => handleVerifyProject(project, false)}
                                            disabled={isProcessing}
                                            className="border-destructive/30 text-destructive hover:bg-destructive/10"
                                        >
                                            <XCircle className="mr-1.5 h-4 w-4" />
                                            Отклонить
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                    {projects.length === 0 && (
                        <div className="rounded-xl border border-border/50 bg-card p-12 text-center">
                            <CheckCircle className="mx-auto h-12 w-12 text-accent" />
                            <p className="mt-4 text-lg font-semibold text-foreground">Все проекты проверены!</p>
                            <p className="mt-1 text-muted-foreground">Новых проектов на верификацию нет</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}
