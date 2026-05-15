# Testing Strategy

- Cover feature-boundary hooks before full-screen UI flows.
- Critical-path coverage in this repo focuses on auth, onboarding persistence, route resolution, and meal data access.
- Use Jest with `jest-expo` and React Native Testing Library’s `renderHook` for hooks and small integration seams.
- Prefer mocking Supabase at the feature boundary instead of reaching for networked or end-to-end fixtures.
- CI should run `pnpm typecheck`, `pnpm lint`, `pnpm format:check`, and `pnpm test`.
