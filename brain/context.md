# Context — Pravah

> **This is the file you paste into AI tools.** Keep it current. Update before every context switch.
> Optimised for one-shot pasting — concise, no fluff.

---

## Snapshot

```
Project:          Pravah — zero-decision fitness + nutrition app (India-first)
Stack:            Expo 55 · React Native 0.81 · TypeScript strict · expo-router v4
Backend:          Supabase (Postgres + Auth + Edge Functions) — project ref: ktjzgggvjocuuxeoxbny
State:            Zustand (authStore + MMKV persist · appStore session-only)
Server state:     TanStack Query v5 — first hook (useMeals) just landed in feat/use-meals-hook
Package manager:  pnpm — never npm/yarn
Design system:    Serene Flow — src/lib/theme.ts (ALL values are tokens, never hardcode)
Fonts:            Newsreader (display) · Manrope (UI/body)
Container runtime: NOT installed locally — supabase local stack needs OrbStack or Docker Desktop
```

---

## Current Goal

Sprint slice: **Wire real meal data from Supabase**.

Status: 🟢 schema done (#7), 🟢 hook done (PR open / not yet merged: `feat/use-meals-hook`), 🔴 mutation pending.

---

## Current Task

`feat/use-meals-hook` is pushed. PR not yet opened (gh CLI not authenticated in this env).
Open at: https://github.com/Avi-000-Avi/pravah-app/pull/new/feat/use-meals-hook

After it merges, the next task is `useLogMeal` mutation against `public.user_meal_plans`.

---

## In-Flight Branches

| Branch                | State             | Notes                                                                                                                                                                                                                                                                                    |
| --------------------- | ----------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `feat/use-meals-hook` | pushed, no PR yet | Adds `src/features/meals/{types,hooks,index}.ts` + wires `useMeals` into `app/(tabs)/meals.tsx` with loading/error/empty states. **Has uncommitted `supabase/config.toml` change** adding `[db.seed]` block — should be committed before opening PR or moved to a separate chore commit. |

Latest develop: `18f1cfa Feat/brain ai system (#8)` → `6d4573a meals-schema (#7)` → `4c6a266 email-auth (#6)` → `5491866 design-system (#5)`.

---

## Remote Supabase State (just reconciled)

- Project ref: `ktjzgggvjocuuxeoxbny` (Tokyo region, `aws-1-ap-northeast-1`)
- Migration history reconciled via `supabase migration repair` — local & remote now match for `20260426022855`, `20260428000302`, `20260506000000`.
- `public.meals` exists and is seeded with 10 sample Indian meals (`supabase/seed/01_meals.sql`).
- `public.user_meal_plans` exists, empty (no plan generator yet).
- `auth.users INSERT → handle_new_user()` trigger active — auto-creates `public.users` rows.
- `[db.seed]` block enabled in `supabase/config.toml`; future devs run `supabase db push --include-seed` to populate the catalog locally too.

---

## Known Bugs / Pending Issues

1. **Email confirmation deep link is broken.** Tapping the confirm link in the email redirects to `http://localhost:3000/#access_token=...` — Supabase's default Site URL. App is mobile, so this fails with `ERR_CONNECTION_REFUSED`. Two paths:
   - **Quick (no code):** Supabase Dashboard → Auth → Providers → Email → toggle OFF "Confirm email" while developing.
   - **Proper (small PR):** `feat/email-confirmation-deep-link` — pass `emailRedirectTo: Linking.createURL('/auth-callback')` in `useEmailAuth.signUp`, add `app/auth-callback.tsx` that calls `supabase.auth.setSession()`, configure Site URL = `pravah://` and Redirect URLs to whitelist `pravah://**` + `exp://**`.
2. **`expo-env.d.ts` has 1 pre-existing prettier error** on develop. Not introduced by any open branch.
3. **`PRAVAH_DESIGN_SYSTEM_ANALYSIS.md`** — stale untracked file at repo root, can be deleted.
4. **`expo-dev-client` is installed**, so `pnpm start` expects a dev build. Use `pnpm start -- --go` for Expo Go (which is what `pnpm start` actually does — `--go` is in the script already).

---

## Relevant Architecture

- Route guard: `app/_layout.tsx` → `RouteGuard` owns all navigation. Three-state: `!session → /(auth)/email`, `session+!onboarded → /(onboarding)/welcome` (or step-1 — verify), `session+onboarded → /(tabs)`.
- Auth: `src/features/auth/` — `useEmailAuth`, `useGoogleSSO`, `usePhoneOTP` (built, not active).
- Session source of truth: `supabase.auth` runtime; `authStore.session` (MMKV) mirrors it for sync cold-start.
- Today UI state: `src/stores/appStore.ts` — Zustand, NO persist, intentionally resets each app launch.
- Onboarding draft: `src/features/preferences/store/onboardingStore.ts` — no persist, cleared on submit.
- Supabase client: `src/lib/supabase.ts` — MMKV auth adapter, `autoRefreshToken: true`, `detectSessionInUrl: false` (mobile needs custom URL handler if email confirm is fixed).
- **First TanStack Query hook lives at `src/features/meals/hooks/useMeals.ts`** — sets the precedent for future server-state hooks. queryKey is a const tuple, queryFn throws on error, `captureError()` runs for unexpected failures, filters are part of queryKey for auto-invalidation.

---

## Patterns to Follow (STRICT — see brain/patterns.md for full rules)

1. **Never call Supabase directly from screens** — wrap in hooks inside `src/features/{domain}/hooks/`.
2. **Always use theme tokens** from `src/lib/theme.ts` — never hardcode hex/spacing/radii.
3. **Screens are dumb** — no business logic; import from feature hooks only.
4. **Errors surface as strings** — hooks expose `error`; screens display it; `captureError()` for unexpected exceptions.
5. **State machines over booleans** — discriminated unions: `type Phase = 'ready' | 'logging' | 'logged'`.
6. **`import type`** for all type imports — never mix value and type imports.
7. **Postgres `numeric` columns come back as strings** from supabase-js — coerce to number in the hook's queryFn.
8. **`MEALS` is now derived from `useMeals()`**, not a module-level constant. `buildTodayPlan(catalog)` picks one row per slot in canonical order. Same shape as before, so screen logic untouched.

---

## Relevant Files

| File                                                   | Purpose                                                      |
| ------------------------------------------------------ | ------------------------------------------------------------ |
| `app/_layout.tsx`                                      | Root layout + RouteGuard (session listener, 3-state routing) |
| `app/(tabs)/meals.tsx`                                 | Fuel screen — now uses `useMeals` + `buildTodayPlan`         |
| `app/(tabs)/workout.tsx`                               | Flow screen (still hardcoded — next domain to wire)          |
| `app/(tabs)/chat.tsx`                                  | Rest screen                                                  |
| `app/(tabs)/profile.tsx`                               | Data screen                                                  |
| `app/(tabs)/grocery.tsx`                               | Grocery (hidden tab, `href: null`)                           |
| `src/features/meals/hooks/useMeals.ts`                 | **First TanStack Query hook — pattern reference**            |
| `src/features/meals/types.ts`                          | `Meal`, `MealSlot`, `DietType`, `UseMealsFilters`            |
| `src/features/meals/index.ts`                          | Barrel export                                                |
| `src/features/auth/hooks/useEmailAuth.ts`              | Email sign-in/up — needs `emailRedirectTo` for deep-link fix |
| `src/features/auth/store/authStore.ts`                 | Auth state                                                   |
| `src/stores/appStore.ts`                               | Session-only UI state                                        |
| `src/lib/theme.ts`                                     | ALL design tokens — single source of truth                   |
| `src/lib/supabase.ts`                                  | Supabase client config                                       |
| `src/lib/monitoring.ts`                                | `captureError()` Sentry wrapper                              |
| `supabase/migrations/20260506000000_meals_catalog.sql` | Meals schema                                                 |
| `supabase/seed/01_meals.sql`                           | 10 sample Indian meals                                       |
| `supabase/config.toml`                                 | Has uncommitted `[db.seed]` block addition                   |

---

## Sprint backlog (from brain/tasks.md)

- [~] Wire real meal data — schema ✅, useMeals ✅, **useLogMeal mutation pending**
- [ ] Wire real workout data
- [ ] Connect onboarding store → `usePreferences.submit()` → `meal_preferences`
- [ ] Fix "Replay onboarding" → call `clearAuth()` + `supabase.auth.signOut()`
- [ ] Fix email-confirmation deep link

---

## Next Recommended Step

**`feat/log-meal-mutation`** — `useLogMeal({ mealId, slot, date })` that upserts into `public.user_meal_plans` with `is_logged: true, logged_at: now()`. Replaces the local-only `setMealLogged()` call in the Fuel screen's phase machine with a real DB write. Pattern: copy the queryFn-throws + captureError style from `useMeals.ts`, use `useMutation`, invalidate `[MEALS_QUERY_KEY]` cache on success.

Alternative tight wins:

- `feat/replay-onboarding-signout` — 5-minute fix to make the dev "Replay onboarding" button properly sign out.
- `feat/onboarding-preferences-write` — wire `usePreferences.submit()` to actually INSERT into `meal_preferences` (currently believed-but-unverified to be wired).

---

## How to Continue (handoff to next AI tool)

1. Read this file in full.
2. Read `brain/patterns.md` for the strict coding rules.
3. Read `brain/architecture.md` for the DB schema (especially `meal_slot` enum + `meals`/`user_meal_plans` columns).
4. Check `git status` and `git log --oneline develop..HEAD` to see in-flight changes.
5. Commit the uncommitted `supabase/config.toml` change before doing anything else (or revert it if you disagree).
6. Pick a task from the sprint backlog above; for new schema changes, branch off `develop`.
