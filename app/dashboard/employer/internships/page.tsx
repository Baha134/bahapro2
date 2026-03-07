import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Users, Clock, CheckCircle, Star, TrendingUp, BookOpen } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default async function EmployerInternshipsPage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) redirect('/auth/login')

    const { data: students } = await supabase
        .from('profiles').select('*').eq('role', 'student')

    const candidates = (students ?? []).filter(s => s.available_for_internship)

    return (
        <div className="mx-auto max-w-6xl space-y-8">

            <div>
                <h1 className="text-2xl font-bold text-foreground">Управление стажировками</h1>
                <p className="mt-1 text-sm text-muted-foreground">
                    Трекер прогресса стажёров и бронирование талантов
                </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
                {[
                    { icon: Users, label: 'Доступны для стажировки', value: candidates.length, color: '#6C5CE7', bg: '#6C5CE710' },
                    { icon: Clock, label: 'На рассмотрении', value: 0, color: '#F97316', bg: '#F9731610' },
                    { icon: CheckCircle, label: 'Активных стажёров', value: 0, color: '#00B894', bg: '#00B89410' },
                    { icon: Star, label: 'Забронировано талантов', value: 0, color: '#a855f7', bg: '#a855f710' },
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

                {/* Available for internship */}
                <Card className="rounded-2xl border-border">
                    <CardHeader className="pb-3">
                        <CardTitle className="flex items-center gap-2 text-sm font-semibold">
                            <Users className="h-4 w-4 text-primary" />
                            Готовы к стажировке
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="pb-5">
                        {candidates.length > 0 ? (
                            <div className="flex flex-col gap-3">
                                {candidates.slice(0, 6).map((s: any) => (
                                    <div key={s.id}
                                        className="flex items-center justify-between rounded-xl border border-border bg-secondary/30 p-3">
                                        <div className="flex items-center gap-3">
                                            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-xs font-bold text-primary">
                                                {(s.full_name ?? 'S')[0].toUpperCase()}
                                            </div>
                                            <div>
                                                <p className="text-[13px] font-semibold text-foreground">{s.full_name}</p>
                                                <p className="text-[11px] text-muted-foreground">
                                                    {s.specialty ?? 'CS'} · {s.university_short ?? s.university ?? 'Университет'}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className="text-[12px] font-bold text-foreground">{s.gpa?.toFixed(2) ?? '—'}</span>
                                            <button className="rounded-lg bg-primary/10 px-3 py-1.5 text-[11px] font-semibold text-primary transition-colors hover:bg-primary/20">
                                                Забронировать
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="py-10 text-center text-xs text-muted-foreground">
                                Нет студентов доступных для стажировки
                            </p>
                        )}
                    </CardContent>
                </Card>

                {/* How it works */}
                <Card className="rounded-2xl border-border">
                    <CardHeader className="pb-3">
                        <CardTitle className="flex items-center gap-2 text-sm font-semibold">
                            <BookOpen className="h-4 w-4 text-primary" />
                            Как работает программа
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="pb-5">
                        <div className="flex flex-col gap-4">
                            {[
                                { step: 1, title: 'Найдите кандидата', desc: 'Используйте поиск талантов для нахождения подходящих студентов', color: '#6C5CE7' },
                                { step: 2, title: 'Забронируйте таланта', desc: 'Заблаговременно бронируйте студентов до их выпуска', color: '#00B894' },
                                { step: 3, title: 'Отслеживайте прогресс', desc: 'Следите за ростом навыков стажёра в реальном времени', color: '#F97316' },
                                { step: 4, title: 'Конвертируйте в найм', desc: 'Переводите лучших стажёров в штат компании', color: '#a855f7' },
                            ].map((item) => (
                                <div key={item.step} className="flex items-start gap-3">
                                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl text-sm font-black text-white"
                                        style={{ backgroundColor: item.color }}>
                                        {item.step}
                                    </div>
                                    <div>
                                        <p className="text-[13px] font-semibold text-foreground">{item.title}</p>
                                        <p className="text-[11px] text-muted-foreground">{item.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

            </div>
        </div>
    )
}