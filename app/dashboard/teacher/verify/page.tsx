'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { CheckCircle, X, Loader } from 'lucide-react'

interface BadgeItem {
    id: string
    user_id: string
    badge_id: string
    verified: boolean
    created_at: string
    badges?: {
        name: string
        description: string
        icon: string
    }
    profiles?: {
        full_name: string
        email: string
        gpa: number
    }
}

export default function VerificationPage() {
    const [badges, setBadges] = useState<BadgeItem[]>([])
    const [loading, setLoading] = useState(true)
    const [filter, setFilter] = useState<'all' | 'pending' | 'verified'>('pending')
    const [processing, setProcessing] = useState<string | null>(null)

    useEffect(() => {
        fetchBadges()
    }, [])

    const fetchBadges = async () => {
        try {
            setLoading(true)
            const response = await fetch('/api/teacher/reports/data')
            const data = await response.json()
            setBadges(data.allBadges || [])
        } catch (error) {
            console.error('Error:', error)
        } finally {
            setLoading(false)
        }
    }

    const handleVerify = async (badgeId: string, approved: boolean) => {
        try {
            setProcessing(badgeId)
            const response = await fetch('/api/teacher/verify-badge', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ badgeId, verified: approved })
            })

            const data = await response.json()

            if (!response.ok) {
                console.error('Error response:', data)
                alert(`Ошибка: ${data.error || 'Unknown error'}`)
                return
            }

            setBadges(badges.map(b =>
                b.id === badgeId ? { ...b, verified: approved } : b
            ))
            alert('✅ Навык ' + (approved ? 'одобрен' : 'отклонен'))
        } catch (error) {
            console.error('Error:', error)
            alert('Ошибка при верификации: ' + error)
        } finally {
            setProcessing(null)
        }
    }

    const filteredBadges = badges.filter(b => {
        if (filter === 'pending') return !b.verified
        if (filter === 'verified') return b.verified
        return true
    })

    const stats = {
        total: badges.length,
        pending: badges.filter(b => !b.verified).length,
        verified: badges.filter(b => b.verified).length
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center h-96">
                <Loader className="h-8 w-8 animate-spin text-primary" />
            </div>
        )
    }

    return (
        <div className="mx-auto max-w-5xl space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-foreground">Верификация навыков</h1>
                <p className="mt-1 text-sm text-muted-foreground">Проверьте и одобрите навыки студентов</p>
            </div>

            <div className="grid grid-cols-3 gap-4">
                {[
                    { label: 'Всего', value: stats.total, color: 'text-primary' },
                    { label: 'Ожидают', value: stats.pending, color: 'text-amber-500' },
                    { label: 'Верифицировано', value: stats.verified, color: 'text-[#00B894]' },
                ].map((stat) => (
                    <Card key={stat.label} className="rounded-2xl border-border">
                        <CardContent className="p-4 text-center">
                            <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
                            <p className="text-[11px] text-muted-foreground mt-1">{stat.label}</p>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <div className="flex gap-2">
                {(['all', 'pending', 'verified'] as const).map((f) => (
                    <Button
                        key={f}
                        variant={filter === f ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setFilter(f)}
                    >
                        {f === 'all' ? '📋 Все' : f === 'pending' ? '⏳ Ожидают' : '✅ Верифицированы'}
                    </Button>
                ))}
            </div>

            <div className="space-y-3">
                {filteredBadges.length > 0 ? (
                    filteredBadges.map((badge) => (
                        <Card key={badge.id} className="rounded-xl border-border overflow-hidden hover:border-primary/30 transition-all">
                            <CardContent className="p-4">
                                <div className="flex items-start justify-between gap-4">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-2">
                                            <p className="font-semibold text-foreground">
                                                {badge.profiles?.full_name || 'Unknown'}
                                            </p>
                                            {badge.profiles?.gpa && (
                                                <Badge variant="outline" className="text-xs">
                                                    GPA: {badge.profiles.gpa.toFixed(2)}
                                                </Badge>
                                            )}
                                        </div>
                                        <p className="text-sm font-medium text-primary mb-1">
                                            {badge.badges?.name || 'Badge'}
                                        </p>
                                        <p className="text-xs text-muted-foreground">
                                            {badge.badges?.description || 'No description'}
                                        </p>
                                        <p className="text-xs text-muted-foreground mt-2">
                                            Добавлено: {new Date(badge.created_at).toLocaleDateString('ru-RU')}
                                        </p>
                                    </div>
                                    <div className="flex gap-2">
                                        {badge.verified ? (
                                            <Badge className="bg-[#00B894]/10 text-[#00B894] border-[#00B894]/30 flex items-center gap-1">
                                                <CheckCircle className="h-3 w-3" />
                                                Верифицировано
                                            </Badge>
                                        ) : (
                                            <div className="flex gap-2">
                                                <Button
                                                    size="sm"
                                                    disabled={processing === badge.id}
                                                    onClick={() => handleVerify(badge.id, true)}
                                                    className="gap-1 bg-[#00B894]/10 text-[#00B894] hover:bg-[#00B894]/20 border border-[#00B894]/30"
                                                    variant="outline"
                                                >
                                                    {processing === badge.id ? (
                                                        <Loader className="h-3 w-3 animate-spin" />
                                                    ) : (
                                                        <CheckCircle className="h-3 w-3" />
                                                    )}
                                                    Одобрить
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    disabled={processing === badge.id}
                                                    onClick={() => handleVerify(badge.id, false)}
                                                    variant="outline"
                                                    className="gap-1"
                                                >
                                                    <X className="h-3 w-3" />
                                                </Button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))
                ) : (
                    <Card className="rounded-2xl border-border">
                        <CardContent className="p-8 text-center">
                            <p className="text-muted-foreground">
                                {filter === 'pending' ? 'Нет навыков для верификации' : 'Нет верифицированных навыков'}
                            </p>
                        </CardContent>
                    </Card>
                )}
            </div>
        </div>
    )
}