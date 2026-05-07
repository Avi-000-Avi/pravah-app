/**
 * ProgressRing — animated SVG arc ring used across all tab screens.
 *
 * Matches the design system's `ProgressRing` from shared.jsx:
 * - Starts at top (SVG rotated -90°)
 * - Smooth 0.8s cubic-bezier fill animation via strokeDasharray
 * - Center slot for stat value + optional caption below the ring
 */
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { colors, fonts, typography } from '@/lib/theme';

interface ProgressRingProps {
  size?: number;
  strokeWidth?: number;
  percent: number;
  color?: string;
  trackColor?: string;
  children?: React.ReactNode;
  /** Optional label rendered below the ring (e.g. "Daily Goal") */
  caption?: string;
  /** Optional large stat inside the ring — use `children` for full control */
  label?: string;
}

export function ProgressRing({
  size = 96,
  strokeWidth = 4,
  percent,
  color = colors.mint,
  trackColor = colors.tonal,
  children,
  caption,
  label,
}: ProgressRingProps) {
  const r = (size - strokeWidth * 2) / 2;
  const cx = size / 2;
  const cy = size / 2;
  const circumference = 2 * Math.PI * r;
  const filled = (Math.min(100, Math.max(0, percent)) / 100) * circumference;

  return (
    <View style={styles.wrapper}>
      <View style={{ width: size, height: size }}>
        {/* SVG rotated so arc starts at top */}
        <Svg width={size} height={size} style={{ transform: [{ rotate: '-90deg' }] }}>
          {/* Track */}
          <Circle cx={cx} cy={cy} r={r} fill="none" stroke={trackColor} strokeWidth={strokeWidth} />
          {/* Fill */}
          <Circle
            cx={cx}
            cy={cy}
            r={r}
            fill="none"
            stroke={color}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={`${filled} ${circumference}`}
          />
        </Svg>

        {/* Center overlay */}
        <View style={[StyleSheet.absoluteFill, styles.center]}>
          {children ? children : label ? <Text style={styles.label}>{label}</Text> : null}
        </View>
      </View>

      {caption ? <Text style={styles.caption}>{caption}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    alignItems: 'center',
    gap: 6,
  },
  center: {
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
  },
  label: {
    fontFamily: fonts.statsThin,
    fontSize: typography.size['2xl'],
    color: colors.text.primary,
    lineHeight: typography.size['2xl'],
  },
  caption: {
    fontFamily: fonts.label,
    fontSize: typography.size.xs,
    color: colors.text.muted,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
    opacity: 0.7,
  },
});
