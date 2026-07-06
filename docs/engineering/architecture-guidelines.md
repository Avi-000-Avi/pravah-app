# Architecture Guidelines

- Keep `app/` route files thin. They compose hooks and view components; they do not own Supabase calls or domain orchestration.
- Keep each feature self-contained under `src/features/{domain}`. Shared primitives belong in `src/components` only when reused across multiple domains.
- TanStack Query is the source of truth for server-backed data. Zustand is reserved for transient UI or session-only state.
- The only typed Supabase client lives in [`src/lib/supabase.ts`](/Users/avinashtoppo/Desktop/pravah-app/src/lib/supabase.ts), backed by [`src/lib/database.types.ts`](/Users/avinashtoppo/Desktop/pravah-app/src/lib/database.types.ts).
- Prefer explicit row-to-domain mappers at feature boundaries instead of leaking raw database rows into screens.
- `src/features/onboarding` owns the multi-step draft flow. `src/features/preferences` owns persisted preference reads and future settings writes.
