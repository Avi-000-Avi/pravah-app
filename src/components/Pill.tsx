import React from 'react';
import { StyleSheet, Text, View, type ViewStyle } from 'react-native';
import { colors, fonts, radii, typography } from '@/lib/theme';

export type PillVariant =
  | 'success' // mint — Log / done
  | 'warning' // amber — Prepped / in-progress
  | 'error' // pale rose — Prepare / needs action
  | 'info' // sky — informational
  | 'lavender' // soft purple
  | 'neutral'; // gray pill — pref values

interface PillProps {
  label: string;
  variant?: PillVariant;
  style?: ViewStyle;
  /** Stretch full-width and center label (used inside meal cards). */
  block?: boolean;
}

const variantStyles: Record<PillVariant, { fill: string; text: string }> = {
  success: { fill: colors.status.successBg, text: colors.status.successText },
  warning: { fill: colors.status.warningBg, text: colors.status.warningText },
  error: { fill: colors.status.errorBg, text: colors.status.errorText },
  info: { fill: colors.status.infoBg, text: colors.status.infoText },
  lavender: { fill: colors.lavender, text: colors.eggplant },
  neutral: { fill: colors.bg, text: colors.text.muted },
};

export function Pill({ label, variant = 'success', style, block = false }: PillProps) {
  const { fill, text } = variantStyles[variant];
  return (
    <View style={[styles.pill, { backgroundColor: fill }, block && styles.block, style]}>
      <Text style={[styles.label, { color: text }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  pill: {
    alignSelf: 'flex-start',
    borderRadius: radii.pill,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  block: {
    alignSelf: 'stretch',
    alignItems: 'center',
    paddingHorizontal: 0,
  },
  label: {
    fontFamily: fonts.ui,
    fontSize: typography.size.sm,
  },
});
