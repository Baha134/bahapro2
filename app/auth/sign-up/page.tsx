// app/auth/sign-up/page.tsx
// Страница регистрации новых пользователей.
// Позволяет выбрать роль (Студент, Работодатель, Преподаватель) и ввести учетные данные (имя, email, пароль).
// При регистрации через Supabase Auth дополнительные данные (имя и роль) сохраняются в метаданных (user_metadata),
// чтобы затем триггер в БД мог создать соответствующую запись в таблице profiles.
'use client'

import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

const ROLES = [
  {
    value: 'student',
    label: 'Студент',
    description: 'Развивай навыки, собирай портфолио',
    icon: '🎓',
    gradient: 'from-[#6C5CE7] to-[#a855f7]',
  },
  {
    value: 'employer',
    label: 'Работодатель',
    description: 'Находи лучших кандидатов',
    icon: '🏢',
    gradient: 'from-[#00B894] to-[#00D2D3]',
  },
  {
    value: 'teacher',
    label: 'Преподаватель',
    description: 'Верифицируй навыки студентов',
    icon: '📚',
    gradient: 'from-[#FDCB6E] to-[#F97316]',
  },
] as const

export default function SignUpPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [repeatPassword, setRepeatPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [role, setRole] = useState<string>('student')
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    const supabase = createClient()
    setIsLoading(true)
    setError(null)

    if (password !== repeatPassword) {
      setError('Пароли не совпадают')
      setIsLoading(false)
      return
    }

    if (password.length < 6) {
      setError('Пароль должен быть не менее 6 символов')
      setIsLoading(false)
      return
    }

    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo:
            process.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL ||
            `${window.location.origin}/dashboard/${role}`,
          data: {
            full_name: fullName,
            role: role,
          },
        },
      })
      if (error) throw error
      router.push('/auth/sign-up-success')
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
              <h1 className="text-2xl font-bold text-foreground">Регистрация</h1>
              <p className="mt-1 text-sm text-muted-foreground">
                Создай аккаунт и начни свой путь
              </p>
            </div>
            <form onSubmit={handleSignUp}>
              <div className="flex flex-col gap-5">
                {/* Role selection */}
                <div className="grid gap-2">
                  <Label>Выберите роль</Label>
                  <div className="grid grid-cols-3 gap-2">
                    {ROLES.map((r) => (
                      <button
                        key={r.value}
                        type="button"
                        onClick={() => setRole(r.value)}
                        className={`flex flex-col items-center gap-1 rounded-xl border-2 p-3 text-center transition-all ${role === r.value
                            ? `border-[#6C5CE7] bg-[#6C5CE7]/10`
                            : 'border-border/50 bg-background/50 hover:border-border'
                          }`}
                      >
                        <span className="text-xl">{r.icon}</span>
                        <span className="text-xs font-semibold text-foreground">{r.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="fullName">Полное имя</Label>
                  <Input
                    id="fullName"
                    type="text"
                    placeholder="Иванов Иван"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="bg-background/50"
                  />
                </div>
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
                <div className="grid gap-2">
                  <Label htmlFor="repeat-password">Повторите пароль</Label>
                  <Input
                    id="repeat-password"
                    type="password"
                    required
                    value={repeatPassword}
                    onChange={(e) => setRepeatPassword(e.target.value)}
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
                  {isLoading ? 'Создаём аккаунт...' : 'Зарегистрироваться'}
                </Button>
              </div>
              <div className="mt-6 text-center text-sm text-muted-foreground">
                {'Уже есть аккаунт? '}
                <Link
                  href="/auth/login"
                  className="font-medium text-[#6C5CE7] underline underline-offset-4 hover:text-[#5A4BD1]"
                >
                  Войти
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
