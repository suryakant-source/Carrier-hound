-- ============================================================
-- Career Hound — Supabase Schema
-- Run this in: Supabase Dashboard → SQL Editor → New query
-- ============================================================

-- ── JOBS TABLE ───────────────────────────────────────────────────────────────
create table if not exists public.jobs (
  id            uuid        primary key default gen_random_uuid(),
  company       text        not null,
  title         text        not null,
  location      text        not null,
  remote_scope  text        check (remote_scope in ('remote', 'hybrid', 'onsite', 'any')),
  job_type      text        check (job_type in ('full-time', 'part-time', 'contract', 'internship')),
  salary_text   text,                          -- e.g. "$120k–$160k" or null = "Not listed"
  description   text,                          -- Auth-gated — never returned to guests
  skills        text[],                        -- Auth-gated — never returned to guests
  apply_url     text,                          -- Auth-gated — direct ATS link
  source_url    text,                          -- The careers page this job was scraped from
  first_seen_at timestamptz default now(),
  last_seen_at  timestamptz default now(),
  status        text        default 'active' check (status in ('active', 'expired'))
);

-- ── PROFILES TABLE ───────────────────────────────────────────────────────────
create table if not exists public.profiles (
  user_id      uuid        primary key references auth.users on delete cascade,
  full_name    text,
  target_roles text[],
  created_at   timestamptz default now()
);

-- ── ROW LEVEL SECURITY ───────────────────────────────────────────────────────
alter table public.jobs     enable row level security;
alter table public.profiles enable row level security;

-- Jobs: any authenticated or anonymous user can SELECT active jobs.
-- Full vs teaser field split is enforced in the API route, not RLS.
-- This keeps RLS simple and correct; the API is the enforcement point.
drop policy if exists "jobs_public_read" on public.jobs;
create policy "jobs_public_read"
  on public.jobs
  for select
  using (status = 'active');

-- Profiles: owner can read their own profile
drop policy if exists "profiles_owner_select" on public.profiles;
create policy "profiles_owner_select"
  on public.profiles
  for select
  using (auth.uid() = user_id);

-- Profiles: owner can insert their own profile
drop policy if exists "profiles_owner_insert" on public.profiles;
create policy "profiles_owner_insert"
  on public.profiles
  for insert
  with check (auth.uid() = user_id);

-- Profiles: owner can update their own profile
drop policy if exists "profiles_owner_update" on public.profiles;
create policy "profiles_owner_update"
  on public.profiles
  for update
  using (auth.uid() = user_id);

-- ── INDEXES ──────────────────────────────────────────────────────────────────
create index if not exists jobs_status_idx
  on public.jobs (status);

create index if not exists jobs_first_seen_idx
  on public.jobs (first_seen_at desc);

create index if not exists jobs_company_idx
  on public.jobs (company);

-- Prevent duplicate jobs from the same ATS (same apply URL = same job)
create unique index if not exists jobs_apply_url_unique
  on public.jobs (apply_url)
  where apply_url is not null;

-- ── AUTO-UPDATE last_seen_at FUNCTION ────────────────────────────────────────
-- When the ingestion worker touches an existing job, update last_seen_at.
create or replace function public.touch_job_last_seen()
returns trigger language plpgsql as $$
begin
  new.last_seen_at := now();
  return new;
end;
$$;

drop trigger if exists jobs_touch_last_seen on public.jobs;
create trigger jobs_touch_last_seen
  before update on public.jobs
  for each row execute function public.touch_job_last_seen();
