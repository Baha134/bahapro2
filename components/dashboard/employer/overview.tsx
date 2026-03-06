'use client'

import { StatCard } from '@/components/dashboard/stat-card'
import { Briefcase, Users, Eye, TrendingUp, ArrowUpRight, Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { cn } from '@/lib/utils'

interface EmployerOverviewProps {
  profile: any
  vacancies: any[]
  applications: any[]
}

export function EmployerOverview({ profile, vacancies, applications }: EmployerOverviewProps) {
  const companyName = profile?.full_name || 'Работодатель'

  // Реальные расчеты
  const activeVacancies = vacancies.filter(v => v.status === 'active').length
  const totalApps = applications.length

  return (
    <div className="space-y-8 p-1">
      {/* Header */}
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-black text-white italic tracking-tighter uppercase">
            System <span className="text-[#00B894]">Console</span>
          </h1>
          <p className="text-muted-foreground text-sm font-medium">Командир: {companyName.split(' ')[0]}</p>
        </div>
        <Link href="/dashboard/employer/vacancies/new">
          <Button className="bg-[#00B894] hover:bg-[#00D2D3] text-white font-bold rounded-xl shadow-[0_0_20px_rgba(0,184,148,0.2)]">
            + Создать вакансию
          </Button>
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Активных вакансий"
          value={activeVacancies}
          icon={<Briefcase className="h-5 w-5" />}
          gradient="from-[#00B894] to-[#05ce91]"
        />
        <StatCard
          label="Всего откликов"
          value={totalApps}
          icon={<Users className="h-5 w-5" />}
          gradient="from-[#6C5CE7] to-[#a855f7]"
          trend="+8 сегодня"
        />
        <StatCard
          label="Просмотры"
          value={156}
          icon={<Eye className="h-5 w-5" />}
          gradient="from-[#FDCB6E] to-[#F97316]"
        />
        <StatCard
          label="Match Rate"
          value="84%"
          icon={<TrendingUp className="h-5 w-5" />}
          gradient="from-[#00B894] to-[#6C5CE7]"
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Список откликов */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold uppercase tracking-widest text-gray-500">Последние кандидаты</h2>
          </div>

          <div className="space-y-3">
            {applications.length > 0 ? (
              applications.slice(0, 5).map((app: any) => (
                <div
                  key={app.id}
                  className="glass group flex items-center justify-between rounded-2xl border border-white/5 p-4 transition-all hover:border-[#00B894]/40 hover:bg-white/[0.03]"
                >
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-gray-800 to-black border border-white/10 font-bold text-[#00B894]">
                      {app.user_id?.slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-bold text-white group-hover:text-[#00B894] transition-colors">
                        Кандидат ID: {app.user_id?.slice(-6)}
                      </p>
                      <p className="text-[10px] text-muted-foreground uppercase tracking-tighter">
                        отклик на <span className="text-gray-300 font-bold">{app.vacancies?.title || 'Вакансия'}</span>
                      </p>
                    </div>
                  </div>
                  <Button variant="ghost" size="icon" className="rounded-full hover:bg-[#00B894]/10 hover:text-[#00B894]">
                    <ArrowUpRight className="h-5 w-5" />
                  </Button>
                </div>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center py-12 rounded-3xl border border-dashed border-white/10 glass">
                <Search className="h-8 w-8 text-gray-700 mb-2" />
                <p className="text-gray-500 text-sm italic">Пока никто не откликнулся...</p>
              </div>
            )}
          </div>
        </div>

        {/* Правая колонка: Аналитика Joltap */}
        <div className="space-y-4">
          <div className="rounded-3xl border border-white/5 bg-[#0a0c10] p-6 shadow-2xl glow-card">
            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-[#00B894] mb-4">AI Талант-сканер</h3>
            <div className="space-y-4 text-xs">
              <p className="text-gray-400 leading-relaxed">
                В базе найдено <span className="text-white font-bold">12 студентов</span>, чьи навыки совпадают с вашими вакансиями на 90%+.
              </p>
              <div className="h-px w-full bg-gradient-to-r from-transparent via-white/10 to-transparent" />
              <Link href="/dashboard/employer/search" className="block">
                <Button className="w-full bg-white/5 border border-white/10 hover:bg-white/10 text-[10px] font-bold uppercase tracking-widest text-white">
                  Открыть поиск талантов
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}