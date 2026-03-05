import { cn } from '@/lib/utils'

interface StatCardProps {
  label: string
  value: string | number
  icon: React.ReactNode
  trend?: string
  gradient?: string
  className?: string
}

export function StatCard({ label, value, icon, trend, gradient = 'from-[#6C5CE7] to-[#a855f7]', className }: StatCardProps) {
  return (
    <div className={cn('rounded-xl border border-border/50 bg-card p-5', className)}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-muted-foreground">{label}</p>
          <p className="mt-1 text-2xl font-bold text-foreground">{value}</p>
          {trend && (
            <p className="mt-1 text-xs text-accent">{trend}</p>
          )}
        </div>
        <div className={cn('flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br text-white', gradient)}>
          {icon}
        </div>
      </div>
    </div>
  )
}
