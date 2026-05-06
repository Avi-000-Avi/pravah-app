# Architecture — Pravah

## High-Level System Design

```
┌─────────────────────────────────────────────────────┐
│                  Expo / React Native                 │
│  ┌──────────┐  ┌──────────┐  ┌────────────────────┐ │
│  │  (auth)  │  │(onboard) │  │      (tabs)        │ │
│  │  email   │  │ step 1-6 │  │ Today/Fuel/Flow/   │ │
│  │  phone   │  │ welcome  │  │ Rest/Data/Grocery  │ │
│  └──────────┘  └──────────┘  └────────────────────┘ │
│          ↓ route guard (app/_layout.tsx)             │
│  ┌─────────────────────────────────────────────────┐ │
│  │           State Layer                           │ │
│  │  authStore (Zustand+MMKV persist)               │ │
│  │  appStore  (Zustand, session-only)              │ │
│  │  onboardingStore (Zustand, no persist)          │ │
│  └─────────────────────────────────────────────────┘ │
│          ↓ hooks (never direct Supabase from screens)│
│  ┌─────────────────────────────────────────────────┐ │
│  │           src/features/{domain}/hooks           │ │
│  │  useEmailAuth  useGoogleSSO  usePhoneOTP        │ │
│  │  useAuth  usePreferences  useOnboarding         │ │
│  └─────────────────────────────────────────────────┘ │
└──────────────────────────┬──────────────────────────┘
                           │ supabase-js v2
┌──────────────────────────▼──────────────────────────┐
│                    Supabase                         │
│  ┌───────────────┐  ┌──────────────────────────┐   │
│  │  Auth         │  │  Postgres (RLS)          │   │
│  │  Email/Google │  │  public.users            │   │
│  │  Phone (TODO) │  │  public.meal_preferences │   │
│  │               │  │  public.meals            │   │
│  │               │  │  public.user_meal_plans  │   │
│  └───────────────┘  └──────────────────────────┘   │
│  ┌───────────────┐  ┌──────────────────────────┐   │
│  │  Edge Funcs   │  │  MMKV (device local)     │   │
│  │  delete-acct  │  │  auth session token      │   │
│  └───────────────┘  │  isOnboarded flag        │   │
│                     └──────────────────────────┘   │
└─────────────────────────────────────────────────────┘
```

## Tech Stack

| Layer           | Choice                             | Version |
| --------------- | ---------------------------------- | ------- |
| Framework       | Expo SDK                           | 55      |
| Runtime         | React Native                       | 0.83.6  |
| Routing         | expo-router (file-based)           | v4      |
| Language        | TypeScript strict                  | ~5.9    |
| Global state    | Zustand                            | ^5.0    |
| Server state    | TanStack Query                     | v5      |
| Backend         | Supabase (Postgres + Auth + Edge)  | ^2.104  |
| Local storage   | react-native-mmkv                  | ^4.3    |
| Analytics       | PostHog                            | ^4.43   |
| Error tracking  | Sentry                             | ^7.11   |
| Package manager | pnpm                               | —       |
| Display font    | Newsreader (Google Fonts)          | ^0.4    |
| UI font         | Manrope (Google Fonts)             | ^0.4    |
| Icons           | @expo/vector-icons (MaterialIcons) | ^15     |
| SVG             | react-native-svg                   | 15.15   |

## Folder Structure

```
app/                    expo-router pages ONLY — no business logic
  _layout.tsx           root layout + RouteGuard (session → onboarding → tabs)
  (auth)/               unauthenticated screens
    email.tsx           sign-in / sign-up toggle
    phone.tsx           phone number entry
    otp.tsx             6-digit OTP verification
  (onboarding)/         first-run preference capture
    welcome.tsx
    step-1..6.tsx
  (tabs)/               main app (5 visible + 1 hidden)
    _layout.tsx         PravahTabBar (custom)
    index.tsx           Today
    meals.tsx           Fuel
    workout.tsx         Flow
    chat.tsx            Rest / Recovery
    profile.tsx         Data / Insights
    grocery.tsx         Grocery (hidden, href:null)
  index.tsx             redirect shim

src/
  features/             domain-scoped logic
    auth/               authentication
      hooks/            useAuth, useEmailAuth, useGoogleSSO, usePhoneOTP
      store/            authStore (Zustand + MMKV persist)
      types/            auth.types.ts
    preferences/        user prefs / onboarding data
      hooks/            useOnboarding, usePreferences
      store/            onboardingStore (no persist)
      types/            preferences.types.ts
    onboarding/         (legacy folder, being unified with preferences)
  components/           shared primitives only
    Card.tsx
    Pill.tsx
    PrimaryButton.tsx
    GhostButton.tsx
    SectionLabel.tsx
    ProgressRing.tsx    SVG ring used on all 5 tab screens
    StatRing.tsx
    SystemStatusRow.tsx
    onboarding/         onboarding-specific primitives
  lib/                  singletons
    supabase.ts         Supabase client (MMKV auth adapter)
    theme.ts            ALL design tokens — do not hardcode values
    fonts.ts            usePravahFonts() hook
    analytics.ts        PostHog wrapper: track()
    monitoring.ts       Sentry wrapper: captureError()
    storage.ts          MMKV with in-memory fallback
  stores/
    appStore.ts         session-only state (meals, workout, sleep, recovery)

supabase/
  migrations/           forward-only SQL migrations
  functions/            Deno Edge Functions
    delete-account/     GDPR hard delete (cascade)
  seed/                 local seed data
```

## Data Flow

### Auth Boot Sequence

```
App opens
  → usePravahFonts() loads Newsreader + Manrope
  → RouteGuard mounts
  → supabase.auth.getSession() reads MMKV token (sync)
  → setSession() + setLoading(false) → splash hides
  → routing effect: no session → /(auth)/email
                   session + !onboarded → /(onboarding)/welcome
                   session + onboarded → /(tabs)

Sign in event:
  useEmailAuth.signIn() → supabase.auth.signInWithPassword()
  → onAuthStateChange(SIGNED_IN, session) fires
  → setSession(session) in RouteGuard listener
  → routing effect fires → navigate to onboarding or tabs
```

### Onboarding → Preferences

```
step-1..6 write to useOnboardingStore (in-memory draft)
step-6 finish:
  → usePreferences.submit() → INSERT into public.meal_preferences
  → setOnboarded(true) persisted to MMKV
  → routing effect → /(tabs)
```

## API / Supabase Conventions

- All DB queries go through feature hooks (`src/features/*/hooks/`) — never called directly from screens
- RLS policy: every table has `USING (auth.uid() = user_id)`
- Edge functions use DELETE/POST (not REST-style GET for mutations)
- Edge function response: `{ success: true }` or `{ error: string, detail?: string }`
- TanStack Query manages server state caching; Zustand is for UI + ephemeral session state only

## Database Schema

Source of truth: `supabase/migrations/`. This is a summary of the deployed shape.

### Enums

```sql
public.diet_type   = 'vegetarian' | 'non_vegetarian' | 'vegan' | 'eggetarian'
public.fitness_goal = 'fat_loss' | 'muscle_gain' | 'maintenance'
public.cooking_mode = 'i_cook' | 'someone_cooks_for_me' | 'mix'
public.meal_slot   = 'breakfast' | 'lunch' | 'dinner' | 'snack'
```

### Tables

```sql
public.users (
  id          uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name        text,
  email       text,
  phone       text,
  age         int      CHECK (age > 0 AND age < 120),
  sex         text     CHECK (sex IN ('male','female','other','prefer_not_to_say')),
  height_cm   numeric  CHECK (height_cm > 0),
  weight_kg   numeric  CHECK (weight_kg > 0),
  created_at  timestamptz NOT NULL DEFAULT now(),
  updated_at  timestamptz NOT NULL DEFAULT now()
)
-- Auto-populated by handle_new_user() trigger on auth.users INSERT
-- RLS: read-own / update-own (no client INSERT — trigger handles it)

public.meal_preferences (
  user_id           uuid PRIMARY KEY REFERENCES public.users(id) ON DELETE CASCADE,
  diet_type         public.diet_type    NOT NULL,
  goal              public.fitness_goal NOT NULL,
  meal_count        int                 NOT NULL CHECK (meal_count BETWEEN 2 AND 6),
  prep_time_max_min int                 NOT NULL CHECK (prep_time_max_min BETWEEN 5 AND 240),
  budget_weekly_inr numeric,
  cooking_mode      public.cooking_mode,
  cuisines          text[] DEFAULT '{}',
  allergies         text[] DEFAULT '{}',
  avoid             text[] DEFAULT '{}',
  health_conditions text[] DEFAULT '{}',
  created_at        timestamptz NOT NULL DEFAULT now(),
  updated_at        timestamptz NOT NULL DEFAULT now()
)
-- Existence == "onboarding complete"
-- RLS: read/insert/update own

public.meals (
  id             uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug           text UNIQUE NOT NULL,
  name           text NOT NULL,
  description    text,
  meal_slot      public.meal_slot NOT NULL,
  diet_type      public.diet_type NOT NULL,
  cuisine        text,
  image_url      text,
  prep_time_min  int     NOT NULL CHECK (prep_time_min BETWEEN 0 AND 240),
  calories_kcal  int     NOT NULL CHECK (calories_kcal >= 0),
  protein_g      numeric NOT NULL,
  carbs_g        numeric NOT NULL,
  fat_g          numeric NOT NULL,
  tags           text[]  NOT NULL DEFAULT '{}',
  is_active      boolean NOT NULL DEFAULT true,
  created_at     timestamptz NOT NULL DEFAULT now(),
  updated_at     timestamptz NOT NULL DEFAULT now()
)
-- System-curated global catalog (no user_id)
-- RLS: read-only for any authenticated user
-- Writes: service-role only (Supabase Studio / admin SQL)
-- Index: (meal_slot, diet_type) WHERE is_active

public.user_meal_plans (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     uuid NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  meal_id     uuid NOT NULL REFERENCES public.meals(id) ON DELETE RESTRICT,
  plan_date   date NOT NULL,
  meal_slot   public.meal_slot NOT NULL,
  servings    numeric NOT NULL DEFAULT 1 CHECK (servings > 0),
  is_logged   boolean NOT NULL DEFAULT false,
  logged_at   timestamptz,
  created_at  timestamptz NOT NULL DEFAULT now(),
  updated_at  timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, plan_date, meal_slot)
)
-- One row per user × date × slot — assigns a meal template to a slot
-- RLS: full CRUD scoped to auth.uid() = user_id
-- Index: (user_id, plan_date)
```

### Triggers

- `auth.users INSERT` → `public.handle_new_user()` → inserts `public.users` row (security definer)
- `BEFORE UPDATE` on `users`, `meal_preferences`, `meals`, `user_meal_plans` → `public.set_updated_at()`
