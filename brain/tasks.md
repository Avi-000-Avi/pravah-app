# Tasks — Pravah

> Keep this file current. Update status when work starts/finishes.
> Format: `- [ ]` pending · `- [~]` in progress · `- [x]` done

---

## 🔥 Current Sprint

- [~] Wire real meal data from Supabase
  - [x] Schema shipped (#7) — `public.meals` catalog + `public.user_meal_plans`
  - [ ] Build `useMeals` TanStack Query hook
  - [ ] Replace hardcoded `MEAL_DATA` in `app/(tabs)/meals.tsx` with real query
  - [ ] Build `useLogMeal` mutation against `user_meal_plans`
- [ ] Wire real workout data from Supabase (replace hardcoded `WORKOUT` object in `workout.tsx`)
- [ ] Connect onboarding store → `usePreferences.submit()` → write to `public.meal_preferences`
- [ ] Implement "Replay onboarding" properly: call `clearAuth()` + `supabase.auth.signOut()` (currently only calls `setOnboarded(false)`)

---

## 📋 Backlog

### Auth & Onboarding

- [ ] Enable Google OAuth (requires dev build + Supabase Google provider setup)
- [ ] Enable Phone OTP (requires Supabase phone provider + Twilio account)
- [ ] Add "Forgot password" flow (Supabase `resetPasswordForEmail`)
- [ ] Add email confirmation resend button in `pendingConfirmation` state
- [ ] Add profile screen: display name, avatar, sign-out, delete account

### Data & Backend

- [ ] Design `public.workouts` and `public.workout_logs` schema
- [ ] Design `public.daily_stats` schema (sleep, recovery, steps)
- [ ] Design `public.grocery_lists` schema
- [ ] Set up TanStack Query for all Supabase data fetching (first hook lands with `useMeals`)
- [ ] Add RLS policies for all new tables

### Screens

- [ ] Grocery screen: persist checklist to Supabase (currently session-only state)
- [ ] Today screen: pull real streak + progress from Supabase
- [ ] Data/Insights screen: compute heatmap from real workout_logs
- [ ] Notifications: morning workout reminder, meal logging nudges
- [ ] Push notification setup (Expo Notifications + Supabase webhook)

### Infrastructure

- [ ] Set up EAS Build profiles (development, preview, production)
- [ ] Add GitHub Actions CI: typecheck + lint on every PR
- [ ] Add Sentry DSN to `app.json` (currently monitoring.ts is a stub)
- [ ] Add PostHog project key to `.env`
- [ ] Configure `supabase/seed/` with dev seed data

### Design

- [ ] Replace placeholder grocery item photos with real image assets
- [ ] Add empty state screens (no workouts logged, no meals today)
- [ ] Add loading skeletons for data-fetching states
- [ ] Implement haptic feedback on button taps (Expo Haptics)

---

## ✅ Completed

- [x] Meals catalog + `user_meal_plans` schema with RLS, indexes, and 10-meal seed (#7)
- [x] `public.users` auto-insert trigger on `auth.users` (`handle_new_user`, security-definer) — already in migration `20260428000302`
- [x] Design system migration — "Serene Flow" tokens in `src/lib/theme.ts`
- [x] Newsreader + Manrope font loading
- [x] Custom tab bar with lavender pill active state
- [x] Today screen — rebuilt with animated hero, stat rings, streak card
- [x] Fuel/Meals screen — phase-based log flow, smart swaps, live macro totals
- [x] Flow/Workout screen — 4-phase session, elapsed timer, rest countdown ring
- [x] Rest/Recovery screen — adaptive low-sleep plan, streak calendar
- [x] Data/Insights screen — consistency ring, heatmap, muscle volume bars
- [x] Grocery screen — interactive checklist, live total, sticky CTA
- [x] Zustand `appStore` for cross-screen session state
- [x] `ProgressRing` SVG component reused across all screens
- [x] Email auth wired end-to-end (useEmailAuth + RouteGuard session listener)
- [x] Three-state RouteGuard (auth → onboarding → tabs)
- [x] GDPR account deletion edge function
- [x] Phone OTP hook built (blocked on SMS provider)
- [x] Google OAuth hook built (blocked on dev build)
- [x] MMKV storage adapter with Expo Go fallback
- [x] Husky + commitlint + lint-staged pre-commit hooks
