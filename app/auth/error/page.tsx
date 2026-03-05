// app/auth/error/page.tsx
// Страница для отображения ошибок аутентификации (например, неверный токен сброса пароля или ошибка входа).
// Выводит код или описание ошибки, переданные через параметры URL (searchParams).
import Link from 'next/link'

export default async function AuthErrorPage({
  searchParams,
}: {
  searchParams: Promise<{ error: string }>
}) {
  const params = await searchParams

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
          <div className="rounded-2xl border border-destructive/30 bg-card/80 p-8 text-center shadow-2xl backdrop-blur-sm">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-destructive/20">
              <svg className="h-8 w-8 text-destructive-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-foreground">Ошибка авторизации</h1>
            {params?.error ? (
              <p className="mt-2 text-sm text-muted-foreground">
                {'Код ошибки: '}{params.error}
              </p>
            ) : (
              <p className="mt-2 text-sm text-muted-foreground">
                Произошла неизвестная ошибка.
              </p>
            )}
            <Link
              href="/auth/login"
              className="mt-6 inline-flex h-10 items-center justify-center rounded-lg bg-gradient-to-r from-[#6C5CE7] to-[#00B894] px-6 text-sm font-semibold text-white hover:opacity-90"
            >
              Вернуться ко входу
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
