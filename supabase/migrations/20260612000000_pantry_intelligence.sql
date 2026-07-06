-- ============================================================
-- Pravah — Adaptive Pantry Intelligence (v1 schema)
-- ============================================================
-- Core tables for the pantry-aware moat:
-- - Catalogs (shared, read-only to clients): ingredients, dishes,
--   leftover_transformations
-- - User-scoped (owner-only RLS): pantry_items, household,
--   leftover_events, daily_plans, meal_logs
-- - meal_preferences gains time_constraints + diet_tags
--
-- Design notes:
-- - pantry_items.source is text + check (not a Postgres enum) so
--   'swiggy' can be added later with a single constraint swap.
-- - dishes.effort_score (1 assemble / 2 light / 3 full cooking) is
--   deliberately distinct from prep_minutes: 10 min of microwaving
--   is low effort, 10 min of chopping is not.
-- - daily_plans.condition_flags is the condition-mode architecture:
--   v1 consumes only 'tired', but vrat/travel/illness/budget modes
--   plug in as additional flags without schema change.
-- - leftover_transformations.active supports retiring content
--   without breaking historical leftover_events.
--
-- Forward-only.
-- ============================================================

-- ---------- 1. Catalog: ingredients ----------
create table public.ingredients (
  id                      uuid primary key default gen_random_uuid(),
  name                    text not null unique,
  name_aliases            text[] not null default '{}',
  category                text not null check (category in
    ('vegetable', 'dairy', 'grain', 'protein', 'spice', 'staple', 'fruit', 'other')),
  default_shelf_life_days int check (default_shelf_life_days > 0),
  is_staple               boolean not null default false,
  created_at              timestamptz not null default now(),
  updated_at              timestamptz not null default now()
);

create trigger ingredients_updated_at
  before update on public.ingredients
  for each row execute function public.set_updated_at();

-- ---------- 2. Catalog: dishes ----------
create table public.dishes (
  id           uuid primary key default gen_random_uuid(),
  name         text not null unique,
  slot_tags    text[] not null default '{}'
    check (slot_tags <@ array['breakfast', 'lunch', 'dinner', 'any']::text[]),
  prep_minutes int not null check (prep_minutes > 0),
  effort_score int not null check (effort_score between 1 and 3),
  protein_g    double precision not null check (protein_g >= 0),
  calories     int not null check (calories > 0),
  -- array of { ingredient_id: uuid, qty_hint: text }
  ingredients  jsonb not null default '[]',
  -- array of strings, max 6 — enforced app-side and by seed review
  method_steps jsonb not null default '[]',
  tags         text[] not null default '{}',
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

create trigger dishes_updated_at
  before update on public.dishes
  for each row execute function public.set_updated_at();

-- ---------- 3. Catalog: leftover_transformations ----------
create table public.leftover_transformations (
  id            uuid primary key default gen_random_uuid(),
  base_category text not null check (base_category in
    ('dal', 'sabzi', 'rice', 'roti', 'curry', 'paneer')),
  dish_id       uuid not null references public.dishes(id),
  -- ingredient ids required beyond the leftover itself; empty = floor
  -- transform, guaranteed available regardless of pantry state
  extra_staples text[] not null default '{}',
  active        boolean not null default true,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

create index leftover_transformations_base_category_idx
  on public.leftover_transformations (base_category) where active;

create trigger leftover_transformations_updated_at
  before update on public.leftover_transformations
  for each row execute function public.set_updated_at();

-- ---------- 4. pantry_items ----------
create table public.pantry_items (
  id                 uuid primary key default gen_random_uuid(),
  user_id            uuid not null references public.users(id) on delete cascade,
  ingredient_id      uuid not null references public.ingredients(id),
  source             text not null check (source in ('staple', 'manual', 'seed')),
  purchased_at       timestamptz not null default now(),
  predicted_empty_at timestamptz,
  confidence         double precision not null default 1.0
    check (confidence >= 0 and confidence <= 1),
  last_confirmed_at  timestamptz,
  created_at         timestamptz not null default now(),
  updated_at         timestamptz not null default now(),
  unique (user_id, ingredient_id)
);

create index pantry_items_user_idx on public.pantry_items (user_id);

create trigger pantry_items_updated_at
  before update on public.pantry_items
  for each row execute function public.set_updated_at();

-- ---------- 5. household ----------
create table public.household (
  user_id         uuid primary key references public.users(id) on delete cascade,
  size_bucket     text not null check (size_bucket in ('solo', 'couple', 'family', 'large')),
  cooking_context text not null default 'self' check (cooking_context in ('self', 'shared')),
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

create trigger household_updated_at
  before update on public.household
  for each row execute function public.set_updated_at();

-- ---------- 6. leftover_events ----------
create table public.leftover_events (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid not null references public.users(id) on delete cascade,
  base_category text not null check (base_category in
    ('dal', 'sabzi', 'rice', 'roti', 'curry', 'paneer')),
  dish_id       uuid not null references public.dishes(id),
  created_at    timestamptz not null default now()
);

create index leftover_events_user_idx on public.leftover_events (user_id, created_at desc);

-- ---------- 7. daily_plans ----------
create table public.daily_plans (
  id              uuid primary key default gen_random_uuid(),
  user_id         uuid not null references public.users(id) on delete cascade,
  date            date not null,
  -- array of PlanSlot — contract documented in src/types/domain.ts
  slots           jsonb not null,
  workout         jsonb,
  condition_flags text[] not null default '{}',
  generated_at    timestamptz not null default now(),
  plan_version    int not null default 1,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now(),
  unique (user_id, date)
);

create trigger daily_plans_updated_at
  before update on public.daily_plans
  for each row execute function public.set_updated_at();

-- ---------- 8. meal_logs ----------
create table public.meal_logs (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid not null references public.users(id) on delete cascade,
  plan_date     date not null,
  slot          text not null check (slot in ('breakfast', 'lunch', 'dinner')),
  status        text not null check (status in ('ate', 'swapped', 'skipped')),
  swap_category text,
  custom_text   text,
  logged_at     timestamptz not null default now(),
  created_at    timestamptz not null default now(),
  unique (user_id, plan_date, slot)
);

create index meal_logs_user_idx on public.meal_logs (user_id, plan_date desc);

-- ---------- 9. meal_preferences extensions ----------
alter table public.meal_preferences
  add column if not exists time_constraints jsonb,
  add column if not exists diet_tags text[] not null default '{}';

-- ---------- 10. Row-Level Security ----------
-- Catalogs: readable by any authenticated user; writes are
-- service-role-only (no insert/update/delete policies), matching
-- the public.meals pattern.
alter table public.ingredients              enable row level security;
alter table public.dishes                   enable row level security;
alter table public.leftover_transformations enable row level security;

create policy "ingredients: read all" on public.ingredients
  for select to authenticated using (true);
create policy "dishes: read all" on public.dishes
  for select to authenticated using (true);
create policy "transformations: read all" on public.leftover_transformations
  for select to authenticated using (true);

-- User tables: owner-only.
alter table public.pantry_items    enable row level security;
alter table public.household       enable row level security;
alter table public.leftover_events enable row level security;
alter table public.daily_plans     enable row level security;
alter table public.meal_logs       enable row level security;

create policy "pantry: read own" on public.pantry_items
  for select using (auth.uid() = user_id);
create policy "pantry: insert own" on public.pantry_items
  for insert with check (auth.uid() = user_id);
create policy "pantry: update own" on public.pantry_items
  for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "pantry: delete own" on public.pantry_items
  for delete using (auth.uid() = user_id);

create policy "household: read own" on public.household
  for select using (auth.uid() = user_id);
create policy "household: insert own" on public.household
  for insert with check (auth.uid() = user_id);
create policy "household: update own" on public.household
  for update using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "leftover events: read own" on public.leftover_events
  for select using (auth.uid() = user_id);
create policy "leftover events: insert own" on public.leftover_events
  for insert with check (auth.uid() = user_id);

create policy "plans: read own" on public.daily_plans
  for select using (auth.uid() = user_id);
create policy "plans: insert own" on public.daily_plans
  for insert with check (auth.uid() = user_id);
create policy "plans: update own" on public.daily_plans
  for update using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "meal logs: read own" on public.meal_logs
  for select using (auth.uid() = user_id);
create policy "meal logs: insert own" on public.meal_logs
  for insert with check (auth.uid() = user_id);
create policy "meal logs: update own" on public.meal_logs
  for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
