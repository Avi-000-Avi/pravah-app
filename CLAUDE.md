# Pravah — Claude guidance

## Stack

| Layer           | Choice                                                              |
| --------------- | ------------------------------------------------------------------- |
| Framework       | Expo SDK 55, React Native 0.81, expo-router v4 (file-based routing) |
| Language        | TypeScript — strict + noUncheckedIndexedAccess                      |
| State           | Zustand (global), TanStack Query v5 (server state)                  |
| Backend         | Supabase (Postgres + Auth + Realtime + Storage)                     |
| Local storage   | react-native-mmkv (used by supabase auth adapter)                   |
| Analytics       | PostHog (`src/lib/analytics.ts`)                                    |
| Error tracking  | Sentry (`src/lib/monitoring.ts`)                                    |
| Package manager | pnpm — always use `pnpm`, never npm or yarn                         |

## Folder rules

```
app/               expo-router pages only — no business logic
  (auth)/          unauthenticated screens
  (onboarding)/    first-run flow
  (tabs)/          main tab navigator
src/
  features/        one folder per domain (auth, meals, workouts, …)
  lib/             shared singletons: supabase, theme, analytics, monitoring
  components/      shared primitives only (Card, Pill, SectionLabel)
  hooks/           shared custom hooks
  types/           shared TypeScript types and interfaces
supabase/
  migrations/      sequential SQL migrations — forward-only
  functions/       Edge Functions
  seed/            local seed data
```

**Feature folder convention** — each feature owns its own components, hooks, stores, and types:

```
src/features/meals/
  components/
  hooks/
  store.ts
  types.ts
```

## Design system rules

- **Always use tokens** from `src/lib/theme.ts`. Never hardcode hex values, font sizes, spacing numbers, or border radii.
- **No weight 600/700** — design only uses `400` (regular) and `500` (medium).
- **Sentence case everywhere** — UI labels, button text, section headers. No ALL CAPS except Pill/SectionLabel which apply `textTransform: uppercase` via the component.
- **Macro colours are semantic** — use `protein`/`carbs`/`fat` variants only for their respective macronutrient context; use `brand` for UI chrome.
- **Primitives** — use `Card`, `Pill`, `SectionLabel` from `src/components/`. Don't re-implement them inline.
- Never add new colour values. Extend the theme file and request design review.

## Do / don't

| Do                                                    | Don't                                                   |
| ----------------------------------------------------- | ------------------------------------------------------- |
| Use `track()` for meaningful user actions             | Don't call Supabase or PostHog directly from components |
| Throw typed errors; catch at feature boundaries       | Don't swallow errors silently                           |
| Gate all Supabase queries with RLS and `auth.uid()`   | Don't call Supabase from the client without RLS enabled |
| Use `captureError()` for unexpected exceptions        | Don't use `console.log` (warn/error are fine)           |
| Write migration SQL in `supabase/migrations/`         | Don't edit already-deployed migrations                  |
| Import types with `import type`                       | Don't mix value and type imports                        |
| Match existing patterns in the feature you're editing | Don't introduce new patterns without discussion         |

## Branching model

```
main        protected, production — only hotfix merges and release PRs
develop     integration branch — all feature work merges here first
feat/*      short-lived feature branches from develop
fix/*       bug fix branches from develop
chore/*     tooling, deps, config — from develop
hotfix/*    urgent production fixes from main, merged into both main + develop
```

Commit messages follow Conventional Commits with sentence-case subject:

```
feat: Add meal plan screen
fix: Correct calorie rounding in macro summary
chore: Upgrade expo-router to v4.1
```

## Common commands

```bash
pnpm start          # Expo dev server
pnpm typecheck      # tsc --noEmit
pnpm lint           # ESLint
pnpm lint:fix       # ESLint --fix
pnpm format         # Prettier write
pnpm format:check   # Prettier check (used in CI)
pnpm db:start       # Start local Supabase (requires supabase CLI)
pnpm db:reset       # Reset + re-seed local DB
pnpm db:migrate     # Push migrations to linked project
pnpm db:diff        # Generate migration from schema diff
```

## Environment variables

Copy `.env.example` → `.env` and fill in values before running locally.
All client-visible vars are prefixed `EXPO_PUBLIC_`.
Never commit `.env` — it is gitignored.

## Match existing patterns

Before adding a new hook, store, or utility, check if a similar one already exists in the relevant feature folder or `src/lib`. Prefer extending existing abstractions to creating parallel ones.
