/**
 * Onboarding v2 design tokens — "Warm Serif" palette.
 *
 * Matches the onboarding.jsx reference design which uses Pravah's existing
 * Newsreader (serif) + Manrope (sans) — same fonts as the main tab screens.
 */

export const ob = {
  // Surfaces
  bg: '#f5f0ec',
  surface: '#ffffff',

  // Brand rose
  rose: '#c17a7a',
  roseDeep: '#8b4a4a',
  roseSoft: '#f2e4e4',
  rosePale: '#faf4f4',

  // Ink
  ink: '#1e1a18',
  ink2: '#5a4f4a',
  ink3: '#a09088',

  // Borders
  border: 'rgba(30,26,24,0.10)',
  border2: 'rgba(30,26,24,0.06)',

  // Fonts (loaded via usePravahFonts — Newsreader + Manrope)
  serif: 'Newsreader_400Regular',
  serifItalic: 'Newsreader_400Regular_Italic',
  serifMedium: 'Newsreader_600SemiBold',
  sans: 'Manrope_400Regular',
  sansRegular: 'Manrope_400Regular',
  sansMedium: 'Manrope_600SemiBold',
} as const;
