# Decisions — Pravah

> Log every major architectural or product decision here. Minor implementation details do not need entries.
> Format: newest first.

---

## Template

```
## [YYYY-MM-DD] — Decision title

**Decision:** What was decided.
**Context:** Why this decision needed to be made.
**Options considered:**
  - Option A — pros/cons
  - Option B — pros/cons
**Final choice:** Which option and why.
**Consequences:** What this means going forward / what it closes off.
```

---

## [2026-05-05] — Wire email auth via RouteGuard session listener

**Decision:** Add `supabase.auth.onAuthStateChange` listener and `getSession()` boot call inside `RouteGuard` in `app/_layout.tsx`. Expand route guard from two-state to three-state (`!session` → auth, `session+!onboarded` → onboarding, `session+onboarded` → tabs).

**Context:** Auth infrastructure (hooks, screens, store, Supabase client) was fully built but disconnected. The route guard only checked `isOnboarded`, so auth screens were unreachable from the navigation flow.

**Options considered:**

- A: Wire in RouteGuard (single place, reacts to all auth events) — chosen
- B: Wire in each auth screen individually (more boilerplate, harder to maintain)
- C: Use a dedicated `useAuthInit()` hook called at root (adds indirection for minimal gain)

**Final choice:** Option A — one `useEffect` in RouteGuard owns the full auth lifecycle.

**Consequences:** All future auth methods (Google, phone OTP) automatically propagate via the same `onAuthStateChange` listener with no additional wiring required.

---

## [2026-05-05] — Serene Flow design system migration

**Decision:** Replace all design tokens in `src/lib/theme.ts` with the "Serene Flow" system (Material Design 3 warm palette, Newsreader + Manrope fonts). Rebuild all 5 tab screens to match the exported Stitch HTML.

**Context:** Original screens used Syne/Urbanist fonts and placeholder styling. A Google Stitch export provided pixel-perfect HTML reference for all screens.

**Options considered:**

- A: Incremental migration (one screen at a time) — lower risk, slower
- B: Full replacement in one PR — higher risk, consistent output

**Final choice:** Option B — consistency of the design system is more important than minimising diff size. Token file is the single change point.

**Consequences:** All onboarding screens inherit new tokens automatically. Any new screen must use `theme.ts` tokens — hardcoding is banned.

---

## [2026-05-05] — Grocery as hidden tab route

**Decision:** Grocery screen lives at `app/(tabs)/grocery.tsx` with `href: null` in the tab layout, making it a registered route (accessible via `router.push`) but invisible in the tab bar.

**Context:** Design has 5 visible tabs (Today/Fuel/Flow/Rest/Data). Grocery is accessed via a card tap on the Today screen. Options were: (a) separate route group `app/(grocery)/`, (b) modal, (c) hidden tab.

**Options considered:**

- A: `app/(grocery)/` route group — requires new Stack layout, more files
- B: Modal presentation — wrong interaction pattern; grocery is a full screen
- C: Hidden tab (`href: null`) — zero extra layout files, same navigation API

**Final choice:** Option C — simplest solution that shares the tab layout shell.

**Consequences:** Grocery cannot be deep-linked directly to a URL without removing `href: null`. Acceptable for v1.

---

## [2026-05-05] — Cross-screen state via Zustand appStore (no persistence)

**Decision:** Create `src/stores/appStore.ts` as a session-only Zustand store (no MMKV persistence) for today's meals/workout/sleep/recovery data.

**Context:** Multiple tab screens (Today, Meals, Workout, Recovery) needed to share the same live state (e.g., marking a workout done on the Workout screen should update the Today screen chip).

**Options considered:**

- A: Local state + prop drilling — doesn't work across tabs
- B: Zustand with MMKV persistence — too heavy; "today" data should reset each session
- C: Zustand session-only — clean reset on app restart, simple

**Final choice:** Option C. Persistence will be added when we wire real Supabase data.

**Consequences:** All today data resets on app kill. This is intentional for v1 (mocked data). When real data is wired, this store will either be replaced by TanStack Query or have selective persistence added.

---

## [2026-05-05] — Email auth as primary, phone OTP deferred

**Decision:** Email + password is the active sign-in path. Phone OTP (`usePhoneOTP`) is built but blocked on SMS provider setup.

**Context:** SMS providers (Twilio) require business verification and cost per message. Email is free and unblocked.

**Options considered:**

- A: Phone-first (Indian users prefer OTP) — blocked by SMS infra
- B: Google-first — requires dev build, not Expo Go compatible
- C: Email-first, phone later — unblocked immediately

**Final choice:** Option C. `usePhoneOTP` is implemented and ready; just needs Supabase phone provider configured.

**Consequences:** Indian users may find email auth slightly unfamiliar. UX should be tested at launch.

---

## [2026-05-05] — MMKV as storage adapter for both Supabase and Zustand persist

**Decision:** Use `react-native-mmkv` as the storage backend for both Supabase's auth session and Zustand's `persist` middleware. Fallback to an in-memory Map in Expo Go / web.

**Context:** `AsyncStorage` is the default but has performance issues and is not synchronous. MMKV is synchronous and 10x faster.

**Options considered:**

- A: AsyncStorage — default, widely supported, async
- B: MMKV — sync, fast, requires JSI (not available in all environments)
- C: SecureStore — good for tokens but async and limited to small payloads

**Final choice:** Option B with in-memory fallback (`src/lib/storage.ts`).

**Consequences:** Session is available synchronously on cold start — RouteGuard can read it before the first render cycle.

---

## [2026-05-06] — Hybrid meal data model (catalog + per-user plan rows)

**Decision:** Model meals as two tables.

- `public.meals` — system-curated global catalog of meal templates (no `user_id`, read-only for any authenticated user, service-role-only writes).
- `public.user_meal_plans` — per-user assignments of a meal template to a `(plan_date, meal_slot)` with full owner-only CRUD.

`UNIQUE (user_id, plan_date, meal_slot)` enforces one meal per slot per day.

**Context:** Hardcoded meal arrays in `meals.tsx` had to move to Supabase. Three viable shapes were on the table.

**Options considered:**

- A: Global templates + `user_meal_logs` only (no per-user assignment) — clean but loses the "smart-swap" interaction; the catalog row is the source of truth and per-day variation can't be expressed.
- B: Per-user generated `meal_plans` — every meal is its own row owned by a user; needs a generator algorithm before any meal renders, and duplicates the same template thousands of times across users.
- C: Hybrid — chosen.

**Final choice:** Option C. Aligns with Pravah's "plans are curated by the system" non-goal (users do not author meals), while still letting each user's daily plan be its own mutable row that can be logged/swapped/skipped without mutating the shared catalog.

**Consequences:**

- Catalog edits go through Supabase Studio (no client-side mutation policies on `public.meals`). A simple admin tool may be needed once the catalog grows.
- Smart-swap implementation just rewrites the `meal_id` on the existing `user_meal_plans` row — no history kept. If history becomes a requirement, the unique key needs `(user_id, plan_date, meal_slot, version)`.
- A future plan-generator service will populate `user_meal_plans` daily from `meal_preferences`. That algorithm is its own design problem and is explicitly out of scope of #7.
- Shipped in PR #7 (`feat: Add meals catalog and user_meal_plans schema`), seeded with 10 sample Indian meals.
