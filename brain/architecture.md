# Architecture — Pravah

## Top-level shape

```text
app/
  route files only
src/
  components/   shared primitives only
  features/     domain-owned logic
  lib/          typed singletons and cross-cutting concerns
  stores/       app-wide transient state
supabase/
  migrations/
  functions/
  seed/
```

## Runtime boundaries

- `app/_layout.tsx` boots fonts, analytics, monitoring, and auth routing.
- `useAuthBootstrap()` owns session hydration plus onboarding-status checks.
- `resolveProtectedRoute()` is a pure helper for three-state auth routing.
- `src/features/onboarding` owns the six-step draft flow and submit behavior.
- `src/features/preferences` owns persisted preference reads and later settings writes.
- `src/features/meals` owns meal row mapping, meal reads, and meal logging mutation.

## State model

### Zustand

- `authStore`
  - session mirror
  - `isOnboarded`
  - auth loading flag
- `appStore`
  - transient, app-session-only UI state for non-server-backed surfaces

### TanStack Query

- server-backed reads and writes
- currently used for meals and persisted preferences
- future source of truth for workout, grocery, and insights domains

## Supabase boundary

- single client: `src/lib/supabase.ts`
- single committed type contract: `src/lib/database.types.ts`
- row mapping happens in features, not in route files
- route files do not import Supabase directly

## Current database model

### Enums

```sql
diet_type      = vegetarian | non_vegetarian | vegan | eggetarian
fitness_goal   = fat_loss | muscle_gain | maintenance
cooking_mode   = i_cook | someone_cooks_for_me | mix
meal_slot      = breakfast | lunch | dinner | snack
```

### Core tables

- `users`
  - profile row created from `auth.users`
- `meal_preferences`
  - onboarding-backed meal defaults
  - presence of a row indicates onboarding complete
- `meals`
  - global meal catalog
- `user_meal_plans`
  - one row per user/date/slot with meal assignment and logging state

## Auth flow

```text
app launch
  -> load fonts
  -> useAuthBootstrap()
  -> supabase.auth.getSession()
  -> mirror session into authStore
  -> check meal_preferences existence
  -> route:
       no session               -> /(auth)/email
       session + not onboarded  -> /(onboarding)/welcome
       session + onboarded      -> /(tabs)
```

## Onboarding flow

```text
welcome
  -> step-1 diet type
  -> step-2 goal
  -> step-3 meal count
  -> step-4 prep time
  -> step-5 review
  -> step-6 submit

submit
  -> upsert meal_preferences
  -> set authStore.isOnboarded = true
  -> track onboarding_completed
  -> reset draft store
  -> route to /(tabs)
```

## Next architectural evolution

- extract the remaining large tab screens into feature-owned components/hooks
- create real `grocery` and `insights` feature folders when logic leaves route files
- replace mock-backed tab data with typed query hooks one domain at a time
