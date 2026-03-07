'use client'

import React, { useState } from 'react'
import { FileText, Download, TrendingUp, Users, Award, BadgeCheck, Loader } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

interface ReportData {
    students: any[]
    allSkills: any[]
    allBadges: any[]
    recs: any[]
    avgGpa: string
    deansListCount: number
    internshipReady: number
    topSkills: [string, number][]
}

interface Report {
    title: string
    desc: string
    icon: React.ComponentType<any>
    color: string
    type: 'students' | 'skills' | 'employment' | 'recommendations'
}

export default function TeacherReportsPage() {
    const [data, setData] = useState<ReportData | null>(null)
    const [loading, setLoading] = useState(false)
    const [generatingReport, setGeneratingReport] = useState<string | null>(null)

    React.useEffect(() => {
        fetchData()
    }, [])

    const fetchData = async () => {
        try {
            setLoading(true)
            const response = await fetch('/api/teacher/reports/data')
            const result = await response.json()
            setData(result)
        } catch (error) {
            console.error('Ошибка загрузки данных:', error)
        } finally {
            setLoading(false)
        }
    }

    const generateReport = async (reportType: string) => {
        try {
            setGeneratingReport(reportType)
            console.log('Отправляем запрос на:', '/api/teacher/reports/generate')
            console.log('Данные:', { reportType, data })

            const response = await fetch('/api/teacher/reports/generate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ reportType, data })
            })

            console.log('Статус ответа:', response.status)
            console.log('Response OK:', response.ok)

            if (!response.ok) {
                const errorText = await response.text()
                console.error('Ошибка от сервера:', errorText)
                throw new Error(`Ошибка ${response.status}: ${errorText}`)
            }

            const blob = await response.blob()
            console.log('Размер PDF:', blob.size)

            const url = window.URL.createObjectURL(blob)
            const a = document.createElement('a')
            a.href = url
            a.download = `report-${reportType}-${new Date().toISOString().split('T')[0]}.pdf`
            document.body.appendChild(a)
            a.click()
            window.URL.revokeObjectURL(url)
            document.body.removeChild(a)

            console.log('PDF скачан успешно!')
        } catch (error) {
            console.error('Ошибка при скачивании:', error)
            alert(`Не удалось скачать отчёт: ${error}`)
        } finally {
            setGeneratingReport(null)
        }
    }

    if (loading) {
        return (
            <div className="mx-auto max-w-5xl space-y-8">
                <div className="flex items-center justify-center h-96">
                    <Loader className="h-8 w-8 animate-spin text-primary" />
                </div>
            </div>
        )
    }

    if (!data) {
        return (
            <div className="mx-auto max-w-5xl space-y-8">
                <div className="text-center">
                    <p className="text-muted-foreground">Не удалось загрузить данные</p>
                    <Button onClick={fetchData} className="mt-4">Повторить</Button>
                </div>
            </div>
        )
    }

    const reports: Report[] = [
        {
            title: 'Общий отчёт по студентам',
            desc: 'Статистика успеваемости, навыков и трудоустройства',
            icon: Users,
            color: '#6C5CE7',
            type: 'students'
        },
        {
            title: 'Отчёт по навыкам',
            desc: 'Топ навыков, уровни владения, верификация',
            icon: Award,
            color: '#00B894',
            type: 'skills'
        },
        {
            title: 'Отчёт по трудоустройству',
            desc: 'Процент трудоустроенных, готовые к стажировке',
            icon: TrendingUp,
            color: '#F97316',
            type: 'employment'
        },
        {
            title: 'Отчёт по рекомендациям',
            desc: 'Все рекомендации преподавателей',
            icon: BadgeCheck,
            color: '#a855f7',
            type: 'recommendations'
        },
    ]

    return (
        <div className="mx-auto max-w-5xl space-y-8">

            <div>
                <h1 className="text-3xl font-bold text-foreground">Генератор отчётов</h1>
                <p className="mt-2 text-sm text-muted-foreground">
                    Создание и скачивание PDF отчётов для ВУЗа
                </p>
            </div>

            <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
                {[
                    { label: 'Студентов', value: data.students?.length ?? 0, color: '#6C5CE7', bg: '#6C5CE710' },
                    { label: 'Средний GPA', value: data.avgGpa, color: '#00B894', bg: '#00B89410' },
                    { label: "Dean's List", value: data.deansListCount, color: '#F97316', bg: '#F9731610' },
                    { label: 'Готовы к стажировке', value: data.internshipReady, color: '#a855f7', bg: '#a855f710' },
                ].map((stat) => (
                    <Card key={stat.label} className="rounded-2xl border-border">
                        <CardContent className="p-5 text-center">
                            <p className="text-3xl font-black text-foreground">{stat.value}</p>
                            <p className="mt-1 text-[11px] text-muted-foreground">{stat.label}</p>
                            <div className="mt-3 h-1.5 w-full rounded-full overflow-hidden"
                                style={{ backgroundColor: stat.bg }}>
                                <div className="h-full rounded-full" style={{ backgroundColor: stat.color, width: '100%' }} />
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <div className="grid gap-6 lg:grid-cols-2">

                <Card className="rounded-2xl border-border lg:col-span-2">
                    <CardHeader className="pb-4">
                        <CardTitle className="flex items-center gap-2 text-sm font-semibold">
                            <FileText className="h-5 w-5 text-primary" />
                            Доступные отчёты
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="pb-5">
                        <div className="grid gap-3 md:grid-cols-2">
                            {reports.map((report) => (
                                <div key={report.type}
                                    className="flex items-center justify-between rounded-xl border border-border bg-secondary/30 p-4 transition-all hover:border-primary/30 hover:bg-secondary/50">
                                    <div className="flex items-center gap-3 flex-1">
                                        <div className="flex h-11 w-11 items-center justify-center rounded-xl shrink-0"
                                            style={{ backgroundColor: `${report.color}15` }}>
                                            <report.icon className="h-5 w-5" style={{ color: report.color }} />
                                        </div>
                                        <div>
                                            <p className="text-[13px] font-semibold text-foreground">{report.title}</p>
                                            <p className="text-[11px] text-muted-foreground">{report.desc}</p>
                                        </div>
                                    </div>
                                    <Button
                                        onClick={() => generateReport(report.type)}
                                        disabled={generatingReport === report.type}
                                        className="ml-2 shrink-0 gap-1.5 rounded-xl px-3 py-2 text-[11px] font-semibold transition-all"
                                        style={{
                                            backgroundColor: `${report.color}15`,
                                            color: report.color,
                                            borderColor: `${report.color}30`,
                                        }}
                                    >
                                        {generatingReport === report.type ? (
                                            <Loader className="h-3.5 w-3.5 animate-spin" />
                                        ) : (
                                            <Download className="h-3.5 w-3.5" />
                                        )}
                                        {generatingReport === report.type ? 'Загрузка...' : 'PDF'}
                                    </Button>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                <Card className="rounded-2xl border-border lg:col-span-2">
                    <CardHeader className="pb-4">
                        <CardTitle className="flex items-center gap-2 text-sm font-semibold">
                            <TrendingUp className="h-5 w-5 text-primary" />
                            Топ навыков студентов
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="pb-5">
                        <div className="grid gap-6 md:grid-cols-2">
                            <div className="flex flex-col gap-3">
                                {data.topSkills.slice(0, 5).map(([name, count], idx) => {
                                    const max = data.topSkills[0]?.[1] ?? 1
                                    const pct = Math.round((count / max) * 100)
                                    const colors = ['#6C5CE7', '#00B894', '#F97316', '#a855f7', '#00D2D3']
                                    return (
                                        <div key={name} className="flex items-center gap-3">
                                            <span className="w-6 text-center text-[11px] font-black text-muted-foreground">#{idx + 1}</span>
                                            <span className="w-24 text-[13px] font-medium text-foreground truncate">{name}</span>
                                            <div className="flex-1 h-2 rounded-full bg-secondary overflow-hidden">
                                                <div className="h-full rounded-full" style={{ width: `${pct}%`, backgroundColor: colors[idx] }} />
                                            </div>
                                            <span className="text-[12px] font-bold text-foreground w-8 text-right">{count}</span>
                                        </div>
                                    )
                                })}
                                {data.topSkills.length === 0 && (
                                    <p className="py-8 text-center text-xs text-muted-foreground">Нет данных</p>
                                )}
                            </div>

                            <div className="rounded-2xl bg-gradient-to-br from-secondary/50 to-secondary/30 p-5 flex flex-col justify-between">
                                <div>
                                    <p className="text-xs font-bold text-foreground mb-4">Сводка данных</p>
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between">
                                            <p className="text-[12px] text-muted-foreground">Всего навыков</p>
                                            <p className="text-2xl font-black text-foreground">{data.allSkills?.length ?? 0}</p>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <p className="text-[12px] text-muted-foreground">Рекомендаций</p>
                                            <p className="text-2xl font-black text-foreground">{data.recs?.length ?? 0}</p>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <p className="text-[12px] text-muted-foreground">Верифицировано</p>
                                            <p className="text-2xl font-black text-foreground">{data.allBadges?.filter((b: any) => b.verified).length ?? 0}</p>
                                        </div>
                                    </div>
                                </div>
                                <p className="text-[10px] text-muted-foreground mt-4">
                                    Последнее обновление: {new Date().toLocaleDateString('ru-RU')}
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

            </div>
        </div>
    )
}
