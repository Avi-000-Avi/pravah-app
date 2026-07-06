import React from 'react';
import { Pressable, StyleSheet, Text, type StyleProp, type ViewStyle } from 'react-native';
import { colors, fonts, radii, spacing, typography } from '@/lib/theme';

interface TileButtonProps {
  label: string;
  /** Optional second line — kept short ("4 of us", "30 min"). */
  sublabel?: string;
  selected?: boolean;
  onPress: () => void;
  style?: StyleProp<ViewStyle>;
  accessibilityLabel?: string;
}

/**
 * Selectable tile — the building block of every tap-only capture
 * surface (staple grid, household, time, swap sheet, leftover picker).
 * Selected state: rose fill, white label.
 */
export function TileButton({
  label,
  sublabel,
  selected = false,
  onPress,
  style,
  accessibilityLabel,
}: TileButtonProps) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ selected }}
      accessibilityLabel={accessibilityLabel ?? label}
      onPress={onPress}
      style={({ pressed }) => [
        styles.tile,
        selected && styles.tileSelected,
        pressed && styles.pressed,
        style,
      ]}
    >
      <Text style={[styles.label, selected && styles.labelSelected]} numberOfLines={2}>
        {label}
      </Text>
      {sublabel ? (
        <Text style={[styles.sublabel, selected && styles.sublabelSelected]} numberOfLines={1}>
          {sublabel}
        </Text>
      ) : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  tile: {
    backgroundColor: colors.surface,
    borderRadius: radii.lg,
    borderWidth: 1.5,
    borderColor: colors.gray[200],
    paddingHorizontal: spacing.sm,
    paddingVertical: 14,
    minHeight: 56,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,
  },
  tileSelected: {
    backgroundColor: colors.rose,
    borderColor: colors.rose,
  },
  pressed: {
    opacity: 0.85,
  },
  label: {
    fontFamily: fonts.bodySemi,
    fontSize: typography.size.base,
    color: colors.text.primary,
    textAlign: 'center',
  },
  labelSelected: {
    color: colors.white,
  },
  sublabel: {
    fontFamily: fonts.body,
    fontSize: typography.size.sm,
    color: colors.text.secondary,
    textAlign: 'center',
  },
  sublabelSelected: {
    color: colors.text.inverse,
  },
});
