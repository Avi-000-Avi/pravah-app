import React from 'react';
import { StyleSheet, Text, type TextProps } from 'react-native';
import { colors, fonts, typography } from '@/lib/theme';

interface SectionLabelProps extends TextProps {
  children: React.ReactNode;
}

/**
 * Small uppercase caption used above lists / cards.
 * In the design these mark groupings like "Today", "Groceries".
 * For the larger bold serif headings (Syne 18/700), use `<SectionTitle>`.
 */
export function SectionLabel({ children, style, ...rest }: SectionLabelProps) {
  return (
    <Text style={[styles.label, style]} {...rest}>
      {children}
    </Text>
  );
}

const styles = StyleSheet.create({
  label: {
    fontFamily: fonts.label,
    fontSize: typography.size.xs,
    color: colors.text.muted,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
    marginBottom: 8,
  },
});
