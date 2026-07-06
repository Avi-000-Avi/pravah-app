-- ============================================================
-- Pravah — Workouts Catalog & User Workout Plans
-- ============================================================
-- Hybrid model:
-- - public.workouts             : system-curated global workout catalog
-- - public.workout_exercises    : ordered exercise rows for each workout
-- - public.user_workout_plans   : per-user daily workout assignment + completion
--
-- Why hybrid: just like meals, workouts are curated by the product. The
-- catalog is shared, but each user's daily workout state belongs in an
-- owner-scoped row so completion and future plan generation stay isolated.
-- ============================================================

create type public.workout_status as enum ('pending', 'completed', 'skipped');

create table public.workouts (
  id            uuid primary key default gen_random_uuid(),
  slug          text unique not null,
  name          text not null,
  description   text,
  duration_min  int not null check (duration_min between 1 and 240),
  focus_area    text not null,
  is_active     boolean not null default true,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

create table public.workout_exercises (
  id                      uuid primary key default gen_random_uuid(),
  workout_id              uuid not null references public.workouts(id) on delete cascade,
  sort_order              int not null check (sort_order > 0),
  name                    text not null,
  muscle                  text not null,
  sets                    int not null check (sets between 1 and 20),
  reps                    text not null,
  target_weight           text not null,
  previous_weight         text not null,
  rest_after_set_sec      int not null default 60 check (rest_after_set_sec between 0 and 600),
  rest_after_exercise_sec int not null default 90 check (rest_after_exercise_sec between 0 and 900),
  created_at              timestamptz not null default now(),
  updated_at              timestamptz not null default now(),
  unique (workout_id, sort_order)
);

create table public.user_workout_plans (
  id              uuid primary key default gen_random_uuid(),
  user_id         uuid not null references public.users(id) on delete cascade,
  workout_id      uuid not null references public.workouts(id) on delete restrict,
  plan_date       date not null,
  status          public.workout_status not null default 'pending',
  duration_sec    int check (duration_sec is null or duration_sec >= 0),
  completed_sets  int check (completed_sets is null or completed_sets >= 0),
  completed_at    timestamptz,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now(),
  unique (user_id, plan_date)
);

create index workouts_active_idx on public.workouts (is_active) where is_active;
create index workout_exercises_workout_sort_idx on public.workout_exercises (workout_id, sort_order);
create index user_workout_plans_user_date_idx on public.user_workout_plans (user_id, plan_date);

create trigger workouts_updated_at
  before update on public.workouts
  for each row execute function public.set_updated_at();

create trigger workout_exercises_updated_at
  before update on public.workout_exercises
  for each row execute function public.set_updated_at();

create trigger user_workout_plans_updated_at
  before update on public.user_workout_plans
  for each row execute function public.set_updated_at();

alter table public.workouts enable row level security;
alter table public.workout_exercises enable row level security;
alter table public.user_workout_plans enable row level security;

create policy "workouts: read all (authenticated)" on public.workouts
  for select to authenticated using (true);

create policy "workout_exercises: read all (authenticated)" on public.workout_exercises
  for select to authenticated using (true);

create policy "user_workout_plans: read own" on public.user_workout_plans
  for select using (auth.uid() = user_id);

create policy "user_workout_plans: insert own" on public.user_workout_plans
  for insert with check (auth.uid() = user_id);

create policy "user_workout_plans: update own" on public.user_workout_plans
  for update using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "user_workout_plans: delete own" on public.user_workout_plans
  for delete using (auth.uid() = user_id);
