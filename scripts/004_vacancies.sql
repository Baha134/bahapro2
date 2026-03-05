-- Employer vacancies
create table if not exists public.vacancies (
  id uuid primary key default gen_random_uuid(),
  employer_id uuid not null references public.profiles(id) on delete cascade,
  title text not null,
  description text not null default '',
  required_skills text[] not null default '{}',
  type text not null check (type in ('internship', 'job', 'micro')) default 'internship',
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

alter table public.vacancies enable row level security;

-- Everyone authenticated can read active vacancies
create policy "vacancies_select_all" on public.vacancies
  for select to authenticated using (true);

-- Employers CRUD own vacancies
create policy "vacancies_insert_own" on public.vacancies
  for insert to authenticated with check (auth.uid() = employer_id);

create policy "vacancies_update_own" on public.vacancies
  for update to authenticated using (auth.uid() = employer_id);

create policy "vacancies_delete_own" on public.vacancies
  for delete to authenticated using (auth.uid() = employer_id);

-- Applications
create table if not exists public.applications (
  id uuid primary key default gen_random_uuid(),
  vacancy_id uuid not null references public.vacancies(id) on delete cascade,
  student_id uuid not null references public.profiles(id) on delete cascade,
  status text not null check (status in ('pending', 'reviewed', 'accepted', 'rejected')) default 'pending',
  cover_letter text default '',
  created_at timestamptz not null default now(),
  unique(vacancy_id, student_id)
);

alter table public.applications enable row level security;

-- Students can read own applications
create policy "applications_select_student" on public.applications
  for select to authenticated using (auth.uid() = student_id);

-- Employers can read applications to their vacancies
create policy "applications_select_employer" on public.applications
  for select to authenticated using (
    exists (
      select 1 from public.vacancies
      where vacancies.id = applications.vacancy_id and vacancies.employer_id = auth.uid()
    )
  );

-- Students can apply
create policy "applications_insert_student" on public.applications
  for insert to authenticated with check (auth.uid() = student_id);

-- Employers can update application status
create policy "applications_update_employer" on public.applications
  for update to authenticated using (
    exists (
      select 1 from public.vacancies
      where vacancies.id = applications.vacancy_id and vacancies.employer_id = auth.uid()
    )
  );
