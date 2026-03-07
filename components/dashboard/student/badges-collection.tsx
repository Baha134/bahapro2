'use client'

import { useState } from 'react'
import { Trophy, Star, Lock, BadgeCheck, Zap, Filter } from 'lucide-react'

interface Badge {
  id: string
  name: string
  description: string
  icon: string | null
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary'
  category?: string
  xp_reward?: number
}

interface UserBadge {
  id: string
  badge_id: string
  verified: boolean
  earned_at?: string
  verifier_name?: string
  verifier_title?: string
  verifier_department?: string
  badges: Badge
}

const rarityConfig = {
  common: { label: 'Обычный', color: '#6b7280', bg: 'from-slate-400 to-slate-500', glow: '#6b728020', border: '#6b728030' },
  uncommon: { label: 'Необычный', color: '#00B894', bg: 'from-emerald-400 to-teal-500', glow: '#00B89420', border: '#00B89430' },
  rare: { label: 'Редкий', color: '#3b82f6', bg: 'from-blue-400 to-cyan-500', glow: '#3b82f620', border: '#3b82f630' },
  epic: { label: 'Эпический', color: '#6C5CE7', bg: 'from-violet-500 to-purple-600', glow: '#6C5CE720', border: '#6C5CE730' },
  legendary: { label: 'Легендарный', color: '#F97316', bg: 'from-amber-400 to-orange-500', glow: '#F9731620', border: '#F9731630' },
}

const categoryIcons: Record<string, string> = {
  skill: '⚡',
  academic: '🎓',
  competition: '🏆',
  certification: '📜',
  default: '🏅',
}

const filters = ['Все', 'Получены', 'Не получены', 'Верифицированы']

export function BadgesCollection({ userBadges, allBadges }: { userBadges: UserBadge[]; allBadges: Badge[] }) {
  const [activeFilter, setActiveFilter] = useState('Все')
  const [hoveredId, setHoveredId] = useState<string | null>(null)

  const earnedMap = new Map(userBadges.map(ub => [ub.badge_id ?? ub.badges?.id, ub]))
  const badges = allBadges.length > 0 ? allBadges : []
  const earnedCount = userBadges.length
  const totalXp = userBadges.reduce((sum, ub) => sum + (ub.badges?.xp_reward ?? 0), 0)

  const filtered = badges.filter(badge => {
    const earned = earnedMap.has(badge.id)
    const ub = earnedMap.get(badge.id)
    if (activeFilter === 'Получены') return earned
    if (activeFilter === 'Не получены') return !earned
    if (activeFilter === 'Верифицированы') return earned && ub?.verified
    return true
  })

  return (
    <div className="mx-auto max-w-5xl space-y-8">

      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Достижения</h1>
        <p className="mt-1 text-sm text-muted-foreground">Собирай бейджи и подтверждай свои компетенции</p>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { icon: Trophy, label: 'Получено', value: `${earnedCount} / ${badges.length}`, color: '#F97316', bg: '#F9731610' },
          { icon: Zap, label: 'Опыт заработан', value: `${totalXp} XP`, color: '#6C5CE7', bg: '#6C5CE710' },
          { icon: BadgeCheck, label: 'Верифицировано', value: userBadges.filter(ub => ub.verified).length.toString(), color: '#00B894', bg: '#00B89410' },
        ].map((stat) => (
          <div key={stat.label}
            className="flex items-center gap-4 rounded-2xl border border-border bg-card p-5">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl"
              style={{ backgroundColor: stat.bg }}>
              <stat.icon className="h-6 w-6" style={{ color: stat.color }} />
            </div>
            <div>
              <p className="text-xl font-black text-foreground">{stat.value}</p>
              <p className="text-xs text-muted-foreground">{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Progress bar */}
      <div className="rounded-2xl border border-border bg-card p-5">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-semibold text-foreground">Прогресс коллекции</span>
          <span className="text-sm font-bold text-foreground">
            {badges.length > 0 ? Math.round((earnedCount / badges.length) * 100) : 0}%
          </span>
        </div>
        <div className="h-3 w-full overflow-hidden rounded-full bg-secondary">
          <div
            className="h-full rounded-full bg-gradient-to-r from-[#6C5CE7] to-[#00B894] transition-all duration-700"
            style={{ width: `${badges.length > 0 ? (earnedCount / badges.length) * 100 : 0}%` }}
          />
        </div>
        <div className="mt-3 flex gap-4">
          {Object.entries(rarityConfig).map(([key, cfg]) => {
            const count = badges.filter(b => (b.rarity ?? 'common') === key && earnedMap.has(b.id)).length
            if (count === 0) return null
            return (
              <span key={key} className="flex items-center gap-1 text-xs font-medium"
                style={{ color: cfg.color }}>
                <span className="h-2 w-2 rounded-full" style={{ backgroundColor: cfg.color }} />
                {cfg.label}: {count}
              </span>
            )
          })}
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-2">
        <Filter className="h-4 w-4 text-muted-foreground" />
        <div className="flex gap-2">
          {filters.map(f => (
            <button key={f} onClick={() => setActiveFilter(f)}
              className="rounded-xl px-4 py-1.5 text-xs font-semibold transition-all"
              style={activeFilter === f
                ? { backgroundColor: '#6C5CE7', color: 'white' }
                : { backgroundColor: 'var(--secondary)', color: 'var(--muted-foreground)' }}>
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Badge Grid */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <Trophy className="h-12 w-12 text-muted-foreground/30 mb-4" />
          <p className="text-sm text-muted-foreground">Нет бейджей в этой категории</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {filtered.map((badge) => {
            const earned = earnedMap.has(badge.id)
            const ub = earnedMap.get(badge.id)
            const rarity = rarityConfig[badge.rarity as keyof typeof rarityConfig] ?? rarityConfig.common
            const catIcon = categoryIcons[badge.category ?? 'default'] ?? categoryIcons.default

            return (
              <div key={badge.id}
                onMouseEnter={() => setHoveredId(badge.id)}
                onMouseLeave={() => setHoveredId(null)}
                className="relative flex flex-col items-center rounded-2xl border p-5 text-center transition-all duration-200"
                style={{
                  borderColor: earned ? rarity.border : 'var(--border)',
                  backgroundColor: hoveredId === badge.id && earned ? rarity.glow : 'var(--card)',
                  opacity: earned ? 1 : 0.5,
                  filter: earned ? 'none' : 'grayscale(0.8)',
                  transform: hoveredId === badge.id ? 'translateY(-4px)' : 'none',
                  boxShadow: hoveredId === badge.id && earned ? `0 8px 30px ${rarity.glow}` : 'none',
                }}>

                {/* Verified badge */}
                {ub?.verified && (
                  <div className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-[#00B894]">
                    <BadgeCheck className="h-3 w-3 text-white" />
                  </div>
                )}

                {/* Lock icon for unearned */}
                {!earned && (
                  <div className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-secondary border border-border">
                    <Lock className="h-3 w-3 text-muted-foreground" />
                  </div>
                )}

                {/* Icon */}
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br text-3xl mb-3"
                  style={{ background: `linear-gradient(135deg, ${rarity.color}30, ${rarity.color}10)` }}>
                  {catIcon}
                </div>

                {/* Rarity label */}
                <span className="mb-1 rounded-full px-2 py-0.5 text-[10px] font-bold"
                  style={{ backgroundColor: `${rarity.color}15`, color: rarity.color }}>
                  {rarity.label}
                </span>

                <p className="mt-1 text-sm font-bold text-foreground leading-tight">{badge.name}</p>
                <p className="mt-1 text-[11px] text-muted-foreground leading-relaxed">{badge.description}</p>

                {/* Verifier info on hover */}
                {hoveredId === badge.id && ub?.verifier_name && (
                  <div className="mt-3 w-full rounded-xl p-2 text-left"
                    style={{ backgroundColor: `${rarity.color}10` }}>
                    <p className="text-[10px] font-semibold" style={{ color: rarity.color }}>
                      Верифицировал
                    </p>
                    <p className="text-[10px] text-foreground">{ub.verifier_name}</p>
                    <p className="text-[10px] text-muted-foreground">{ub.verifier_department}</p>
                  </div>
                )}

                {/* Earned date */}
                {earned && ub?.earned_at && (
                  <p className="mt-2 text-[10px] text-muted-foreground/60">
                    {new Date(ub.earned_at).toLocaleDateString('ru-RU')}
                  </p>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}