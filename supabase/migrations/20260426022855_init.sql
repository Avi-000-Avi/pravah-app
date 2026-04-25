-- ============================================================
-- Enums
-- ============================================================
create type public.diet_type as enum (
  'omnivore',
  'vegetarian',
  'vegan',
  'pescatarian',
  'keto',
  'paleo',
  'jain',
  'other'
);

create type public.fitness_goal as enum (
  'lose_weight',
  'maintain_weight',
  'gain_muscle',
  'improve_endurance',
  'general_health'
);

create type public.cooking_mode as enum (
  'home_cook',
  'meal_prep',
  'minimal_cook',
  'no_cook'
);

-- ============================================================
-- Utility: set_updated_at trigger function
-- ============================================================
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- ============================================================
-- users
-- ============================================================
create table public.users (
  id          uuid primary key references auth.users (id) on delete cascade,
  name        text,
  email       text,
  phone       text,
  age         smallint check (age > 0 and age < 150),
  sex         text check (sex in ('male', 'female', 'other', 'prefer_not_to_say')),
  height_cm   numeric(5, 1) check (height_cm > 0),
  weight_kg   numeric(5, 2) check (weight_kg > 0),
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create trigger users_set_updated_at
  before update on public.users
  for each row execute function public.set_updated_at();

alter table public.users enable row level security;

create policy "users: read own"
  on public.users for select
  using (auth.uid() = id);

create policy "users: insert own"
  on public.users for insert
  with check (auth.uid() = id);

create policy "users: update own"
  on public.users for update
  using (auth.uid() = id)
  with check (auth.uid() = id);

create policy "users: delete own"
  on public.users for delete
  using (auth.uid() = id);

-- ============================================================
-- meal_preferences
-- ============================================================
create table public.meal_preferences (
  user_id              uuid primary key references public.users (id) on delete cascade,
  diet_type            public.diet_type not null default 'omnivore',
  goal                 public.fitness_goal not null default 'general_health',
  meal_count           smallint not null default 3 check (meal_count between 2 and 6),
  prep_time_max_min    smallint not null default 30 check (prep_time_max_min between 5 and 240),
  budget_weekly_inr    numeric(10, 2) check (budget_weekly_inr > 0),
  cooking_mode         public.cooking_mode not null default 'home_cook',
  cuisines             text[] not null default '{}',
  allergies            text[] not null default '{}',
  avoid                text[] not null default '{}',
  prefer               text[] not null default '{}',
  health_conditions    text[] not null default '{}',
  created_at           timestamptz not null default now(),
  updated_at           timestamptz not null default now()
);

create trigger meal_preferences_set_updated_at
  before update on public.meal_preferences
  for each row execute function public.set_updated_at();

alter table public.meal_preferences enable row level security;

create policy "meal_preferences: read own"
  on public.meal_preferences for select
  using (auth.uid() = user_id);

create policy "meal_preferences: insert own"
  on public.meal_preferences for insert
  with check (auth.uid() = user_id);

create policy "meal_preferences: update own"
  on public.meal_preferences for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "meal_preferences: delete own"
  on public.meal_preferences for delete
  using (auth.uid() = user_id);
