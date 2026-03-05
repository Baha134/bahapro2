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
} from 'lucide-react'
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

type NavItem = {
  label: string
  href: string
  icon: React.ElementType
}

const studentNav: NavItem[] = [
  { label: 'Обзор', href: '/dashboard/student', icon: LayoutDashboard },
  { label: 'Профиль', href: '/dashboard/student/profile', icon: User },
  { label: 'Проекты', href: '/dashboard/student/projects', icon: FolderOpen },
  { label: 'Вакансии', href: '/dashboard/student/vacancies', icon: Search },
  { label: 'Достижения', href: '/dashboard/student/badges', icon: Award },
]

const employerNav: NavItem[] = [
  { label: 'Обзор', href: '/dashboard/employer', icon: LayoutDashboard },
  { label: 'Поиск талантов', href: '/dashboard/employer/search', icon: Search },
  { label: 'Вакансии', href: '/dashboard/employer/vacancies', icon: Briefcase },
]

const teacherNav: NavItem[] = [
  { label: 'Обзор', href: '/dashboard/teacher', icon: LayoutDashboard },
  { label: 'Верификация', href: '/dashboard/teacher/verify', icon: CheckCircle },
  { label: 'Студенты', href: '/dashboard/teacher/students', icon: Users },
  { label: 'Выпускники', href: '/dashboard/teacher/alumni', icon: Award },
]

export function DashboardSidebar({ role }: { role: 'student' | 'employer' | 'teacher' }) {
  const pathname = usePathname()
  const [collapsed, setCollapsed] = useState(false)
  const router = useRouter()

  const navItems = role === 'student' ? studentNav : role === 'employer' ? employerNav : teacherNav

  const roleLabel = role === 'student' ? 'Студент' : role === 'employer' ? 'Работодатель' : 'Преподаватель'
  const roleGradient = role === 'student' ? 'from-[#6C5CE7] to-[#a855f7]' : role === 'employer' ? 'from-[#00B894] to-[#00D2D3]' : 'from-[#FDCB6E] to-[#F97316]'

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/')
  }

  return (
    <aside
      className={cn(
        'flex h-screen flex-col border-r border-sidebar-border bg-sidebar transition-all duration-300',
        collapsed ? 'w-16' : 'w-64'
      )}
    >
      {/* Logo */}
      <div className="flex h-16 items-center gap-2 border-b border-sidebar-border px-4">
        <span className={cn(
          'flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br text-xs font-bold text-white',
          roleGradient
        )}>
          PS
        </span>
        {!collapsed && (
          <span className="truncate text-sm font-bold text-sidebar-foreground">ПрофСтарт</span>
        )}
      </div>

      {/* Role badge */}
      {!collapsed && (
        <div className="px-4 py-3">
          <span className={cn(
            'inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r px-3 py-1 text-xs font-semibold text-white',
            roleGradient
          )}>
            <FileText className="h-3 w-3" />
            {roleLabel}
          </span>
        </div>
      )}

      {/* Nav */}
      <nav className="flex-1 space-y-1 px-2 py-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                isActive
                  ? 'bg-sidebar-accent text-sidebar-primary'
                  : 'text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground'
              )}
            >
              <item.icon className={cn('h-5 w-5 shrink-0', isActive && 'text-sidebar-primary')} />
              {!collapsed && <span className="truncate">{item.label}</span>}
            </Link>
          )
        })}
      </nav>

      {/* Bottom actions */}
      <div className="border-t border-sidebar-border p-2">
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-sidebar-foreground/70 transition-colors hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
        >
          <LogOut className="h-5 w-5 shrink-0" />
          {!collapsed && <span>Выйти</span>}
        </button>
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="mt-1 flex w-full items-center justify-center rounded-lg p-2 text-sidebar-foreground/50 transition-colors hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
          aria-label={collapsed ? 'Развернуть меню' : 'Свернуть меню'}
        >
          {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </button>
      </div>
    </aside>
  )
}
