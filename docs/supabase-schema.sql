-- Zentra MVP schema for Supabase/Postgres

-- Enable extension for UUID generation (already available on Supabase, kept explicit for portability)
create extension if not exists pgcrypto;

-- Basic role type
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'app_role') THEN
    CREATE TYPE app_role AS ENUM ('student', 'company');
  END IF;
END $$;

-- USERS profile table (mapped 1:1 with auth.users)
create table if not exists public.users (
  id uuid primary key references auth.users(id) on delete cascade,
  role app_role not null,
  email text not null unique,
  created_at timestamptz not null default now()
);

create table if not exists public.student_profiles (
  user_id uuid primary key references public.users(id) on delete cascade,
  full_name text not null,
  education text,
  bio text,
  score integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.student_skills (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references public.student_profiles(user_id) on delete cascade,
  skill text not null,
  created_at timestamptz not null default now(),
  unique(student_id, skill)
);

create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references public.student_profiles(user_id) on delete cascade,
  title text not null,
  description text,
  link text,
  created_at timestamptz not null default now()
);

create table if not exists public.jobs (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references public.users(id) on delete cascade,
  title text not null,
  description text,
  required_skills text[] not null default '{}',
  created_at timestamptz not null default now()
);

-- Keep updated_at fresh
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists trg_student_profiles_updated_at on public.student_profiles;
create trigger trg_student_profiles_updated_at
before update on public.student_profiles
for each row execute procedure public.set_updated_at();

-- Score helper
create or replace function public.calculate_student_score(p_student_id uuid)
returns integer
language plpgsql
as $$
declare
  skills_count integer;
  projects_count integer;
  completion_count integer;
  completion_ratio numeric;
  final_score integer;
begin
  select count(*) into skills_count
  from public.student_skills
  where student_id = p_student_id;

  select count(*) into projects_count
  from public.projects
  where student_id = p_student_id;

  -- Required profile fields for completion: full_name, education, bio
  select
    (case when full_name is not null and full_name <> '' then 1 else 0 end) +
    (case when education is not null and education <> '' then 1 else 0 end) +
    (case when bio is not null and bio <> '' then 1 else 0 end)
  into completion_count
  from public.student_profiles
  where user_id = p_student_id;

  completion_ratio := coalesce(completion_count, 0)::numeric / 3.0;

  final_score :=
    (skills_count * 2) +
    (projects_count * 3) +
    floor(completion_ratio * 5);

  return final_score;
end;
$$;

create or replace function public.refresh_student_score(p_student_id uuid)
returns integer
language plpgsql
as $$
declare
  new_score integer;
begin
  new_score := public.calculate_student_score(p_student_id);

  update public.student_profiles
  set score = new_score
  where user_id = p_student_id;

  return new_score;
end;
$$;

-- Matching helper
create or replace function public.calculate_job_match_score(
  p_job_id uuid,
  p_student_id uuid
)
returns numeric
language sql
as $$
  with job as (
    select required_skills
    from public.jobs
    where id = p_job_id
  ),
  overlap as (
    select count(*)::numeric as overlap_count
    from public.student_skills ss
    join job j on true
    where ss.student_id = p_student_id
      and lower(ss.skill) = any (
        select lower(skill)
        from unnest(j.required_skills) as skill
      )
  ),
  student as (
    select score::numeric as student_score
    from public.student_profiles
    where user_id = p_student_id
  )
  select coalesce(o.overlap_count, 0) + (coalesce(s.student_score, 0) / 10.0)
  from overlap o
  cross join student s;
$$;

-- Helpful indexes
create index if not exists idx_student_skills_skill on public.student_skills (lower(skill));
create index if not exists idx_student_profiles_score_desc on public.student_profiles (score desc);
create index if not exists idx_jobs_company_id on public.jobs (company_id);

-- Basic RLS
alter table public.users enable row level security;
alter table public.student_profiles enable row level security;
alter table public.student_skills enable row level security;
alter table public.projects enable row level security;
alter table public.jobs enable row level security;

-- Users can read everyone (for ranking pages)
drop policy if exists users_select_all on public.users;
create policy users_select_all
on public.users
for select
using (true);

-- Users can manage own user row
drop policy if exists users_manage_own on public.users;
create policy users_manage_own
on public.users
for all
using (auth.uid() = id)
with check (auth.uid() = id);

-- Student profiles are publicly readable; writable by owner
drop policy if exists student_profiles_select_all on public.student_profiles;
create policy student_profiles_select_all
on public.student_profiles
for select
using (true);

drop policy if exists student_profiles_manage_own on public.student_profiles;
create policy student_profiles_manage_own
on public.student_profiles
for all
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

-- Skills/projects: readable by all, writable by owner
drop policy if exists student_skills_select_all on public.student_skills;
create policy student_skills_select_all
on public.student_skills
for select
using (true);

drop policy if exists student_skills_manage_own on public.student_skills;
create policy student_skills_manage_own
on public.student_skills
for all
using (
  exists (
    select 1
    from public.student_profiles sp
    where sp.user_id = student_id
      and sp.user_id = auth.uid()
  )
)
with check (
  exists (
    select 1
    from public.student_profiles sp
    where sp.user_id = student_id
      and sp.user_id = auth.uid()
  )
);

drop policy if exists projects_select_all on public.projects;
create policy projects_select_all
on public.projects
for select
using (true);

drop policy if exists projects_manage_own on public.projects;
create policy projects_manage_own
on public.projects
for all
using (
  exists (
    select 1
    from public.student_profiles sp
    where sp.user_id = student_id
      and sp.user_id = auth.uid()
  )
)
with check (
  exists (
    select 1
    from public.student_profiles sp
    where sp.user_id = student_id
      and sp.user_id = auth.uid()
  )
);

-- Jobs are readable by all, writable by the company that created them
drop policy if exists jobs_select_all on public.jobs;
create policy jobs_select_all
on public.jobs
for select
using (true);

drop policy if exists jobs_manage_own on public.jobs;
create policy jobs_manage_own
on public.jobs
for all
using (auth.uid() = company_id)
with check (auth.uid() = company_id);
