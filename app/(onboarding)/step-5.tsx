import { router } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';
import { DIET_LABELS, GOAL_LABELS, OnboardingShell, useOnboarding } from '@/features/onboarding';
import { fonts, onboarding } from '@/lib/theme';

export default function Step5Review() {
  const { answers } = useOnboarding();
  const canContinue =
    answers.dietType !== null &&
    answers.goal !== null &&
    answers.mealCount !== null &&
    answers.prepTimeMaxMin !== null;

  return (
    <OnboardingShell
      step={5}
      stepLabel="Step 05 / Review"
      titleLine1="This is the version"
      titleLine2="we’ll start from."
      desc="Nothing here is permanent. It just gives Pravah enough signal to reduce your daily decision load."
      navActionLabel="Back"
      onNavAction={() => router.back()}
      ctaLabel="Build my plan"
      ctaDisabled={!canContinue}
      onCta={() => router.push('/(onboarding)/step-6')}
    >
      <View style={styles.summaryCard}>
        <SummaryRow
          label="Food style"
          value={answers.dietType ? DIET_LABELS[answers.dietType] : 'Not set'}
        />
        <SummaryRow label="Goal" value={answers.goal ? GOAL_LABELS[answers.goal] : 'Not set'} />
        <SummaryRow label="Meals / day" value={String(answers.mealCount)} />
        <SummaryRow label="Prep window" value={`Up to ${answers.prepTimeMaxMin} minutes`} />
      </View>

      <View style={styles.noteCard}>
        <Text style={styles.noteTitle}>What happens next</Text>
        <Text style={styles.noteBody}>
          Your first plan will use these settings as defaults. You can refine preferences later
          without redoing onboarding.
        </Text>
      </View>
    </OnboardingShell>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.summaryRow}>
      <Text style={styles.summaryLabel}>{label}</Text>
      <Text style={styles.summaryValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  summaryCard: {
    backgroundColor: onboarding.surface,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: onboarding.borderSubtle,
    paddingHorizontal: 20,
  },
  summaryRow: {
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: onboarding.borderSubtle,
  },
  summaryLabel: {
    fontFamily: fonts.body,
    fontSize: 11,
    textTransform: 'uppercase',
    letterSpacing: 1,
    color: onboarding.textSecondary,
    marginBottom: 6,
  },
  summaryValue: {
    fontFamily: fonts.displayRegular,
    fontSize: 20,
    color: onboarding.accentDeep,
  },
  noteCard: {
    marginTop: 14,
    backgroundColor: onboarding.accentPale,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: onboarding.accentSoft,
    padding: 14,
  },
  noteTitle: {
    fontFamily: fonts.body,
    fontSize: 12,
    color: onboarding.accentDeep,
    marginBottom: 4,
  },
  noteBody: {
    fontFamily: fonts.body,
    fontSize: 11,
    color: onboarding.textSecondary,
    lineHeight: 18,
  },
});
