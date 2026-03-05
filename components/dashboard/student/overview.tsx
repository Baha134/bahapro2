'use client'

import { XpBar } from '@/components/dashboard/xp-bar'
import { StatCard } from '@/components/dashboard/stat-card'
import { BadgeCard } from '@/components/dashboard/badge-card'
import { Award, FolderOpen, TrendingUp, Zap, DollarSign, CheckCircle } from 'lucide-react'
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts'

interface StudentOverviewProps {
  profile: any | null
  skills: any[]
  projects: any[]
  badges: any[]
  userEmail: string
}

export function StudentOverview({ profile, skills, projects, badges, userEmail }: StudentOverviewProps) {
  // Данные из вашей таблицы profiles
  const fullName = profile?.full_name || userEmail.split('@')[0]
  const xp = profile?.xp || 450
  const level = profile?.current_level || 1
  const gpa = profile?.gpa || 0

  // Подготовка данных для радара из вашей таблицы skills
  const radarData = skills.length > 0
    ? skills.slice(0, 6).map((s) => ({
      skill: s.name || 'Навык',
      level: s.level || 0,
      fullMark: 100,
    }))
    : [
      { skill: 'JavaScript', level: 85, fullMark: 100 },
      { skill: 'React', level: 75, fullMark: 100 },
      { skill: 'Node.js', level: 60, fullMark: 100 },
      { skill: 'Design', level: 40, fullMark: 100 },
      { skill: 'Soft Skills', level: 90, fullMark: 100 },
      { skill: 'Git', level: 70, fullMark: 100 },
    ]

  // Расчет прогноза зарплаты (Логика Joltap)
  const baseSalary = 60000
  const skillBonus = skills.reduce((sum, s) => sum + (s.level * 500), 0)
  const levelBonus = level * 5000
  const projectBonus = projects.length * 3000
  const predictedSalary = baseSalary + skillBonus + levelBonus + projectBonus

  return (
    <div className="space-y-8 p-1">
      {/* Заголовок и приветствие */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-white">
            Привет, {fullName}!
          </h1>
          <p className="text-muted-foreground text-sm">Вот твоя сводка на сегодня</p>
        </div>
        {profile?.role === 'admin' && (
          <div className="px-3 py-1 rounded-full border border-primary/30 bg-primary/10 text-primary text-[10px] uppercase font-bold tracking-tighter">
            Admin View
          </div>
        )}
      </div>

      {/* Линия XP прогресса */}
      <XpBar current={xp} max={1000} level={level} />

      {/* Сетка карточек статистики */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Навыков"
          value={skills.length || 6}
          icon={<Zap className="h-5 w-5" />}
          gradient="from-[#6C5CE7] to-[#a855f7]"
          trend="+2 за неделю"
        />
        <StatCard
          label="Проектов"
          value={projects.length || 3}
          icon={<FolderOpen className="h-5 w-5" />}
          gradient="from-[#00B894] to-[#00D2D3]"
          trend="1 на проверке"
        />
        <StatCard
          label="Бейджей"
          value={badges.length || 3}
          icon={<Award className="h-5 w-5" />}
          gradient="from-[#FDCB6E] to-[#F97316]"
        />
        <StatCard
          label="Уровень"
          value={level}
          icon={<TrendingUp className="h-5 w-5" />}
          gradient="from-[#6C5CE7] to-[#00B894]"
          trend={`${xp}/1000 XP`}
        />
      </div>

      {/* Виджет прогноза зарплаты */}
      <div className="rounded-2xl border border-white/5 bg-[#0a0c10] p-6 shadow-2xl">
        <div className="flex items-center gap-3 mb-6">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#00B894] text-white">
            <DollarSign className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">Прогноз зарплаты</h2>
            <p className="text-xs text-gray-500">На основе подтверждённых навыков и достижений</p>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-4">
          <div className="flex flex-col justify-center border-r border-white/5 pr-4">
            <p className="text-3xl font-black text-white">{predictedSalary.toLocaleString()} ₽</p>
            <p className="text-[10px] text-gray-500 uppercase mt-1 tracking-widest font-bold">Прогноз в месяц</p>
          </div>

          <div className="flex flex-col justify-center px-4">
            <div className="flex justify-between text-xs mb-1">
              <span className="text-gray-500">Базовая ставка</span>
              <span className="text-gray-300">{baseSalary.toLocaleString()} ₽</span>
            </div>
            <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
              <div className="h-full bg-gray-600" style={{ width: '40%' }} />
            </div>
          </div>

          <div className="flex flex-col justify-center px-4 border-l border-white/5">
            <div className="flex justify-between text-xs mb-1">
              <span className="text-gray-500">Навыки ({skills.length})</span>
              <span className="text-[#00B894]">+{skillBonus.toLocaleString()} ₽</span>
            </div>
            <div className="flex items-center gap-1 text-[10px] text-[#00B894]">
              <CheckCircle className="h-3 w-3" /> <span>{skills.length} верифицированных</span>
            </div>
          </div>

          <div className="flex flex-col justify-center pl-4 border-l border-white/5">
            <div className="flex justify-between text-xs mb-1">
              <span className="text-gray-500">Бонусы</span>
              <span className="text-[#6C5CE7]">+{(levelBonus + projectBonus).toLocaleString()} ₽</span>
            </div>
            <p className="text-[10px] text-gray-500">Ур. {level} + {projects.length} проектов</p>
          </div>
        </div>
      </div>

      {/* Нижняя часть: Карта навыков и Бейджи */}
      <div className="grid gap-6 lg:grid-cols-5">
        <div className="lg:col-span-3 rounded-2xl border border-white/5 bg-[#0a0c10] p-6 shadow-xl">
          <h2 className="mb-6 text-sm font-bold uppercase tracking-widest text-gray-400">Карта навыков</h2>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={radarData}>
                <PolarGrid stroke="rgba(255,255,255,0.05)" />
                <PolarAngleAxis dataKey="skill" tick={{ fill: '#4b5563', fontSize: 10 }} />
                <Radar
                  name="Level"
                  dataKey="level"
                  stroke="#6C5CE7"
                  fill="#6C5CE7"
                  fillOpacity={0.4}
                  strokeWidth={2}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="lg:col-span-2 rounded-2xl border border-white/5 bg-[#0a0c10] p-6 shadow-xl">
          <h2 className="mb-6 text-sm font-bold uppercase tracking-widest text-gray-400">Последние достижения</h2>
          <div className="grid gap-4">
            {badges.slice(0, 3).map((badge: any, i: number) => (
              <BadgeCard
                key={i}
                name={badge.badges?.name || 'Achievement'}
                description={badge.badges?.description}
                rarity={badge.badges?.rarity}
                earned={true}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}