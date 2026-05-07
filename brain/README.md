# /brain — AI-First Development System

> **The single source of truth** for every human and AI working on Pravah.
> When in doubt, read this. When you add something, update this.

---

## Table of Contents

1. [Why this exists](#why-this-exists)
2. [File map](#file-map)
3. [The golden rules](#the-golden-rules)
4. [Daily workflow](#daily-workflow)
5. [Starting a session](#starting-a-session)
6. [Ending a session](#ending-a-session)
7. [Switching AI tools](#switching-ai-tools)
8. [Choosing the right AI tool](#choosing-the-right-ai-tool)
9. [Prompt templates](#prompt-templates)
10. [Keeping GitHub as source of truth](#keeping-github-as-source-of-truth)
11. [Onboarding a new AI (or human)](#onboarding-a-new-ai-or-human)
12. [Enforcement rules](#enforcement-rules)
13. [Maintenance](#maintenance)

---

## Why this exists

AI tools are powerful but amnesiac. Every new chat starts cold. Without a system, you spend the first 15 minutes of every session re-explaining the project, re-establishing patterns, and cleaning up inconsistencies the AI introduced because it didn't know the rules.

This `/brain` folder solves that. It is:

- **The memory layer** — what AI tools lose between sessions, this folder holds
- **The consistency enforcer** — patterns are written down, not assumed
- **The decision log** — future you (or a collaborator) can understand _why_ things are built the way they are
- **The onboarding doc** — anyone, human or AI, can read `/brain` and contribute correctly in minutes

The system works only if you keep it current. A stale `/brain` is worse than no `/brain` — it misleads tools into making wrong decisions with false confidence.

---

## File map

```
brain/
├── README.md          ← You are here. Workflow guide.
├── context.md         ← Paste into AI tools. Update every session.
├── product.md         ← What we're building, for whom, why.
├── architecture.md    ← System design, stack, data flow, DB schema.
├── patterns.md        ← Coding rules. Strict. All tools must follow.
├── decisions.md       ← Log of major architectural choices.
└── tasks.md           ← Sprint board. Current / backlog / done.
```

### What each file is for

| File              | One-line purpose                            | Who reads it                  | Update when                    |
| ----------------- | ------------------------------------------- | ----------------------------- | ------------------------------ |
| `context.md`      | Current state snapshot for AI pasting       | AI tools, daily               | Every session start/end        |
| `product.md`      | Product vision, users, features, non-goals  | New contributors, AIs         | Product pivots                 |
| `architecture.md` | System design, folder structure, data flows | AIs doing refactors, new devs | New tables, services, patterns |
| `patterns.md`     | Strict coding rules for consistency         | Every AI on every task        | New pattern introduced         |
| `decisions.md`    | Dated log of _why_ choices were made        | Humans reviewing old code     | Any significant decision       |
| `tasks.md`        | Sprint tracking                             | Human daily standup           | Every session                  |

---

## The golden rules

These five rules make the system work. Break them and it degrades:

```
1. Update context.md BEFORE switching AI tools or ending a session.
2. Log every significant decision in decisions.md with date + reasoning.
3. Never violate patterns.md — update the file first, then write the code.
4. Keep tasks.md current — move items to ✅ done when they're done.
5. Code lives in GitHub. Intent lives in /brain. Both must stay in sync.
```

---

## Daily workflow

```
Start of day
  │
  ├─ Read tasks.md → pick up where you left off
  ├─ Read context.md → remember what you were doing
  └─ Open the relevant files

During development
  │
  ├─ Write code with AI assistance (see: Prompt Templates)
  ├─ Run pnpm typecheck && pnpm lint before every commit
  ├─ Update context.md as you move between files/tasks
  └─ Log decisions in decisions.md as you make them

End of day / end of session
  │
  ├─ Update context.md (Current Task, Open Questions)
  ├─ Update tasks.md (move done items, add new ones)
  ├─ Commit everything: git add -p, meaningful commit message
  └─ Push branch
```

---

## Starting a session

**If you're continuing from yesterday:**

1. Open `brain/context.md`
2. Read "Current Goal" and "Current Task"
3. Open the files listed under "Relevant Files"
4. You're oriented. Start coding.

**If you're starting a new task:**

1. Pick a task from `brain/tasks.md` (Current Sprint section)
2. Update `context.md`:
   - Set `Current Goal` to the sprint item
   - Set `Current Task` to the specific file/function you'll start in
   - Update `Relevant Files` to match
3. Create a branch: `git checkout -b feat/your-task-name develop`
4. Start coding

**If you're using an AI tool:**

Paste this opening message:

```
I'm working on Pravah, an Indian fitness + nutrition React Native app.

Current context:
---
[PASTE ENTIRE brain/context.md HERE]
---

Coding rules (follow strictly — do not deviate):
---
[PASTE ENTIRE brain/patterns.md HERE]
---

My task: [DESCRIBE YOUR TASK IN ONE SENTENCE]
```

---

## Ending a session

Before you close anything — editor, terminal, AI chat — do this:

**Update `context.md`:**

```markdown
Current Goal: [What are you still trying to achieve?]
Current Task: [Exact file + function you were last in]
Relevant Files: [Add any new files you opened]
Open Questions: [Add anything unresolved]
```

**Update `tasks.md`:**

```markdown
- [x] Tasks you finished → move to ✅ Completed
- [~] Tasks in progress → mark with [~]
- [ ] New tasks discovered → add to Backlog
```

**Commit your work:**

```bash
git add [files you changed]
git commit -m "feat: [what you did]"
git push
```

If the session produced no committable code, still update `context.md` and `tasks.md` — the context shift has value.

---

## Switching AI tools

Context loss happens when you switch tools without updating `/brain` first. This is the correct procedure:

### Before switching

1. **In the current AI chat:** ask it to summarize what it built or decided
2. **Open `brain/context.md`** and update:
   - `Current Task` — exact file + line or function
   - `Open Questions` — anything unresolved in the current chat
   - `Relevant Files` — any new files opened this session
3. If the session introduced a new pattern → update `brain/patterns.md`
4. If the session made an architectural decision → add entry to `brain/decisions.md`
5. Commit the `/brain` updates: `git add brain/ && git commit -m "docs: Update brain context after [session topic]"`

### Opening a new tool

Use this exact opening message structure:

```
You are working on Pravah — an Indian zero-decision fitness + nutrition app
built with Expo 55 / React Native / TypeScript / Supabase / Zustand.

## Current context
[PASTE brain/context.md]

## Coding rules — follow these strictly
[PASTE brain/patterns.md]

## Architecture reference
[PASTE brain/architecture.md OR the relevant sections]

## My task
[ONE SENTENCE DESCRIPTION]

Do not start writing code yet. First, tell me:
1. Which files you'll need to read or modify
2. Your implementation approach
3. Any questions before you start
```

Asking the AI to confirm its plan before writing prevents wasted output and catches misunderstandings early.

### After the new tool session

Copy generated code into the editor. Run:

```bash
pnpm typecheck && pnpm lint
```

Fix any errors. Then commit. Never commit AI-generated code you haven't read.

---

## Choosing the right AI tool

Different tools have different strengths. Use the right one:

| Task                                  | Best tool                 | Reason                                                        |
| ------------------------------------- | ------------------------- | ------------------------------------------------------------- |
| Large multi-file refactors            | **Claude**                | Maintains consistency across many files in one context window |
| Understanding an existing codebase    | **Claude**                | Best at reading and reasoning about real code                 |
| Generating boilerplate from a pattern | **ChatGPT** or **Gemini** | Fast at pattern-based repetition                              |
| Comparing architectural approaches    | **ChatGPT**               | Good at structured trade-off analysis                         |
| Writing SQL migrations                | **Claude**                | Better at catching RLS and constraint edge cases              |
| Writing documentation                 | **Claude**                | Best long-form structured output                              |
| Generating test cases                 | **ChatGPT** or **Gemini** | Good at enumerating edge cases                                |
| Quick syntax lookups                  | Any                       | Doesn't matter                                                |
| Debugging a specific error            | **Claude**                | Best at reading stack traces in context                       |

**Rule of thumb:** If the task requires understanding a lot of existing code → Claude. If the task is generative from a clear spec → ChatGPT or Gemini.

**When to use multiple tools in sequence:**

1. Use Claude to understand the codebase and design the approach
2. Use ChatGPT to generate repetitive boilerplate fast
3. Return to Claude to review for consistency and edge cases

---

## Prompt templates

Copy, fill in `[BRACKETS]`, paste. Do not skip the context paste — it's what makes these work.

---

### New feature

```
I'm adding a new feature to Pravah.

## Context
[PASTE brain/context.md]

## Patterns — follow strictly
[PASTE brain/patterns.md]

## Feature spec
Name: [FEATURE NAME]
User story: As a [user type], I want to [action] so that [outcome].

Requirements:
- [REQUIREMENT 1]
- [REQUIREMENT 2]
- [REQUIREMENT 3]

Files to create:
- [FILE PATH] — [PURPOSE]

Files to modify:
- [FILE PATH] — [WHAT CHANGES]

Non-requirements (do not build these):
- [THING 1]
- [THING 2]

Before writing code: confirm your approach and list the files you'll touch.
```

---

### Bug fix

```
There's a bug in Pravah.

## Context
[PASTE brain/context.md]

## Bug
What happens: [OBSERVED BEHAVIOUR]
What should happen: [EXPECTED BEHAVIOUR]
When it happens: [STEPS TO REPRODUCE]

## Relevant code
File: [FILE PATH]
[PASTE THE RELEVANT CODE SNIPPET OR DESCRIBE WHERE THE BUG IS]

## What I've tried
- [ATTEMPT 1 AND RESULT]

## Constraints
- Fix only the reported bug — do not refactor surrounding code
- Follow patterns.md for any new code you write
- Diagnose first: is this a state issue, a navigation issue, or a data issue?
```

---

### Refactor

```
I need to refactor code in Pravah.

## Context
[PASTE brain/context.md]

## What to refactor
File: [FILE PATH]
Current problem: [DUPLICATION / PERFORMANCE / VIOLATES PATTERN / OTHER]

Current code:
[PASTE OR DESCRIBE CURRENT STATE]

Target state:
[DESCRIBE WHAT IT SHOULD LOOK LIKE AFTER]

## Constraints
- Observable behaviour must not change
- All existing tests must continue to pass (if applicable)
- No new dependencies without a decisions.md entry
- pnpm typecheck && pnpm lint must pass after your changes
- Follow patterns.md — do not introduce new patterns
```

---

### Code review

```
Please review this code for Pravah.

## Context
[PASTE brain/context.md]

## Code
[PASTE CODE OR DESCRIBE FILE PATH]

## Review against this checklist
1. Follows patterns.md (naming, tokens, state management, error handling)?
2. Design tokens only — no hardcoded hex, font sizes, spacing, radii?
3. Supabase called from hooks only, never directly from screens?
4. Errors caught and surfaced as string, not swallowed silently?
5. TypeScript strict — no `any`, `import type` for type imports?
6. State machines (discriminated unions) not boolean flag soup?
7. Any unnecessary re-renders or missing useCallback/useMemo?
8. Commit-ready: typecheck passes, lint passes, message follows Conventional Commits?

Output: one section per checklist item. Flag blockers clearly.
```

---

### Database migration

```
I need to write a Supabase migration for Pravah.

## Architecture context
[PASTE the Database Schema section from brain/architecture.md]

## What I'm adding
[DESCRIBE THE NEW TABLE OR COLUMN]

## Requirements
- All tables must have RLS enabled with USING (auth.uid() = user_id)
- Use uuid primary keys
- ON DELETE CASCADE from public.users to all child tables
- Add updated_at with trigger if the table is mutable
- Migration file goes in supabase/migrations/ with sequential naming

Write:
1. The SQL migration
2. The RLS policies
3. The TypeScript type (matching MealPreferencesRow pattern in preferences.types.ts)
```

---

### Adding a new screen

```
I need to add a new screen to Pravah.

## Context
[PASTE brain/context.md]

## Patterns — follow strictly
[PASTE brain/patterns.md]

## Screen spec
Route: app/[ROUTE PATH].tsx
Purpose: [WHAT THE SCREEN DOES]
Navigation: [HOW USERS GET HERE — tab / push from X / modal]

Data needed:
- [DATA POINT 1] — source: [Zustand store / Supabase / local state]
- [DATA POINT 2] — source: [...]

Interactions:
- [BUTTON / GESTURE 1] → [WHAT HAPPENS]
- [BUTTON / GESTURE 2] → [WHAT HAPPENS]

## Constraints
- Screen file contains NO business logic — import from src/features/ hooks
- Use useSafeAreaInsets() for top padding
- ScrollView with paddingBottom: 120 to clear the tab bar
- All styling via theme.ts tokens — never hardcode
```

---

## Keeping GitHub as source of truth

AI tools generate code in chat. The repo holds the real code. These can drift.

**Rules:**

- Code generated in AI chat is not real until it's in the repo, reviewed, and committed
- Every AI session that produces code must end with a commit
- Never paste AI code directly into `main` or `develop` — branch, test, PR
- Run `pnpm typecheck && pnpm lint` on AI-generated code before committing — always
- Read AI-generated code before committing — you are responsible for it

**Branch workflow:**

```bash
# Start of task
git checkout develop
git pull origin develop
git checkout -b feat/your-task

# During work
git add [specific files]
git commit -m "feat: Descriptive message"

# End of task
git push -u origin feat/your-task
# Open PR on GitHub targeting develop
```

**Commit message format** (enforced by commitlint):

```
feat: Add grocery checklist with live total
fix: Correct recovery ring colour below score 50
refactor: Extract meal card into shared component
docs: Update architecture.md with meal_logs schema
chore: Upgrade expo-router to v4.2
```

Rules: sentence case, imperative verb, no trailing period, body lines ≤ 100 chars.

---

## Onboarding a new AI (or human)

To get any AI up to speed on this project, paste files in this order:

**Minimum context (quick task):**

```
brain/context.md
brain/patterns.md
```

**Full context (new feature or refactor):**

```
brain/context.md       ← current state
brain/patterns.md      ← coding rules
brain/architecture.md  ← system design
brain/product.md       ← what we're building and why
```

**Deep context (major decisions, architecture changes):**
All of the above, plus `brain/decisions.md`.

**For a new human engineer:**
Read files in this order:

1. `brain/product.md` — understand what and why
2. `brain/architecture.md` — understand the system
3. `brain/patterns.md` — understand the rules
4. `brain/decisions.md` — understand the reasoning
5. `brain/tasks.md` — understand what's happening now
6. `README.md` in repo root — run the project locally

---

## Enforcement rules

### Code — always

| Rule                                        | What it protects                          |
| ------------------------------------------- | ----------------------------------------- |
| Use `theme.ts` tokens, never hardcode       | Design consistency across all screens     |
| Call Supabase from hooks, never screens     | Separation of concerns, testability       |
| `import type` for all type imports          | TypeScript correctness                    |
| No `any` — use `unknown` and narrow         | Type safety                               |
| Discriminated unions for state machines     | Exhaustive handling, no impossible states |
| `pnpm typecheck && pnpm lint` before commit | CI doesn't break                          |

### Brain files — always

| Rule                                     | What it protects                      |
| ---------------------------------------- | ------------------------------------- |
| Update `context.md` before tool switch   | Continuity across sessions            |
| Log decisions in `decisions.md`          | Future reasoning preserved            |
| New pattern → update `patterns.md` first | AIs don't invent conflicting patterns |
| Task done → move to ✅ in `tasks.md`     | Sprint visibility                     |

### Git — always

| Rule                            | What it protects                         |
| ------------------------------- | ---------------------------------------- |
| Never commit to `main` directly | Production stability                     |
| Never `--no-verify`             | Pre-commit hooks exist for a reason      |
| Conventional Commits format     | Changelog generation, searchable history |
| Feature branches from `develop` | Clean merge history                      |

---

## Maintenance

The `/brain` system degrades if not maintained. Signs of degradation:

- `context.md` has a `Current Task` from two weeks ago
- `tasks.md` has items that have been "in progress" for weeks
- `patterns.md` describes patterns that no longer match the code
- `decisions.md` hasn't been updated in months despite active development

**Monthly review (5 minutes):**

1. Is `context.md` current?
2. Does `tasks.md` reflect reality?
3. Does `patterns.md` match the codebase?
4. Are there decisions made since the last `decisions.md` update?

If the answer to any is no — fix it now. A 5-minute update saves hours of AI confusion later.

---

_Last updated: 2026-05-05_
_Maintained by: the engineer who last touched the code_
