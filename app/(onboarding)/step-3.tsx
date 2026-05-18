import { router } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { MEAL_COUNT_OPTIONS, OnboardingShell, useOnboardingStore } from '@/features/onboarding';
import { fonts, onboarding } from '@/lib/theme';

const PREVIEW = [
  { label: '2 meals', sub: 'A simpler lunch + dinner rhythm' },
  { label: '3 meals', sub: 'Classic breakfast, lunch, dinner flow' },
  { label: '4+ meals', sub: 'More spread-out protein and snack support' },
];

export default function Step3MealCount() {
  const mealCount = useOnboardingStore((state) => state.mealCount);
  const setField = useOnboardingStore((state) => state.setField);

  return (
    <OnboardingShell
      step={3}
      stepLabel="Step 03 / Daily rhythm"
      titleLine1="How many meal"
      titleLine2="moments fit your day?"
      desc="Pick the cadence you can repeat on busy weekdays, not your most perfect day."
      navActionLabel="Back"
      onNavAction={() => router.back()}
      ctaLabel="These look right"
      ctaDisabled={mealCount === null}
      onCta={() => router.push('/(onboarding)/step-4')}
    >
      <View style={styles.stepperCard}>
        <Text style={styles.stepperQ}>Meals per day</Text>
        <View style={styles.stepperRow}>
          {MEAL_COUNT_OPTIONS.map((count) => {
            const selected = count === mealCount;

            return (
              <Pressable
                key={count}
                style={[styles.stepperPill, selected && styles.stepperPillSelected]}
                onPress={() => setField('mealCount', count)}
              >
                <Text style={[styles.stepperPillText, selected && styles.stepperPillTextSelected]}>
                  {count}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </View>

      <Text style={styles.sectionLabel}>What this means</Text>
      <View style={styles.previewCard}>
        {PREVIEW.map((item, index) => (
          <View
            key={item.label}
            style={[styles.previewRow, index < PREVIEW.length - 1 && styles.previewBorder]}
          >
            <Text style={styles.previewTitle}>{item.label}</Text>
            <Text style={styles.previewSub}>{item.sub}</Text>
          </View>
        ))}
      </View>
    </OnboardingShell>
  );
}

const styles = StyleSheet.create({
  stepperCard: {
    backgroundColor: onboarding.surface,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: onboarding.borderSubtle,
    padding: 20,
    marginBottom: 8,
  },
  stepperQ: {
    fontFamily: fonts.body,
    fontSize: 13,
    color: onboarding.textSecondary,
    lineHeight: 20,
    marginBottom: 18,
  },
  stepperRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  stepperPill: {
    minWidth: 52,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: onboarding.border,
    backgroundColor: onboarding.bg,
    alignItems: 'center',
  },
  stepperPillSelected: {
    backgroundColor: onboarding.accentSoft,
    borderColor: onboarding.accentDeep,
  },
  stepperPillText: {
    fontFamily: fonts.displayRegular,
    fontSize: 20,
    color: onboarding.accentDeep,
  },
  stepperPillTextSelected: {
    color: onboarding.accentDeep,
  },
  sectionLabel: {
    fontFamily: fonts.uiSemi,
    fontSize: 9,
    letterSpacing: 1.3,
    textTransform: 'uppercase',
    color: onboarding.accentDeep,
    marginTop: 20,
    marginBottom: 10,
  },
  previewCard: {
    backgroundColor: onboarding.surface,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: onboarding.borderSubtle,
    overflow: 'hidden',
  },
  previewRow: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  previewBorder: {
    borderBottomWidth: 1,
    borderBottomColor: onboarding.borderSubtle,
  },
  previewTitle: {
    fontFamily: fonts.displayRegular,
    fontSize: 16,
    color: onboarding.accentDeep,
    marginBottom: 3,
  },
  previewSub: {
    fontFamily: fonts.body,
    fontSize: 12,
    color: onboarding.textSecondary,
    lineHeight: 18,
  },
});
