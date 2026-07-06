/**
 * Pravah Design System — "Serene Flow" tokens
 *
 * Derived from the Google Stitch export at:
 * stitch_pravah_zero_decision_fitness_system/serene_flow/DESIGN.md
 *
 * Material Design 3 warm palette + Newsreader (serif) / Manrope (sans).
 *
 * Rules:
 * - Always use tokens — never hardcode hex values, sizes, or radii.
 * - Sentence case in UI; label-caps components apply uppercase internally.
 * - Tonal layering over shadows for depth (surface → surface2 → white).
 * - Warm shadow tint: rgba(84,67,67,…) — never pure black.
 */

export const colors = {
  // Surfaces (tonal layering)
  bg: '#fff8f7', // page background
  surface: '#FAF9F9', // default card / sheet
  surface2: '#f7ebeb', // slightly raised
  surfaceLow: '#fcf1f0', // low elevation
  surfaceHigh: '#f1e6e5', // elevated containers
  white: '#ffffff',

  // Text
  text: {
    primary: '#1f1a1a', // warm near-black
    secondary: '#544342', // mid warm brown
    muted: '#544342', // captions (intentionally same as secondary)
    dark: '#5d1d20', // deep maroon — emphasis
    deep: '#230B28', // deep eggplant — display
    inverse: '#faeeee', // text on dark surfaces
  },

  // Brand
  primary: '#934748', // brand maroon — structural emphasis
  primaryContainer: '#dc8282', // rose — primary CTA buttons
  secondary: '#725475', // eggplant secondary
  secondaryContainer: '#fdd6fe', // lavender container

  // Functional accents
  rose: '#DC8282', // CTA buttons
  lavender: '#ECD0F2', // active tab pill, chips
  lavenderBorder: '#CBB2DC', // nav border, card borders (30% opacity)
  mint: '#9AF6D7', // growth / fitness rings
  sky: '#D0E0F2', // recovery / sleep rings
  eggplant: '#230B28', // icon / text on lavender
  warmBrown: '#544343', // chevrons, focus borders
  tonal: '#EFEBEB', // ring tracks, background layering
  amber: '#FBD695', // warning accent

  // Status (Pills)
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

  // Outline
  outline: '#867272',
  outlineVariant: '#d9c1c0',

  // Warm gray scale (borders, dividers)
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

  // Navigation
  nav: {
    bg: '#FAF9F9',
    active: '#ECD0F2', // lavender active pill
    activeText: '#230B28', // eggplant icon on active
    inactive: 'rgba(84,67,67,0.5)',
  },
} as const;

export const onboarding = {
  bg: '#f5f0ec',
  surface: colors.white,
  accent: '#c17a7a',
  accentDeep: '#8b4a4a',
  accentSoft: '#f2e4e4',
  accentPale: '#faf4f4',
  textPrimary: '#1e1a18',
  textSecondary: '#5a4f4a',
  textMuted: '#a09088',
  heroBg: '#3d1f1f',
  heroOverlay: colors.rose,
  heroOutline: 'rgba(255,255,255,0.06)',
  heroChip: 'rgba(255,255,255,0.12)',
  heroChipBorder: 'rgba(255,255,255,0.15)',
  heroText: colors.white,
  heroTextMuted: 'rgba(255,255,255,0.6)',
  heroTextSoft: 'rgba(255,255,255,0.55)',
  heroTextStrong: 'rgba(255,255,255,0.9)',
  border: 'rgba(30,26,24,0.10)',
  borderSubtle: 'rgba(30,26,24,0.06)',
  shadow: 'rgba(0,0,0,0.15)',
  macroCarbs: '#c4a882',
  macroFat: '#a8b8c4',
} as const;

/** 8px base grid — matches Stitch spacing spec */
export const spacing = {
  xs: 4,
  sm: 12,
  base: 8,
  gutter: 16,
  margin: 20,
  md: 24,
  lg: 48,
  xl: 80,
} as const;

export const radii = {
  sm: 4,
  md: 12,
  lg: 16,
  card: 24, // rounded-3xl
  xl: 24,
  pill: 9999,
  full: 9999,
} as const;

/**
 * Font families — Newsreader (serif editorial) + Manrope (functional sans).
 * Loaded via `usePravahFonts()` in `src/lib/fonts.ts`.
 * Always reference these constants; never hardcode a family string.
 */
export const fonts = {
  // Newsreader — display / editorial serif
  display: 'Newsreader_600SemiBold',
  displayItalic: 'Newsreader_400Regular_Italic',
  displayRegular: 'Newsreader_400Regular',

  // Manrope — functional sans
  ui: 'Manrope_700Bold', // numbers, buttons
  uiSemi: 'Manrope_600SemiBold',
  body: 'Manrope_400Regular', // body copy
  bodySemi: 'Manrope_600SemiBold',
  bodyBold: 'Manrope_700Bold',
  label: 'Manrope_700Bold', // label-caps (uppercase overlines)
  statsThin: 'Manrope_200ExtraLight', // large stat numbers (40px)
} as const;

export const typography = {
  size: {
    xs: 10, // label-caps
    sm: 12, // label-caps (rendered size)
    base: 14, // body-md default
    md: 16, // body-md
    lg: 18, // body-lg
    xl: 24, // headline-md
    '2xl': 32, // headline-lg
    '3xl': 40, // stats-lg
    '4xl': 48, // display
  },
  weight: {
    thin: '200' as const,
    regular: '400' as const,
    medium: '500' as const,
    semibold: '600' as const,
    bold: '700' as const,
  },
  leading: {
    tight: 1.0,
    snug: 1.1,
    normal: 1.5,
    relaxed: 1.6,
  },
  /** Letter-spacing multipliers — applied as `fontSize * tracking.X`. */
  tracking: {
    display: -0.01, // subtle tight tracking for serif headlines
    tight: -0.005, // gentle tightening for large stats
    normal: 0,
  },
} as const;

/** Warm-tinted shadows — use rgba(84,67,67,…) not black */
export const shadows = {
  card: {
    shadowColor: 'rgba(84,67,67,1)',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 30,
    elevation: 3,
  },
  cardSubtle: {
    shadowColor: 'rgba(84,67,67,1)',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.02,
    shadowRadius: 20,
    elevation: 1,
  },
  nav: {
    shadowColor: 'rgba(84,67,67,1)',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.04,
    shadowRadius: 30,
    elevation: 8,
  },
  // Legacy aliases used by existing components
  s1: {
    shadowColor: 'rgba(84,67,67,1)',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.04,
    shadowRadius: 30,
    elevation: 8,
  },
  sm: {
    shadowColor: 'rgba(84,67,67,1)',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.02,
    shadowRadius: 20,
    elevation: 1,
  },
} as const;

const theme = { colors, onboarding, spacing, radii, fonts, typography, shadows };
export default theme;
