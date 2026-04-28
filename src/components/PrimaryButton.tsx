import React from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  View,
  type PressableProps,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import { colors, fonts, radii, typography } from '@/lib/theme';

interface PrimaryButtonProps extends Omit<PressableProps, 'style'> {
  label: string;
  /** Render an optional leading element (icon / "+" glyph). */
  leading?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}

/**
 * Solid dark pill — the primary CTA across the app.
 * Matches "Log Progress" on Home and "Start" on workout cards.
 */
export function PrimaryButton({ label, leading, style, ...rest }: PrimaryButtonProps) {
  return (
    <Pressable
      android_ripple={{ color: 'rgba(255,255,255,0.12)' }}
      style={({ pressed }) => [styles.button, pressed && styles.pressed, style]}
      {...rest}
    >
      {leading ? <View style={styles.leading}>{leading}</View> : null}
      <Text style={styles.label}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: colors.text.primary,
    borderRadius: radii.pill,
    paddingHorizontal: 22,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    alignSelf: 'flex-start',
  },
  pressed: {
    opacity: 0.85,
  },
  leading: {
    marginRight: 2,
  },
  label: {
    color: colors.white,
    fontFamily: fonts.ui,
    fontSize: typography.size.base - 1,
    letterSpacing: typography.size.base * typography.tracking.display,
  },
});
