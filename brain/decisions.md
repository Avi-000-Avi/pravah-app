# Decisions — Pravah

## [2026-05-10] — Converge onto one production architecture

**Decision:** Stop carrying parallel onboarding, mixed server/local sources of truth, and untyped database boundaries. Standardize on thin route files, typed Supabase access, feature-owned hooks, TanStack Query for server state, and Zustand for transient state only.

**Why:** The repo had started to drift into duplicate patterns and ambiguous ownership, which would get more expensive with every new feature.

**Consequences:** Cleanup happens as convergence, not rewrite. Existing product behavior stays intact while architecture becomes predictable.

## [2026-05-10] — Onboarding owns draft state, preferences owns persisted reads

**Decision:** `src/features/onboarding` is the only onboarding draft flow. `src/features/preferences` now owns persisted `meal_preferences` reads and future settings writes.

**Why:** The repo had two onboarding implementations and no clean ownership boundary between draft flow state and saved preference state.

**Consequences:** New onboarding work must extend `src/features/onboarding`. New settings/profile preference work must extend `src/features/preferences`.

## [2026-05-10] — Auth bootstrap moved out of the root route file

**Decision:** Keep routing in `app/_layout.tsx`, but move auth/session boot logic into `useAuthBootstrap()` and pure route resolution into `resolveProtectedRoute()`.

**Why:** The root layout had become the implicit owner of routing, session hydration, and side effects.

**Consequences:** Route behavior is easier to test and reason about, and future auth methods inherit the same boot flow.

## [2026-05-06] — Hybrid meal data model (catalog + per-user plan rows)

**Decision:** Keep `meals` as the system catalog and `user_meal_plans` as the per-user/date/slot assignment and logging table.

**Why:** It balances curated shared templates with user-specific daily state.

**Consequences:** Meal logging, swaps, and future plan generation all have a stable data model.
