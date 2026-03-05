// middleware.ts
// Глобальный middleware Next.js.
// Перехватывает входящие запросы к приложению (исключая статику и системные пути)
// и передает их в функцию updateSession для проверки и обновления сессии пользователя в Supabase.
import { updateSession } from '@/lib/supabase/middleware'
import { type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  return await updateSession(request)
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
