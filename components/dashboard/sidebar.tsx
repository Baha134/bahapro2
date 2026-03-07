'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import {
  User,
  Briefcase,
  FolderOpen,
  Search,
  Award,
  LayoutDashboard,
  Users,
  CheckCircle,
  FileText,
  LogOut,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  MapPin,
  Zap
} from 'lucide-react'
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

// ОПРЕДЕЛЯЕМ ТИП
type NavItem = {
  label: string
  href: string
  icon: React.ElementType
}

// МАССИВЫ НАВИГАЦИИ (Должны быть здесь)
const studentNav: NavItem[] = [
  { label: 'Обзор', href: '/dashboard/student', icon: LayoutDashboard },
  { label: 'Профиль', href: '/dashboard/student/profile', icon: User },
  { label: 'Проекты', href: '/dashboard/student/projects', icon: FolderOpen },
  { label: 'Вакансии', href: '/dashboard/student/vacancies', icon: Search },
  { label: 'Достижения', href: '/dashboard/student/badges', icon: Award },
  { label: 'Резюме', href: '/dashboard/student/resume', icon: FileText },
]

const employerNav: NavItem[] = [
  { label: 'Обзор', href: '/dashboard/employer', icon: LayoutDashboard },
  { label: 'Поиск талантов', href: '/dashboard/employer/search', icon: Search },
  { label: 'Вакансии', href: '/dashboard/employer/vacancies', icon: Briefcase },
  { label: 'Стажировки', href: '/dashboard/employer/internships', icon: Users },
  { label: 'Аналитика', href: '/dashboard/employer/analytics', icon: TrendingUp },
]

const teacherNav: NavItem[] = [
  { label: 'Обзор', href: '/dashboard/teacher', icon: LayoutDashboard },
  { label: 'Верификация', href: '/dashboard/teacher/verify', icon: CheckCircle },
  { label: 'Студенты', href: '/dashboard/teacher/students', icon: Users },
  { label: 'Выпускники', href: '/dashboard/teacher/alumni', icon: Award },
  { label: 'Отчёты PDF', href: '/dashboard/teacher/reports', icon: FileText },
  { label: 'Карта Alumni', href: '/dashboard/teacher/map', icon: MapPin },
]

export function DashboardSidebar({ role }: { role: 'student' | 'employer' | 'teacher' }) {
  const pathname = usePathname()
  const [collapsed, setCollapsed] = useState(false)
  const router = useRouter()

  // ЛОГИКА ВЫБОРА МЕНЮ
  const navItems = role === 'student' ? studentNav : role === 'employer' ? employerNav : teacherNav
  const roleLabel = role === 'student' ? 'Студент' : role === 'employer' ? 'Работодатель' : 'Преподаватель'

  // ЦВЕТА
  const roleColor = role === 'student' ? '#6C5CE7' : role === 'employer' ? '#00B894' : '#F97316'
  const roleGradient = role === 'student' ? 'from-[#6C5CE7] to-[#a855f7]' : role === 'employer' ? 'from-[#00B894] to-[#00D2D3]' : 'from-[#F97316] to-[#FDCB6E]'

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/')
  }

  return (
    <aside
      className={cn(
        'flex h-screen flex-col border-r border-white/5 bg-[#0a0c10] transition-all duration-300 relative z-50',
        collapsed ? 'w-20' : 'w-64'
      )}
    >
      {/* Логотип */}
      <div className="flex h-20 items-center gap-3 border-b border-white/5 px-4">
        <div className={cn(
          "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br shadow-lg",
          roleGradient
        )}>
          <span className="text-sm font-black text-white">Ó</span>
        </div>
        {!collapsed && (
          <div className="flex flex-col">
            <span className="text-sm font-black tracking-tight text-white">ÓRKEN</span>
            <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest leading-none">Career Platform</span>
          </div>
        )}
      </div>

      {/* Навигация */}
      <nav className="flex-1 space-y-2 px-3 py-6 overflow-y-auto custom-scrollbar">
        {navItems.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'group relative flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200',
                isActive
                  ? 'bg-white/5 text-white'
                  : 'text-gray-500 hover:text-gray-300 hover:bg-white/[0.02]'
              )}
            >
              {/* Светящийся индикатор слева */}
              {isActive && (
                <div
                  className="absolute left-0 h-6 w-1 rounded-r-full"
                  style={{ backgroundColor: roleColor, boxShadow: `0 0 15px ${roleColor}` }}
                />
              )}

              <item.icon
                className={cn('h-5 w-5 shrink-0 transition-transform group-hover:scale-110')}
                style={isActive ? { color: roleColor, filter: `drop-shadow(0 0 5px ${roleColor})` } : {}}
              />
              {!collapsed && <span className="truncate">{item.label}</span>}
            </Link>
          )
        })}
      </nav>

      {/* Футер сайдбара */}
      <div className="border-t border-white/5 p-4 space-y-2">
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-gray-500 transition-all hover:bg-red-500/10 hover:text-red-500 group"
        >
          <LogOut className="h-5 w-5 shrink-0 transition-transform group-hover:-translate-x-1" />
          {!collapsed && <span>Выход</span>}
        </button>

        <button
          onClick={() => setCollapsed(!collapsed)}
          className="flex w-full items-center justify-center rounded-xl py-2 text-gray-600 hover:text-white hover:bg-white/5"
        >
          {collapsed ? <ChevronRight className="h-5 w-5" /> : <ChevronLeft className="h-5 w-5" />}
        </button>
      </div>
    </aside>
  )
}