# Context — Pravah

## Snapshot

```text
Project:         Pravah — India-first zero-decision fitness + nutrition app
Branch:          feat/production-cleanup
Stack:           Expo 55 · React Native 0.83.6 · TypeScript strict · expo-router
Backend:         Supabase Auth + Postgres + Edge Functions
State:           Zustand for auth/app UI state · TanStack Query for server reads/mutations
Design system:   src/lib/theme.ts is the single token source
Typed DB layer:  src/lib/database.types.ts + src/lib/supabase.ts
Testing:         Jest + jest-expo + React Native Testing Library
Package manager: pnpm
```

## Current status

- Auth boot is real again: `app/_layout.tsx` now uses `useAuthBootstrap()` plus a pure `resolveProtectedRoute()` helper.
- Email sign-up deep-links back through `app/auth-callback.tsx`.
- `src/features/onboarding` is now the only onboarding draft flow.
- `src/features/preferences` now owns persisted preference reads only.
- Meal reads and meal logging both go through typed feature hooks.
- Workout selection, exercise reads, and workout completion now go through typed feature hooks.
- Screens no longer import Supabase directly.
- CI and local quality gates include `pnpm test`.

## What is complete on this branch

- typed Supabase contract committed
- canonical onboarding store/hooks/components rebuilt
- auth sign-out and delete-account flows standardized through `useAuth`
- meal logging mutation wired to `user_meal_plans`
- workout catalog, exercises, and completion wired through `workouts`, `workout_exercises`, and `user_workout_plans`
- route protection restored to three-state session logic
- critical-path hook tests added
- engineering docs added under `docs/engineering/`

## What is still intentionally deferred

- moving grocery, recovery, workout, and insights logic out of large route files
- full hardcoded-color cleanup in older tab screens
- progressive profiling beyond the backend-backed onboarding fields

## Relevant files

- `app/_layout.tsx`
- `app/auth-callback.tsx`
- `app/(tabs)/meals.tsx`
- `app/(tabs)/profile.tsx`
- `src/features/auth/hooks/useAuth.ts`
- `src/features/auth/hooks/useAuthBootstrap.ts`
- `src/features/auth/utils/resolveProtectedRoute.ts`
- `src/features/onboarding/hooks/useOnboarding.ts`
- `src/features/preferences/hooks/usePreferences.ts`
- `src/features/meals/hooks/useMeals.ts`
- `src/features/meals/hooks/useLogMeal.ts`
- `src/features/workouts/hooks/useWorkouts.ts`
- `src/features/workouts/hooks/useTodayWorkout.ts`
- `src/features/workouts/hooks/useCompleteWorkout.ts`
- `src/lib/database.types.ts`
- `src/lib/supabase.ts`
- `src/lib/theme.ts`
- `docs/engineering/*`

## Next best work after this cleanup

1. Decompose the remaining large tab screens into feature-owned components and hooks.
2. Move the remaining workout/recovery route logic into feature-owned components and hooks.
3. Create real feature folders for grocery and insights as logic leaves route files.
4. Continue token normalization in older tab screens that still contain legacy hardcoded colors.
