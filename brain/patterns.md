# Patterns — Pravah

## Core rules

1. `app/` route files are thin containers only.
2. Supabase access lives in feature hooks, not in route files or presentational components.
3. `src/lib/theme.ts` is the only place for app design tokens.
4. TanStack Query owns server-backed data.
5. Zustand owns transient UI/session state.
6. `src/features/onboarding` is the only onboarding draft flow.
7. `src/features/preferences` owns persisted preference reads and future settings writes.

## Naming

- components: `PascalCase.tsx`
- hooks: `useSomething.ts`
- stores: `somethingStore.ts`
- route files: lowercase Expo Router filenames
- types: PascalCase, imported with `import type`

## Folder rules

```text
src/features/{domain}/
  components/
  hooks/
  store/
  types/
  utils/
  index.ts
```

- Keep a concern inside its feature unless it is reused across multiple domains.
- `src/components/` is for shared primitives only.
- Avoid generic buckets like `src/hooks` and `src/types`.

## Styling rules

- Prefer theme tokens over hardcoded values.
- Use `StyleSheet.create`.
- Keep copy in sentence case.
- Add new semantic tokens to `theme.ts` instead of inventing local colors.

## Data rules

- Prefer explicit row mappers at feature boundaries.
- Convert Postgres `numeric` fields to numbers in feature mappers/hooks.
- Surface user-facing errors as plain-English strings.
- Unexpected errors should call `captureError()`.
- Meaningful feature actions should call `track()`.

## Testing rules

- Prefer direct imports of the hook/module under test.
- Mock Supabase at the feature boundary.
- Cover critical-path hooks before adding broader screen tests.

## Git rules

- branch from `develop`
- use Conventional Commits
- keep PRs focused and staged instead of rewriting unrelated parts of the repo
