-- ============================================================
-- Pravah — Meals Catalog & User Meal Plans
-- ============================================================
-- Hybrid model:
-- - public.meals            : system-curated global catalog of meal templates
--                             (no user_id; readable by any authenticated user)
-- - public.user_meal_plans  : per-user assignments of a meal template to a
--                             (date, slot); owner-only RLS, mirrors the
--                             meal_preferences pattern
--
-- Why hybrid: Pravah's product principle is "plans are curated by the
-- system" — users do not create their own meal templates. The catalog is
-- shared, but each user's daily plan is its own row so it can be logged
-- or swapped without mutating the catalog.
--
-- Forward-only. Catalog write access is intentionally service-role-only
-- (no INSERT/UPDATE/DELETE policies on public.meals).
-- ============================================================

-- ---------- 1. Enums ----------
create type public.meal_slot as enum ('breakfast', 'lunch', 'dinner', 'snack');

-- ---------- 2. public.meals (global catalog) ----------
create table public.meals (
  id             uuid primary key default gen_random_uuid(),
  slug           text unique not null,
  name           text not null,
  description    text,
  meal_slot      public.meal_slot not null,
  diet_type      public.diet_type not null,
  cuisine        text,
  image_url      text,
  prep_time_min  int     not null check (prep_time_min between 0 and 240),
  -- macros per serving
  calories_kcal  int     not null check (calories_kcal >= 0),
  protein_g      numeric not null check (protein_g     >= 0),
  carbs_g        numeric not null check (carbs_g       >= 0),
  fat_g          numeric not null check (fat_g         >= 0),
  -- metadata
  tags           text[]  not null default '{}',
  is_active      boolean not null default true,
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now()
);

create index meals_slot_diet_idx
  on public.meals (meal_slot, diet_type)
  where is_active;

create trigger meals_updated_at
  before update on public.meals
  for each row execute function public.set_updated_at();

-- ---------- 3. public.user_meal_plans (per-user plan rows) ----------
create table public.user_meal_plans (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references public.users(id) on delete cascade,
  meal_id     uuid not null references public.meals(id) on delete restrict,
  plan_date   date not null,
  meal_slot   public.meal_slot not null,
  servings    numeric not null default 1 check (servings > 0),
  is_logged   boolean not null default false,
  logged_at   timestamptz,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now(),
  unique (user_id, plan_date, meal_slot)
);

create index user_meal_plans_user_date_idx
  on public.user_meal_plans (user_id, plan_date);

create trigger user_meal_plans_updated_at
  before update on public.user_meal_plans
  for each row execute function public.set_updated_at();

-- ---------- 4. Row-Level Security ----------
alter table public.meals             enable row level security;
alter table public.user_meal_plans   enable row level security;

-- meals: read-only for any signed-in user. Writes happen via service-role
-- (admin SQL or Supabase Studio) — no client-side mutation policies.
create policy "meals: read all (authenticated)" on public.meals
  for select to authenticated using (true);

-- user_meal_plans: full CRUD scoped to the row owner.
create policy "user_meal_plans: read own"   on public.user_meal_plans
  for select using (auth.uid() = user_id);
create policy "user_meal_plans: insert own" on public.user_meal_plans
  for insert with check (auth.uid() = user_id);
create policy "user_meal_plans: update own" on public.user_meal_plans
  for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "user_meal_plans: delete own" on public.user_meal_plans
  for delete using (auth.uid() = user_id);
