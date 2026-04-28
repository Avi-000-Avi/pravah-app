import React from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  View,
  type PressableProps,
  type ViewStyle,
} from 'react-native';
import { colors, fonts, radii, typography } from '@/lib/theme';

type GhostSize = 'md' | 'sm';

interface GhostButtonProps extends Omit<PressableProps, 'style'> {
  label: string;
  leading?: React.ReactNode;
  size?: GhostSize;
  /** Solid dark border (Home "Adjust Plan") vs subtle gray (Profile "Edit"). */
  emphasis?: 'strong' | 'subtle';
  style?: ViewStyle;
}

/**
 * Outlined pill — the secondary CTA across the app. Used as
 * "Adjust Plan", "Edit Prefs", "Settings", "Edit" on profile blocks.
 */
export function GhostButton({
  label,
  leading,
  size = 'md',
  emphasis = 'subtle',
  style,
  ...rest
}: GhostButtonProps) {
  const sizeStyle = size === 'sm' ? styles.sm : styles.md;
  const borderColor = emphasis === 'strong' ? colors.text.primary : colors.gray[300];
  const labelColor = emphasis === 'strong' ? colors.text.primary : colors.text.secondary;

  return (
    <Pressable
      android_ripple={{ color: 'rgba(0,0,0,0.05)' }}
      style={({ pressed }) => [
        styles.button,
        sizeStyle,
        { borderColor },
        pressed && styles.pressed,
        style,
      ]}
      {...rest}
    >
      {leading ? <View style={styles.leading}>{leading}</View> : null}
      <Text style={[styles.label, { color: labelColor }]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: 'transparent',
    borderRadius: radii.pill,
    borderWidth: 1.5,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    alignSelf: 'flex-start',
  },
  md: { paddingHorizontal: 18, paddingVertical: 10 },
  sm: { paddingHorizontal: 14, paddingVertical: 7 },
  pressed: { opacity: 0.7 },
  leading: { marginRight: 2 },
  label: {
    fontFamily: fonts.uiSemi,
    fontSize: typography.size.sm,
  },
});
