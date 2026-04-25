export const colors = {
  brand: {
    purple: '#534AB7',
    surface: '#EEEDFE',
    dark: '#26215C',
  },
  macro: {
    protein: { fill: '#E1F5EE', text: '#04342C' },
    carbs: { fill: '#FAEEDA', text: '#412402' },
    fat: { fill: '#FAECE7', text: '#4A1B0C' },
  },
  neutral: {
    bgPrimary: '#FFFFFF',
    bgSecondary: '#F1EFE8',
    border: '#D3D1C7',
    textPrimary: '#2C2C2A',
    textSecondary: '#5F5E5A',
    textTertiary: '#888780',
  },
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  '2xl': 32,
} as const;

export const radii = {
  sm: 6,
  md: 8,
  lg: 12,
  xl: 16,
  pill: 999,
} as const;

export const typography = {
  size: {
    display: 32,
    heading: 22,
    bodyBold: 16,
    body: 14,
    caption: 12,
    label: 11,
  },
  weight: {
    regular: '400' as const,
    medium: '500' as const,
  },
  label: {
    textTransform: 'uppercase' as const,
    letterSpacing: 0.5,
  },
} as const;

const theme = { colors, spacing, radii, typography };
export default theme;
