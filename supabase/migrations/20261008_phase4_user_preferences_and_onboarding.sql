-- ============================================================================
-- Phase 4 Migration: User Preferences & Onboarding State
-- ============================================================================

create table if not exists public.user_preferences (
  user_id             uuid primary key references auth.users(id) on delete cascade,
  roles               text[] default '{}',
  categories          text[] default '{}',
  experience_level    text,
  employment_types    text[] default '{}',
  locations           text[] default '{}',
  remote_preference   text default 'any', -- 'remote', 'hybrid', 'onsite', 'any'
  work_auth           text,
  min_salary          numeric,
  salary_currency     text default 'USD',
  daily_digest_opt_in boolean default true,
  onboarding_completed boolean default false,
  created_at          timestamptz default now(),
  updated_at          timestamptz default now()
);

alter table public.user_preferences enable row level security;

drop policy if exists "user_preferences_owner_select" on public.user_preferences;
create policy "user_preferences_owner_select"
  on public.user_preferences for select
  using (auth.uid() = user_id);

drop policy if exists "user_preferences_owner_insert" on public.user_preferences;
create policy "user_preferences_owner_insert"
  on public.user_preferences for insert
  with check (auth.uid() = user_id);

drop policy if exists "user_preferences_owner_update" on public.user_preferences;
create policy "user_preferences_owner_update"
  on public.user_preferences for update
  using (auth.uid() = user_id);

drop policy if exists "user_preferences_owner_delete" on public.user_preferences;
create policy "user_preferences_owner_delete"
  on public.user_preferences for delete
  using (auth.uid() = user_id);
