// app/dashboard/employer/layout.tsx
// Макет (Layout) для раздела работодателя.
// Оборачивает дочерние страницы работодателя в единый UI: добавляет боковую панель навигации (DashboardSidebar)
// и ограничивает основную область контента на весь экран с возможностью прокрутки.
import { DashboardSidebar } from '@/components/dashboard/sidebar'

export default function EmployerDashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex h-screen overflow-hidden">
      <DashboardSidebar role="employer" />
      <main className="flex-1 overflow-y-auto">
        <div className="p-6 lg:p-8">{children}</div>
      </main>
    </div>
  )
}
