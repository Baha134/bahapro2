// app/auth/login/page.tsx
// Страница авторизации пользователей.
// Содержит форму для входа по email и паролю.
// Использует Supabase Auth для аутентификации. После успешного входа
// запрашивает профиль пользователя из базы данных, чтобы определить его роль
// и перенаправить на соответствующий дашборд (студент, работодатель или преподаватель).
'use client'

import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    const supabase = createClient()
    setIsLoading(true)
    setError(null)

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })
      if (error) throw error

      // Fetch profile to get role for redirect
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', user.id)
          .single()

        const role = profile?.role || 'student'
        router.push(`/dashboard/${role}`)
      }
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : 'Произошла ошибка')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-md">
        <div className="flex flex-col gap-6">
          <div className="text-center">
            <Link href="/" className="inline-flex items-center gap-2 text-2xl font-bold text-foreground">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#6C5CE7] to-[#00B894] text-sm font-bold text-white">PS</span>
              ПрофСтарт
            </Link>
          </div>
          <div className="rounded-2xl border border-border/50 bg-card/80 p-8 shadow-2xl backdrop-blur-sm">
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-foreground">Вход в аккаунт</h1>
              <p className="mt-1 text-sm text-muted-foreground">
                Введите данные для входа в платформу
              </p>
            </div>
            <form onSubmit={handleLogin}>
              <div className="flex flex-col gap-5">
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="student@university.ru"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="bg-background/50"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="password">Пароль</Label>
                  <Input
                    id="password"
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="bg-background/50"
                  />
                </div>
                {error && (
                  <div className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive-foreground">
                    {error}
                  </div>
                )}
                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-[#6C5CE7] to-[#00B894] font-semibold text-white hover:opacity-90"
                  disabled={isLoading}
                >
                  {isLoading ? 'Входим...' : 'Войти'}
                </Button>
              </div>
              <div className="mt-6 text-center text-sm text-muted-foreground">
                {'Нет аккаунта? '}
                <Link
                  href="/auth/sign-up"
                  className="font-medium text-[#6C5CE7] underline underline-offset-4 hover:text-[#5A4BD1]"
                >
                  Зарегистрироваться
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
