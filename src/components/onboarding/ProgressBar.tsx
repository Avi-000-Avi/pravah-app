import { StyleSheet, Text, View } from 'react-native';
import { colors, fonts, radii, typography } from '@/lib/theme';

interface ProgressBarProps {
  step: number;
  total: number;
}

/**
 * Thin progress indicator for the onboarding flow. Sits inside
 * `OnboardingLayout`'s header row alongside the back button.
 */
export function ProgressBar({ step, total }: ProgressBarProps) {
  const pct = Math.max(0, Math.min(100, (step / total) * 100));
  return (
    <>
      <View style={styles.track}>
        <View style={[styles.fill, { width: `${pct}%` }]} />
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
