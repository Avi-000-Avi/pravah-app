/**
 * Pravah Design System — theme tokens
 *
 * Mirrors `pravah-design-system/export/tokens.css`. Naming follows
 * `--pravah-<category>-<name>` from the spec, flattened into TS objects.
 *
 * Vibe rules:
 * - Soft, hand-painted, atmospheric — never sharp/geometric.
 * - Warm off-white background, warm near-black text.
 * - Pill-shaped CTAs (radius 52), card radius 14.
 * - Use only weights 400 (regular) and 700 (display); UI labels use 600.
 * - Sentence case in UI; SectionLabel/Pill apply uppercase via component.
 */

export const colors = {
  // Surfaces
  bg: '#EFEBEB', // app background — warm off-white
  surface: '#FAF9F9', // card / sheet
  surface2: '#F5F3F3',
  white: '#FFFFFF',

  // Text
  text: {
    primary: '#1C1717', // warm near-black
    secondary: '#544343', // mid warm brown
    muted: '#797575', // captions
    dark: '#280B0B', // deep maroon — emphasis
    deep: '#230B28', // deep eggplant — display
    inverse: '#FFFFFF',
  },

  // Brand accents
  rose: '#DC8282',
  roseLight: '#F6969A',
  rosePale: '#F2D0D0', // meal "Prepare" chip bg
  lavender: '#ECD0F2',
  lavenderMid: '#CBB2DC',
  sky: '#D0E0F2',
  skyMid: '#82AEE2',
  mint: '#9AF6D7',
  amber: '#FBD695',
  eggplant: '#230B28',

  // Status pill text colors (chosen from the design)
  status: {
    successBg: '#9AF6D7',
    successText: '#04302A',
    warningBg: '#FBD695',
    warningText: '#312002',
    errorBg: '#F2D0D0',
    errorText: '#2F0404',
    infoBg: '#D0E0F2',
    infoText: '#0B1928',
  },

  // Neutrals (4-step warm gray scale used across borders/dividers)
  gray: {
    100: '#F5F3F3',
    200: '#E4DEDE',
    300: '#D9D9D9',
    400: '#AFAFAF',
    500: '#797575',
    600: '#544343',
    700: '#382D2D',
    800: '#1C1717',
  },

  // Navigation pill
  nav: {
    bg: 'rgba(255,255,255,0.88)',
    active: '#1C1717',
    inactive: '#797575',
  },
} as const;

/** 4px base grid */
export const spacing = {
  '1': 4,
  '2': 6,
  '3': 8,
  '4': 10,
  '5': 12,
  '6': 16,
  '7': 20,
  '8': 24,
  '9': 32,
  '10': 48,
  '11': 64,
} as const;

export const radii = {
  sm: 4,
  md: 12,
  card: 14,
  pill: 52,
  full: 9999,
} as const;

/**
 * Font families. Loaded via `useFonts` in `src/lib/fonts.ts`.
 * Always reference these constants; never hardcode the family string.
 */
export const fonts = {
  display: 'Syne_700Bold', // hero/display
  displayRegular: 'Syne_400Regular',
  ui: 'Urbanist_700Bold', // buttons, numbers
  uiSemi: 'Urbanist_600SemiBold',
  body: 'OpenSans_400Regular', // body copy
  bodySemi: 'OpenSans_600SemiBold',
  bodyBold: 'OpenSans_700Bold',
  label: 'PlusJakartaSans_600SemiBold',
  serif: 'Georgia', // greeting — system serif
  inter: 'Inter_700Bold', // status bar
} as const;

export const typography = {
  size: {
    xs: 10,
    sm: 12,
    base: 14,
    md: 16,
    lg: 18,
    xl: 22,
    '2xl': 24,
    '3xl': 36,
    '4xl': 42,
    '5xl': 64,
  },
  tracking: {
    display: 0.02,
    body: 0.05,
    tight: -0.04,
    wide: 0.08,
  },
  leading: {
    tight: 1,
    snug: 1.2,
    normal: 1.5,
  },
  // Legacy hint — primitives use uppercase + wide tracking for SectionLabel/Pill.
  label: {
    textTransform: 'uppercase' as const,
    letterSpacing: 0.5,
  },
} as const;

/** RN shadow approximations of Pravah S1 / sm */
export const shadows = {
  s1: {
    // diffused outer glow — nav, elevated floating elements
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 8,
  },
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
} as const;

/** Effect tokens — for inline use; see `effects.css` reference. */
export const effects = {
  blurB1: 4,
  blurB2: 8,
  noiseOpacity: 0.06,
  glassBg: 'rgba(255,255,255,0.4)',
  glassBorder: 'rgba(255,255,255,0.6)',
} as const;

const theme = { colors, spacing, radii, fonts, typography, shadows, effects };
export default theme;
