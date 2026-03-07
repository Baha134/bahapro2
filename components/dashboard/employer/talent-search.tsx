'use client'

import { useState } from 'react'
import { Search, User, Eye, EyeOff, BadgeCheck, Filter, SlidersHorizontal, Star, MapPin, GraduationCap } from 'lucide-react'

interface SkillInfo { name: string; category: string }
interface UserSkill { level: number; verified: boolean; skills: SkillInfo }
interface Student {
  id: string
  full_name: string | null
  university: string | null
  level: number
  xp: number
  user_skills: UserSkill[]
}

const levelColor = (level: number) => {
  if (level >= 80) return '#00B894'
  if (level >= 60) return '#6C5CE7'
  if (level >= 40) return '#F97316'
  return '#6b7280'
}

const levelLabel = (level: number) => {
  if (level >= 80) return 'Expert'
  if (level >= 60) return 'Advanced'
  if (level >= 40) return 'Intermediate'
  return 'Beginner'
}

export function TalentSearch({ students: serverStudents }: { students: Student[] }) {
  const [query, setQuery] = useState('')
  const [blindMode, setBlindMode] = useState(false)
  const [verifiedOnly, setVerifiedOnly] = useState(false)
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null)

  const students = serverStudents ?? []

  const filtered = students.filter((s) => {
    const q = query.toLowerCase()
    const matchesQuery = !query ||
      (!blindMode && s.full_name?.toLowerCase().includes(q)) ||
      s.university?.toLowerCase().includes(q) ||
      s.user_skills.some((us) => us.skills?.name.toLowerCase().includes(q))
    const matchesVerified = !verifiedOnly || s.user_skills.some((us) => us.verified)
    return matchesQuery && matchesVerified
  })

  return (
    <div className="mx-auto max-w-6xl space-y-6">

      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Поиск талантов</h1>
        <p className="mt-1 text-sm text-muted-foreground">Найдите лучших студентов по навыкам и компетенциям</p>
      </div>

      {/* Search & Filters */}
      <div className="flex flex-wrap items-center gap-3 rounded-2xl border border-border bg-card p-4">
        <div className="relative flex-1 min-w-[260px]">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Поиск по имени, навыку или ВУЗу..."
            className="w-full rounded-xl border border-border bg-secondary/50 py-2.5 pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
        </div>

        <button onClick={() => setVerifiedOnly(!verifiedOnly)}
          className="flex items-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-medium transition-all"
          style={verifiedOnly
            ? { borderColor: '#00B894', backgroundColor: '#00B89415', color: '#00B894' }
            : { borderColor: 'var(--border)', backgroundColor: 'var(--secondary)', color: 'var(--muted-foreground)' }}>
          <BadgeCheck className="h-4 w-4" />
          Только верифицированные
        </button>

        <button onClick={() => setBlindMode(!blindMode)}
          className="flex items-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-medium transition-all"
          style={blindMode
            ? { borderColor: '#6C5CE7', backgroundColor: '#6C5CE715', color: '#6C5CE7' }
            : { borderColor: 'var(--border)', backgroundColor: 'var(--secondary)', color: 'var(--muted-foreground)' }}>
          {blindMode ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          Blind Mode {blindMode ? 'ON' : 'OFF'}
        </button>

        <div className="ml-auto text-sm text-muted-foreground">
          {filtered.length} студентов
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">

        {/* Student List */}
        <div className="lg:col-span-2 flex flex-col gap-4">
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center rounded-2xl border border-border bg-card">
              <Search className="h-10 w-10 text-muted-foreground/30 mb-3" />
              <p className="text-sm text-muted-foreground">Никого не найдено</p>
            </div>
          ) : filtered.map((student) => {
            const topSkills = student.user_skills.slice(0, 5)
            const verifiedCount = student.user_skills.filter(s => s.verified).length
            const isSelected = selectedStudent?.id === student.id

            return (
              <div key={student.id}
                onClick={() => setSelectedStudent(isSelected ? null : student)}
                className="cursor-pointer rounded-2xl border bg-card p-5 transition-all hover:-translate-y-0.5 hover:shadow-lg"
                style={{
                  borderColor: isSelected ? '#6C5CE7' : 'var(--border)',
                  boxShadow: isSelected ? '0 0 0 2px #6C5CE720' : 'none',
                }}>
                <div className="flex items-start gap-4">

                  {/* Avatar */}
                  <div className="relative shrink-0">
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-[#6C5CE7] to-[#00B894] text-lg font-bold text-white">
                      {blindMode ? '?' : (student.full_name?.[0] ?? 'S')}
                    </div>
                    <div className="absolute -bottom-1.5 -right-1.5 rounded-lg bg-card border border-border px-1.5 py-0.5 text-[10px] font-black text-foreground">
                      LVL {student.level}
                    </div>
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h3 className="font-bold text-foreground">
                          {blindMode ? `Candidate #${student.id.slice(-6)}` : (student.full_name ?? 'Студент')}
                        </h3>
                        <div className="mt-0.5 flex items-center gap-1.5 text-xs text-muted-foreground">
                          <GraduationCap className="h-3.5 w-3.5" />
                          {student.university ?? 'Университет'}
                        </div>
                      </div>
                      {verifiedCount > 0 && (
                        <span className="flex items-center gap-1 rounded-full bg-[#00B894]/10 px-2.5 py-1 text-[11px] font-semibold text-[#00B894]">
                          <BadgeCheck className="h-3.5 w-3.5" />
                          {verifiedCount} verified
                        </span>
                      )}
                    </div>

                    {/* Skills */}
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {topSkills.map((us, idx) => (
                        <span key={idx}
                          className="flex items-center gap-1 rounded-lg px-2.5 py-1 text-[11px] font-semibold"
                          style={{
                            backgroundColor: `${levelColor(us.level)}15`,
                            color: levelColor(us.level),
                          }}>
                          {us.verified && <BadgeCheck className="h-3 w-3" />}
                          {us.skills?.name}
                          <span className="opacity-60">{us.level}%</span>
                        </span>
                      ))}
                      {student.user_skills.length > 5 && (
                        <span className="rounded-lg bg-secondary px-2.5 py-1 text-[11px] text-muted-foreground">
                          +{student.user_skills.length - 5}
                        </span>
                      )}
                    </div>

                    {/* XP bar */}
                    <div className="mt-3 flex items-center gap-2">
                      <div className="flex-1 h-1.5 rounded-full bg-secondary overflow-hidden">
                        <div className="h-full rounded-full bg-gradient-to-r from-[#6C5CE7] to-[#00B894]"
                          style={{ width: `${Math.min((student.xp / 1000) * 100, 100)}%` }} />
                      </div>
                      <span className="text-[10px] text-muted-foreground">{student.xp} XP</span>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Detail Panel */}
        <div className="lg:col-span-1">
          {selectedStudent ? (
            <div className="sticky top-24 rounded-2xl border border-border bg-card p-6">
              <div className="flex flex-col items-center text-center">
                <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-[#6C5CE7] to-[#00B894] text-2xl font-bold text-white">
                  {blindMode ? '?' : (selectedStudent.full_name?.[0] ?? 'S')}
                </div>
                <h3 className="mt-3 font-bold text-foreground">
                  {blindMode ? `Candidate #${selectedStudent.id.slice(-6)}` : selectedStudent.full_name}
                </h3>
                <p className="text-sm text-muted-foreground">{selectedStudent.university}</p>
                <div className="mt-2 flex items-center gap-2">
                  <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-bold text-primary">
                    Level {selectedStudent.level}
                  </span>
                  <span className="rounded-full bg-secondary px-3 py-1 text-xs text-muted-foreground">
                    {selectedStudent.xp} XP
                  </span>
                </div>
              </div>

              <div className="mt-6">
                <p className="mb-3 text-xs font-bold uppercase tracking-wider text-muted-foreground">Навыки</p>
                <div className="flex flex-col gap-2">
                  {selectedStudent.user_skills.map((us, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <span className="w-24 truncate text-xs text-foreground">{us.skills?.name}</span>
                      <div className="flex-1 h-1.5 rounded-full bg-secondary overflow-hidden">
                        <div className="h-full rounded-full transition-all"
                          style={{ width: `${us.level}%`, backgroundColor: levelColor(us.level) }} />
                      </div>
                      <span className="text-[10px] text-muted-foreground w-8 text-right">{us.level}%</span>
                      {us.verified && <BadgeCheck className="h-3.5 w-3.5 shrink-0 text-[#00B894]" />}
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-6 flex flex-col gap-2">
                <button className="w-full rounded-xl bg-[#6C5CE7] py-2.5 text-sm font-bold text-white transition-opacity hover:opacity-90">
                  Пригласить на интервью
                </button>
                <button className="w-full rounded-xl border border-border bg-secondary py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-secondary/80">
                  Сохранить кандидата
                </button>
              </div>
            </div>
          ) : (
            <div className="sticky top-24 flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-card/50 p-12 text-center">
              <User className="h-10 w-10 text-muted-foreground/30 mb-3" />
              <p className="text-sm text-muted-foreground">Выберите студента для просмотра деталей</p>
            </div>
          )}
        </div>

      </div>
    </div>
  )
}