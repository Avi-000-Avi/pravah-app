# Pravah — Claude guidance

## Stack

| Layer           | Choice                                                          |
| --------------- | --------------------------------------------------------------- |
| Framework       | Expo SDK 55, React Native 0.83.6, expo-router                   |
| Language        | TypeScript strict + `noUncheckedIndexedAccess`                  |
| State           | Zustand for transient/app state, TanStack Query for server data |
| Backend         | Supabase (Auth, Postgres, Edge Functions)                       |
| Local storage   | `react-native-mmkv` through `src/lib/storage.ts`                |
| Analytics       | PostHog via `src/lib/analytics.ts`                              |
| Error tracking  | Sentry via `src/lib/monitoring.ts`                              |
| Package manager | pnpm only                                                       |

## Architecture rules

- `app/` owns routing only. No direct Supabase calls, data mapping, or domain orchestration in route files.
- `src/features/{domain}` owns its hooks, store, components, and mappers.
- `src/features/onboarding` is the only onboarding draft flow.
- `src/features/preferences` owns persisted preference reads and future settings writes.
- `src/lib/supabase.ts` is the only Supabase client and is typed by `src/lib/database.types.ts`.
- TanStack Query is the source of truth for server-backed data. Zustand is for transient UI/session concerns only.
- New shared UI belongs in `src/components/` only if it is genuinely cross-domain.

## Folder rules

```text
app/
  (auth)/
  (onboarding)/
  (tabs)/
src/
  components/      shared primitives only
  features/        auth, meals, onboarding, preferences, future domains
  lib/             theme, supabase, analytics, monitoring, storage
  stores/          app-wide transient state only
docs/
  engineering/
brain/
```

Avoid reviving `src/hooks` or `src/types` as generic dumping grounds.

## Design system rules

- Use tokens from `src/lib/theme.ts`. Do not add new app colors, spacing, radii, or font constants elsewhere.
- Keep copy in sentence case.
- Prefer shared primitives such as `Card`, `Pill`, `PrimaryButton`, and `SectionLabel` before inventing one-off UI patterns.
- If a new semantic token is needed, add it to `theme.ts` first.

## Data and observability rules

- Feature hooks own Supabase access.
- Unexpected errors should reach `captureError()`.
- Meaningful user actions should reach `track()`.
- Do not log or send PII to analytics.
- Prefer explicit database-row-to-domain mappers at feature boundaries.

## Testing rules

- Prefer direct imports of the hook or module under test instead of wide feature barrels.
- Mock Supabase at the feature boundary.
- Keep tests focused on auth flows, onboarding persistence, route resolution, and data hooks before building broader UI coverage.

## Commands

```bash
pnpm start
pnpm test
pnpm typecheck
pnpm lint
pnpm format:check
pnpm db:start
pnpm db:reset
pnpm db:migrate
```

## Source of truth

- Code and `docs/engineering/*` are the primary engineering source of truth.
- `brain/*` is AI/session memory and handoff context, not the authoritative architecture spec.
