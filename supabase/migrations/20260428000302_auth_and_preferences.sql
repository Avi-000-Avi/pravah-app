-- ============================================================
-- Pravah — Auth & Preferences
-- ============================================================
-- Replaces the initial schema with the v1 auth + onboarding model:
-- - public.users mirrors auth.users (auto-populated via trigger)
-- - public.meal_preferences (existence == "onboarding complete")
-- - RLS: read-own / write-own only
-- - DPDP: cascading delete via FK -> auth.users
--
-- Forward-only. Safe at this stage because no production data exists.
-- If you've already applied 20260426022855_init.sql via SQL editor,
-- run this to overwrite. CASCADE drops all dependents.
-- ============================================================

-- ---------- 1. Tear down prior schema ----------
drop trigger if exists on_auth_user_created on auth.users;
drop function if exists public.handle_new_user() cascade;

drop table if exists public.meal_preferences cascade;
drop table if exists public.users cascade;

drop type if exists public.diet_type cascade;
drop type if exists public.fitness_goal cascade;
drop type if exists public.cooking_mode cascade;

-- ---------- 2. Enums (per v1 onboarding spec) ----------
create type public.diet_type    as enum ('vegetarian', 'non_vegetarian', 'vegan', 'eggetarian');
create type public.fitness_goal as enum ('fat_loss', 'muscle_gain', 'maintenance');
create type public.cooking_mode as enum ('i_cook', 'someone_cooks_for_me', 'mix');

-- ---------- 3. set_updated_at trigger function ----------
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- ---------- 4. public.users ----------
create table public.users (
  id          uuid primary key references auth.users(id) on delete cascade,
  name        text,
  email       text,
  phone       text,
  age         int     check (age > 0 and age < 120),
  sex         text    check (sex in ('male', 'female', 'other', 'prefer_not_to_say')),
  height_cm   numeric check (height_cm > 0),
  weight_kg   numeric check (weight_kg > 0),
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create trigger users_updated_at
  before update on public.users
  for each row execute function public.set_updated_at();

-- ---------- 5. public.meal_preferences (1:1 with users) ----------
create table public.meal_preferences (
  user_id           uuid primary key references public.users(id) on delete cascade,
  -- core (collected during 4-step onboarding)
  diet_type         public.diet_type    not null,
  goal              public.fitness_goal not null,
  meal_count        int                 not null check (meal_count between 2 and 6),
  prep_time_max_min int                 not null check (prep_time_max_min between 5 and 240),
  -- deferred (filled progressively after week 1, all nullable)
  budget_weekly_inr numeric,
  cooking_mode      public.cooking_mode,
  cuisines          text[] default '{}',
  allergies         text[] default '{}',
  avoid             text[] default '{}',
  health_conditions text[] default '{}',
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now()
);

create trigger meal_preferences_updated_at
  before update on public.meal_preferences
  for each row execute function public.set_updated_at();

-- ---------- 6. Auto-create users row on auth signup ----------
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.users (id, email, phone)
  values (new.id, new.email, new.phone)
  on conflict (id) do nothing;
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ---------- 7. Row-Level Security ----------
alter table public.users             enable row level security;
alter table public.meal_preferences  enable row level security;

-- users: read/update own row only. (No insert policy — handle_new_user
-- runs with security definer; clients never insert directly.)
create policy "users: read own"   on public.users
  for select using (auth.uid() = id);
create policy "users: update own" on public.users
  for update using (auth.uid() = id) with check (auth.uid() = id);

-- meal_preferences: read/insert/update own.
create policy "prefs: read own"   on public.meal_preferences
  for select using (auth.uid() = user_id);
create policy "prefs: insert own" on public.meal_preferences
  for insert with check (auth.uid() = user_id);
create policy "prefs: update own" on public.meal_preferences
  for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
