import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
    CheckCircle, Users, Clock, GraduationCap,
    BadgeCheck, TrendingUp, Award, BookOpen
} from 'lucide-react'
import Link from 'next/link'

export default async function TeacherDashboardPage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) redirect('/auth/login')

    const { data: profile } = await supabase
        .from('profiles').select('*').eq('id', user.id).single()

    const { count: studentsCount } = await supabase
        .from('profiles').select('*', { count: 'exact', head: true }).eq('role', 'student')

    const { data: recentStudents } = await supabase
        .from('profiles')
        .select('*')
        .eq('role', 'student')
        .limit(5)

    const { data: recentBadges } = await supabase
        .from('user_badges')
        .select('*, badges(*), profiles!user_badges_user_id_fkey(full_name)')
        .eq('verified', false)
        .limit(4)

    const { count: verifiedCount } = await supabase
        .from('user_badges').select('*', { count: 'exact', head: true }).eq('verified', true)

    const { data: recentRecs } = await supabase
        .from('recommendations').select('*').order('created_at', { ascending: false }).limit(3)

    const teacherName = profile?.full_name ?? user.email?.split('@')[0] ?? 'Преподаватель'

    const stats = [
        { label: 'Студентов', value: studentsCount ?? 0, icon: Users, color: 'text-primary bg-primary/10' },
        { label: 'Верифицировано', value: verifiedCount ?? 0, icon: CheckCircle, color: 'text-[#00B894] bg-[#00B894]/10' },
        { label: 'Ожидают верификации', value: recentBadges?.length ?? 0, icon: Clock, color: 'text-amber-500 bg-amber-500/10' },
        { label: 'Рекомендаций', value: recentRecs?.length ?? 0, icon: Award, color: 'text-chart-4 bg-chart-4/10' },
    ]

    return (
        <div className="mx-auto max-w-7xl space-y-8">

            {/* Заголовок */}
            <div className="rounded-2xl border border-border bg-card p-6">
                <div className="flex items-center gap-4">
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#F97316]/10 text-lg font-bold text-[#F97316]">
                        {teacherName[0].toUpperCase()}
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-foreground">
                            Добро пожаловать, {teacherName.split(' ')[0]}!
                        </h1>
                        <p className="mt-0.5 text-sm text-muted-foreground">
                            Панель преподавателя · Верификация и управление студентами
                        </p>
                    </div>
                </div>
            </div>

            {/* Статистика */}
            <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
                {stats.map((stat) => (
                    <Card key={stat.label} className="rounded-2xl border-border">
                        <CardContent className="flex items-center gap-4 p-4">
                            <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${stat.color}`}>
                                <stat.icon className="h-5 w-5" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                                <p className="text-[11px] font-medium text-muted-foreground">{stat.label}</p>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <div className="grid gap-6 lg:grid-cols-2">

                {/* Ожидают верификации */}
                <Card className="rounded-2xl border-border">
                    <CardHeader className="pb-3">
                        <CardTitle className="flex items-center justify-between text-sm font-semibold text-foreground">
                            <span className="flex items-center gap-2">
                                <Clock className="h-4 w-4 text-amber-500" />
                                Ожидают верификации
                            </span>
                            <Link href="/dashboard/teacher/verify"
                                className="text-xs font-normal text-primary hover:underline">
                                Все запросы →
                            </Link>
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="pb-5">
                        {(recentBadges ?? []).length > 0 ? (
                            <div className="flex flex-col gap-3">
                                {recentBadges!.map((item: any) => (
                                    <div key={item.id}
                                        className="flex items-center justify-between rounded-xl border border-border bg-secondary/30 p-3">
                                        <div className="flex items-center gap-3">
                                            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-500/10 text-xs font-bold text-amber-500">
                                                {((item.profiles?.full_name ?? "?") as string)[0].toUpperCase()}
                                            </div>
                                            <div>
                                                <p className="text-[13px] font-semibold text-foreground">
                                                    {item.profiles?.full_name ?? "Студент"}
                                                </p>
                                                <p className="text-[11px] text-muted-foreground">
                                                    {item.badges?.name ?? "Badge"}
                                                </p>
                                            </div>
                                        </div>
                                        <Badge variant="outline"
                                            className="rounded-lg border-amber-500/20 bg-amber-500/10 text-[10px] text-amber-500">
                                            Pending
                                        </Badge>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-center text-xs text-muted-foreground py-8">
                                Нет запросов на верификацию
                            </p>
                        )}
                    </CardContent>
                </Card>

                {/* Последние студенты */}
                <Card className="rounded-2xl border-border">
                    <CardHeader className="pb-3">
                        <CardTitle className="flex items-center justify-between text-sm font-semibold text-foreground">
                            <span className="flex items-center gap-2">
                                <Users className="h-4 w-4 text-primary" />
                                Студенты
                            </span>
                            <span className="text-xs font-normal text-muted-foreground">
                                {studentsCount ?? 0} всего
                            </span>
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="pb-5">
                        {(recentStudents ?? []).length > 0 ? (
                            <div className="flex flex-col gap-3">
                                {recentStudents!.map((student: any) => (
                                    <div key={student.id}
                                        className="flex items-center justify-between rounded-xl border border-border bg-secondary/30 p-3">
                                        <div className="flex items-center gap-3">
                                            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-xs font-bold text-primary">
                                                {((student.full_name ?? student.email ?? "?") as string)[0].toUpperCase()}
                                            </div>
                                            <div>
                                                <p className="text-[13px] font-semibold text-foreground">
                                                    {student.full_name ?? student.email}
                                                </p>
                                                <p className="text-[11px] text-muted-foreground">
                                                    {student.specialty ?? "CS"} · {student.year ?? 1} курс
                                                </p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-[13px] font-bold text-foreground">
                                                {student.gpa?.toFixed(2) ?? "—"}
                                            </p>
                                            <p className="text-[10px] text-muted-foreground">GPA</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-center text-xs text-muted-foreground py-8">
                                Нет студентов
                            </p>
                        )}
                    </CardContent>
                </Card>

                {/* Быстрые действия */}
                <Card className="rounded-2xl border-border">
                    <CardHeader className="pb-3">
                        <CardTitle className="flex items-center gap-2 text-sm font-semibold text-foreground">
                            <TrendingUp className="h-4 w-4 text-primary" />
                            Быстрые действия
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="pb-5">
                        <div className="flex flex-col gap-2">
                            {[
                                { href: '/dashboard/teacher/verify', icon: BadgeCheck, label: 'Верифицировать навыки', color: 'text-[#00B894] bg-[#00B894]/10' },
                                { href: '/dashboard/teacher/alumni', icon: GraduationCap, label: 'Карта выпускников', color: 'text-primary bg-primary/10' },
                                { href: '/dashboard/teacher/recommendations', icon: BookOpen, label: 'Написать рекомендацию', color: 'text-[#F97316] bg-[#F97316]/10' }, // ✅ Исправлено
                            ].map((action) => (
                                <Link key={action.href} href={action.href}
                                    className="flex items-center gap-3 rounded-xl border border-border bg-secondary/30 p-3 transition-all hover:border-primary/30 hover:bg-primary/5">
                                    <div className={`flex h-9 w-9 items-center justify-center rounded-xl ${action.color}`}>
                                        <action.icon className="h-4 w-4" />
                                    </div>
                                    <span className="text-[13px] font-medium text-foreground">{action.label}</span>
                                </Link>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Последние рекомендации */}
                <Card className="rounded-2xl border-border">
                    <CardHeader className="pb-3">
                        <CardTitle className="flex items-center gap-2 text-sm font-semibold text-foreground">
                            <Award className="h-4 w-4 text-primary" />
                            Последние рекомендации
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="pb-5">
                        {(recentRecs ?? []).length > 0 ? (
                            <div className="flex flex-col gap-3">
                                {recentRecs!.map((rec: any) => (
                                    <div key={rec.id}
                                        className="rounded-xl border border-border bg-secondary/30 p-3">
                                        <div className="flex items-center justify-between mb-1">
                                            <p className="text-[13px] font-semibold text-foreground">
                                                {rec.professor_name}
                                            </p>
                                            {rec.verified && (
                                                <BadgeCheck className="h-4 w-4 text-[#00B894]" />
                                            )}
                                        </div>
                                        <p className="text-[11px] text-muted-foreground line-clamp-2">{rec.text}</p>
                                        <p className="mt-1 text-[10px] text-muted-foreground/70">{rec.course}</p>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-center text-xs text-muted-foreground py-8">
                                Нет рекомендаций
                            </p>
                        )}
                    </CardContent>
                </Card>

            </div>
        </div>
    )
}