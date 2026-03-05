// app/dashboard/student/layout.tsx
// Макет (Layout) для раздела студента.
// Задает общую структуру (боковая панель навигации + основной контейнер для контента)
// для всех страниц внутри /dashboard/student.
import { DashboardSidebar } from '@/components/dashboard/sidebar'

export default function StudentDashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex h-screen overflow-hidden">
      <DashboardSidebar role="student" />
      <main className="flex-1 overflow-y-auto">
        <div className="p-6 lg:p-8">{children}</div>
      </main>
    </div>
  )
}
