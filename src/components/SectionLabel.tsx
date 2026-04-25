import React from 'react';
import { StyleSheet, Text, type TextProps } from 'react-native';
import { colors, spacing, typography } from '@/lib/theme';

interface SectionLabelProps extends TextProps {
  children: React.ReactNode;
}

export function SectionLabel({ children, style, ...rest }: SectionLabelProps) {
  return (
    <Text style={[styles.label, style]} {...rest}>
      {children}
    </Text>
  );
}

const styles = StyleSheet.create({
  label: {
    fontSize: typography.size.label,
    fontWeight: typography.weight.medium,
    color: colors.neutral.textSecondary,
    textTransform: typography.label.textTransform,
    letterSpacing: typography.label.letterSpacing,
    marginBottom: spacing.sm,
  },
});
