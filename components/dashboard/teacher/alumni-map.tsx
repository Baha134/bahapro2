'use client'

import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { Search, Building2, GraduationCap, MapPin, Briefcase, User } from 'lucide-react'

interface AlumniProfile {
    id: string
    full_name: string | null
    university: string | null
    company: string | null
    position: string | null
    avatar_url: string | null
    level: number
}

const demoAlumni: AlumniProfile[] = [
    { id: '1', full_name: 'Иван Сидоров', university: 'МГУ', company: 'Яндекс', position: 'Frontend-разработчик', avatar_url: null, level: 12 },
    { id: '2', full_name: 'Анна Козлова', university: 'МФТИ', company: 'VK', position: 'Data Scientist', avatar_url: null, level: 15 },
    { id: '3', full_name: 'Сергей Волков', university: 'ИТМО', company: 'Тинькофф', position: 'Backend-разработчик', avatar_url: null, level: 10 },
    { id: '4', full_name: 'Ольга Морозова', university: 'ВШЭ', company: 'Яндекс', position: 'Product Manager', avatar_url: null, level: 11 },
    { id: '5', full_name: 'Артём Лебедев', university: 'МГУ', company: 'Сбер', position: 'ML Engineer', avatar_url: null, level: 14 },
    { id: '6', full_name: 'Кристина Павлова', university: 'МФТИ', company: 'Тинькофф', position: 'iOS-разработчик', avatar_url: null, level: 9 },
    { id: '7', full_name: 'Максим Орлов', university: 'ИТМО', company: 'VK', position: 'DevOps Engineer', avatar_url: null, level: 13 },
    { id: '8', full_name: 'Дарья Титова', university: 'ВШЭ', company: 'Сбер', position: 'UX Designer', avatar_url: null, level: 8 },
    { id: '9', full_name: 'Никита Фёдоров', university: 'МГУ', company: 'Kaspersky', position: 'Security Analyst', avatar_url: null, level: 11 },
    { id: '10', full_name: 'Валерия Соколова', university: 'МФТИ', company: 'Kaspersky', position: 'QA Engineer', avatar_url: null, level: 7 },
]

const companyColors: Record<string, string> = {
    'Яндекс': 'from-red-500 to-yellow-500',
    'VK': 'from-blue-500 to-cyan-500',
    'Тинькофф': 'from-yellow-400 to-yellow-600',
    'Сбер': 'from-green-500 to-emerald-600',
    'Kaspersky': 'from-emerald-400 to-teal-600',
}

export function AlumniMap({ alumni: serverAlumni }: { alumni: AlumniProfile[] }) {
    const [searchQuery, setSearchQuery] = useState('')
    const [selectedCompany, setSelectedCompany] = useState<string | null>(null)

    const alumni = serverAlumni.length > 0 ? serverAlumni : demoAlumni

    // Unique companies
    const companies = [...new Set(alumni.map((a) => a.company).filter(Boolean) as string[])]

    const filtered = alumni.filter((a) => {
        const matchesSearch = !searchQuery ||
            a.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            a.company?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            a.position?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            a.university?.toLowerCase().includes(searchQuery.toLowerCase())

        const matchesCompany = !selectedCompany || a.company === selectedCompany

        return matchesSearch && matchesCompany
    })

    // Company stats
    const companyStats = companies.map((c) => ({
        name: c,
        count: alumni.filter((a) => a.company === c).length,
    })).sort((a, b) => b.count - a.count)

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-foreground">Карта выпускников</h1>
                <p className="mt-1 text-muted-foreground">Трудоустроенные выпускники по компаниям</p>
            </div>

            {/* Company filter chips */}
            <div className="flex flex-wrap items-center gap-2">
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedCompany(null)}
                    className={cn(!selectedCompany && 'border-accent text-accent bg-accent/10')}
                >
                    Все ({alumni.length})
                </Button>
                {companyStats.map((c) => (
                    <Button
                        key={c.name}
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedCompany(selectedCompany === c.name ? null : c.name)}
                        className={cn(selectedCompany === c.name && 'border-accent text-accent bg-accent/10')}
                    >
                        <Building2 className="mr-1.5 h-3.5 w-3.5" />
                        {c.name} ({c.count})
                    </Button>
                ))}
            </div>

            {/* Search */}
            <div className="relative">
                <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                <Input
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Поиск по имени, компании, позиции..."
                    className="bg-background/50 pl-10"
                />
            </div>

            {/* Alumni Grid */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {filtered.map((person) => {
                    const gradient = companyColors[person.company || ''] || 'from-[#6C5CE7] to-[#a855f7]'
                    return (
                        <div key={person.id} className="rounded-xl border border-border/50 bg-card p-5 transition-colors hover:border-border">
                            <div className="flex items-start gap-4">
                                <div className={cn('flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br text-white', gradient)}>
                                    <User className="h-6 w-6" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h3 className="font-bold text-foreground truncate">{person.full_name || 'Выпускник'}</h3>
                                    <div className="mt-1 space-y-1">
                                        <p className="flex items-center gap-1.5 text-sm text-muted-foreground truncate">
                                            <Briefcase className="h-3.5 w-3.5 shrink-0" />
                                            {person.position || 'Специалист'}
                                        </p>
                                        <p className="flex items-center gap-1.5 text-sm font-medium text-foreground truncate">
                                            <Building2 className="h-3.5 w-3.5 shrink-0" />
                                            {person.company}
                                        </p>
                                        <p className="flex items-center gap-1.5 text-xs text-muted-foreground truncate">
                                            <GraduationCap className="h-3.5 w-3.5 shrink-0" />
                                            {person.university || 'Университет'}
                                        </p>
                                    </div>
                                    <div className="mt-2">
                                        <span className="inline-flex rounded-full bg-gradient-to-r from-[#6C5CE7] to-[#a855f7] px-2.5 py-0.5 text-[10px] font-bold text-white">
                                            Ур. {person.level}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )
                })}
            </div>

            {filtered.length === 0 && (
                <div className="py-12 text-center text-muted-foreground">
                    Выпускники не найдены. Попробуйте изменить фильтры.
                </div>
            )}
        </div>
    )
}
