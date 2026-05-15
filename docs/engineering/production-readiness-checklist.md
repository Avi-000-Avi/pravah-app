# Production Readiness Checklist

- Auth boot and route protection are driven by the real session state.
- Onboarding persists only backend-supported fields and does not maintain a parallel draft architecture elsewhere.
- Supabase access is typed and centralized.
- Screens do not import Supabase directly.
- Critical-path hooks have automated coverage.
- CI runs typecheck, lint, formatting, and tests.
- Observability calls are present at feature boundaries for sign-in, sign-up, onboarding completion, and meal logging.
