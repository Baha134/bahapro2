// app/page.tsx
// Главная страница (landing page) платформы "ПрофСтарт".
// Содержит презентационные блоки: шапку (header) с навигацией, Hero-секцию с главным призывом к действию,
// анимированные счетчики статистики, карточки ролей (Студент, Работодатель, Преподаватель),
// описание процесса работы ("Как это работает") и подвал (footer).
// Данная страница статична и служит для привлечения и маршрутизации новых пользователей.
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { AnimatedCounter } from '@/components/landing/animated-counter'
import { RoleCard } from '@/components/landing/role-card'
import { StepCard } from '@/components/landing/step-card'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <header className="sticky top-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
          <Link href="/" className="flex items-center gap-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-[#6C5CE7] to-[#00B894] text-sm font-bold text-white">
              PS
            </span>
            <span className="text-lg font-bold text-foreground">ПрофСтарт</span>
          </Link>
          <div className="flex items-center gap-3">
            <Link
              href="/auth/login"
              className="rounded-lg px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-secondary"
            >
              Войти
            </Link>
            <Link
              href="/auth/sign-up"
              className="rounded-lg bg-gradient-to-r from-[#6C5CE7] to-[#00B894] px-4 py-2 text-sm font-semibold text-white transition-opacity hover:opacity-90"
            >
              Регистрация
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden px-4 py-20 md:py-32">
        {/* Ambient glow effects */}
        <div className="pointer-events-none absolute left-1/4 top-0 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-[#6C5CE7]/10 blur-[120px]" />
        <div className="pointer-events-none absolute right-1/4 top-20 h-[400px] w-[400px] translate-x-1/2 rounded-full bg-[#00B894]/10 blur-[120px]" />

        <div className="relative mx-auto max-w-4xl text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border/50 bg-secondary px-4 py-1.5 text-sm text-secondary-foreground">
            <span className="flex h-2 w-2 rounded-full bg-accent" />
            Платформа нового поколения
          </div>
          <h1 className="text-balance text-4xl font-bold leading-tight text-foreground md:text-6xl">
            {'Прокачай карьеру '}
            <span className="bg-gradient-to-r from-[#6C5CE7] to-[#00B894] bg-clip-text text-transparent">
              как в RPG
            </span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-pretty text-lg text-muted-foreground">
            ПрофСтарт - геймифицированная платформа, где студенты развивают навыки,
            работодатели находят верифицированных кандидатов, а преподаватели подтверждают компетенции.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="/auth/sign-up"
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#6C5CE7] to-[#00B894] px-8 py-3.5 text-base font-semibold text-white transition-opacity hover:opacity-90"
            >
              Начать бесплатно
              <ArrowRight className="h-5 w-5" />
            </Link>
            <Link
              href="#roles"
              className="inline-flex items-center gap-2 rounded-xl border border-border px-8 py-3.5 text-base font-semibold text-foreground transition-colors hover:bg-secondary"
            >
              Узнать больше
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Counter */}
      <section className="border-y border-border/50 bg-card/50 px-4 py-12">
        <div className="mx-auto grid max-w-4xl grid-cols-2 gap-8 md:grid-cols-4">
          <AnimatedCounter target={12500} suffix="+" label="Студентов" />
          <AnimatedCounter target={340} suffix="+" label="Работодателей" />
          <AnimatedCounter target={890} label="Верифицированных навыков" />
          <AnimatedCounter target={2100} suffix="+" label="Размещённых вакансий" />
        </div>
      </section>

      {/* Role Cards */}
      <section id="roles" className="px-4 py-20">
        <div className="mx-auto max-w-6xl">
          <div className="mb-12 text-center">
            <h2 className="text-balance text-3xl font-bold text-foreground">Выберите свою роль</h2>
            <p className="mx-auto mt-3 max-w-xl text-pretty text-muted-foreground">
              Платформа адаптируется под каждого участника, предоставляя уникальные инструменты и возможности.
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            <RoleCard
              title="Студент"
              description="Развивай навыки, собирай верифицированное портфолио и находи работу мечты"
              features={[
                'RPG-прокачка навыков и уровней',
                'Портфолио с верификацией преподавателей',
                'AI-помощник по карьере',
                'Система достижений и бейджей',
              ]}
              icon="🎓"
              gradient="from-[#6C5CE7] to-[#a855f7]"
              href="/auth/sign-up"
            />
            <RoleCard
              title="Работодатель"
              description="Находите лучших кандидатов с подтверждёнными навыками"
              features={[
                'Поиск по верифицированным навыкам',
                'Слепой наём без предубеждений',
                'Прямой доступ к портфолио',
                'Управление вакансиями и откликами',
              ]}
              icon="🏢"
              gradient="from-[#00B894] to-[#00D2D3]"
              href="/auth/sign-up"
            />
            <RoleCard
              title="Преподаватель"
              description="Верифицируйте компетенции студентов и помогайте им расти"
              features={[
                'Подтверждение навыков студентов',
                'Верификация проектных работ',
                'Рекомендации работодателям',
                'Аналитика по группам',
              ]}
              icon="📚"
              gradient="from-[#FDCB6E] to-[#F97316]"
              href="/auth/sign-up"
            />
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="border-y border-border/50 bg-card/30 px-4 py-20">
        <div className="mx-auto max-w-4xl">
          <div className="mb-12 text-center">
            <h2 className="text-balance text-3xl font-bold text-foreground">Как это работает</h2>
            <p className="mx-auto mt-3 max-w-xl text-pretty text-muted-foreground">
              Простой путь от регистрации до первого оффера
            </p>
          </div>
          <div className="grid gap-8 md:grid-cols-4">
            <StepCard
              step={1}
              title="Регистрация"
              description="Создай аккаунт и выбери свою роль на платформе"
              gradient="from-[#6C5CE7] to-[#a855f7]"
            />
            <StepCard
              step={2}
              title="Прокачка"
              description="Развивай навыки, выполняй задания и получай XP"
              gradient="from-[#00B894] to-[#00D2D3]"
            />
            <StepCard
              step={3}
              title="Верификация"
              description="Преподаватели подтверждают твои компетенции"
              gradient="from-[#FDCB6E] to-[#F97316]"
            />
            <StepCard
              step={4}
              title="Трудоустройство"
              description="Работодатели находят тебя по навыкам"
              gradient="from-[#6C5CE7] to-[#00B894]"
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-4 py-20">
        <div className="relative mx-auto max-w-4xl overflow-hidden rounded-3xl border border-border/50 bg-card p-12 text-center">
          <div className="pointer-events-none absolute left-0 top-0 h-full w-full bg-gradient-to-br from-[#6C5CE7]/10 via-transparent to-[#00B894]/10" />
          <div className="relative">
            <h2 className="text-balance text-3xl font-bold text-foreground">
              Готов начать свой путь?
            </h2>
            <p className="mx-auto mt-3 max-w-lg text-pretty text-muted-foreground">
              Присоединяйся к тысячам студентов, которые уже прокачивают свою карьеру на ПрофСтарт.
            </p>
            <Link
              href="/auth/sign-up"
              className="mt-8 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#6C5CE7] to-[#00B894] px-8 py-3.5 text-base font-semibold text-white transition-opacity hover:opacity-90"
            >
              Создать аккаунт
              <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/50 px-4 py-8">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 text-sm text-muted-foreground md:flex-row">
          <div className="flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-[#6C5CE7] to-[#00B894] text-[10px] font-bold text-white">PS</span>
            <span className="font-medium text-foreground">ПрофСтарт</span>
          </div>
          <p>2026 ПрофСтарт. Все права защищены.</p>
        </div>
      </footer>
    </div>
  )
}
