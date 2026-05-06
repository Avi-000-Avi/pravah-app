import { useEffect, useRef } from 'react';
import { Animated, Easing, StyleSheet, Text, View } from 'react-native';
import { colors, fonts, radii, typography } from '@/lib/theme';

interface ProgressBarProps {
  step: number;
  total: number;
}

const ANIMATION_DURATION_MS = 300;

/**
 * Thin progress indicator for the onboarding flow. The fill width
 * eases from one step to the next over 300ms — the value is held in
 * an Animated.Value and re-animated whenever `step` changes.
 *
 * Width can't use the native driver, so this animation runs on the JS
 * thread. With a single bar and a once-per-screen-transition trigger,
 * that's well within budget.
 */
export function ProgressBar({ step, total }: ProgressBarProps) {
  const targetPct = Math.max(0, Math.min(100, (step / total) * 100));

  // Seed the value with the initial percentage so the first render lands
  // on the correct width — no zero-width flash on mount.
  const progress = useRef(new Animated.Value(targetPct)).current;

  useEffect(() => {
    Animated.timing(progress, {
      toValue: targetPct,
      duration: ANIMATION_DURATION_MS,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: false,
    }).start();
  }, [targetPct, progress]);

  const animatedWidth = progress.interpolate({
    inputRange: [0, 100],
    outputRange: ['0%', '100%'],
    extrapolate: 'clamp',
  });

  return (
    <>
      <View style={styles.track}>
        <Animated.View style={[styles.fill, { width: animatedWidth }]} />
      </View>
      <Text style={styles.count}>
        {step}/{total}
      </Text>
    </>
  );
}

const styles = StyleSheet.create({
  track: {
    flex: 1,
    height: 6,
    backgroundColor: colors.gray[200],
    borderRadius: radii.full,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    backgroundColor: colors.text.primary,
    borderRadius: radii.full,
  },
  count: {
    fontFamily: fonts.label,
    fontSize: typography.size.xs,
    color: colors.text.muted,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
});
