<p align="center">
  <img src="./assets/icon.png" alt="Pravah" width="96" height="96" />
</p>

<h1 align="center">Pravah</h1>

<p align="center">
  Your personal nutrition and fitness companion — personalised meal plans, workout tracking, and AI-powered guidance, all in one place.
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Expo-SDK%2055-000020?logo=expo&logoColor=white" />
  <img src="https://img.shields.io/badge/React%20Native-0.83-61DAFB?logo=react&logoColor=white" />
  <img src="https://img.shields.io/badge/TypeScript-strict-3178C6?logo=typescript&logoColor=white" />
  <img src="https://img.shields.io/badge/Supabase-backend-3ECF8E?logo=supabase&logoColor=white" />
</p>

---

## Features

| Area           | What it does                                                                        |
| -------------- | ----------------------------------------------------------------------------------- |
| **Auth**       | Email + password sign-in / sign-up; Google SSO (dev build); phone OTP (coming soon) |
| **Onboarding** | 4-step flow — diet type, fitness goal, meal count, max prep time                    |
| **Meals**      | Personalised meal plans based on your preferences                                   |
| **Workouts**   | Track sessions and monitor progress                                                 |
| **Grocery**    | Auto-generated shopping lists from your meal plan                                   |
| **Pantry**     | Log what you have at home to reduce waste                                           |
| **Insights**   | Weekly nutrition and fitness summaries                                              |
| **AI Chat**    | Ask anything — powered by an AI assistant                                           |
| **Profile**    | Edit preferences, sign out, or delete your account                                  |

---

## Tech stack

| Layer           | Choice                                                   |
| --------------- | -------------------------------------------------------- |
| Framework       | Expo SDK 55, expo-router v4 (file-based routing)         |
| Language        | TypeScript — strict + `noUncheckedIndexedAccess`         |
| UI              | React Native + custom design system (`src/lib/theme.ts`) |
| Global state    | Zustand (with MMKV persistence for auth)                 |
| Server state    | TanStack Query v5                                        |
| Backend         | Supabase — Postgres, Auth, Realtime, Storage             |
| Local storage   | react-native-mmkv                                        |
| Analytics       | PostHog                                                  |
| Error tracking  | Sentry                                                   |
| Package manager | pnpm                                                     |

---

## Getting started

### Prerequisites

- Node.js 20+
- pnpm 9+
- [Expo Go](https://expo.dev/go) (for development) or a simulator/device for dev builds
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

### 3. Apply the database migration

In your Supabase dashboard → **SQL Editor**, paste and run:

```
supabase/migrations/20260428000302_auth_and_preferences.sql
```

### 4. Start the dev server

```bash
pnpm start
```

Scan the QR code with Expo Go, or press `i` / `a` to launch in a simulator.

> **Note:** Google SSO requires a dev build (`expo run:ios` / `expo run:android`). It shows a graceful error in Expo Go.

---

## Project structure

```
app/                    expo-router pages (no business logic)
  (auth)/               unauthenticated screens
  (onboarding)/         first-run flow (4 steps)
  (tabs)/               main tab navigator

src/
  features/             one folder per domain
    auth/               sign-in, sign-up, session management
    preferences/        onboarding store, hooks, types
    meals/              meal plan screens and hooks
    workouts/           workout tracking
    grocery/            shopping list generation
    pantry/             ingredient inventory
    insights/           weekly summaries
    ai/                 AI chat integration
  components/           shared primitives (Card, Pill, SectionLabel)
    onboarding/         onboarding-specific components
  lib/                  singletons: supabase, theme, analytics, monitoring
  hooks/                shared custom hooks
  types/                shared TypeScript types

supabase/
  migrations/           forward-only SQL migrations
  functions/            Edge Functions
  seed/                 local seed data
```

---

## Common commands

```bash
pnpm start          # Start Expo dev server
pnpm ios            # Run on iOS simulator (dev build)
pnpm android        # Run on Android emulator (dev build)
pnpm typecheck      # tsc --noEmit
pnpm lint           # ESLint
pnpm lint:fix       # ESLint --fix
pnpm format         # Prettier write
pnpm db:start       # Start local Supabase
pnpm db:reset       # Reset + re-seed local DB
pnpm db:migrate     # Push migrations to linked project
```

---

## Branching model

```
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
2. Keep changes focused; open a PR against `develop`
3. `pnpm typecheck && pnpm lint` must pass with zero errors

---

<p align="center">Built with ❤️ using Expo and Supabase</p>
