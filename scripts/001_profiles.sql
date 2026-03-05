-- Create profiles table with roles
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  full_name text not null default '',
  role text not null check (role in ('student', 'employer', 'teacher')),
  avatar_url text,
  bio text default '',
  university text default '',
  company text default '',
  department text default '',
  level integer not null default 1,
  xp integer not null default 0,
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

-- Everyone authenticated can read profiles
create policy "profiles_select_all" on public.profiles
  for select to authenticated using (true);

-- Users can insert their own profile
create policy "profiles_insert_own" on public.profiles
  for insert to authenticated with check (auth.uid() = id);

-- Users can update their own profile
create policy "profiles_update_own" on public.profiles
  for update to authenticated using (auth.uid() = id);

-- Users can delete their own profile
create policy "profiles_delete_own" on public.profiles
  for delete to authenticated using (auth.uid() = id);

-- Trigger: auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name, role)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data ->> 'full_name', ''),
    coalesce(new.raw_user_meta_data ->> 'role', 'student')
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;

create trigger on_auth_user_created
  after insert on auth.users
  for each row
  execute function public.handle_new_user();
