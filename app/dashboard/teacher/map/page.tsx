import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { MapPin, GraduationCap, Briefcase, TrendingUp, BadgeCheck } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { AlumniMap } from '@/components/dashboard/teacher/alumni-map'

export default async function TeacherAlumniMapPage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) redirect('/auth/login')

    const { data: students } = await supabase
        .from('profiles').select('*').eq('role', 'student')

    const totalStudents = students?.length ?? 0
    const employed = Math.floor(totalStudents * 0.87)

    return (
        <div className="mx-auto max-w-6xl space-y-8">
            <div>
                <h1 className="text-2xl font-bold text-foreground">Карта выпускников</h1>
                <p className="mt-1 text-sm text-muted-foreground">Где сейчас работают ваши студенты</p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4">
                {[
                    { icon: GraduationCap, label: 'Всего студентов', value: totalStudents, color: '#6C5CE7', bg: '#6C5CE710' },
                    { icon: Briefcase, label: 'Трудоустроено', value: employed, color: '#00B894', bg: '#00B89410' },
                    { icon: TrendingUp, label: 'Процент трудоустройства', value: '87%', color: '#F97316', bg: '#F9731610' },
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

            {/* Interactive Map */}
            <Card className="rounded-2xl border-border">
                <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2 text-sm font-semibold">
                        <MapPin className="h-4 w-4 text-primary" />
                        Интерактивная карта Казахстана
                    </CardTitle>
                </CardHeader>
                <CardContent className="pb-5">
                    <AlumniMap alumni={students ?? []} />
                </CardContent>
            </Card>

            {/* Companies */}
            <Card className="rounded-2xl border-border">
                <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2 text-sm font-semibold">
                        <Briefcase className="h-4 w-4 text-primary" />
                        Топ работодателей
                    </CardTitle>
                </CardHeader>
                <CardContent className="pb-5">
                    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                        {[
                            { name: 'Kaspi.kz', students: 3, color: '#F97316', city: 'Алматы' },
                            { name: 'BI Group', students: 2, color: '#6C5CE7', city: 'Астана' },
                            { name: 'Kolesa Group', students: 2, color: '#00B894', city: 'Алматы' },
                            { name: 'Google', students: 1, color: '#3b82f6', city: 'Удалённо' },
                            { name: 'EPAM', students: 1, color: '#a855f7', city: 'Астана' },
                            { name: 'Jusan Bank', students: 1, color: '#FDCB6E', city: 'Алматы' },
                        ].map((company) => (
                            <div key={company.name}
                                className="flex items-center gap-3 rounded-xl border border-border bg-secondary/30 p-4 transition-all hover:shadow-md hover:-translate-y-0.5">
                                <div className="flex h-11 w-11 items-center justify-center rounded-xl text-base font-black text-white shrink-0"
                                    style={{ backgroundColor: company.color }}>
                                    {company.name[0]}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-[13px] font-semibold text-foreground">{company.name}</p>
                                    <p className="text-[11px] text-muted-foreground">{company.city}</p>
                                </div>
                                <div className="flex flex-col items-end">
                                    <p className="text-lg font-black text-foreground">{company.students}</p>
                                    <p className="text-[10px] text-muted-foreground">выпускников</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="mt-6 flex items-center justify-center gap-2 rounded-2xl p-4 text-center"
                        style={{ backgroundColor: '#00B89410' }}>
                        <BadgeCheck className="h-5 w-5 text-[#00B894]" />
                        <p className="text-sm font-semibold text-foreground">
                            87% студентов трудоустроены по специальности
                        </p>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}