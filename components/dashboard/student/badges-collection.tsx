'use client'

import { BadgeCard } from '@/components/dashboard/badge-card'
import { XpBar } from '@/components/dashboard/xp-bar'
import { Trophy } from 'lucide-react'

interface Badge {
  id: string
  name: string
  description: string
  icon: string | null
  rarity: 'common' | 'rare' | 'epic' | 'legendary'
  xp_reward: number
}

interface UserBadge {
  id: string
  badges: Badge
}

const demoBadges: Badge[] = [
  { id: '1', name: 'Первый шаг', description: 'Создал аккаунт на платформе', icon: null, rarity: 'common', xp_reward: 50 },
  { id: '2', name: 'Мастер навыков', description: 'Добавил 5 навыков в профиль', icon: null, rarity: 'rare', xp_reward: 100 },
  { id: '3', name: 'Портфолио PRO', description: 'Добавил 3 верифицированных проекта', icon: null, rarity: 'epic', xp_reward: 200 },
  { id: '4', name: 'Легенда кампуса', description: 'Достиг 10 уровня', icon: null, rarity: 'legendary', xp_reward: 500 },
  { id: '5', name: 'Первый проект', description: 'Добавил первый проект', icon: null, rarity: 'common', xp_reward: 75 },
  { id: '6', name: 'Верификатор', description: 'Получил первую верификацию навыка', icon: null, rarity: 'rare', xp_reward: 150 },
  { id: '7', name: 'Охотник за работой', description: 'Откликнулся на 5 вакансий', icon: null, rarity: 'rare', xp_reward: 100 },
  { id: '8', name: 'Супер-звезда', description: 'Работодатель пригласил тебя на собеседование', icon: null, rarity: 'epic', xp_reward: 250 },
]

export function BadgesCollection({ userBadges, allBadges }: { userBadges: UserBadge[]; allBadges: Badge[] }) {
  const badges = allBadges.length > 0 ? allBadges : demoBadges
  const earnedIds = new Set(userBadges.map((ub) => ub.badges?.id))

  // Demo: mark first 3 as earned if no real data
  const isDemo = userBadges.length === 0
  const totalXp = isDemo ? 350 : userBadges.reduce((sum, ub) => sum + (ub.badges?.xp_reward || 0), 0)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Достижения</h1>
        <p className="mt-1 text-muted-foreground">Собирай бейджи и получай опыт</p>
      </div>

      {/* Progress summary */}
      <div className="rounded-xl border border-border/50 bg-card p-6">
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-[#FDCB6E] to-[#F97316]">
            <Trophy className="h-7 w-7 text-white" />
          </div>
          <div className="flex-1">
            <p className="text-sm text-muted-foreground">
              Получено {isDemo ? 3 : userBadges.length} из {badges.length} бейджей
            </p>
            <XpBar current={totalXp} max={1500} level={Math.floor(totalXp / 300) + 1} className="mt-2" />
          </div>
        </div>
      </div>

      {/* Badge Grid */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {badges.map((badge, i) => {
          const earned = isDemo ? i < 3 : earnedIds.has(badge.id)
          return (
            <BadgeCard
              key={badge.id}
              name={badge.name}
              description={badge.description}
              icon={badge.icon || undefined}
              rarity={badge.rarity}
              earned={earned}
            />
          )
        })}
      </div>
    </div>
  )
}
