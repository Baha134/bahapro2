'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'
import { Plus, Briefcase, Users, Clock, CheckCircle, XCircle, X, Eye, Trash2 } from 'lucide-react'
import { useRouter } from 'next/navigation'

interface Vacancy {
    id: string
    title: string
    description: string
    company_name: string
    location: string
    salary_range: string | null
    required_skills: string[]
    status: string
    created_at: string
    applications: { count: number }[] | null
}

const statusMap: Record<string, { label: string; icon: React.ElementType; color: string }> = {
    active: { label: 'Активна', icon: CheckCircle, color: 'text-accent' },
    paused: { label: 'Приостановлена', icon: Clock, color: 'text-[#FDCB6E]' },
    closed: { label: 'Закрыта', icon: XCircle, color: 'text-muted-foreground' },
}

const demoVacancies: Vacancy[] = [
    {
        id: '1',
        title: 'Frontend-разработчик (React)',
        description: 'Ищем талантливого фронтенд-разработчика для SaaS-продукта.',
        company_name: 'TechCorp',
        location: 'Удалённо',
        salary_range: '100 000 - 150 000 ₽',
        required_skills: ['React', 'TypeScript', 'CSS'],
        status: 'active',
        created_at: '2026-03-01',
        applications: [{ count: 12 }],
    },
    {
        id: '2',
        title: 'Fullstack-разработчик',
        description: 'Разработка микросервисной архитектуры.',
        company_name: 'TechCorp',
        location: 'Москва',
        salary_range: '120 000 - 180 000 ₽',
        required_skills: ['Node.js', 'PostgreSQL', 'React'],
        status: 'active',
        created_at: '2026-02-28',
        applications: [{ count: 8 }],
    },
    {
        id: '3',
        title: 'Data Analyst (Junior)',
        description: 'Анализ данных пользовательского поведения.',
        company_name: 'TechCorp',
        location: 'Санкт-Петербург',
        salary_range: '80 000 - 110 000 ₽',
        required_skills: ['SQL', 'Python', 'Excel'],
        status: 'paused',
        created_at: '2026-02-20',
        applications: [{ count: 5 }],
    },
]

export function VacanciesManagement({ vacancies: serverVacancies, userId }: { vacancies: Vacancy[]; userId: string }) {
    const [showForm, setShowForm] = useState(false)
    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')
    const [companyName, setCompanyName] = useState('')
    const [location, setLocation] = useState('')
    const [salaryRange, setSalaryRange] = useState('')
    const [skillsInput, setSkillsInput] = useState('')
    const [isSubmitting, setIsSubmitting] = useState(false)
    const router = useRouter()

    const vacancies = serverVacancies.length > 0 ? serverVacancies : demoVacancies

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSubmitting(true)
        const supabase = createClient()

        const skills = skillsInput.split(',').map((s) => s.trim()).filter(Boolean)

        const { error } = await supabase.from('vacancies').insert({
            employer_id: userId,
            title,
            description,
            company_name: companyName,
            location,
            salary_range: salaryRange || null,
            required_skills: skills,
            status: 'active',
        })

        if (error) {
            toast.error('Ошибка создания вакансии')
        } else {
            toast.success('Вакансия опубликована!')
            setTitle('')
            setDescription('')
            setCompanyName('')
            setLocation('')
            setSalaryRange('')
            setSkillsInput('')
            setShowForm(false)
            router.refresh()
        }
        setIsSubmitting(false)
    }

    const getAppCount = (v: Vacancy) => {
        if (v.applications && v.applications.length > 0) return v.applications[0].count
        return 0
    }

    const activeCount = vacancies.filter((v) => v.status === 'active').length
    const totalApps = vacancies.reduce((sum, v) => sum + getAppCount(v), 0)

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-foreground">Мои вакансии</h1>
                    <p className="mt-1 text-muted-foreground">Управляйте вакансиями и отслеживайте отклики</p>
                </div>
                <Button
                    onClick={() => setShowForm(!showForm)}
                    className="bg-gradient-to-r from-[#00B894] to-[#00D2D3] text-white hover:opacity-90"
                >
                    <Plus className="mr-2 h-4 w-4" />
                    Новая вакансия
                </Button>
            </div>

            {/* Summary stats */}
            <div className="grid gap-4 sm:grid-cols-3">
                <div className="rounded-xl border border-border/50 bg-card p-5">
                    <div className="flex items-start justify-between">
                        <div>
                            <p className="text-sm text-muted-foreground">Всего вакансий</p>
                            <p className="mt-1 text-2xl font-bold text-foreground">{vacancies.length}</p>
                        </div>
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#00B894] to-[#00D2D3] text-white">
                            <Briefcase className="h-5 w-5" />
                        </div>
                    </div>
                </div>
                <div className="rounded-xl border border-border/50 bg-card p-5">
                    <div className="flex items-start justify-between">
                        <div>
                            <p className="text-sm text-muted-foreground">Активных</p>
                            <p className="mt-1 text-2xl font-bold text-foreground">{activeCount}</p>
                        </div>
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#6C5CE7] to-[#a855f7] text-white">
                            <Eye className="h-5 w-5" />
                        </div>
                    </div>
                </div>
                <div className="rounded-xl border border-border/50 bg-card p-5">
                    <div className="flex items-start justify-between">
                        <div>
                            <p className="text-sm text-muted-foreground">Всего откликов</p>
                            <p className="mt-1 text-2xl font-bold text-foreground">{totalApps}</p>
                        </div>
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#FDCB6E] to-[#F97316] text-white">
                            <Users className="h-5 w-5" />
                        </div>
                    </div>
                </div>
            </div>

            {/* New vacancy form */}
            {showForm && (
                <div className="rounded-xl border border-[#00B894]/30 bg-card p-6">
                    <div className="mb-4 flex items-center justify-between">
                        <h2 className="text-lg font-bold text-foreground">Новая вакансия</h2>
                        <button onClick={() => setShowForm(false)} className="text-muted-foreground hover:text-foreground">
                            <X className="h-5 w-5" />
                        </button>
                    </div>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid gap-4 sm:grid-cols-2">
                            <div className="grid gap-2">
                                <Label>Название позиции</Label>
                                <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Frontend-разработчик" required className="bg-background/50" />
                            </div>
                            <div className="grid gap-2">
                                <Label>Компания</Label>
                                <Input value={companyName} onChange={(e) => setCompanyName(e.target.value)} placeholder="TechCorp" required className="bg-background/50" />
                            </div>
                        </div>
                        <div className="grid gap-4 sm:grid-cols-2">
                            <div className="grid gap-2">
                                <Label>Локация</Label>
                                <Input value={location} onChange={(e) => setLocation(e.target.value)} placeholder="Удалённо / Москва" required className="bg-background/50" />
                            </div>
                            <div className="grid gap-2">
                                <Label>Зарплатная вилка</Label>
                                <Input value={salaryRange} onChange={(e) => setSalaryRange(e.target.value)} placeholder="100 000 - 150 000 ₽" className="bg-background/50" />
                            </div>
                        </div>
                        <div className="grid gap-2">
                            <Label>Описание</Label>
                            <textarea
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder="Опишите обязанности и требования..."
                                required
                                rows={4}
                                className="w-full rounded-lg border border-input bg-background/50 px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label>Требуемые навыки (через запятую)</Label>
                            <Input value={skillsInput} onChange={(e) => setSkillsInput(e.target.value)} placeholder="React, TypeScript, Node.js" className="bg-background/50" />
                        </div>
                        <div className="flex gap-3">
                            <Button type="submit" disabled={isSubmitting} className="bg-gradient-to-r from-[#00B894] to-[#00D2D3] text-white hover:opacity-90">
                                {isSubmitting ? 'Публикуем...' : 'Опубликовать вакансию'}
                            </Button>
                            <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
                                Отмена
                            </Button>
                        </div>
                    </form>
                </div>
            )}

            {/* Vacancies list */}
            <div className="space-y-4">
                {vacancies.map((vacancy) => {
                    const st = statusMap[vacancy.status] || statusMap.active
                    const StIcon = st.icon
                    const appCount = getAppCount(vacancy)

                    return (
                        <div key={vacancy.id} className="rounded-xl border border-border/50 bg-card p-6 transition-colors hover:border-border">
                            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                                <div className="flex-1">
                                    <div className="flex items-center gap-3">
                                        <h3 className="text-lg font-bold text-foreground">{vacancy.title}</h3>
                                        <span className={cn('flex items-center gap-1 text-xs font-medium', st.color)}>
                                            <StIcon className="h-3.5 w-3.5" />
                                            {st.label}
                                        </span>
                                    </div>
                                    <p className="mt-1 text-sm text-muted-foreground">
                                        {vacancy.company_name} · {vacancy.location}
                                    </p>
                                    <p className="mt-2 text-sm text-secondary-foreground">{vacancy.description}</p>
                                    {vacancy.required_skills && vacancy.required_skills.length > 0 && (
                                        <div className="mt-3 flex flex-wrap gap-1.5">
                                            {vacancy.required_skills.map((skill) => (
                                                <span key={skill} className="rounded-full border border-primary/20 bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
                                                    {skill}
                                                </span>
                                            ))}
                                        </div>
                                    )}
                                    {vacancy.salary_range && (
                                        <p className="mt-2 text-sm font-semibold text-accent">{vacancy.salary_range}</p>
                                    )}
                                </div>

                                {/* Tracker */}
                                <div className="flex shrink-0 flex-col items-end gap-2">
                                    <div className="rounded-xl border border-border/50 bg-secondary/30 px-4 py-3 text-center">
                                        <p className="text-2xl font-bold text-foreground">{appCount}</p>
                                        <p className="text-xs text-muted-foreground">Откликов</p>
                                    </div>
                                    <p className="text-xs text-muted-foreground">
                                        {new Date(vacancy.created_at).toLocaleDateString('ru-RU')}
                                    </p>
                                </div>
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}
