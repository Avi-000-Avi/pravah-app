# Folder Structure

```text
app/
  (auth)/
  (onboarding)/
  (tabs)/
src/
  components/
  features/
    auth/
    meals/
    onboarding/
    preferences/
  lib/
  stores/
docs/
  engineering/
brain/
```

- `src/components/` is for shared primitives only.
- `src/features/{domain}` should contain the domain’s hooks, components, store, constants, and tests-facing helpers when needed.
- Avoid reviving empty placeholder roots like `src/hooks` or `src/types` unless there is a concrete shared ownership need.
