'use client'

import { StatCard } from '@/components/dashboard/stat-card'
import { CheckCircle, Users, Clock, GraduationCap, ArrowRight } from 'lucide-react'
import Link from 'next/link'

interface TeacherOverviewProps {
    profile: Record<string, unknown> | null
    pendingRequests: Record<string, unknown>[]
    verifiedCount: number
    studentsCount: number
}

const demoRequests = [
    { id: '1', profiles: { full_name: 'Алексей Петров' }, skills: { name: 'React' }, level: 7, created_at: '2026-03-03' },
    { id: '2', profiles: { full_name: 'Мария Иванова' }, skills: { name: 'Python' }, level: 8, created_at: '2026-03-02' },
    { id: '3', profiles: { full_name: 'Дмитрий Козлов' }, skills: { name: 'Java' }, level: 6, created_at: '2026-03-01' },
    { id: '4', profiles: { full_name: 'Елена Смирнова' }, skills: { name: 'Figma' }, level: 7, created_at: '2026-02-28' },
]

export function TeacherOverview({ profile, pendingRequests, verifiedCount, studentsCount }: TeacherOverviewProps) {
    const fullName = (profile?.full_name as string) || 'Преподаватель'
    const pending = pendingRequests.length > 0 ? pendingRequests : demoRequests

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-2xl font-bold text-foreground">
                    {'Добро пожаловать, '}{fullName.split(' ')[0]}{'!'}
                </h1>
                <p className="mt-1 text-muted-foreground">Панель управления преподавателя</p>
            </div>

            {/* Stats */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <StatCard
                    label="Ожидают верификации"
                    value={pending.length}
                    icon={<Clock className="h-5 w-5" />}
                    gradient="from-[#FDCB6E] to-[#F97316]"
                />
                <StatCard
                    label="Верифицировано"
                    value={verifiedCount || 47}
                    icon={<CheckCircle className="h-5 w-5" />}
                    gradient="from-[#00B894] to-[#00D2D3]"
                    trend="+5 за неделю"
                />
                <StatCard
                    label="Студентов"
                    value={studentsCount || 156}
                    icon={<Users className="h-5 w-5" />}
                    gradient="from-[#6C5CE7] to-[#a855f7]"
                />
                <StatCard
                    label="Выпускников"
                    value={23}
                    icon={<GraduationCap className="h-5 w-5" />}
                    gradient="from-[#6C5CE7] to-[#00B894]"
                    trend="87% трудоустроены"
                />
            </div>

            {/* Recent pending requests */}
            <div className="rounded-xl border border-border/50 bg-card p-6">
                <div className="mb-4 flex items-center justify-between">
                    <h2 className="text-lg font-bold text-foreground">Последние запросы на верификацию</h2>
                    <Link
                        href="/dashboard/teacher/verify"
                        className="flex items-center gap-1 text-sm font-medium text-primary hover:underline"
                    >
                        Все запросы
                        <ArrowRight className="h-4 w-4" />
                    </Link>
                </div>
                <div className="space-y-3">
                    {pending.slice(0, 4).map((req: Record<string, unknown>) => {
                        const studentName = ((req.profiles as Record<string, unknown>)?.full_name as string) || 'Студент'
                        const skillName = ((req.skills as Record<string, unknown>)?.name as string) || 'Навык'
                        const level = (req.level as number) || 1
                        return (
                            <div key={req.id as string} className="flex items-center justify-between rounded-lg border border-border/30 bg-secondary/30 p-4">
                                <div className="flex items-center gap-3">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#FDCB6E] to-[#F97316] text-white">
                                        <Clock className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <p className="font-semibold text-foreground">{studentName}</p>
                                        <p className="text-sm text-muted-foreground">
                                            {skillName} · Уровень {level}
                                        </p>
                                    </div>
                                </div>
                                <span className="rounded-full bg-[#FDCB6E]/10 px-3 py-1 text-xs font-medium text-[#FDCB6E]">
                                    Ожидает
                                </span>
                            </div>
                        )
                    })}
                </div>
            </div>
        </div>
    )
}
