'use client'

import { StatCard } from '@/components/dashboard/stat-card'
import { Briefcase, Users, Eye, TrendingUp } from 'lucide-react'

interface EmployerOverviewProps {
  profile: Record<string, unknown> | null
  vacancies: Record<string, unknown>[]
  applications: Record<string, unknown>[]
}

export function EmployerOverview({ profile, vacancies, applications }: EmployerOverviewProps) {
  const fullName = (profile?.full_name as string) || 'Работодатель'
  const activeVacancies = vacancies.filter((v) => v.status === 'active').length || 4
  const totalApplications = applications.length || 23
  const newThisWeek = 8

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-foreground">
          {'Добро пожаловать, '}{fullName.split(' ')[0]}{'!'}
        </h1>
        <p className="mt-1 text-muted-foreground">Панель управления работодателя</p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Активных вакансий"
          value={activeVacancies}
          icon={<Briefcase className="h-5 w-5" />}
          gradient="from-[#00B894] to-[#00D2D3]"
        />
        <StatCard
          label="Всего откликов"
          value={totalApplications}
          icon={<Users className="h-5 w-5" />}
          gradient="from-[#6C5CE7] to-[#a855f7]"
          trend={`+${newThisWeek} за неделю`}
        />
        <StatCard
          label="Просмотры"
          value={156}
          icon={<Eye className="h-5 w-5" />}
          gradient="from-[#FDCB6E] to-[#F97316]"
          trend="+12% за неделю"
        />
        <StatCard
          label="Конверсия"
          value="14.7%"
          icon={<TrendingUp className="h-5 w-5" />}
          gradient="from-[#6C5CE7] to-[#00B894]"
        />
      </div>

      {/* Recent Applications */}
      <div className="rounded-xl border border-border/50 bg-card p-6">
        <h2 className="mb-4 text-lg font-bold text-foreground">Последние отклики</h2>
        <div className="space-y-3">
          {demoApplications.map((app) => (
            <div key={app.id} className="flex items-center justify-between rounded-lg border border-border/30 bg-secondary/30 p-4">
              <div>
                <p className="font-semibold text-foreground">{app.name}</p>
                <p className="text-sm text-muted-foreground">
                  {app.vacancy}{' · '}{app.date}
                </p>
              </div>
              <span className={`rounded-full px-3 py-1 text-xs font-medium ${
                app.status === 'new' ? 'bg-primary/10 text-primary' :
                app.status === 'reviewed' ? 'bg-accent/10 text-accent' :
                'bg-secondary text-secondary-foreground'
              }`}>
                {app.status === 'new' ? 'Новый' : app.status === 'reviewed' ? 'Рассмотрен' : 'В архиве'}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

const demoApplications = [
  { id: '1', name: 'Алексей Петров', vacancy: 'Frontend-разработчик', date: '2 часа назад', status: 'new' },
  { id: '2', name: 'Мария Иванова', vacancy: 'Fullstack-разработчик', date: '5 часов назад', status: 'new' },
  { id: '3', name: 'Дмитрий Козлов', vacancy: 'Data Analyst', date: 'Вчера', status: 'reviewed' },
  { id: '4', name: 'Елена Смирнова', vacancy: 'Frontend-разработчик', date: '2 дня назад', status: 'reviewed' },
]
