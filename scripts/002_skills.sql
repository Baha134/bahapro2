-- Skills catalog
create table if not exists public.skills (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  category text not null check (category in ('hard', 'soft')),
  icon text default 'code'
);

alter table public.skills enable row level security;

create policy "skills_select_all" on public.skills
  for select to authenticated using (true);

-- Student skills with verification
create table if not exists public.student_skills (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references public.profiles(id) on delete cascade,
  skill_id uuid not null references public.skills(id) on delete cascade,
  level integer not null default 1 check (level between 1 and 10),
  verified boolean not null default false,
  verified_by uuid references public.profiles(id),
  verified_at timestamptz,
  created_at timestamptz not null default now(),
  unique(student_id, skill_id)
);

alter table public.student_skills enable row level security;

-- Everyone authenticated can read student skills
create policy "student_skills_select_all" on public.student_skills
  for select to authenticated using (true);

-- Students can manage their own skills
create policy "student_skills_insert_own" on public.student_skills
  for insert to authenticated with check (auth.uid() = student_id);

create policy "student_skills_update_own" on public.student_skills
  for update to authenticated using (auth.uid() = student_id);

create policy "student_skills_delete_own" on public.student_skills
  for delete to authenticated using (auth.uid() = student_id);

-- Teachers can verify skills (update verified status)
create policy "student_skills_teacher_verify" on public.student_skills
  for update to authenticated using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'teacher'
    )
  );
