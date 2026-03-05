-- Badges catalog
create table if not exists public.badges (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  description text not null default '',
  icon text not null default 'award',
  xp_reward integer not null default 50,
  created_at timestamptz not null default now()
);

alter table public.badges enable row level security;

create policy "badges_select_all" on public.badges
  for select to authenticated using (true);

-- Student badges (earned)
create table if not exists public.student_badges (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references public.profiles(id) on delete cascade,
  badge_id uuid not null references public.badges(id) on delete cascade,
  earned_at timestamptz not null default now(),
  unique(student_id, badge_id)
);

alter table public.student_badges enable row level security;

create policy "student_badges_select_all" on public.student_badges
  for select to authenticated using (true);

create policy "student_badges_insert_own" on public.student_badges
  for insert to authenticated with check (auth.uid() = student_id);

-- Activity log
create table if not exists public.activity_log (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  action text not null,
  details jsonb default '{}',
  created_at timestamptz not null default now()
);

alter table public.activity_log enable row level security;

create policy "activity_log_select_own" on public.activity_log
  for select to authenticated using (auth.uid() = user_id);

create policy "activity_log_insert_own" on public.activity_log
  for insert to authenticated with check (auth.uid() = user_id);
