import { cn } from '@/lib/utils'

interface SkillTagProps {
  name: string
  level: number
  verified?: boolean
  className?: string
}

export function SkillTag({ name, level, verified = false, className }: SkillTagProps) {
  return (
    <span className={cn(
      'inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium',
      verified
        ? 'border-accent/30 bg-accent/10 text-accent'
        : 'border-border/50 bg-secondary text-secondary-foreground',
      className
    )}>
      {name}
      <span className="rounded-full bg-foreground/10 px-1.5 py-0.5 text-[10px] font-bold">
        {level}
      </span>
      {verified && (
        <svg className="h-3 w-3 text-accent" viewBox="0 0 24 24" fill="currentColor">
          <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )}
    </span>
  )
}
