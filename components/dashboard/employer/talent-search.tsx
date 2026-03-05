'use client'

import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { SkillTag } from '@/components/dashboard/skill-tag'
import { Search, User, GraduationCap, Eye, EyeOff } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface Student {
  id: string
  full_name: string | null
  university: string | null
  level: number
  xp: number
  user_skills: Array<{
    level: number
    verified: boolean
    skills: { name: string; category: string }
  }>
}

const demoStudents: Student[] = [
  {
    id: '1',
    full_name: 'Алексей Петров',
    university: 'МГУ',
    level: 5,
    xp: 1250,
    user_skills: [
      { level: 8, verified: true, skills: { name: 'React', category: 'Hard Skills' } },
      { level: 7, verified: true, skills: { name: 'TypeScript', category: 'Hard Skills' } },
      { level: 6, verified: false, skills: { name: 'Node.js', category: 'Hard Skills' } },
    ],
  },
  {
    id: '2',
    full_name: 'Мария Иванова',
    university: 'МФТИ',
    level: 7,
    xp: 2100,
    user_skills: [
      { level: 9, verified: true, skills: { name: 'Python', category: 'Hard Skills' } },
      { level: 8, verified: true, skills: { name: 'SQL', category: 'Hard Skills' } },
      { level: 7, verified: true, skills: { name: 'Machine Learning', category: 'Hard Skills' } },
    ],
  },
  {
    id: '3',
    full_name: 'Дмитрий Козлов',
    university: 'ИТМО',
    level: 4,
    xp: 850,
    user_skills: [
      { level: 7, verified: true, skills: { name: 'Java', category: 'Hard Skills' } },
      { level: 6, verified: false, skills: { name: 'Spring', category: 'Hard Skills' } },
      { level: 5, verified: true, skills: { name: 'Docker', category: 'Tools' } },
    ],
  },
  {
    id: '4',
    full_name: 'Елена Смирнова',
    university: 'ВШЭ',
    level: 6,
    xp: 1800,
    user_skills: [
      { level: 8, verified: true, skills: { name: 'Figma', category: 'Tools' } },
      { level: 7, verified: true, skills: { name: 'UI/UX', category: 'Hard Skills' } },
      { level: 6, verified: false, skills: { name: 'CSS', category: 'Hard Skills' } },
    ],
  },
]

export function TalentSearch({ students: serverStudents }: { students: Student[] }) {
  const [query, setQuery] = useState('')
  const [blindMode, setBlindMode] = useState(false)
  const [verifiedOnly, setVerifiedOnly] = useState(false)

  const students = serverStudents.length > 0 ? serverStudents : demoStudents

  const filtered = students.filter((s) => {
    const matchesQuery = !query ||
      (!blindMode && s.full_name?.toLowerCase().includes(query.toLowerCase())) ||
      s.university?.toLowerCase().includes(query.toLowerCase()) ||
      s.user_skills.some((sk) => sk.skills.name.toLowerCase().includes(query.toLowerCase()))

    const matchesVerified = !verifiedOnly ||
      s.user_skills.some((sk) => sk.verified)

    return matchesQuery && matchesVerified
  })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Поиск талантов</h1>
        <p className="mt-1 text-muted-foreground">Находите кандидатов по верифицированным навыкам</p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Поиск по навыку, университету..."
            className="bg-background/50 pl-10"
          />
        </div>
        <Button
          variant="outline"
          onClick={() => setBlindMode(!blindMode)}
          className={cn(blindMode && 'border-accent text-accent')}
        >
          {blindMode ? <EyeOff className="mr-2 h-4 w-4" /> : <Eye className="mr-2 h-4 w-4" />}
          {blindMode ? 'Слепой наём: вкл' : 'Слепой наём'}
        </Button>
        <Button
          variant="outline"
          onClick={() => setVerifiedOnly(!verifiedOnly)}
          className={cn(verifiedOnly && 'border-accent text-accent')}
        >
          {verifiedOnly ? 'Только верифицированные' : 'Все навыки'}
        </Button>
      </div>

      {/* Results */}
      <div className="space-y-4">
        {filtered.map((student) => (
          <div key={student.id} className="rounded-xl border border-border/50 bg-card p-5 transition-colors hover:border-border">
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-[#6C5CE7] to-[#a855f7] text-white">
                  <User className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-bold text-foreground">
                    {blindMode ? `Кандидат #${student.id.slice(0, 4)}` : student.full_name || 'Без имени'}
                  </h3>
                  {!blindMode && student.university && (
                    <p className="flex items-center gap-1 text-sm text-muted-foreground">
                      <GraduationCap className="h-3.5 w-3.5" />
                      {student.university}
                    </p>
                  )}
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {student.user_skills.map((sk, i) => (
                      <SkillTag key={i} name={sk.skills.name} level={sk.level} verified={sk.verified} />
                    ))}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <span className="rounded-full bg-gradient-to-r from-[#6C5CE7] to-[#a855f7] px-2.5 py-0.5 text-xs font-bold text-white">
                  {'Ур.'}{student.level}
                </span>
              </div>
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="py-12 text-center text-muted-foreground">
            Кандидаты не найдены. Попробуйте изменить фильтры.
          </div>
        )}
      </div>
    </div>
  )
}
