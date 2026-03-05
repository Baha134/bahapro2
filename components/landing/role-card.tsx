'use client'

import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { cn } from '@/lib/utils'

interface RoleCardProps {
  title: string
  description: string
  features: string[]
  icon: string
  gradient: string
  href: string
}

export function RoleCard({ title, description, features, icon, gradient, href }: RoleCardProps) {
  return (
    <div className="group relative overflow-hidden rounded-2xl border border-border/50 bg-card transition-all hover:border-border hover:shadow-lg">
      <div className={cn('absolute inset-x-0 top-0 h-1 bg-gradient-to-r', gradient)} />
      <div className="p-6">
        <div className="flex items-start gap-4">
          <div className={cn(
            'flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br text-xl text-white',
            gradient
          )}>
            {icon}
          </div>
          <div>
            <h3 className="text-lg font-bold text-foreground">{title}</h3>
            <p className="mt-1 text-sm text-muted-foreground">{description}</p>
          </div>
        </div>
        <ul className="mt-4 space-y-2">
          {features.map((feature, i) => (
            <li key={i} className="flex items-center gap-2 text-sm text-secondary-foreground">
              <svg className={cn('h-4 w-4 shrink-0')} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
              {feature}
            </li>
          ))}
        </ul>
        <Link
          href={href}
          className={cn(
            'mt-5 inline-flex items-center gap-2 rounded-lg bg-gradient-to-r px-4 py-2 text-sm font-semibold text-white transition-opacity hover:opacity-90',
            gradient
          )}
        >
          Начать
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  )
}
