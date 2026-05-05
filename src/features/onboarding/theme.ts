/**
 * Onboarding v2 design tokens — "Warm Serif" palette.
 *
 * Separate from the main Serene Flow theme used in the tab screens.
 * Uses Cormorant Garamond (serif) + Jost (sans) per the HTML prototype.
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

  // Fonts (loaded via usePravahFonts)
  serif: 'CormorantGaramond_300Light',
  serifItalic: 'CormorantGaramond_300Light_Italic',
  serifMedium: 'CormorantGaramond_500Medium',
  sans: 'Jost_300Light',
  sansRegular: 'Jost_400Regular',
  sansMedium: 'Jost_500Medium',
} as const;
