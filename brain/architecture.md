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

## Database Schema (known tables)

```sql
-- Inferred from types and edge function
public.users (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE
  -- TODO: add profile columns as needed
)

public.meal_preferences (
  user_id uuid PRIMARY KEY REFERENCES public.users(id) ON DELETE CASCADE,
  diet_type text,          -- 'vegetarian' | 'non_vegetarian' | 'vegan' | 'eggetarian'
  goal text,               -- 'fat_loss' | 'muscle_gain' | 'maintenance'
  meal_count int,          -- 2..6
  prep_time_max_min int,   -- 5..240
  budget_weekly_inr int,
  cooking_mode text,
  cuisines text[],
  allergies text[],
  avoid text[],
  health_conditions text[],
  created_at timestamptz,
  updated_at timestamptz
)
```
