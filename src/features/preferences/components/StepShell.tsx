import { Feather } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { PrimaryButton } from '@/components/PrimaryButton';
import { colors, fonts, radii, typography } from '@/lib/theme';

interface StepShellProps {
  step: 1 | 2 | 3 | 4;
  title: string;
  subtitle?: string;
  canBack?: boolean;
  canNext: boolean;
  nextLabel?: string;
  isSubmitting?: boolean;
  errorMessage?: string | null;
  onNext: () => void;
  children: React.ReactNode;
}

const TOTAL_STEPS = 4;

/**
 * Shared chrome for the 4 onboarding steps: progress bar, back button,
 * question + body, sticky "Next" CTA. Keeps each step file focused on
 * its question + option list.
 */
export function StepShell({
  step,
  title,
  subtitle,
  canBack = step > 1,
  canNext,
  nextLabel = 'Next',
  isSubmitting,
  errorMessage,
  onNext,
  children,
}: StepShellProps) {
  const insets = useSafeAreaInsets();
  return (
    <View style={[styles.screen, { paddingTop: insets.top + 16 }]}>
      {/* Progress + back */}
      <View style={styles.header}>
        {canBack ? (
          <Pressable onPress={() => router.back()} hitSlop={12} style={styles.backBtn}>
            <Feather name="chevron-left" size={24} color={colors.text.primary} />
          </Pressable>
        ) : (
          <View style={styles.backBtn} />
        )}
        <View style={styles.progressTrack}>
          <View style={[styles.progressFill, { width: `${(step / TOTAL_STEPS) * 100}%` }]} />
        </View>
        <Text style={styles.stepCount}>
          {step}/{TOTAL_STEPS}
        </Text>
      </View>

      {/* Question */}
      <View style={styles.body}>
        <Text style={styles.title}>{title}</Text>
        {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}

        <View style={styles.options}>{children}</View>

        {errorMessage ? <Text style={styles.error}>{errorMessage}</Text> : null}
      </View>

      {/* Sticky CTA */}
      <View style={[styles.footer, { paddingBottom: Math.max(insets.bottom, 16) + 8 }]}>
        <PrimaryButton
          label={isSubmitting ? 'Saving…' : nextLabel}
          onPress={onNext}
          disabled={!canNext || isSubmitting}
          style={[styles.cta, (!canNext || isSubmitting) && styles.ctaDisabled]}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bg },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    gap: 12,
    marginBottom: 8,
  },
  backBtn: { width: 32, height: 32, justifyContent: 'center' },
  progressTrack: {
    flex: 1,
    height: 6,
    backgroundColor: colors.gray[200],
    borderRadius: radii.full,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.text.primary,
    borderRadius: radii.full,
  },
  stepCount: {
    fontFamily: fonts.label,
    fontSize: typography.size.xs,
    color: colors.text.muted,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  body: { flex: 1, paddingHorizontal: 24, paddingTop: 32 },
  title: {
    fontFamily: fonts.display,
    fontSize: typography.size['2xl'],
    color: colors.text.primary,
    letterSpacing: typography.size['2xl'] * typography.tracking.display,
  },
  subtitle: {
    fontFamily: fonts.body,
    fontSize: typography.size.base,
    color: colors.text.muted,
    marginTop: 8,
  },
  options: { marginTop: 32, gap: 12 },
  error: {
    fontFamily: fonts.body,
    fontSize: typography.size.sm,
    color: colors.rose,
    marginTop: 16,
  },
  footer: { paddingHorizontal: 24, paddingTop: 12, backgroundColor: colors.bg },
  cta: { alignSelf: 'stretch', justifyContent: 'center' },
  ctaDisabled: { opacity: 0.45 },
});
