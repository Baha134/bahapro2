-- Student projects
create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references public.profiles(id) on delete cascade,
  title text not null,
  description text not null default '',
  tech_stack text[] not null default '{}',
  github_link text,
  preview_url text,
  verified boolean not null default false,
  verified_by uuid references public.profiles(id),
  verified_at timestamptz,
  created_at timestamptz not null default now()
);

alter table public.projects enable row level security;

-- Everyone authenticated can read projects
create policy "projects_select_all" on public.projects
  for select to authenticated using (true);

-- Students CRUD own projects
create policy "projects_insert_own" on public.projects
  for insert to authenticated with check (auth.uid() = student_id);

create policy "projects_update_own" on public.projects
  for update to authenticated using (auth.uid() = student_id);

create policy "projects_delete_own" on public.projects
  for delete to authenticated using (auth.uid() = student_id);

-- Teachers can update verification status
create policy "projects_teacher_verify" on public.projects
  for update to authenticated using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'teacher'
    )
  );
