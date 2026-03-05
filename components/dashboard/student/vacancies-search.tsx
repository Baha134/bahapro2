'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { toast } from 'sonner'
import { Search, MapPin, Briefcase, Send } from 'lucide-react'

interface Vacancy {
  id: string
  title: string
  description: string
  company_name: string
  location: string
  salary_range: string | null
  required_skills: string[]
  status: string
  created_at: string
}

const demoVacancies: Vacancy[] = [
  {
    id: '1',
    title: 'Frontend-разработчик (React)',
    description: 'Ищем талантливого фронтенд-разработчика для работы над SaaS-продуктом. Удалённая работа, гибкий график.',
    company_name: 'TechCorp',
    location: 'Удалённо',
    salary_range: '100 000 - 150 000 руб.',
    required_skills: ['React', 'TypeScript', 'CSS'],
    status: 'active',
    created_at: '2026-03-01',
  },
  {
    id: '2',
    title: 'Fullstack-разработчик',
    description: 'Разработка и поддержка микросервисной архитектуры. Стек: Node.js, PostgreSQL, React.',
    company_name: 'StartupHub',
    location: 'Москва',
    salary_range: '120 000 - 180 000 руб.',
    required_skills: ['Node.js', 'PostgreSQL', 'React'],
    status: 'active',
    created_at: '2026-02-28',
  },
  {
    id: '3',
    title: 'Data Analyst (Junior)',
    description: 'Анализ данных пользовательского поведения, построение дашбордов. Отличная позиция для старта карьеры.',
    company_name: 'DataWise',
    location: 'Санкт-Петербург',
    salary_range: '80 000 - 110 000 руб.',
    required_skills: ['SQL', 'Python', 'Excel'],
    status: 'active',
    created_at: '2026-02-25',
  },
  {
    id: '4',
    title: 'UI/UX Designer (Стажёр)',
    description: 'Проектирование пользовательских интерфейсов для мобильных приложений. Наставничество от senior-дизайнера.',
    company_name: 'DesignStudio',
    location: 'Удалённо',
    salary_range: '50 000 - 70 000 руб.',
    required_skills: ['Figma', 'UI/UX', 'Prototyping'],
    status: 'active',
    created_at: '2026-02-20',
  },
]

export function VacanciesSearch({ vacancies: serverVacancies, userId }: { vacancies: Vacancy[]; userId: string }) {
  const [searchQuery, setSearchQuery] = useState('')
  const [applying, setApplying] = useState<string | null>(null)

  const vacancies = serverVacancies.length > 0 ? serverVacancies : demoVacancies
  const filtered = vacancies.filter(
    (v) =>
      v.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.company_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.required_skills.some((s) => s.toLowerCase().includes(searchQuery.toLowerCase()))
  )

  const handleApply = async (vacancyId: string) => {
    setApplying(vacancyId)
    const supabase = createClient()
    const { error } = await supabase.from('applications').insert({
      vacancy_id: vacancyId,
      student_id: userId,
      status: 'pending',
    })

    if (error) {
      if (error.code === '23505') {
        toast.error('Вы уже откликнулись на эту вакансию')
      } else {
        toast.error('Ошибка отправки отклика')
      }
    } else {
      toast.success('Отклик отправлен!')
    }
    setApplying(null)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Поиск вакансий</h1>
        <p className="mt-1 text-muted-foreground">Найди работу мечты по своим навыкам</p>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Поиск по названию, компании или навыку..."
          className="bg-background/50 pl-10"
        />
      </div>

      {/* Results */}
      <div className="space-y-4">
        {filtered.map((vacancy) => (
          <div key={vacancy.id} className="rounded-xl border border-border/50 bg-card p-6 transition-colors hover:border-border">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div className="flex-1">
                <h3 className="text-lg font-bold text-foreground">{vacancy.title}</h3>
                <div className="mt-1 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Briefcase className="h-3.5 w-3.5" />
                    {vacancy.company_name}
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin className="h-3.5 w-3.5" />
                    {vacancy.location}
                  </span>
                </div>
                <p className="mt-3 text-sm text-secondary-foreground">{vacancy.description}</p>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {vacancy.required_skills.map((skill) => (
                    <span
                      key={skill}
                      className="rounded-full border border-primary/20 bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
                {vacancy.salary_range && (
                  <p className="mt-2 text-sm font-semibold text-accent">{vacancy.salary_range}</p>
                )}
              </div>
              <Button
                onClick={() => handleApply(vacancy.id)}
                disabled={applying === vacancy.id}
                className="shrink-0 bg-gradient-to-r from-[#6C5CE7] to-[#00B894] text-white hover:opacity-90"
              >
                <Send className="mr-2 h-4 w-4" />
                {applying === vacancy.id ? 'Отправляем...' : 'Откликнуться'}
              </Button>
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="py-12 text-center text-muted-foreground">
            Вакансии не найдены. Попробуйте изменить поисковый запрос.
          </div>
        )}
      </div>
    </div>
  )
}
