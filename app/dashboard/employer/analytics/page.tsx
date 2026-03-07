import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { TrendingUp, Users, BookOpen, Award, BarChart2, Zap } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default async function EmployerAnalyticsPage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) redirect('/auth/login')

    const { data: students } = await supabase
        .from('profiles').select('*').eq('role', 'student')

    const { data: allSkills } = await supabase
        .from('skills').select('name, level, category')

    // Топ навыки
    const skillCount: Record<string, number> = {}
    allSkills?.forEach(s => {
        skillCount[s.name] = (skillCount[s.name] ?? 0) + 1
    })
    const topSkills = Object.entries(skillCount)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 8)

    // Средний GPA
    const avgGpa = students && students.length > 0
        ? (students.reduce((sum, s) => sum + (s.gpa ?? 0), 0) / students.length).toFixed(2)
        : '0.00'

    return (
        <div className="mx-auto max-w-6xl space-y-8">

            <div>
                <h1 className="text-2xl font-bold text-foreground">HR Аналитика</h1>
                <p className="mt-1 text-sm text-muted-foreground">
                    Тепловая карта навыков и статистика рынка талантов
                </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
                {[
                    { icon: Users, label: 'Всего студентов', value: students?.length ?? 0, color: '#6C5CE7', bg: '#6C5CE710' },
                    { icon: TrendingUp, label: 'Средний GPA', value: avgGpa, color: '#00B894', bg: '#00B89410' },
                    { icon: BookOpen, label: 'Уникальных навыков', value: Object.keys(skillCount).length, color: '#F97316', bg: '#F9731610' },
                    { icon: Award, label: 'Готовы к стажировке', value: students?.filter(s => s.available_for_internship).length ?? 0, color: '#a855f7', bg: '#a855f710' },
                ].map((stat) => (
                    <Card key={stat.label} className="rounded-2xl border-border">
                        <CardContent className="flex items-center gap-4 p-5">
                            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl"
                                style={{ backgroundColor: stat.bg }}>
                                <stat.icon className="h-5 w-5" style={{ color: stat.color }} />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                                <p className="text-[11px] text-muted-foreground">{stat.label}</p>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <div className="grid gap-6 lg:grid-cols-2">

                {/* Top skills heatmap */}
                <Card className="rounded-2xl border-border">
                    <CardHeader className="pb-3">
                        <CardTitle className="flex items-center gap-2 text-sm font-semibold">
                            <BarChart2 className="h-4 w-4 text-primary" />
                            Тепловая карта навыков
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="pb-5">
                        <div className="flex flex-col gap-3">
                            {topSkills.map(([name, count], idx) => {
                                const maxCount = topSkills[0]?.[1] ?? 1
                                const pct = Math.round((count / maxCount) * 100)
                                const colors = ['#6C5CE7', '#00B894', '#F97316', '#a855f7', '#00D2D3', '#FDCB6E', '#3b82f6', '#ec4899']
                                const color = colors[idx % colors.length]
                                return (
                                    <div key={name} className="flex items-center gap-3">
                                        <span className="w-28 truncate text-[13px] font-medium text-foreground">{name}</span>
                                        <div className="flex-1 h-2.5 rounded-full bg-secondary overflow-hidden">
                                            <div className="h-full rounded-full transition-all duration-500"
                                                style={{ width: `${pct}%`, backgroundColor: color }} />
                                        </div>
                                        <span className="w-6 text-right text-[12px] font-bold text-foreground">{count}</span>
                                    </div>
                                )
                            })}
                            {topSkills.length === 0 && (
                                <p className="py-8 text-center text-xs text-muted-foreground">Нет данных</p>
                            )}
                        </div>
                    </CardContent>
                </Card>

                {/* GPA Distribution */}
                <Card className="rounded-2xl border-border">
                    <CardHeader className="pb-3">
                        <CardTitle className="flex items-center gap-2 text-sm font-semibold">
                            <Zap className="h-4 w-4 text-primary" />
                            Распределение по GPA
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="pb-5">
                        <div className="flex flex-col gap-3">
                            {[
                                { label: '3.5 — 4.0 (Отлично)', min: 3.5, max: 4.0, color: '#00B894' },
                                { label: '3.0 — 3.5 (Хорошо)', min: 3.0, max: 3.5, color: '#6C5CE7' },
                                { label: '2.5 — 3.0 (Удовлетворительно)', min: 2.5, max: 3.0, color: '#F97316' },
                                { label: 'Ниже 2.5', min: 0, max: 2.5, color: '#6b7280' },
                            ].map((range) => {
                                const count = students?.filter(s => (s.gpa ?? 0) >= range.min && (s.gpa ?? 0) < range.max).length ?? 0
                                const total = students?.length ?? 1
                                const pct = Math.round((count / total) * 100)
                                return (
                                    <div key={range.label} className="flex items-center gap-3">
                                        <span className="w-44 truncate text-[12px] text-muted-foreground">{range.label}</span>
                                        <div className="flex-1 h-2.5 rounded-full bg-secondary overflow-hidden">
                                            <div className="h-full rounded-full"
                                                style={{ width: `${pct}%`, backgroundColor: range.color }} />
                                        </div>
                                        <span className="w-6 text-right text-[12px] font-bold text-foreground">{count}</span>
                                    </div>
                                )
                            })}
                        </div>

                        <div className="mt-6 rounded-2xl bg-secondary/50 p-4 text-center">
                            <p className="text-3xl font-black text-foreground">{avgGpa}</p>
                            <p className="mt-1 text-xs text-muted-foreground">Средний GPA по платформе</p>
                        </div>
                    </CardContent>
                </Card>

            </div>
        </div>
    )
}