'use client'

import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { SkillTag } from '@/components/dashboard/skill-tag'
import { Search, User, GraduationCap, Eye, EyeOff, Target } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { Radar, RadarChart, PolarGrid, ResponsiveContainer } from 'recharts'

// 1. ЧЕТКИЕ ТИПЫ (Чтобы не было ошибки на sk и i)
interface SkillInfo {
  name: string
  category: string
}

interface UserSkill {
  level: number
  verified: boolean
  skills: SkillInfo // Важно: тут объект skills, а не массив
}

interface Student {
  id: string
  full_name: string | null
  university: string | null
  level: number
  xp: number
  user_skills: UserSkill[]
}

// 2. ДЕМО-ДАННЫЕ (Для проверки визуала)
const demoStudents: Student[] = [
  {
    id: 'opt-1',
    full_name: 'Алексей Петров',
    university: 'МГУ',
    level: 5,
    xp: 1250,
    user_skills: [
      { level: 80, verified: true, skills: { name: 'React', category: 'Hard' } },
      { level: 70, verified: true, skills: { name: 'TS', category: 'Hard' } },
      { level: 90, verified: false, skills: { name: 'Node', category: 'Hard' } },
    ],
  },
]

export function TalentSearch({ students: serverStudents }: { students: Student[] }) {
  const [query, setQuery] = useState('')
  const [blindMode, setBlindMode] = useState(false)
  const [verifiedOnly, setVerifiedOnly] = useState(false)

  // Если сервер прислал пустой массив, берем демо
  const students = serverStudents && serverStudents.length > 0 ? serverStudents : demoStudents

  // 3. ИСПРАВЛЕННЫЙ ФИЛЬТР (Убираем ошибку sk)
  const filtered = students.filter((s) => {
    const searchLower = query.toLowerCase()

    const matchesQuery = !query ||
      (!blindMode && s.full_name?.toLowerCase().includes(searchLower)) ||
      s.university?.toLowerCase().includes(searchLower) ||
      s.user_skills.some((us) => us.skills?.name.toLowerCase().includes(searchLower))

    const matchesVerified = !verifiedOnly || s.user_skills.some((us) => us.verified)

    return matchesQuery && matchesVerified
  })

  return (
    <div className="space-y-6 p-1">
      {/* Заголовок и Фильтры (те же, что были) */}
      <div className="flex flex-wrap items-center gap-3 glass p-4 rounded-2xl border border-white/5">
        <div className="relative flex-1 min-w-[300px]">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Поиск по стеку или вузу..."
            className="bg-white/5 border-white/10 pl-10 focus:ring-[#00B894]/50"
          />
        </div>
        <Button variant="outline" onClick={() => setBlindMode(!blindMode)}>
          {blindMode ? 'Blind Mode: ON' : 'Blind Mode'}
        </Button>
      </div>

      {/* РЕНДЕР КАРТОЧЕК */}
      <div className="grid gap-4">
        {filtered.map((student) => (
          <div key={student.id} className="glass group relative overflow-hidden rounded-2xl border border-white/5 p-5 hover:border-[#00B894]/30">
            <div className="flex flex-col md:flex-row items-start justify-between gap-6">

              <div className="flex flex-1 items-start gap-5">
                <div className="relative shrink-0">
                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-gray-800 to-black border border-white/10 text-[#00B894]">
                    <User className="h-8 w-8" />
                  </div>
                  <div className="absolute -bottom-2 -right-2 rounded-lg bg-[#00B894] px-1.5 py-0.5 text-[10px] font-black text-black">
                    LVL {student.level}
                  </div>
                </div>

                <div className="space-y-3">
                  <h3 className="text-lg font-bold text-white group-hover:text-[#00B894] transition-colors">
                    {blindMode ? `Candidate #...${student.id.slice(-5)}` : (student.full_name || 'Anonymous')}
                  </h3>

                  {/* ТЕ САМЫЕ SKILL TAGS (где вылезала ошибка) */}
                  <div className="flex flex-wrap gap-2">
                    {student.user_skills?.map((us, idx) => (
                      <SkillTag
                        key={idx}
                        name={us.skills?.name || 'Skill'}
                        level={us.level}
                        verified={us.verified}
                      />
                    ))}
                  </div>
                </div>
              </div>

              {/* МИНИ-РАДАР */}
              <div className="h-32 w-32 shrink-0 bg-white/[0.02] rounded-xl border border-white/5 p-1">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart data={student.user_skills.slice(0, 5).map(us => ({
                    subject: us.skills?.name || '',
                    A: us.level
                  }))}>
                    <PolarGrid stroke="#333" />
                    <Radar dataKey="A" stroke="#00B894" fill="#00B894" fillOpacity={0.5} />
                  </RadarChart>
                </ResponsiveContainer>
              </div>

            </div>
          </div>
        ))}
      </div>
    </div>
  )
}