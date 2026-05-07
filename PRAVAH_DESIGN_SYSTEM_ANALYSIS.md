# Pravah Design System Analysis — "Serene Flow"

> Complete reference for integrating the Stitch-exported design system into your existing codebase via Claude Code.

---

## 1. What You Have (Export Structure)

```
stitch_pravah_zero_decision_fitness_system/
├── pravah_prd_design_brief_1.md        # Product Requirements Document
├── serene_flow/DESIGN.md               # Design token specification (YAML frontmatter)
├── onboarding/   (screen.png + code.html)
├── today/        (screen.png + code.html)
├── meal_plan/    (screen.png + code.html)
├── live_workout/ (screen.png + code.html)
├── recovery_adaptor/ (screen.png + code.html)
├── smart_triggers/   (screen.png + code.html)
├── grocery_list/     (screen.png + code.html)
├── insights/         (screen.png + code.html)
└── pravah_prd_design_brief_2/ (screen.png + code.html)
```

Each feature folder contains a **visual mockup** (`screen.png`) and a **standalone HTML implementation** (`code.html`) using Tailwind CSS with an inline config that embeds all design tokens.

---

## 2. Design Tokens (extracted from `serene_flow/DESIGN.md`)

### 2.1 Color Palette

The system follows **Material Design 3** color roles with a warm, earthy personality.

| Token                         | Hex       | Usage                               |
| ----------------------------- | --------- | ----------------------------------- |
| **surface**                   | `#fff8f7` | Page background, default canvas     |
| **surface-dim**               | `#e2d8d7` | Muted background areas              |
| **surface-container-lowest**  | `#ffffff` | Highest elevation surfaces          |
| **surface-container-low**     | `#fcf1f0` | Slightly raised surfaces            |
| **surface-container**         | `#f7ebeb` | Default card/container background   |
| **surface-container-high**    | `#f1e6e5` | Elevated containers                 |
| **surface-container-highest** | `#ebe0df` | Highest-level containers            |
| **on-surface**                | `#1f1a1a` | Primary text on light backgrounds   |
| **on-surface-variant**        | `#544342` | Secondary/muted text                |
| **primary**                   | `#934748` | Brand maroon — structural emphasis  |
| **on-primary**                | `#ffffff` | Text on primary-colored backgrounds |
| **primary-container**         | `#dc8282` | Rose — primary CTA buttons          |
| **on-primary-container**      | `#5d1d20` | Text on primary containers          |
| **secondary**                 | `#725475` | Eggplant — secondary brand tone     |
| **secondary-container**       | `#fdd6fe` | Lavender — secondary container      |
| **tertiary**                  | `#6c5a5a` | Warm brown — tertiary actions       |
| **error**                     | `#ba1a1a` | Error/destructive states            |
| **outline**                   | `#867272` | Borders, dividers                   |
| **outline-variant**           | `#d9c1c0` | Subtle borders                      |
| **inverse-surface**           | `#352f2f` | Dark surface (dark mode / tooltips) |
| **inverse-on-surface**        | `#faeeee` | Text on dark surface                |
| **background**                | `#fff8f7` | App background                      |

**Functional Accent Colors (used inline in HTML, not in DESIGN.md tokens):**

| Color               | Hex       | Usage                                     |
| ------------------- | --------- | ----------------------------------------- |
| **Rose CTA**        | `#DC8282` | Primary action buttons                    |
| **Eggplant Deep**   | `#230B28` | Icon/text on lavender chips               |
| **Lavender Chip**   | `#ECD0F2` | Tag/chip backgrounds                      |
| **Mint Growth**     | `#9AF6D7` | Progress rings (growth/fitness)           |
| **Sky Recovery**    | `#D0E0F2` | Progress rings (sleep/recovery)           |
| **Warm Brown**      | `#544343` | Chevrons, focus states, subtle accents    |
| **Tonal Layer**     | `#EFEBEB` | Background layering, progress ring tracks |
| **Lavender Border** | `#CBB2DC` | Subtle container borders (30% opacity)    |

### 2.2 Typography

Dual-font system: **Newsreader** (editorial serif) + **Manrope** (functional sans-serif).

| Token         | Font       | Size | Weight | Line Height | Letter Spacing | Usage                       |
| ------------- | ---------- | ---- | ------ | ----------- | -------------- | --------------------------- |
| `display`     | Newsreader | 48px | 600    | 1.1         | —              | Hero headlines              |
| `headline-lg` | Newsreader | 32px | 500    | 1.2         | —              | Section headers             |
| `headline-md` | Manrope    | 24px | 600    | 1.3         | —              | Card titles, sub-headers    |
| `body-lg`     | Manrope    | 18px | 400    | 1.6         | —              | Featured body text          |
| `body-md`     | Manrope    | 16px | 400    | 1.5         | —              | Default body text           |
| `label-caps`  | Manrope    | 12px | 700    | 1.4         | 0.05em         | Overlines, metadata, labels |
| `stats-lg`    | Manrope    | 40px | 200    | 1.0         | —              | Large stat numbers          |

### 2.3 Spacing (8px base grid)

| Token           | Value | Usage                            |
| --------------- | ----- | -------------------------------- |
| `base`          | 8px   | Base unit                        |
| `xs`            | 4px   | Tight gaps (icon-to-text)        |
| `sm`            | 12px  | Small gaps (within cards)        |
| `md`            | 24px  | Standard padding (card internal) |
| `lg`            | 48px  | Section gaps                     |
| `xl`            | 80px  | Major vertical breaks            |
| `gutter`        | 16px  | Grid gutters                     |
| `margin_mobile` | 20px  | Mobile safe margin               |

### 2.4 Border Radius

| Token     | Value          | Usage                             |
| --------- | -------------- | --------------------------------- |
| `sm`      | 4px (0.25rem)  | Small elements                    |
| `DEFAULT` | 8px (0.5rem)   | Standard components               |
| `md`      | 12px (0.75rem) | Medium containers                 |
| `lg`      | 16px (1rem)    | Large cards                       |
| `xl`      | 24px (1.5rem)  | Hero cards, major containers      |
| `full`    | 9999px         | Pills, avatars, circular elements |

---

## 3. Component Patterns (extracted from HTML)

### 3.1 Navigation — Bottom Tab Bar

- Fixed bottom, `rounded-t-[32px]`, background `#FAF9F9`
- Top border: `#CBB2DC` at 30% opacity
- Shadow: `0 -4px 30px rgba(84,67,67,0.04)`
- 5 tabs: Today, Fuel, Flow, Rest, Data
- Active tab: `bg-[#ECD0F2]` pill with filled Material icon
- Inactive: `text-[#544343]/50`, hover transitions to Rose
- Icon font: Material Symbols Outlined
- Tab labels: Newsreader serif, 12px uppercase, `tracking-widest`

### 3.2 Header Bar

- Fixed top, background `#EFEBEB`
- Left: avatar (40px circle, `border-outline-variant`) + "Pravah" in italic serif
- Right: notification bell icon in `#DC8282`

### 3.3 Hero / "Next Best Action" Card

- Background: `#FAF9F9`, `rounded-3xl`, padding `md` (24px)
- Shadow: `0 4px 30px rgba(84,67,67,0.04)` — extremely subtle
- Overline: `label-caps` in `primary` color, uppercase with `tracking-[0.1em]`
- Title: `headline-md`
- Body: `body-md` in `on-surface-variant`
- CTA button: `bg-[#DC8282]`, white text, `rounded-full`, `label-caps`
- Decorative image: positioned absolute, bottom-right, 20% opacity, circular crop

### 3.4 Stat Cards (Progress Rings)

- Grid: `grid-cols-2`, gap `gutter` (16px)
- Card: `bg-[#FAF9F9]`, `rounded-3xl`, padding `md`, centered flex column
- SVG ring: 96×96px, stroke-width 4px, `stroke-linecap: round`
- Track color: `#EFEBEB`
- Growth indicator: `#9AF6D7` (Mint)
- Recovery indicator: `#D0E0F2` (Sky)
- Center stat: `stats-lg` (40px, weight 200)
- Label below: `label-caps`, `on-surface-variant` at 60% opacity

### 3.5 List Items (System Status rows)

- Background: `#FAF9F9`, padding `px-md py-4`, `rounded-2xl`
- Layout: flex, `justify-between`, `items-center`
- Left icon: 40px circle with tinted background (Lavender/Sky/Mint at 30-40% opacity), icon in `#230B28`
- Title: `body-lg` weight
- Subtitle: `text-sm`, `on-surface-variant` at 60% opacity
- Right: chevron icon in `#544343`
- Hover: `bg-surface-container`, smooth transition

### 3.6 Buttons

- **Primary CTA:** `bg-[#DC8282]`, white text, `rounded-full`, `label-caps`, hover `opacity-90`, active `scale-95`
- **Secondary (outline):** bottom-border style or bordered pills
- **Chip/Tag:** `bg-[#ECD0F2]`, text `#230B28`, small rounded pills

### 3.7 Input Fields

- Bottom-border only or light tinted backgrounds
- Focus state: border transitions to `#544343` (Warm Brown)
- Minimal chrome — no heavy outlines

### 3.8 Cards (General)

- Borderless, `bg-[#FAF9F9]`
- `rounded-3xl` (24px) for major cards, `rounded-2xl` for smaller
- Internal padding: `md` (24px)
- Shadow: extremely subtle warm-tinted (`rgba(84,67,67, 0.02-0.04)`)
- No hard borders — depth via tonal layering only

---

## 4. Screens & User Flows

| Screen               | Purpose                                                                | Key Components                                                                                                             |
| -------------------- | ---------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------- |
| **Onboarding**       | Identity setup, goal selection, session frequency, dietary constraints | Radio cards, stepper/counter, chip multi-select, hero CTA                                                                  |
| **Today (Home)**     | "Next Best Action" hub, daily status dashboard                         | Hero action card, progress rings, system status list                                                                       |
| **Meal Plan**        | Detailed meal view with macros, calorie-matched swaps                  | Food hero image, macro stat row, logged-state toggle, horizontal scroll alternatives                                       |
| **Live Workout**     | Active exercise tracking with rest timer                               | Exercise header, heart rate/intensity cards, SVG rest timer ring, weight/reps inputs, motivational quote, "Finish Set" CTA |
| **Recovery Adaptor** | Fatigue detection, low-effort mode activation                          | Recovery % ring, system adaptation alert card, "Low Effort" CTA, streak calendar                                           |
| **Smart Triggers**   | Personalized nudge cards based on biometrics                           | Categorized cards (Optimal Window / Low Resource), streak progress bar, post-flow suggestions                              |
| **Grocery List**     | Auto-generated shopping list from meal plan                            | Summary header (total, counts), categorized checklist, per-item pricing, "Add All to Cart" CTA                             |
| **Insights (Data)**  | Identity assessment, consistency score, activity heatmap               | Large stat display, chip badges, heatmap grid, progress ring, precision insight quote card                                 |

---

## 5. How to Use This in Claude Code

### 5.1 Feeding Context to Claude Code

When working in your repository, you can reference these files directly. Here are recommended approaches:

**Option A — Point Claude Code at DESIGN.md as the source of truth:**

```
@serene_flow/DESIGN.md Apply this design system to [component/screen].
```

**Option B — Reference specific screen implementations:**

```
Implement the Today screen based on @today/code.html and @today/screen.png
using our React/Flutter/SwiftUI stack.
```

**Option C — Use this analysis file as a comprehensive prompt:**

```
@PRAVAH_DESIGN_SYSTEM_ANALYSIS.md Convert the design tokens from section 2
into our Tailwind config / theme file.
```

### 5.2 Recommended Extraction Steps

1. **Design Tokens → Theme Config**
   - Extract the color palette, typography, spacing, and radius tokens from Section 2 into your framework's theme/config (Tailwind `tailwind.config.js`, Flutter `ThemeData`, React Native `theme.ts`, etc.)

2. **Component Library**
   - Use Section 3 component patterns to build reusable primitives: `PravahButton`, `PravahCard`, `StatRing`, `SystemStatusRow`, `BottomTabBar`, etc.
   - Each HTML file serves as a pixel-perfect reference for that component's structure and styling.

3. **Screen Composition**
   - Use the HTML files + screenshots as references for screen-level layout.
   - The screenshots show the intended visual result; the HTML shows the exact Tailwind classes used.

4. **Assets Required**
   - Fonts: Google Fonts — `Newsreader` (serif) and `Manrope` (sans-serif)
   - Icons: Material Symbols Outlined (Google)
   - Images: The HTML uses placeholder URLs from Google's AIDA service — replace with your own assets.

### 5.3 Tailwind Config (ready to paste)

```js
// tailwind.config.js — Pravah "Serene Flow" theme
module.exports = {
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        surface: '#fff8f7',
        'surface-dim': '#e2d8d7',
        'surface-bright': '#fff8f7',
        'surface-container-lowest': '#ffffff',
        'surface-container-low': '#fcf1f0',
        'surface-container': '#f7ebeb',
        'surface-container-high': '#f1e6e5',
        'surface-container-highest': '#ebe0df',
        'on-surface': '#1f1a1a',
        'on-surface-variant': '#544342',
        'inverse-surface': '#352f2f',
        'inverse-on-surface': '#faeeee',
        outline: '#867272',
        'outline-variant': '#d9c1c0',
        'surface-tint': '#934748',
        primary: '#934748',
        'on-primary': '#ffffff',
        'primary-container': '#dc8282',
        'on-primary-container': '#5d1d20',
        'inverse-primary': '#ffb3b2',
        secondary: '#725475',
        'on-secondary': '#ffffff',
        'secondary-container': '#fdd6fe',
        'on-secondary-container': '#785a7c',
        tertiary: '#6c5a5a',
        'on-tertiary': '#ffffff',
        'tertiary-container': '#ac9696',
        'on-tertiary-container': '#3f2f2f',
        error: '#ba1a1a',
        'on-error': '#ffffff',
        'error-container': '#ffdad6',
        'on-error-container': '#93000a',
        'primary-fixed': '#ffdad9',
        'primary-fixed-dim': '#ffb3b2',
        'on-primary-fixed': '#3d050b',
        'on-primary-fixed-variant': '#763132',
        'secondary-fixed': '#fdd6fe',
        'secondary-fixed-dim': '#e0bbe1',
        'on-secondary-fixed': '#2a122f',
        'on-secondary-fixed-variant': '#593d5d',
        'tertiary-fixed': '#f6dddc',
        'tertiary-fixed-dim': '#d9c1c1',
        'on-tertiary-fixed': '#251818',
        'on-tertiary-fixed-variant': '#544343',
        background: '#fff8f7',
        'on-background': '#1f1a1a',
        'surface-variant': '#ebe0df',
        // Functional accents (from HTML implementations)
        'rose-cta': '#DC8282',
        'eggplant-deep': '#230B28',
        'lavender-chip': '#ECD0F2',
        'mint-growth': '#9AF6D7',
        'sky-recovery': '#D0E0F2',
        'warm-brown': '#544343',
        'tonal-layer': '#EFEBEB',
        'lavender-border': '#CBB2DC',
      },
      fontFamily: {
        display: ['Newsreader', 'serif'],
        'headline-lg': ['Newsreader', 'serif'],
        'headline-md': ['Manrope', 'sans-serif'],
        'body-lg': ['Manrope', 'sans-serif'],
        'body-md': ['Manrope', 'sans-serif'],
        'label-caps': ['Manrope', 'sans-serif'],
        'stats-lg': ['Manrope', 'sans-serif'],
      },
      fontSize: {
        display: ['48px', { lineHeight: '1.1', fontWeight: '600' }],
        'headline-lg': ['32px', { lineHeight: '1.2', fontWeight: '500' }],
        'headline-md': ['24px', { lineHeight: '1.3', fontWeight: '600' }],
        'body-lg': ['18px', { lineHeight: '1.6', fontWeight: '400' }],
        'body-md': ['16px', { lineHeight: '1.5', fontWeight: '400' }],
        'label-caps': ['12px', { lineHeight: '1.4', letterSpacing: '0.05em', fontWeight: '700' }],
        'stats-lg': ['40px', { lineHeight: '1', fontWeight: '200' }],
      },
      spacing: {
        base: '8px',
        xs: '4px',
        sm: '12px',
        md: '24px',
        lg: '48px',
        xl: '80px',
        gutter: '16px',
        'margin-mobile': '20px',
      },
      borderRadius: {
        sm: '0.25rem',
        DEFAULT: '0.5rem',
        md: '0.75rem',
        lg: '1rem',
        xl: '1.5rem',
        full: '9999px',
      },
      boxShadow: {
        'pravah-card': '0 4px 30px rgba(84, 67, 67, 0.04)',
        'pravah-card-subtle': '0 4px 20px rgba(84, 67, 67, 0.02)',
        'pravah-nav': '0 -4px 30px rgba(84, 67, 67, 0.04)',
      },
    },
  },
};
```

### 5.4 CSS Variables Alternative (for non-Tailwind stacks)

```css
:root {
  /* Colors */
  --color-surface: #fff8f7;
  --color-surface-dim: #e2d8d7;
  --color-surface-container: #f7ebeb;
  --color-surface-container-high: #f1e6e5;
  --color-on-surface: #1f1a1a;
  --color-on-surface-variant: #544342;
  --color-primary: #934748;
  --color-primary-container: #dc8282;
  --color-secondary: #725475;
  --color-secondary-container: #fdd6fe;
  --color-tertiary: #6c5a5a;
  --color-error: #ba1a1a;
  --color-outline: #867272;
  --color-outline-variant: #d9c1c0;
  --color-rose-cta: #dc8282;
  --color-eggplant-deep: #230b28;
  --color-lavender-chip: #ecd0f2;
  --color-mint-growth: #9af6d7;
  --color-sky-recovery: #d0e0f2;
  --color-warm-brown: #544343;
  --color-tonal-layer: #efebeb;
  --color-background: #fff8f7;

  /* Typography */
  --font-serif: 'Newsreader', serif;
  --font-sans: 'Manrope', sans-serif;

  /* Spacing */
  --space-xs: 4px;
  --space-sm: 12px;
  --space-md: 24px;
  --space-lg: 48px;
  --space-xl: 80px;
  --space-gutter: 16px;
  --space-margin-mobile: 20px;

  /* Radius */
  --radius-sm: 0.25rem;
  --radius-default: 0.5rem;
  --radius-md: 0.75rem;
  --radius-lg: 1rem;
  --radius-xl: 1.5rem;

  /* Shadows */
  --shadow-card: 0 4px 30px rgba(84, 67, 67, 0.04);
  --shadow-card-subtle: 0 4px 20px rgba(84, 67, 67, 0.02);
  --shadow-nav: 0 -4px 30px rgba(84, 67, 67, 0.04);
}
```

---

## 6. Design Principles to Maintain

1. **Low information density** — generous whitespace, 24px internal card padding, 48-80px vertical section gaps
2. **Tonal layering over shadows** — depth via surface color changes (`#EFEBEB` → `#FAF9F9` → `#ffffff`), not drop shadows
3. **Warm, never cold** — shadows tinted with Warm Brown (`rgba(84,67,67,...)`) instead of pure black
4. **Thumb-first mobile** — primary actions at screen bottom, navigation at bottom
5. **Pill-shaped CTAs** — `rounded-full` for primary buttons to contrast with the structured grid
6. **Serif for editorial, sans for data** — Newsreader headers give premium feel, Manrope for readability
7. **Thin progress rings** — 2-4px stroke widths, rounded line caps, muted track colors
8. **Restrained color use** — most UI is neutral; color is reserved for CTAs (Rose), data viz (Mint/Sky), and categorization (Lavender chips)
