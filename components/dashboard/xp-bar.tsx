import { cn } from '@/lib/utils'

interface XpBarProps {
  current: number
  max: number
  level: number
  className?: string
}

export function XpBar({ current, max, level, className }: XpBarProps) {
  const percentage = Math.min((current / max) * 100, 100)

  return (
    <div className={cn('flex items-center gap-3', className)}>
      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-[#6C5CE7] to-[#a855f7] text-xs font-bold text-white">
        {level}
      </div>
      <div className="flex-1">
        <div className="mb-1 flex items-center justify-between">
          <span className="text-xs font-medium text-muted-foreground">{'Уровень '}{level}</span>
          <span className="text-xs font-semibold text-foreground">{current}/{max} XP</span>
        </div>
        <div className="h-2 w-full overflow-hidden rounded-full bg-secondary">
          <div
            className="xp-bar-fill h-full rounded-full bg-gradient-to-r from-[#6C5CE7] to-[#00B894]"
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>
    </div>
  )
}
