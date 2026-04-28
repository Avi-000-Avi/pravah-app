import React from 'react';
import { StyleSheet, View, type ViewProps } from 'react-native';
import { colors, radii } from '@/lib/theme';

interface CardProps extends ViewProps {
  children: React.ReactNode;
}

/**
 * Standard Pravah card — radius 14, surface fill, no border.
 * No shadow by default; shadows are reserved for the nav pill.
 */
export function Card({ children, style, ...rest }: CardProps) {
  return (
    <View style={[styles.card, style]} {...rest}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: radii.card,
  },
});
