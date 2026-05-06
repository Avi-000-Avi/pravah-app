# Context — Pravah

> **This is the file you paste into AI tools.** Keep it current. Update before every context switch.
> Optimised for one-shot pasting — concise, no fluff.

---

## Snapshot

```
Project:          Pravah — zero-decision fitness + nutrition app (India-first)
Stack:            Expo 55 · React Native 0.83 · TypeScript strict · expo-router v4
Backend:          Supabase (Postgres + Auth + Edge Functions)
State:            Zustand (authStore persisted to MMKV, appStore session-only)
Package manager:  pnpm
Design system:    Serene Flow — src/lib/theme.ts (ALL values are tokens, never hardcode)
Fonts:            Newsreader (display/serif) · Manrope (UI/body)
```

---

## Current Goal

<!-- UPDATE THIS when starting a new task -->

Wire real meal plan data from Supabase to replace hardcoded meal arrays in `app/(tabs)/meals.tsx`.

---

## Current Task

<!-- UPDATE THIS to the specific thing you're working on right now -->

TODO — update when starting work.

---

## Relevant Architecture

- Route guard: `app/_layout.tsx` → `RouteGuard` owns all navigation decisions
- Auth: `src/features/auth/` → hooks + store + types
- Session: `authStore.session` (MMKV persisted) mirrors Supabase session
- Today state: `src/stores/appStore.ts` (no persist — resets each session)
- Onboarding draft: `src/features/preferences/store/onboardingStore.ts` (no persist)
- Supabase client: `src/lib/supabase.ts` (MMKV auth adapter, autoRefreshToken)

**3-state routing:**

```
!session → /(auth)/email
session + !isOnboarded → /(onboarding)/welcome
session + isOnboarded → /(tabs)
```

---

## Patterns to Follow

1. **Never call Supabase directly from screens** — wrap in hooks inside `src/features/{domain}/hooks/`
2. **Always use theme tokens** — `colors.rose`, `fonts.display`, `radii.card` etc. from `src/lib/theme.ts`
3. **Screens are dumb** — no business logic; import from feature hooks only
4. **Errors surface as strings** — hooks expose `error: string | null`; screens display it; Sentry gets `captureError()` for unexpected ones
5. **State machines over booleans** — use discriminated unions: `type Phase = 'ready' | 'logging' | 'logged'`
6. **`import type` for all type imports** — never mix value and type imports

---

## Relevant Files

| File                                                  | Purpose                                                      |
| ----------------------------------------------------- | ------------------------------------------------------------ |
| `app/_layout.tsx`                                     | Root layout + RouteGuard (session listener, 3-state routing) |
| `app/(tabs)/meals.tsx`                                | Fuel screen — phase-based meal log                           |
| `app/(tabs)/workout.tsx`                              | Flow screen — 4-phase workout session                        |
| `app/(tabs)/chat.tsx`                                 | Rest screen — recovery + adaptive plan                       |
| `app/(tabs)/profile.tsx`                              | Data screen — insights + heatmap                             |
| `app/(tabs)/grocery.tsx`                              | Grocery screen (hidden tab)                                  |
| `src/features/auth/store/authStore.ts`                | Auth state (session, isOnboarded, isLoading)                 |
| `src/features/auth/hooks/useEmailAuth.ts`             | Email sign-in / sign-up                                      |
| `src/stores/appStore.ts`                              | Session state (meals, workout, sleep, recovery)              |
| `src/lib/theme.ts`                                    | ALL design tokens — single source of truth                   |
| `src/lib/supabase.ts`                                 | Supabase client config                                       |
| `src/features/preferences/types/preferences.types.ts` | OnboardingDraft, MealPreferencesRow types                    |

---

## Open Questions

- [ ] What triggers a new meal plan to generate? Time-of-day? Manual refresh? Background job?
- [ ] Should `appStore` today-state be replaced entirely by TanStack Query, or kept as a UI overlay layer?
- [ ] Is `public.users` auto-populated via trigger, or does the app insert it after sign-up?
- [ ] What is the Supabase project URL? (needed to connect `src/lib/supabase.ts` — currently reads from `.env`)
- [ ] Are workout plans stored per-user or are they global templates?

---

## How to Update This File

Before switching AI tools or ending a session:

1. Update **Current Goal** — one sentence
2. Update **Current Task** — the specific file/function you're in
3. Add any new **Relevant Files** if you've opened new parts of the codebase
4. Add new **Open Questions** as they arise
5. Remove resolved Open Questions
