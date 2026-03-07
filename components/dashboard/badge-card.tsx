import { cn } from '@/lib/utils'
import { Award } from 'lucide-react'

interface BadgeCardProps {
  name: string
  description: string
  icon?: string
  rarity: 'common' | 'rare' | 'epic' | 'legendary'
  earned?: boolean
  className?: string
}

const rarityStyles = {
  common: {
    bg: 'from-slate-500 to-slate-600',
    border: 'border-slate-500/30',
    label: 'Обычный',
  },
  rare: {
    bg: 'from-blue-500 to-cyan-500',
    border: 'border-blue-500/30',
    label: 'Редкий',
  },
  epic: {
    bg: 'from-[#6C5CE7] to-[#a855f7]',
    border: 'border-[#6C5CE7]/30',
    label: 'Эпический',
  },
  legendary: {
    bg: 'from-[#FDCB6E] to-[#F97316]',
    border: 'border-[#FDCB6E]/30',
    label: 'Легендарный',
  },
}

export function BadgeCard({ name, description, icon, rarity, earned = false, className }: BadgeCardProps) {
  const styles = rarityStyles[rarity] ?? rarityStyles['common']

  return (
    <div className={cn(
      'relative rounded-xl border bg-card p-4 transition-all',
      earned ? styles.border : 'border-border/30 opacity-50 grayscale',
      earned && 'glow-card',
      className
    )}>
      <div className="flex flex-col items-center gap-2 text-center">
        <div className={cn(
          'flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br text-2xl text-white',
          styles.bg
        )}>
          {icon || <Award className="h-7 w-7" />}
        </div>
        <h3 className="text-sm font-bold text-foreground">{name}</h3>
        <p className="text-xs text-muted-foreground">{description}</p>
        <span className={cn(
          'inline-flex rounded-full bg-gradient-to-r px-2 py-0.5 text-[10px] font-bold text-white',
          styles.bg
        )}>
          {styles.label}
        </span>
      </div>
    </div>
  )
}
