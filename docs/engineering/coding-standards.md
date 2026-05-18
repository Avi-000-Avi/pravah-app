# Coding Standards

- Use `import type` for type-only imports.
- Do not call Supabase directly from route files or presentational components.
- Use theme tokens from [`src/lib/theme.ts`](/Users/avinashtoppo/Desktop/pravah-app/src/lib/theme.ts); do not hardcode app colors, spacing, or radii in new code.
- Surface user-facing errors as plain English strings. Unexpected failures should call `captureError()`.
- Track meaningful feature-boundary events with `track()` and avoid sending PII.
- Prefer small, domain-named helpers over generic utility buckets.
