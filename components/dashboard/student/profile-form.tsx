'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { XpBar } from '@/components/dashboard/xp-bar'
import { SkillTag } from '@/components/dashboard/skill-tag'
import { toast } from 'sonner'
import { Save } from 'lucide-react'
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts'

interface StudentProfileProps {
  profile: Record<string, unknown> | null
  skills: Record<string, unknown>[]
  userEmail: string
}

export function StudentProfile({ profile, skills, userEmail }: StudentProfileProps) {
  const [fullName, setFullName] = useState((profile?.full_name as string) || '')
  const [university, setUniversity] = useState((profile?.university as string) || '')
  const [bio, setBio] = useState((profile?.bio as string) || '')
  const [isLoading, setIsLoading] = useState(false)

  const handleSave = async () => {
    setIsLoading(true)
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const { error } = await supabase
      .from('profiles')
      .update({ full_name: fullName, university, bio })
      .eq('id', user.id)

    if (error) {
      toast.error('Ошибка сохранения')
    } else {
      toast.success('Профиль обновлён!')
    }
    setIsLoading(false)
  }

  // Build skill radar data split by hard/soft
  const hardSkills = skills.length > 0
    ? skills.filter((s: Record<string, unknown>) => {
      const cat = ((s.skills as Record<string, unknown>)?.category as string) || ''
      return cat === 'Hard Skills' || cat === 'Tools' || !cat.includes('Soft')
    })
    : [
      { skills: { name: 'JavaScript', category: 'Hard Skills' }, level: 7, verified: true },
      { skills: { name: 'React', category: 'Hard Skills' }, level: 6, verified: true },
      { skills: { name: 'TypeScript', category: 'Hard Skills' }, level: 8, verified: false },
      { skills: { name: 'Node.js', category: 'Hard Skills' }, level: 5, verified: false },
      { skills: { name: 'SQL', category: 'Hard Skills' }, level: 4, verified: false },
      { skills: { name: 'Git', category: 'Tools' }, level: 6, verified: true },
    ]

  const softSkills = skills.length > 0
    ? skills.filter((s: Record<string, unknown>) => {
      const cat = ((s.skills as Record<string, unknown>)?.category as string) || ''
      return cat === 'Soft Skills'
    })
    : [
      { skills: { name: 'Коммуникация', category: 'Soft Skills' }, level: 6, verified: false },
      { skills: { name: 'Командная работа', category: 'Soft Skills' }, level: 7, verified: true },
      { skills: { name: 'Тайм-менеджмент', category: 'Soft Skills' }, level: 5, verified: false },
      { skills: { name: 'Лидерство', category: 'Soft Skills' }, level: 4, verified: false },
      { skills: { name: 'Креативность', category: 'Soft Skills' }, level: 8, verified: true },
    ]

  const hardRadarData = hardSkills.slice(0, 6).map((s: Record<string, unknown>) => ({
    skill: ((s.skills as Record<string, unknown>)?.name as string) || 'Навык',
    level: (s.level as number) || 1,
    fullMark: 10,
  }))

  const softRadarData = softSkills.slice(0, 6).map((s: Record<string, unknown>) => ({
    skill: ((s.skills as Record<string, unknown>)?.name as string) || 'Навык',
    level: (s.level as number) || 1,
    fullMark: 10,
  }))

  const hardAvg = hardRadarData.length > 0
    ? Math.round(hardRadarData.reduce((s, d) => s + d.level, 0) / hardRadarData.length * 10) / 10
    : 0
  const softAvg = softRadarData.length > 0
    ? Math.round(softRadarData.reduce((s, d) => s + d.level, 0) / softRadarData.length * 10) / 10
    : 0

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Мой профиль</h1>
        <p className="mt-1 text-muted-foreground">Настройте информацию о себе</p>
      </div>

      {/* XP Bar */}
      <XpBar
        current={(profile?.xp as number) || 450}
        max={1000}
        level={(profile?.level as number) || 1}
      />

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Profile Form */}
        <div className="rounded-xl border border-border/50 bg-card p-6 lg:col-span-2">
          <h2 className="mb-4 text-lg font-bold text-foreground">Основная информация</h2>
          <div className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="fullName">Полное имя</Label>
              <Input
                id="fullName"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Иванов Иван Иванович"
                className="bg-background/50"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                value={userEmail}
                disabled
                className="bg-background/50 opacity-60"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="university">Университет</Label>
              <Input
                id="university"
                value={university}
                onChange={(e) => setUniversity(e.target.value)}
                placeholder="МГУ им. Ломоносова"
                className="bg-background/50"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="bio">О себе</Label>
              <textarea
                id="bio"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Расскажите о своих интересах и целях..."
                rows={4}
                className="w-full rounded-lg border border-input bg-background/50 px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
            <Button
              onClick={handleSave}
              disabled={isLoading}
              className="bg-gradient-to-r from-[#6C5CE7] to-[#00B894] text-white hover:opacity-90"
            >
              <Save className="mr-2 h-4 w-4" />
              {isLoading ? 'Сохраняем...' : 'Сохранить'}
            </Button>
          </div>
        </div>

        {/* Skills Sidebar */}
        <div className="rounded-xl border border-border/50 bg-card p-6">
          <h2 className="mb-4 text-lg font-bold text-foreground">Навыки</h2>
          <div className="flex flex-wrap gap-2">
            {skills.length > 0 ? (
              skills.map((s: Record<string, unknown>, i: number) => (
                <SkillTag
                  key={i}
                  name={((s.skills as Record<string, unknown>)?.name as string) || 'Навык'}
                  level={(s.level as number) || 1}
                  verified={(s.verified as boolean) || false}
                />
              ))
            ) : (
              <>
                <SkillTag name="JavaScript" level={7} verified />
                <SkillTag name="React" level={6} verified />
                <SkillTag name="TypeScript" level={8} />
                <SkillTag name="Node.js" level={5} />
                <SkillTag name="SQL" level={4} />
                <SkillTag name="Git" level={6} verified />
              </>
            )}
          </div>
          <p className="mt-4 text-xs text-muted-foreground">
            Навыки с галочкой верифицированы преподавателем
          </p>
        </div>
      </div>

      {/* Skill Radar - Hard vs Soft */}
      <div className="rounded-xl border border-border/50 bg-card p-6">
        <h2 className="mb-2 text-lg font-bold text-foreground">Skill Radar — Баланс навыков</h2>
        <p className="mb-4 text-sm text-muted-foreground">
          Визуализация Hard Skills и Soft Skills для оценки баланса развития
        </p>
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Hard Skills */}
          <div>
            <div className="mb-2 flex items-center justify-between">
              <h3 className="text-sm font-semibold text-foreground">Hard Skills</h3>
              <span className="rounded-full bg-gradient-to-r from-[#6C5CE7] to-[#a855f7] px-2.5 py-0.5 text-xs font-bold text-white">
                Сред. {hardAvg}
              </span>
            </div>
            <div className="h-[250px]">
              {hardRadarData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart data={hardRadarData}>
                    <PolarGrid stroke="oklch(0.28 0.03 260)" />
                    <PolarAngleAxis dataKey="skill" tick={{ fill: 'oklch(0.65 0.02 260)', fontSize: 11 }} />
                    <PolarRadiusAxis angle={30} domain={[0, 10]} tick={{ fill: 'oklch(0.50 0.02 260)', fontSize: 10 }} />
                    <Radar name="Hard Skills" dataKey="level" stroke="#6C5CE7" fill="#6C5CE7" fillOpacity={0.3} strokeWidth={2} />
                  </RadarChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex h-full items-center justify-center text-muted-foreground">
                  Нет Hard Skills
                </div>
              )}
            </div>
          </div>

          {/* Soft Skills */}
          <div>
            <div className="mb-2 flex items-center justify-between">
              <h3 className="text-sm font-semibold text-foreground">Soft Skills</h3>
              <span className="rounded-full bg-gradient-to-r from-[#00B894] to-[#00D2D3] px-2.5 py-0.5 text-xs font-bold text-white">
                Сред. {softAvg}
              </span>
            </div>
            <div className="h-[250px]">
              {softRadarData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart data={softRadarData}>
                    <PolarGrid stroke="oklch(0.28 0.03 260)" />
                    <PolarAngleAxis dataKey="skill" tick={{ fill: 'oklch(0.65 0.02 260)', fontSize: 11 }} />
                    <PolarRadiusAxis angle={30} domain={[0, 10]} tick={{ fill: 'oklch(0.50 0.02 260)', fontSize: 10 }} />
                    <Radar name="Soft Skills" dataKey="level" stroke="#00B894" fill="#00B894" fillOpacity={0.3} strokeWidth={2} />
                  </RadarChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex h-full items-center justify-center text-muted-foreground">
                  Нет Soft Skills
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="mt-4 flex items-center justify-center gap-6 text-xs text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-[#6C5CE7]" />
            Hard Skills ({hardSkills.length})
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-[#00B894]" />
            Soft Skills ({softSkills.length})
          </span>
        </div>
      </div>
    </div>
  )
}
