import React from 'react';
import { StyleSheet, Text, type TextProps } from 'react-native';
import { colors, fonts, typography } from '@/lib/theme';

interface SectionTitleProps extends TextProps {
  children: React.ReactNode;
}

/**
 * Bold Syne section heading — used for "Today", "Groceries",
 * "Today's Workouts", etc. on screens.
 */
export function SectionTitle({ children, style, ...rest }: SectionTitleProps) {
  return (
    <Text style={[styles.title, style]} {...rest}>
      {children}
    </Text>
  );
}

const styles = StyleSheet.create({
  title: {
    fontFamily: fonts.display,
    fontSize: typography.size.lg,
    color: colors.text.primary,
    letterSpacing: typography.size.lg * typography.tracking.display,
    marginBottom: 12,
  },
});
