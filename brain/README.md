# /brain — AI session memory

`brain/` is the handoff layer for AI-assisted development on Pravah.

It is useful, but it is not the primary human engineering source of truth.
For architecture and coding guidance, prefer the codebase plus `docs/engineering/*`.

## What belongs here

- short-term project context
- current architectural decisions
- product framing for new sessions
- active task tracking for AI handoffs

## File map

```text
brain/
  README.md        how to use this folder
  context.md       current branch/session snapshot
  product.md       product framing and non-goals
  architecture.md  current app/data architecture summary
  patterns.md      coding and repository rules for AI sessions
  decisions.md     dated architectural decisions
  tasks.md         current work, backlog, done
```

## Update rules

1. Update `brain/context.md` before ending a long session or switching tools.
2. Add architectural choices to `brain/decisions.md` when they change how the repo should evolve.
3. Keep `brain/tasks.md` aligned with what is actually done on the branch.
4. If `brain/*` disagrees with the code or `docs/engineering/*`, fix `brain/*` immediately.

## Session workflow

1. Read `brain/context.md`.
2. Read `brain/tasks.md`.
3. Open the specific code files referenced there.
4. If the work changes architecture or patterns, update `brain/decisions.md` or `brain/patterns.md`.
5. Before handoff, update `brain/context.md` with the latest repo reality.

## Canonical sources

- Product/runtime truth: code in the repo
- Engineering rules: `docs/engineering/*`
- AI handoff memory: `brain/*`
