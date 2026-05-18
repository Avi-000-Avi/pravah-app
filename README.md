<p align="center">
  <img src="./assets/icon.png" alt="Pravah" width="96" height="96" />
</p>

<h1 align="center">Pravah</h1>

<p align="center">
  India-first zero-decision fitness and nutrition guidance with guided onboarding, meal planning, workout tracking, and production-grade engineering foundations.
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Expo-SDK%2055-000020?logo=expo&logoColor=white" />
  <img src="https://img.shields.io/badge/React%20Native-0.83-61DAFB?logo=react&logoColor=white" />
  <img src="https://img.shields.io/badge/TypeScript-strict-3178C6?logo=typescript&logoColor=white" />
  <img src="https://img.shields.io/badge/Supabase-backend-3ECF8E?logo=supabase&logoColor=white" />
</p>

---

## Screenshots

<p align="center">
  <img src="./assets/screenshots/onboarding.png" width="180" alt="Onboarding" />
  <img src="./assets/screenshots/today.png" width="180" alt="Today" />
  <img src="./assets/screenshots/today-flow.png" width="180" alt="Today — Flow" />
  <img src="./assets/screenshots/fuel.png" width="180" alt="Fuel — Meal detail" />
</p>

<p align="center">
  <img src="./assets/screenshots/flow.png" width="180" alt="Flow — Workout" />
  <img src="./assets/screenshots/rest.png" width="180" alt="Rest — Recovery" />
  <img src="./assets/screenshots/data.png" width="180" alt="Data — Insights" />
  <img src="./assets/screenshots/grocery.png" width="180" alt="Grocery" />
</p>

---

## Product focus

| Area           | What it does                                                                        |
| -------------- | ----------------------------------------------------------------------------------- |
| **Auth**       | Email + password sign-in / sign-up; Google SSO (dev build); phone OTP (coming soon) |
| **Onboarding** | 6-step guided flow that persists backend-backed meal preferences                    |
| **Meals**      | Meal catalog reads through TanStack Query plus real meal logging                    |
| **Workout**    | Guided workout surface backed by typed Supabase workout plans + exercise catalog    |
| **Recovery**   | Rest and recovery surface with workout adaptation that feeds the real workout flow  |
| **Insights**   | Progress and consistency surface, currently still mock-backed                       |
| **Grocery**    | Shopping list flow linked from the main experience                                  |
| **Profile**    | Sign out and account deletion through feature-owned auth hooks                      |

---

## Engineering principles

- `app/` owns routing, not business logic.
- `src/features/{domain}` owns domain hooks, stores, components, and mappers.
- Supabase access is centralized and typed through [`src/lib/supabase.ts`](/Users/avinashtoppo/Desktop/pravah-app/src/lib/supabase.ts) and [`src/lib/database.types.ts`](/Users/avinashtoppo/Desktop/pravah-app/src/lib/database.types.ts).
- TanStack Query owns server state. Zustand is reserved for transient UI and session state.
- [`src/lib/theme.ts`](/Users/avinashtoppo/Desktop/pravah-app/src/lib/theme.ts) is the single token source for new styling work.

---

## Tech stack

| Layer           | Choice                                                   |
| --------------- | -------------------------------------------------------- |
| Framework       | Expo SDK 55, expo-router                                 |
| Language        | TypeScript — strict + `noUncheckedIndexedAccess`         |
| UI              | React Native + custom design system (`src/lib/theme.ts`) |
| Global state    | Zustand (MMKV-backed for auth only)                      |
| Server state    | TanStack Query v5                                        |
| Backend         | Supabase — Auth, Postgres, Edge Functions                |
| Local storage   | react-native-mmkv                                        |
| Analytics       | PostHog                                                  |
| Error tracking  | Sentry                                                   |
| Package manager | pnpm                                                     |

---

## Getting started

### Prerequisites

- Node.js 20+
- pnpm 9+
- [Expo Go](https://expo.dev/go) or a device/simulator for dev builds
- A [Supabase](https://supabase.com) project

### 1. Clone and install

```bash
git clone https://github.com/Avi-000-Avi/pravah-app.git
cd pravah-app
pnpm install
```

### 2. Set up environment variables

```bash
cp .env.example .env
```

Fill in your values:

```env
EXPO_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
EXPO_PUBLIC_POSTHOG_API_KEY=your-posthog-key
EXPO_PUBLIC_SENTRY_DSN=your-sentry-dsn
```

### 3. Apply database migrations

Use the files in [`supabase/migrations/`](/Users/avinashtoppo/Desktop/pravah-app/supabase/migrations) through your normal Supabase deployment flow. The current app expects:

- `users`
- `meal_preferences`
- `meals`
- `user_meal_plans`
- `workouts`
- `workout_exercises`
- `user_workout_plans`

### 4. Start the app

```bash
pnpm start
```

Scan the QR code with Expo Go, or press `i` / `a` for a simulator.

> **Note:** Google SSO requires a dev build (`expo run:ios` / `expo run:android`). Email auth and onboarding work in Expo Go.

---

## Project structure

```text
app/                    Expo Router route files only
  (auth)/               unauthenticated screens
  (onboarding)/         canonical 6-step onboarding flow
  (tabs)/               main app surfaces

src/
  components/           shared primitives only
  features/
    auth/               auth flows, bootstrap, route resolution
    meals/              meal queries, logging mutation, row mappers
    onboarding/         canonical draft flow + submit behavior
    preferences/        persisted preference read models
    workouts/           workout queries, completion mutation, selection logic
  lib/                  typed supabase client, theme, analytics, monitoring
  stores/               app-wide transient state only

supabase/
  migrations/           forward-only SQL migrations
  functions/            Edge Functions
  seed/                 local seed data

docs/
  engineering/          architecture, standards, testing, production-readiness

brain/
  *.md                  AI/session memory; not the primary human engineering source
```

---

## Common commands

```bash
pnpm start          # Start Expo dev server
pnpm ios            # Run on iOS simulator (dev build)
pnpm android        # Run on Android emulator (dev build)
pnpm test           # Jest + React Native Testing Library
pnpm typecheck      # tsc --noEmit
pnpm lint           # ESLint
pnpm lint:fix       # ESLint --fix
pnpm format         # Prettier write
pnpm format:check   # Prettier check
pnpm db:start       # Start local Supabase
pnpm db:reset       # Reset + re-seed local DB
pnpm db:migrate     # Push migrations to linked project
```

---

## Quality gates

- `pnpm typecheck`
- `pnpm lint`
- `pnpm format:check`
- `pnpm test`

CI runs the same checks on pushes and pull requests.

---

## Branching model

```text
main        protected — production releases and hotfixes only
develop     integration — all feature work merges here first
feat/*      feature branches from develop
fix/*       bug fix branches from develop
chore/*     tooling / config from develop
hotfix/*    urgent fixes from main, merged into main + develop
```

Commits follow [Conventional Commits](https://www.conventionalcommits.org/) with sentence-case subjects.

---

## Contributing

1. Branch off `develop` — `feat/your-feature` or `fix/your-fix`
2. Keep route files thin and put feature logic in `src/features/{domain}`
3. Open a PR against `develop`
4. `pnpm typecheck`, `pnpm lint`, `pnpm format:check`, and `pnpm test` must pass

---

<p align="center">Built with ❤️ using Expo and Supabase</p>
