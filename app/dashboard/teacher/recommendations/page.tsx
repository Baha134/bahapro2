'use client'

import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Send, Loader } from 'lucide-react'
import Link from 'next/link'

interface FormData {
    studentId: string
    course: string
    text: string
}

export default function RecommendationsPage() {
    const [formData, setFormData] = useState<FormData>({
        studentId: '',
        course: '',
        text: ''
    })
    const [students, setStudents] = useState<any[]>([])
    const [loading, setLoading] = useState(false)
    const [submitting, setSubmitting] = useState(false)
    const [message, setMessage] = useState('')

    React.useEffect(() => {
        const loadStudents = async () => {
            try {
                setLoading(true)
                const response = await fetch('/api/teacher/reports/data')
                const data = await response.json()
                setStudents(data.students || [])
            } catch (error) {
                console.error('Error:', error)
            } finally {
                setLoading(false)
            }
        }
        loadStudents()
    }, [])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!formData.studentId || !formData.course || !formData.text) {
            setMessage('Заполните все поля!')
            return
        }

        try {
            setSubmitting(true)
            const response = await fetch('/api/teacher/recommendations', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            })

            if (!response.ok) throw new Error('Error')

            setMessage('✅ Рекомендация добавлена!')
            setFormData({ studentId: '', course: '', text: '' })
            setTimeout(() => setMessage(''), 3000)
        } catch (error) {
            setMessage(`❌ Ошибка: ${error}`)
        } finally {
            setSubmitting(false)
        }
    }

    return (
        <div className="mx-auto max-w-2xl space-y-6">
            <div className="flex items-center gap-3">
                <Link href="/dashboard/teacher/reports">
                    <Button variant="ghost" size="sm">
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                </Link>
                <div>
                    <h1 className="text-2xl font-bold text-foreground">Написать рекомендацию</h1>
                    <p className="mt-1 text-sm text-muted-foreground">Добавьте рекомендацию для студента</p>
                </div>
            </div>

            <Card className="rounded-2xl border-border">
                <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-semibold">Форма рекомендации</CardTitle>
                </CardHeader>
                <CardContent className="pb-5">
                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label className="block text-sm font-medium text-foreground mb-2">
                                Выберите студента
                            </label>
                            <select
                                value={formData.studentId}
                                onChange={(e) => setFormData({ ...formData, studentId: e.target.value })}
                                disabled={loading}
                                className="w-full px-4 py-2 rounded-xl border border-border bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                            >
                                <option value="">-- Выберите студента --</option>
                                {students.map(s => (
                                    <option key={s.id} value={s.id}>
                                        {s.full_name || s.email}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-foreground mb-2">
                                Курс / Предмет
                            </label>
                            <input
                                type="text"
                                value={formData.course}
                                onChange={(e) => setFormData({ ...formData, course: e.target.value })}
                                placeholder="Например: Программирование на Python"
                                className="w-full px-4 py-2 rounded-xl border border-border bg-background text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-foreground mb-2">
                                Текст рекомендации
                            </label>
                            <textarea
                                value={formData.text}
                                onChange={(e) => setFormData({ ...formData, text: e.target.value })}
                                placeholder="Напишите рекомендацию..."
                                rows={8}
                                className="w-full px-4 py-2 rounded-xl border border-border bg-background text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                            />
                            <p className="mt-1 text-xs text-muted-foreground">
                                {formData.text.length} символов
                            </p>
                        </div>

                        {message && (
                            <div className={`p-3 rounded-xl text-sm ${message.includes('✅')
                                    ? 'bg-green-500/10 text-green-600'
                                    : 'bg-red-500/10 text-red-600'
                                }`}>
                                {message}
                            </div>
                        )}

                        <Button
                            type="submit"
                            disabled={submitting || loading}
                            className="w-full gap-2"
                        >
                            {submitting ? (
                                <Loader className="h-4 w-4 animate-spin" />
                            ) : (
                                <Send className="h-4 w-4" />
                            )}
                            {submitting ? 'Сохранение...' : 'Отправить рекомендацию'}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}