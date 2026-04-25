## What

<!-- One-paragraph description of the change. -->

## Why

<!-- What problem does this solve, or what requirement does it fulfil? Link issues/tickets. -->

## How

<!-- Key implementation decisions. Anything surprising a reviewer should know. -->

## Checklist

- [ ] `pnpm typecheck` passes locally
- [ ] `pnpm lint` passes locally
- [ ] `pnpm format:check` passes locally
- [ ] New screens use theme tokens — no hardcoded hex/sizes
- [ ] No `console.log` left in (warn/error are fine)
- [ ] No new colours added outside `src/lib/theme.ts`
- [ ] RLS policies added for any new Supabase tables
- [ ] Migration is forward-only (no edits to deployed migrations)
- [ ] PostHog `track()` call added for meaningful user actions
