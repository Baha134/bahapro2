import Link from 'next/link'
import { ArrowRight, BadgeCheck, Briefcase, GraduationCap, Heart, Globe, Lightbulb, Shield, Star, TrendingUp, Users, Quote } from 'lucide-react'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#f8f9fb] text-[#0f1117]">

      {/* Navigation */}
      <header className="sticky top-0 z-50 border-b border-[#e8eaed] bg-white/90 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
          <Link href="/" className="flex items-center gap-2.5">
            <span className="text-xl font-black tracking-tight text-[#0f1117]">ÓRKEN</span>
          </Link>
          <nav className="hidden items-center gap-8 text-sm font-medium text-[#6b7280] md:flex">
            <Link href="#mission" className="transition-colors hover:text-[#0f1117]">Миссия</Link>
            <Link href="#values" className="transition-colors hover:text-[#0f1117]">Ценности</Link>
            <Link href="#universities" className="transition-colors hover:text-[#0f1117]">ВУЗы</Link>
            <Link href="#stories" className="transition-colors hover:text-[#0f1117]">Истории</Link>
          </nav>
          <div className="flex items-center gap-3">
            <Link href="/auth/login"
              className="rounded-lg px-4 py-2 text-sm font-medium text-[#6b7280] transition-colors hover:text-[#0f1117]">
              Войти
            </Link>
            <Link href="/auth/sign-up"
              className="rounded-xl bg-[#0f1117] px-5 py-2 text-sm font-semibold text-white transition-all hover:bg-[#1a1f2e]">
              Начать →
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden px-6 py-28 md:py-40">
        {/* Subtle gradient orbs */}
        <div className="pointer-events-none absolute left-1/3 top-0 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-[#6C5CE7]/6 blur-[120px]" />
        <div className="pointer-events-none absolute right-1/4 bottom-0 h-[400px] w-[400px] rounded-full bg-[#00B894]/6 blur-[100px]" />

        <div className="relative mx-auto max-w-4xl text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#e8eaed] bg-white px-4 py-1.5 text-sm text-[#6b7280] shadow-sm">
            <span className="flex h-2 w-2 animate-pulse rounded-full bg-[#00B894]" />
            Платформа будущего для студентов Казахстана
          </div>

          <h1 className="text-balance text-5xl font-black leading-[1.1] text-[#0f1117] md:text-7xl">
            Открываем двери<br />
            <span className="bg-gradient-to-r from-[#6C5CE7] to-[#00B894] bg-clip-text text-transparent">
              в новую жизнь
            </span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-[#6b7280]">
            ÓRKEN объединяет студентов всех ВУЗов Казахстана с ведущими работодателями.
            Верифицированное портфолио, поддержка преподавателей и прямой путь к карьере мечты.
          </p>

          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link href="/auth/sign-up"
              className="inline-flex items-center gap-2 rounded-2xl bg-[#0f1117] px-8 py-4 text-base font-bold text-white shadow-lg transition-all hover:bg-[#1a1f2e] hover:shadow-xl hover:-translate-y-0.5">
              Начать бесплатно
              <ArrowRight className="h-5 w-5" />
            </Link>
            <Link href="#mission"
              className="inline-flex items-center gap-2 rounded-2xl border border-[#e8eaed] bg-white px-8 py-4 text-base font-semibold text-[#0f1117] shadow-sm transition-all hover:shadow-md hover:-translate-y-0.5">
              Узнать больше
            </Link>
          </div>

          {/* Stats row */}
          <div className="mt-16 grid grid-cols-3 gap-8 border-t border-[#e8eaed] pt-12">
            {[
              { value: '50+', label: 'ВУЗов-партнёров' },
              { value: '12,500+', label: 'Студентов' },
              { value: '340+', label: 'Работодателей' },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="text-3xl font-black text-[#0f1117]">{stat.value}</p>
                <p className="mt-1 text-sm text-[#6b7280]">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section id="mission" className="border-y border-[#e8eaed] bg-white px-6 py-24">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-16 md:grid-cols-2 md:items-center">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-[#6C5CE7]">Наша миссия</span>
              <h2 className="mt-3 text-4xl font-black leading-tight text-[#0f1117]">
                Мы строим мост между<br />образованием и карьерой
              </h2>
              <p className="mt-5 text-lg leading-relaxed text-[#6b7280]">
                Каждый студент Казахстана заслуживает равного доступа к возможностям.
                ÓRKEN устраняет барьеры между талантом и работодателем — независимо от города,
                ВУЗа или социального статуса.
              </p>
              <p className="mt-4 text-lg leading-relaxed text-[#6b7280]">
                Мы верим, что верифицированные знания и реальный опыт важнее громкого имени
                университета. Наша платформа даёт голос каждому таланту.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                { icon: Globe, title: 'Единая экосистема', desc: 'Все ВУЗы страны в одной платформе', color: '#6C5CE7' },
                { icon: Shield, title: 'Верификация', desc: 'Только подтверждённые навыки и достижения', color: '#00B894' },
                { icon: Heart, title: 'Равный доступ', desc: 'Возможности для каждого студента', color: '#F97316' },
                { icon: TrendingUp, title: 'Рост', desc: 'От студента до специалиста без лишних шагов', color: '#a855f7' },
              ].map((item) => (
                <div key={item.title}
                  className="rounded-2xl border border-[#e8eaed] bg-[#f8f9fb] p-5 transition-all hover:shadow-md hover:-translate-y-0.5">
                  <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl"
                    style={{ backgroundColor: `${item.color}15` }}>
                    <item.icon className="h-5 w-5" style={{ color: item.color }} />
                  </div>
                  <p className="font-bold text-[#0f1117]">{item.title}</p>
                  <p className="mt-1 text-sm text-[#6b7280]">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section id="values" className="px-6 py-24">
        <div className="mx-auto max-w-6xl">
          <div className="mb-14 text-center">
            <span className="text-xs font-bold uppercase tracking-widest text-[#6C5CE7]">Ценности</span>
            <h2 className="mt-3 text-4xl font-black text-[#0f1117]">На чём мы стоим</h2>
            <p className="mx-auto mt-3 max-w-xl text-[#6b7280]">
              Наши ценности определяют каждое решение которое мы принимаем
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {[
              {
                icon: '🤝',
                title: 'Доверие через верификацию',
                desc: 'Каждый навык и достижение подтверждается преподавателем или работодателем. Никаких пустых слов — только реальные компетенции.',
                accent: '#6C5CE7',
              },
              {
                icon: '🌱',
                title: 'Рост без границ',
                desc: 'Неважно из какого ты города или ВУЗа. ÓRKEN открывает одинаковые двери для студента из Алматы и из Шымкента.',
                accent: '#00B894',
              },
              {
                icon: '🔗',
                title: 'Единство экосистемы',
                desc: 'Студенты, преподаватели и работодатели — одна связанная система. Каждый участник усиливает ценность других.',
                accent: '#F97316',
              },
              {
                icon: '💡',
                title: 'Прозрачность',
                desc: 'Студент видит почему его выбрали или не выбрали. Работодатель видит реальный потенциал. Никаких чёрных ящиков.',
                accent: '#a855f7',
              },
              {
                icon: '🎯',
                title: 'Фокус на результате',
                desc: 'Наш единственный KPI — трудоустройство студентов. Всё что мы делаем направлено на реальный карьерный результат.',
                accent: '#00D2D3',
              },
              {
                icon: '🏛️',
                title: 'Партнёрство с ВУЗами',
                desc: 'Мы не заменяем университеты — мы усиливаем их. Преподаватели становятся частью карьерного пути студентов.',
                accent: '#FDCB6E',
              },
            ].map((value) => (
              <div key={value.title}
                className="group rounded-3xl border border-[#e8eaed] bg-white p-8 transition-all hover:shadow-lg hover:-translate-y-1">
                <span className="text-3xl">{value.icon}</span>
                <h3 className="mt-4 text-lg font-bold text-[#0f1117]">{value.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-[#6b7280]">{value.desc}</p>
                <div className="mt-5 h-0.5 w-8 rounded-full transition-all group-hover:w-16"
                  style={{ backgroundColor: value.accent }} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Universities */}
      <section id="universities" className="border-y border-[#e8eaed] bg-white px-6 py-24">
        <div className="mx-auto max-w-6xl">
          <div className="mb-14 text-center">
            <span className="text-xs font-bold uppercase tracking-widest text-[#6C5CE7]">ВУЗы-партнёры</span>
            <h2 className="mt-3 text-4xl font-black text-[#0f1117]">Объединяем все ВУЗы Казахстана</h2>
            <p className="mx-auto mt-3 max-w-xl text-[#6b7280]">
              От Астаны до Алматы — студенты всех ведущих университетов уже на платформе
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {[
              { short: 'ЕНУ', name: 'Евразийский национальный университет', city: 'Астана', color: '#6C5CE7' },
              { short: 'НУ', name: 'Назарбаев Университет', city: 'Астана', color: '#00B894' },
              { short: 'КБТУ', name: 'Казахстанско-Британский технический университет', city: 'Алматы', color: '#F97316' },
              { short: 'КазНУ', name: 'Казахский национальный университет', city: 'Алматы', color: '#a855f7' },
              { short: 'МУИТ', name: 'Международный университет IT и телекоммуникаций', city: 'Алматы', color: '#00D2D3' },
              { short: 'АТУ', name: 'Алматинский технологический университет', city: 'Алматы', color: '#FDCB6E' },
              { short: 'КарТУ', name: 'Карагандинский технический университет', city: 'Караганда', color: '#6C5CE7' },
              { short: 'ЮКГУ', name: 'Южно-Казахстанский государственный университет', city: 'Шымкент', color: '#00B894' },
            ].map((uni) => (
              <div key={uni.short}
                className="group rounded-2xl border border-[#e8eaed] bg-[#f8f9fb] p-5 transition-all hover:border-[#d1d5db] hover:bg-white hover:shadow-md">
                <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl text-sm font-black text-white"
                  style={{ backgroundColor: uni.color }}>
                  {uni.short}
                </div>
                <p className="text-sm font-semibold text-[#0f1117] leading-snug">{uni.name}</p>
                <p className="mt-1 text-xs text-[#6b7280]">{uni.city}</p>
              </div>
            ))}
          </div>
          <div className="mt-8 text-center">
            <p className="text-sm text-[#6b7280]">и ещё <span className="font-bold text-[#0f1117]">40+</span> университетов по всему Казахстану</p>
          </div>
        </div>
      </section>

      {/* Student Stories */}
      <section id="stories" className="px-6 py-24">
        <div className="mx-auto max-w-6xl">
          <div className="mb-14 text-center">
            <span className="text-xs font-bold uppercase tracking-widest text-[#6C5CE7]">Истории успеха</span>
            <h2 className="mt-3 text-4xl font-black text-[#0f1117]">Они уже изменили свою жизнь</h2>
            <p className="mx-auto mt-3 max-w-xl text-[#6b7280]">
              Реальные истории студентов которые нашли свой путь через ÓRKEN
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {[
              {
                name: 'Айгерим Бекова',
                role: 'Frontend Developer в Kaspi.kz',
                university: 'ЕНУ, Астана',
                avatar: 'АБ',
                color: '#6C5CE7',
                quote: 'Благодаря верифицированному портфолио на ÓRKEN меня заметил рекрутер Kaspi. Без этой платформы я бы ещё год рассылала резюме в пустоту.',
              },
              {
                name: 'Данияр Сейткали',
                role: 'Data Analyst в BI Group',
                university: 'КБТУ, Алматы',
                avatar: 'ДС',
                color: '#00B894',
                quote: 'Мой преподаватель подтвердил мои навыки прямо через платформу. Работодатель увидел это и позвонил на следующий день. Это работает.',
              },
              {
                name: 'Зарина Нурланова',
                role: 'Product Manager в Kolesa Group',
                university: 'НУ, Астана',
                avatar: 'ЗН',
                color: '#F97316',
                quote: 'ÓRKEN показал мне что мои навыки имеют ценность на рынке. AI-анализ резюме помог точно попасть в требования вакансии.',
              },
            ].map((story) => (
              <div key={story.name}
                className="relative rounded-3xl border border-[#e8eaed] bg-white p-8 transition-all hover:shadow-lg hover:-translate-y-1">
                <Quote className="absolute right-6 top-6 h-8 w-8 text-[#e8eaed]" />
                <p className="text-sm leading-relaxed text-[#374151]">"{story.quote}"</p>
                <div className="mt-6 flex items-center gap-3 border-t border-[#f3f4f6] pt-6">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl text-sm font-bold text-white"
                    style={{ backgroundColor: story.color }}>
                    {story.avatar}
                  </div>
                  <div>
                    <p className="font-bold text-[#0f1117]">{story.name}</p>
                    <p className="text-xs text-[#6C5CE7] font-medium">{story.role}</p>
                    <p className="text-xs text-[#6b7280]">{story.university}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Role Cards */}
      <section className="border-y border-[#e8eaed] bg-white px-6 py-24">
        <div className="mx-auto max-w-6xl">
          <div className="mb-14 text-center">
            <span className="text-xs font-bold uppercase tracking-widest text-[#6C5CE7]">Для кого</span>
            <h2 className="mt-3 text-4xl font-black text-[#0f1117]">Выберите свою роль</h2>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {[
              {
                icon: GraduationCap,
                emoji: '🎓',
                title: 'Студент',
                desc: 'Развивай навыки, получай верификацию от преподавателей и находи первую работу',
                features: ['Верифицированное портфолио', 'AI-анализ резюме', 'Прямой выход на работодателей', 'Поддержка преподавателей'],
                color: '#6C5CE7',
                href: '/auth/sign-up',
              },
              {
                icon: Briefcase,
                emoji: '🏢',
                title: 'Работодатель',
                desc: 'Находите талантливых студентов с подтверждёнными навыками без лишних шагов',
                features: ['Поиск по навыкам', 'Верифицированные профили', 'Прямой контакт', 'Управление вакансиями'],
                color: '#00B894',
                href: '/auth/sign-up',
              },
              {
                icon: Users,
                emoji: '📚',
                title: 'Преподаватель',
                desc: 'Подтверждайте компетенции студентов и помогайте им строить карьеру',
                features: ['Верификация навыков', 'Карта выпускников', 'Рекомендации', 'Аналитика группы'],
                color: '#F97316',
                href: '/auth/sign-up',
              },
            ].map((role) => (
              <div key={role.title}
                className="group flex flex-col rounded-3xl border border-[#e8eaed] bg-[#f8f9fb] p-8 transition-all hover:bg-white hover:shadow-xl hover:-translate-y-1">
                <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl text-3xl"
                  style={{ backgroundColor: `${role.color}12` }}>
                  {role.emoji}
                </div>
                <h3 className="text-xl font-black text-[#0f1117]">{role.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-[#6b7280]">{role.desc}</p>
                <ul className="mt-6 flex-1 space-y-2.5">
                  {role.features.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-sm text-[#374151]">
                      <BadgeCheck className="h-4 w-4 shrink-0" style={{ color: role.color }} />
                      {f}
                    </li>
                  ))}
                </ul>
                <Link href={role.href}
                  className="mt-8 flex items-center justify-center gap-2 rounded-xl py-3 text-sm font-bold text-white transition-opacity hover:opacity-90"
                  style={{ backgroundColor: role.color }}>
                  Начать
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 py-24">
        <div className="relative mx-auto max-w-4xl overflow-hidden rounded-3xl bg-[#0f1117] p-16 text-center">
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-[#6C5CE7]/20 via-transparent to-[#00B894]/20" />
          <div className="relative">
            <span className="text-xs font-bold uppercase tracking-widest text-[#6C5CE7]">Начни сегодня</span>
            <h2 className="mt-4 text-balance text-4xl font-black text-white md:text-5xl">
              Твоя карьера начинается здесь
            </h2>
            <p className="mx-auto mt-4 max-w-lg text-[#9ca3af]">
              Присоединяйся к тысячам студентов которые уже открыли для себя новые возможности через ÓRKEN.
            </p>
            <Link href="/auth/sign-up"
              className="mt-10 inline-flex items-center gap-2 rounded-2xl bg-white px-10 py-4 text-base font-bold text-[#0f1117] shadow-lg transition-all hover:scale-105 hover:shadow-xl">
              Создать аккаунт бесплатно
              <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[#e8eaed] bg-white px-6 py-10">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-6 md:flex-row">
          <div>
            <span className="text-lg font-black text-[#0f1117]">ÓRKEN</span>
            <p className="mt-1 text-xs text-[#6b7280]">Открываем двери в новую жизнь</p>
          </div>
          <p className="text-sm text-[#6b7280]">© 2026 ÓRKEN. Все права защищены.</p>
          <div className="flex gap-6 text-sm text-[#6b7280]">
            <Link href="#" className="hover:text-[#0f1117] transition-colors">О нас</Link>
            <Link href="#" className="hover:text-[#0f1117] transition-colors">Контакты</Link>
            <Link href="#" className="hover:text-[#0f1117] transition-colors">Конфиденциальность</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}