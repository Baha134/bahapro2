import { cn } from '@/lib/utils'

interface StepCardProps {
  step: number
  title: string
  description: string
  gradient: string
}

export function StepCard({ step, title, description, gradient }: StepCardProps) {
  return (
    <div className="flex flex-col items-center text-center">
      <div className={cn(
        'flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br text-xl font-bold text-white',
        gradient
      )}>
        {step}
      </div>
      <h3 className="mt-4 text-base font-bold text-foreground">{title}</h3>
      <p className="mt-2 text-sm text-muted-foreground">{description}</p>
    </div>
  )
}
