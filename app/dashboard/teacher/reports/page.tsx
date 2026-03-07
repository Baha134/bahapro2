'use client'

import React, { useState, useCallback, useMemo } from 'react'
import { FileText, Download, TrendingUp, Users, Award, BadgeCheck, Loader, Filter, X } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import * as XLSX from 'xlsx'

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

interface Filters {
    startDate: string
    endDate: string
    minGpa: string
    maxGpa: string
    student: string
}

export default function TeacherReportsPage() {
    const [data, setData] = useState<ReportData | null>(null)
    const [loading, setLoading] = useState(false)
    const [generatingReport, setGeneratingReport] = useState<string | null>(null)
    const [showFilters, setShowFilters] = useState(false)
    const [filters, setFilters] = useState<Filters>({
        startDate: '',
        endDate: '',
        minGpa: '',
        maxGpa: '',
        student: ''
    })
    const [cacheTime, setCacheTime] = useState<number>(0)

    const fetchData = useCallback(async (forceRefresh = false) => {
        try {
            setLoading(true)

            const cached = localStorage?.getItem('reportData')
            const cachedTime = localStorage?.getItem('reportDataTime')
            const now = Date.now()

            if (cached && cachedTime && !forceRefresh) {
                const age = now - parseInt(cachedTime)
                if (age < 5 * 60 * 1000) {
                    const parsedData = JSON.parse(cached)
                    setData(parsedData)
                    setCacheTime(Math.round(age / 1000))
                    setLoading(false)
                    return
                }
            }

            const response = await fetch('/api/teacher/reports/data')
            const result = await response.json()
            setData(result)

            localStorage?.setItem('reportData', JSON.stringify(result))
            localStorage?.setItem('reportDataTime', now.toString())
            setCacheTime(0)
        } catch (error) {
            console.error('Ошибка загрузки данных:', error)
        } finally {
            setLoading(false)
        }
    }, [])

    React.useEffect(() => {
        fetchData()
    }, [fetchData])

    const filteredData = useMemo(() => {
        if (!data) return null

        let filteredStudents = [...data.students]

        if (filters.minGpa) {
            filteredStudents = filteredStudents.filter(s => (s.gpa ?? 0) >= parseFloat(filters.minGpa))
        }
        if (filters.maxGpa) {
            filteredStudents = filteredStudents.filter(s => (s.gpa ?? 0) <= parseFloat(filters.maxGpa))
        }
        if (filters.student) {
            filteredStudents = filteredStudents.filter(s =>
                (s.full_name ?? s.email ?? '').toLowerCase().includes(filters.student.toLowerCase())
            )
        }

        return {
            ...data,
            students: filteredStudents
        }
    }, [data, filters])

    const generateReport = async (reportType: string) => {
        try {
            setGeneratingReport(reportType)
            const reportData = filteredData || data

            if (!reportData) {
                alert('Нет данных для отчёта')
                return
            }

            const response = await fetch('/api/teacher/reports/generate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ reportType, data: reportData })
            })

            if (!response.ok) throw new Error('Ошибка при генерации отчёта')

            const blob = await response.blob()
            const url = window.URL.createObjectURL(blob)
            const a = document.createElement('a')
            a.href = url
            a.download = `report-${reportType}-${new Date().toISOString().split('T')[0]}.pdf`
            document.body.appendChild(a)
            a.click()
            window.URL.revokeObjectURL(url)
            document.body.removeChild(a)
        } catch (error) {
            console.error('Ошибка при скачивании:', error)
            alert(`Не удалось скачать отчёт: ${error}`)
        } finally {
            setGeneratingReport(null)
        }
    }

    const exportToExcel = () => {
        if (!filteredData) return

        const workbook = XLSX.utils.book_new()

        const studentsData = filteredData.students.map(s => ({
            'ФИО': s.full_name || s.email,
            'Email': s.email,
            'Специальность': s.specialty || 'N/A',
            'Курс': s.year || 'N/A',
            'GPA': s.gpa?.toFixed(2) || 'N/A',
            'Deans List': s.deans_list ? 'Да' : 'Нет'
        }))
        const ws1 = XLSX.utils.json_to_sheet(studentsData)
        XLSX.utils.book_append_sheet(workbook, ws1, 'Студенты')

        const skillsData = filteredData.topSkills.map(([skill, count], idx) => ({
            'Место': idx + 1,
            'Навык': skill,
            'Количество': count
        }))
        const ws2 = XLSX.utils.json_to_sheet(skillsData)
        XLSX.utils.book_append_sheet(workbook, ws2, 'Навыки')

        const statsData = [{
            'Метрика': 'Студентов',
            'Значение': filteredData.students.length
        }, {
            'Метрика': 'Средний GPA',
            'Значение': filteredData.avgGpa
        }, {
            'Метрика': 'Deans List',
            'Значение': filteredData.deansListCount
        }, {
            'Метрика': 'Готовы к стажировке',
            'Значение': filteredData.internshipReady
        }]
        const ws3 = XLSX.utils.json_to_sheet(statsData)
        XLSX.utils.book_append_sheet(workbook, ws3, 'Статистика')

        XLSX.writeFile(workbook, `report-${new Date().toISOString().split('T')[0]}.xlsx`)
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
                    <Button onClick={() => fetchData(true)} className="mt-4">Повторить</Button>
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

            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-foreground">Генератор отчётов</h1>
                    <p className="mt-2 text-sm text-muted-foreground">
                        Создание и скачивание PDF и Excel отчётов для ВУЗа
                    </p>
                </div>
                <div className="text-right">
                    {cacheTime > 0 && (
                        <p className="text-xs text-muted-foreground">
                            Кэш: {cacheTime}с назад
                        </p>
                    )}
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => fetchData(true)}
                        className="mt-2"
                    >
                        Обновить
                    </Button>
                </div>
            </div>

            <div className="space-y-4">
                <Button
                    variant="outline"
                    onClick={() => setShowFilters(!showFilters)}
                    className="gap-2"
                >
                    <Filter className="h-4 w-4" />
                    {showFilters ? 'Скрыть' : 'Показать'} фильтры
                    {Object.values(filters).some(v => v) && <span className="ml-2 text-xs font-bold">({Object.values(filters).filter(v => v).length})</span>}
                </Button>

                {showFilters && (
                    <Card className="rounded-2xl border-border">
                        <CardContent className="p-5">
                            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                                <div>
                                    <label className="text-sm font-medium">Минимальный GPA</label>
                                    <input
                                        type="number"
                                        step="0.1"
                                        placeholder="2.0"
                                        value={filters.minGpa}
                                        onChange={(e) => setFilters({ ...filters, minGpa: e.target.value })}
                                        className="mt-1 w-full px-3 py-2 rounded-lg border border-border text-sm"
                                    />
                                </div>
                                <div>
                                    <label className="text-sm font-medium">Максимальный GPA</label>
                                    <input
                                        type="number"
                                        step="0.1"
                                        placeholder="4.0"
                                        value={filters.maxGpa}
                                        onChange={(e) => setFilters({ ...filters, maxGpa: e.target.value })}
                                        className="mt-1 w-full px-3 py-2 rounded-lg border border-border text-sm"
                                    />
                                </div>
                                <div>
                                    <label className="text-sm font-medium">Поиск по студенту</label>
                                    <input
                                        type="text"
                                        placeholder="Имя или email"
                                        value={filters.student}
                                        onChange={(e) => setFilters({ ...filters, student: e.target.value })}
                                        className="mt-1 w-full px-3 py-2 rounded-lg border border-border text-sm"
                                    />
                                </div>
                            </div>
                            {Object.values(filters).some(v => v) && (
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => setFilters({ startDate: '', endDate: '', minGpa: '', maxGpa: '', student: '' })}
                                    className="mt-3 gap-1"
                                >
                                    <X className="h-3 w-3" />
                                    Очистить фильтры
                                </Button>
                            )}
                        </CardContent>
                    </Card>
                )}
            </div>

            <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
                {[
                    { label: 'Студентов', value: filteredData?.students?.length ?? 0, color: '#6C5CE7', bg: '#6C5CE710' },
                    { label: 'Средний GPA', value: filteredData?.avgGpa, color: '#00B894', bg: '#00B89410' },
                    { label: "Dean's List", value: filteredData?.deansListCount ?? 0, color: '#F97316', bg: '#F9731610' },
                    { label: 'Готовы к стажировке', value: filteredData?.internshipReady ?? 0, color: '#a855f7', bg: '#a855f710' },
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

            <div className="flex gap-3">
                <Button
                    onClick={exportToExcel}
                    className="gap-2"
                    variant="outline"
                >
                    <Download className="h-4 w-4" />
                    Экспорт в Excel
                </Button>
            </div>

            <div className="grid gap-6 lg:grid-cols-2">

                <Card className="rounded-2xl border-border lg:col-span-2">
                    <CardHeader className="pb-4">
                        <CardTitle className="flex items-center gap-2 text-sm font-semibold">
                            <FileText className="h-5 w-5 text-primary" />
                            Доступные отчёты (PDF)
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
                                {filteredData?.topSkills.slice(0, 5).map(([name, count], idx) => {
                                    const max = filteredData?.topSkills[0]?.[1] ?? 1
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
                            </div>

                            <div className="rounded-2xl bg-gradient-to-br from-secondary/50 to-secondary/30 p-5 flex flex-col justify-between">
                                <div>
                                    <p className="text-xs font-bold text-foreground mb-4">Сводка данных</p>
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between">
                                            <p className="text-[12px] text-muted-foreground">Всего навыков</p>
                                            <p className="text-2xl font-black text-foreground">{filteredData?.allSkills?.length ?? 0}</p>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <p className="text-[12px] text-muted-foreground">Рекомендаций</p>
                                            <p className="text-2xl font-black text-foreground">{filteredData?.recs?.length ?? 0}</p>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <p className="text-[12px] text-muted-foreground">Верифицировано</p>
                                            <p className="text-2xl font-black text-foreground">{filteredData?.allBadges?.filter((b: any) => b.verified).length ?? 0}</p>
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