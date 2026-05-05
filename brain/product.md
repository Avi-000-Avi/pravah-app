# Product — Pravah

## Overview

Pravah ("flow" in Sanskrit) is a **zero-decision fitness and nutrition companion** for health-conscious Indians. It removes daily cognitive overhead — users do not plan meals, select workouts, or calculate macros. Pravah does it. Users only act.

## Target Users

| Segment   | Profile                                                          |
| --------- | ---------------------------------------------------------------- |
| Primary   | Urban Indian adults 22–38, gym-goers or home workout enthusiasts |
| Secondary | People managing diet-related health conditions (diabetes, PCOS)  |
| Anti-user | Users who want granular calorie logging (MyFitnessPal use case)  |

## Core Problems Being Solved

1. **Decision fatigue** — users know what to do but spend energy deciding _how_. Pravah decides for them.
2. **Context switching** — separate apps for workouts, macros, sleep, and grocery. Pravah unifies them.
3. **Lack of adaptation** — static plans ignore real-world signals (bad sleep, travel, illness). Pravah adapts plans to daily biometrics.
4. **Accountability without shame** — streaks with grace days, not punitive resets.

## Key Features

- **Today screen** — single daily action card, time-aware greeting, progress ring, streak display
- **Fuel (Meals)** — pre-planned Indian meals with macro breakdown; one-tap "Ate This" logging; smart swaps with calorie-matched alternatives
- **Flow (Workout)** — guided session with set counter, live rest timer, exercise progression, auto-rest after set completion
- **Rest (Recovery)** — recovery score ring; low-sleep adaptive plan (reduces workout intensity, increases carbs); grace-day streak protection
- **Data (Insights)** — weekly consistency ring, activity heatmap, muscle volume distribution, identity reinforcement cards
- **Grocery** — auto-generated shopping list from meal plan; interactive checklist with live total price; "Add all to cart" CTA
- **Onboarding** — 6-step preference capture (diet type, fitness goal, meal count, prep time); writes to `meal_preferences` table

## Auth

- Email + password (primary, live)
- Google OAuth (secondary, dev builds only)
- Phone OTP (planned, blocked on SMS provider setup)

## Non-Goals

- We do **not** build a calorie-counting logger (users do not manually enter food)
- We do **not** support custom workout creation (plans are curated by the system)
- We do **not** build a social/community layer (no public profiles, no following)
- We do **not** support dark mode in v1
- We do **not** support tablets as a primary form factor

## Constraints

- India-first: meals are Indian (dal, roti, paneer, etc.); currency is ₹; phone inputs use +91 prefix
- Expo Go compatible for development (no native modules that require dev builds, except Google OAuth)
- Light mode only — all design tokens are warm-light
- No hardcoded values — all styling via `src/lib/theme.ts` tokens
- All Supabase data is RLS-gated by `auth.uid()` — no public reads
