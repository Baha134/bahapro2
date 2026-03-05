// app/auth/sign-up-success/page.tsx
// Информационная страница, которая отображается после успешной регистрации.
// Сообщает пользователю о необходимости подтвердить email, отправленный на его почту.
import Link from 'next/link'

export default function SignUpSuccessPage() {
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
          <div className="rounded-2xl border border-border/50 bg-card/80 p-8 text-center shadow-2xl backdrop-blur-sm">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-[#00B894] to-[#00D2D3]">
              <svg className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-foreground">Регистрация успешна!</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Проверьте вашу почту и подтвердите email для активации аккаунта.
              После подтверждения вы сможете войти в систему.
            </p>
            <Link
              href="/auth/login"
              className="mt-6 inline-flex h-10 items-center justify-center rounded-lg bg-gradient-to-r from-[#6C5CE7] to-[#00B894] px-6 text-sm font-semibold text-white hover:opacity-90"
            >
              Перейти ко входу
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
