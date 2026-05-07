# Patterns — Pravah

> This file is the law. All AI tools and developers must follow these patterns exactly.
> Never introduce a new pattern without updating this file first.

---

## Naming Conventions

| Thing                   | Convention                           | Example                               |
| ----------------------- | ------------------------------------ | ------------------------------------- |
| React components        | PascalCase                           | `ProgressRing`, `PravahTabBar`        |
| Hooks                   | camelCase, `use` prefix              | `useEmailAuth`, `useAppStore`         |
| Stores                  | camelCase, `Store` suffix            | `authStore`, `appStore`               |
| Types/Interfaces        | PascalCase                           | `AuthState`, `OnboardingDraft`        |
| Type imports            | `import type` — always               | `import type { Session } from '...'`  |
| Files (components)      | PascalCase.tsx                       | `ProgressRing.tsx`                    |
| Files (hooks)           | camelCase.ts                         | `useEmailAuth.ts`                     |
| Files (stores)          | camelCase.ts                         | `authStore.ts`                        |
| Route files             | lowercase (expo-router)              | `email.tsx`, `step-1.tsx`             |
| Constants               | UPPER_SNAKE                          | `MIN_PASSWORD_LENGTH`, `HEATMAP`      |
| Enum-like literals      | lower snake string union             | `'fat_loss' \| 'muscle_gain'`         |
| CSS-in-RN style objects | `st` or `styles` (StyleSheet.create) | `const st = StyleSheet.create({...})` |

---

## UI Copy Rules

- **Sentence case everywhere** — "Sign in", not "Sign In" or "SIGN IN"
- **Label-caps** are applied by components (`Pill`, `SectionLabel`) via `textTransform: 'uppercase'` internally — do not uppercase in the string itself
- No marketing fluff in UI strings — be direct: "Ate this", not "I've consumed this meal"

---

## Folder Structure Rules

```
src/features/{domain}/
  components/     domain-specific UI (NOT shared primitives)
  hooks/          all data-fetching and mutation hooks
  store/          Zustand stores for this domain
  types/          TypeScript types specific to this domain
  index.ts        barrel export — only export what other features need
```

- `src/components/` is for **shared primitives only** (`Card`, `Pill`, `PrimaryButton`, `ProgressRing`)
- `app/` contains **route files only** — no business logic, no Supabase calls
- `src/lib/` contains singletons (`supabase`, `theme`, `fonts`, `analytics`, `monitoring`, `storage`)
- Never create a file in `src/` root — it must live in a subfolder

---

## Design Token Rules (STRICT)

```ts
// ✅ Correct
backgroundColor: colors.rose;
borderRadius: radii.card;
fontFamily: fonts.display;
fontSize: typography.size.base;
paddingHorizontal: spacing.gutter;

// ❌ Wrong — never hardcode
backgroundColor: '#DC8282';
borderRadius: 24;
fontSize: 14;
paddingHorizontal: 16;
```

All tokens live in `src/lib/theme.ts`. Never add a new color to any other file.
If a new color is needed, add it to `theme.ts` first and document it here.

### Color Semantics

| Token              | Use                                             |
| ------------------ | ----------------------------------------------- |
| `colors.rose`      | Primary CTA buttons, active indicators          |
| `colors.lavender`  | Active tab pill, info chips, card backgrounds   |
| `colors.mint`      | Growth / fitness / success rings and indicators |
| `colors.sky`       | Recovery / sleep / info rings                   |
| `colors.eggplant`  | Text/icon on lavender backgrounds               |
| `colors.tonal`     | Ring tracks, disabled backgrounds, borders      |
| `colors.warmBrown` | Secondary text, chevrons, focus borders         |
| `colors.primary`   | Brand maroon — overline text, section structure |
| `colors.surface`   | Default card background                         |
| `colors.bg`        | Page background                                 |

### Font Semantics

| Token                  | Use                                                       |
| ---------------------- | --------------------------------------------------------- |
| `fonts.display`        | Newsreader SemiBold — section headers, card titles        |
| `fonts.displayItalic`  | Newsreader Italic — wordmarks, editorial callouts         |
| `fonts.displayRegular` | Newsreader Regular — greeting text                        |
| `fonts.ui`             | Manrope Bold — stat numbers, tab labels                   |
| `fonts.uiSemi`         | Manrope SemiBold — action links, emphasis                 |
| `fonts.body`           | Manrope Regular — body copy, subtitles                    |
| `fonts.bodySemi`       | Manrope SemiBold — list item titles                       |
| `fonts.bodyBold`       | Manrope Bold — button labels, prices                      |
| `fonts.label`          | Manrope Bold — overlines (always uppercase via component) |
| `fonts.statsThin`      | Manrope ExtraLight — large metric numbers (ring centers)  |

---

## State Management Pattern

Three layers, each with a distinct scope:

```
authStore (Zustand + MMKV persist)
  → persists across app restarts
  → holds: session, isOnboarded, isLoading
  → mutated ONLY by: RouteGuard (session sync), onboarding finish, sign-out

appStore (Zustand, session-only — NO persist)
  → lives only for the current session
  → holds: today.meals, today.workout, today.sleep, today.recoveryScore, user.streak
  → mutated by: Meals, Workout, Recovery screens

onboardingStore (Zustand, NO persist)
  → lives only while the onboarding flow is open
  → cleared on submit success or sign-out
  → holds: the 4-field OnboardingDraft

TanStack Query (server state)
  → for any data that comes FROM Supabase and needs caching/refetch
  → not yet wired (TODO as real data replaces mock state)
```

**Rule**: Do not add persistence to `appStore`. Session data resets on app restart — this is intentional.

---

## Supabase / Data Access Pattern

```ts
// ✅ Correct — hook abstracts Supabase
function MyScreen() {
  const { signIn } = useEmailAuth();
}

// ❌ Wrong — direct Supabase call from screen
function MyScreen() {
  await supabase.auth.signInWithPassword(...)
}
```

- All Supabase calls live in `src/features/{domain}/hooks/`
- Errors are caught in hooks and surfaced as typed error strings — screens only read `error` state
- `captureError()` from `src/lib/monitoring.ts` must be called for unexpected exceptions
- `track()` from `src/lib/analytics.ts` must be called for meaningful user actions (sign-up, onboarding complete, meal logged, workout done)

---

## Component Pattern

```tsx
// Shared primitive — accepts style overrides, no domain logic
export function PrimaryButton({ label, onPress, disabled, style }: Props) {
  return (
    <Pressable style={[styles.btn, disabled && styles.disabled, style]} onPress={onPress}>
      <Text style={styles.label}>{label}</Text>
    </Pressable>
  );
}
const styles = StyleSheet.create({
  btn: { backgroundColor: colors.rose, borderRadius: radii.pill, ... },
  ...
});
```

- `StyleSheet.create({})` is mandatory for all style objects — no inline style objects in JSX (only inline for dynamic values like `width: \`${pct}%\``)
- All screens use `useSafeAreaInsets()` for header/footer padding
- All screens use `<ScrollView contentContainerStyle={{ paddingBottom: 120 }}>` to clear the tab bar

---

## Error Handling Pattern

```ts
// In a hook:
try {
  const { error } = await supabase.auth.signInWithPassword(...)
  if (error) throw error;
} catch (e) {
  const msg = e instanceof Error ? e.message : 'Something went wrong.';
  setError(msg);        // surface to UI
  captureError(e);      // send to Sentry (unexpected only — not validation errors)
  throw e;              // re-throw so the caller's catch block also runs
} finally {
  setIsLoading(false);
}
```

- Never swallow errors silently
- `console.log` is banned — use `console.warn` or `console.error` only
- User-facing error messages: plain English, no stack traces, no Supabase error codes

---

## Navigation Pattern

```ts
// Push (adds to history)
router.push('/(tabs)/meals');

// Replace (no back)
router.replace('/(auth)/email');

// Back
router.back();
```

- Route guard in `app/_layout.tsx` handles all auth-gated navigation
- Screens do NOT check `session` themselves — they trust the guard
- Tab-to-tab navigation uses `router.push`, not `navigation.navigate`

---

## Commit Message Pattern

Follows Conventional Commits (enforced by commitlint + husky):

```
feat: Add grocery screen with live checklist
fix: Correct recovery ring colour threshold
chore: Upgrade expo-router to v4.1
refactor: Extract ProgressRing from workout screen
docs: Update architecture.md with DB schema
```

- Subject: sentence case, imperative ("Add", not "Added" or "Adds")
- Body lines max 100 characters
- No `!` or breaking change markers without a corresponding PR discussion

---

## Branch Naming

```
feat/grocery-screen
fix/recovery-ring-colour
chore/upgrade-expo-sdk
hotfix/auth-loop-on-cold-start
```

All branches target `develop` except `hotfix/*` which targets `main`.

---

## TypeScript Rules

- `strict: true` + `noUncheckedIndexedAccess: true` — both enforced
- `import type` for all type-only imports — never mix value and type imports
- No `any` — use `unknown` and narrow explicitly
- Discriminated unions preferred over optional fields for state machines

```ts
// ✅ Correct
type Phase = 'overview' | 'active' | 'rest' | 'done';

// ❌ Wrong
interface State {
  isActive?: boolean;
  isResting?: boolean;
  isDone?: boolean;
}
```
