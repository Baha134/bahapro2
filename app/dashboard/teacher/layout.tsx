// app/dashboard/teacher/layout.tsx
// Макет (Layout) для раздела преподавателя.
// Отображает боковое меню навигации (DashboardSidebar) и основную область контента
// для всех страниц внутри /dashboard/teacher.
// app/dashboard/teacher/layout.tsx
// Макет (Layout) для раздела преподавателя.
// Отображает боковое меню навигации (DashboardSidebar) и основную область контента
// для всех страниц внутри /dashboard/teacher.
import { DashboardSidebar } from '@/components/dashboard/sidebar'


export default function TeacherDashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="flex h-screen overflow-hidden">
            <DashboardSidebar role="teacher" />
            <main className="flex-1 overflow-y-auto">
                <div className="p-6 lg:p-8">{children}</div>
            </main>
        </div>
    )
}
