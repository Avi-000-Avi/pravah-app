import React from 'react';
import { StyleSheet, Text, View, type ViewStyle } from 'react-native';
import { colors, radii, spacing, typography } from '@/lib/theme';

type PillVariant = 'protein' | 'carbs' | 'fat' | 'brand';

interface PillProps {
  label: string;
  variant?: PillVariant;
  style?: ViewStyle;
}

const variantStyles: Record<PillVariant, { fill: string; text: string }> = {
  protein: colors.macro.protein,
  carbs: colors.macro.carbs,
  fat: colors.macro.fat,
  brand: { fill: colors.brand.surface, text: colors.brand.dark },
};

export function Pill({ label, variant = 'brand', style }: PillProps) {
  const { fill, text } = variantStyles[variant];
  return (
    <View style={[styles.pill, { backgroundColor: fill }, style]}>
      <Text style={[styles.label, { color: text }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  pill: {
    alignSelf: 'flex-start',
    borderRadius: radii.pill,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
  },
  label: {
    fontSize: typography.size.caption,
    fontWeight: typography.weight.medium,
    textTransform: typography.label.textTransform,
    letterSpacing: typography.label.letterSpacing,
  },
});
