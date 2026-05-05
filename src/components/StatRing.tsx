import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Circle, Svg } from 'react-native-svg';
import { colors, fonts, typography } from '@/lib/theme';

interface StatRingProps {
  /** Diameter of the SVG ring. Default 96. */
  size?: number;
  /** Stroke width of track and fill. Default 4. */
  strokeWidth?: number;
  /** Fill percentage 0–100. */
  percent: number;
  /** Fill stroke color — use colors.mint / colors.sky / colors.rose. */
  color: string;
  /** Track color. Default colors.tonal (#EFEBEB). */
  trackColor?: string;
  /** Center label text — e.g. "65%" or "0:45". */
  label: string;
  /** Caption below the ring — e.g. "Daily Goal". */
  caption: string;
}

/**
 * Thin SVG progress ring with a centered stat and a caption below.
 * Used on Today (goal/sleep rings), Flow (rest timer), Rest (recovery),
 * and Data (momentum) screens.
 *
 * The arc starts at the top (SVG rotated −90°). Width animation is left
 * to the caller via `percent` prop changes — this component is stateless.
 */
export function StatRing({
  size = 96,
  strokeWidth = 4,
  percent,
  color,
  trackColor = colors.tonal,
  label,
  caption,
}: StatRingProps) {
  const radius = size / 2 - strokeWidth * 2;
  const circumference = 2 * Math.PI * radius;
  const clampedPct = Math.max(0, Math.min(100, percent));
  const dashOffset = circumference * (1 - clampedPct / 100);
  const center = size / 2;

  return (
    <View style={styles.wrapper}>
      <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
        {/* Rotated so arc starts at 12 o'clock */}
        <Svg
          width={size}
          height={size}
          style={{ position: 'absolute', transform: [{ rotate: '-90deg' }] }}
        >
          {/* Track */}
          <Circle
            cx={center}
            cy={center}
            r={radius}
            fill="transparent"
            stroke={trackColor}
            strokeWidth={strokeWidth}
          />
          {/* Fill */}
          <Circle
            cx={center}
            cy={center}
            r={radius}
            fill="transparent"
            stroke={color}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={dashOffset}
            strokeLinecap="round"
          />
        </Svg>
        {/* Center label */}
        <Text style={[styles.label, { fontSize: size < 120 ? 20 : 40 }]}>{label}</Text>
      </View>
      {/* Caption below ring */}
      <Text style={styles.caption}>{caption}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    alignItems: 'center',
    gap: 8,
  },
  label: {
    fontFamily: fonts.statsThin,
    color: colors.text.primary,
    textAlign: 'center',
  },
  caption: {
    fontFamily: fonts.label,
    fontSize: typography.size.xs,
    color: colors.text.muted,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
    textAlign: 'center',
    opacity: 0.6,
  },
});
