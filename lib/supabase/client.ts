// lib/supabase/client.ts
// Создает и экспортирует экземпляр клиента Supabase для использования в клиентских компонентах (браузере).
// Использует публичные переменные окружения для подключения к проекту Supabase.
import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  )
}
