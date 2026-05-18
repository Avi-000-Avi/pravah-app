# Tasks — Pravah

## Current work

- [~] Production cleanup convergence
  - [x] restore real auth bootstrap and route protection
  - [x] make `useAuth` the canonical auth write surface
  - [x] consolidate onboarding into `src/features/onboarding`
  - [x] move persisted preference reads into `src/features/preferences`
  - [x] type the Supabase client with a committed DB contract
  - [x] wire meal reads and meal logging through feature hooks
  - [x] add Jest coverage for auth, onboarding, route resolution, and meal hooks
  - [x] add `pnpm test` to CI
  - [ ] decompose remaining large tab screens
  - [ ] remove remaining legacy hardcoded colors from older tab screens
- [x] Wire real workout data from Supabase
- [x] Add typed workout hooks and completion mutation
- [x] Add workout hook + selector tests

## Next priority

- [ ] Move workout logic out of `app/(tabs)/workout.tsx`
- [ ] Move recovery logic out of `app/(tabs)/chat.tsx`
- [ ] Create real feature modules for grocery and insights as logic moves out of routes
- [ ] Add profile/settings writes for persisted preferences

## Backlog

- [ ] Enable Google OAuth in dev builds
- [ ] Enable phone OTP once SMS provider is configured
- [ ] Add forgot-password flow
- [ ] Add progressive profiling after onboarding
- [ ] Persist grocery checklist state
- [ ] Replace mock-backed today/insights data with query hooks
- [ ] Add notification flows
- [ ] Add EAS build profiles

## Completed

- [x] meals catalog schema and seed
- [x] `user_meal_plans` schema and meal logging mutation
- [x] six-step canonical onboarding flow
- [x] typed Supabase boundary
- [x] engineering docs under `docs/engineering`
- [x] CI quality gates for typecheck, lint, format, and tests
- [x] workout catalog schema, seed, query hooks, and completion mutation
