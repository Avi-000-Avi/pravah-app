import { router } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { DIET_LABELS, GOAL_LABELS, OnboardingShell, useOnboarding } from '@/features/onboarding';
import { fonts, onboarding } from '@/lib/theme';

const WEEK_DAYS = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
const TODAY_INDEX = (new Date().getDay() + 6) % 7;

const QUICKSTART = [
  { emoji: '🥗', label: 'See your meals' },
  { emoji: '🏋️', label: 'Open today' },
  { emoji: '🛒', label: 'Check grocery' },
];

export default function Step6Launch() {
  const { answers, submit, isSubmitting, submitError, clearError } = useOnboarding();

  const summary = [
    answers.dietType ? DIET_LABELS[answers.dietType] : null,
    answers.goal ? GOAL_LABELS[answers.goal] : null,
    answers.mealCount !== null ? `${answers.mealCount} meals / day` : null,
    answers.prepTimeMaxMin !== null ? `Prep ≤ ${answers.prepTimeMaxMin} min` : null,
  ]
    .filter(Boolean)
    .join(' · ');

  return (
    <OnboardingShell
      step={6}
      stepLabel="Step 06 / Launch"
      titleLine1="Day one."
      titleLine2="Already lighter."
      desc="We have enough signal to start making smaller daily decisions on your behalf."
      navActionLabel="Back"
      onNavAction={() => {
        clearError();
        router.back();
      }}
      ctaLabel={isSubmitting ? 'Saving your flow…' : 'Enter Pravah'}
      ctaDisabled={isSubmitting}
      onCta={() => {
        void submit();
      }}
    >
      <View style={styles.welcomeHero}>
        <View style={styles.welcomeBadge}>
          <Text style={styles.welcomeEmoji}>🌊</Text>
        </View>
        <View style={styles.welcomeText}>
          <Text style={styles.welcomeTitle}>First flow unlocked</Text>
          <Text style={styles.welcomeSub}>Zero-decision plan ready</Text>
        </View>
      </View>

      <View style={styles.planSummary}>
        <Text style={styles.planSummaryLabel}>Your configuration</Text>
        <Text style={styles.planSummaryText}>{summary}</Text>
      </View>

      <View style={styles.streakCard}>
        <Text style={styles.streakLbl}>This week</Text>
        <View style={styles.streakDays}>
          {WEEK_DAYS.map((day, index) => (
            <View
              key={day + index}
              style={[styles.streakDay, index === TODAY_INDEX && styles.streakDayToday]}
            >
              <Text
                style={[styles.streakDayText, index === TODAY_INDEX && styles.streakDayTextToday]}
              >
                {day}
              </Text>
            </View>
          ))}
        </View>
      </View>

      <View style={styles.quickstartCard}>
        <Text style={styles.quickstartLbl}>Start here</Text>
        <View style={styles.quickstartActions}>
          {QUICKSTART.map((item) => (
            <Pressable key={item.label} style={styles.qsAction}>
              <Text style={styles.qsEmoji}>{item.emoji}</Text>
              <Text style={styles.qsLabel}>{item.label}</Text>
            </Pressable>
          ))}
        </View>
      </View>

      {submitError ? <Text style={styles.errorText}>{submitError}</Text> : null}
    </OnboardingShell>
  );
}

const styles = StyleSheet.create({
  welcomeHero: {
    backgroundColor: onboarding.accentDeep,
    borderRadius: 18,
    padding: 22,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    marginBottom: 8,
  },
  welcomeBadge: {
    width: 52,
    height: 52,
    borderRadius: 14,
    backgroundColor: onboarding.heroChipBorder,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  welcomeEmoji: { fontSize: 26 },
  welcomeText: { flex: 1 },
  welcomeTitle: {
    fontFamily: fonts.displayRegular,
    fontSize: 20,
    color: onboarding.heroText,
    letterSpacing: -0.2,
    marginBottom: 3,
  },
  welcomeSub: {
    fontFamily: fonts.body,
    fontSize: 11,
    color: onboarding.heroTextSoft,
  },
  planSummary: {
    backgroundColor: onboarding.accentPale,
    borderWidth: 1,
    borderColor: onboarding.accentSoft,
    borderRadius: 14,
    padding: 14,
    marginBottom: 8,
  },
  planSummaryLabel: {
    fontFamily: fonts.body,
    fontSize: 9,
    letterSpacing: 1.3,
    textTransform: 'uppercase',
    color: onboarding.accent,
    marginBottom: 6,
  },
  planSummaryText: {
    fontFamily: fonts.displayRegular,
    fontSize: 16,
    color: onboarding.accentDeep,
    lineHeight: 23,
  },
  streakCard: {
    backgroundColor: onboarding.surface,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: onboarding.borderSubtle,
    padding: 18,
    paddingHorizontal: 20,
    marginBottom: 8,
  },
  streakLbl: {
    fontFamily: fonts.body,
    fontSize: 9,
    letterSpacing: 1.3,
    textTransform: 'uppercase',
    color: onboarding.textMuted,
    marginBottom: 12,
  },
  streakDays: {
    flexDirection: 'row',
    gap: 6,
  },
  streakDay: {
    flex: 1,
    height: 36,
    borderRadius: 10,
    backgroundColor: onboarding.bg,
    borderWidth: 1,
    borderColor: onboarding.borderSubtle,
    alignItems: 'center',
    justifyContent: 'center',
  },
  streakDayToday: {
    borderWidth: 1.5,
    borderColor: onboarding.accent,
    backgroundColor: onboarding.accentPale,
  },
  streakDayText: {
    fontFamily: fonts.body,
    fontSize: 10,
    color: onboarding.textMuted,
  },
  streakDayTextToday: {
    color: onboarding.accentDeep,
  },
  quickstartCard: {
    backgroundColor: onboarding.surface,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: onboarding.borderSubtle,
    padding: 18,
    paddingHorizontal: 20,
    marginBottom: 8,
  },
  quickstartLbl: {
    fontFamily: fonts.body,
    fontSize: 9,
    letterSpacing: 1.3,
    textTransform: 'uppercase',
    color: onboarding.textMuted,
    marginBottom: 12,
  },
  quickstartActions: {
    gap: 10,
  },
  qsAction: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderRadius: 14,
    backgroundColor: onboarding.accentPale,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  qsEmoji: {
    fontSize: 16,
  },
  qsLabel: {
    fontFamily: fonts.body,
    fontSize: 13,
    color: onboarding.accentDeep,
  },
  errorText: {
    marginTop: 14,
    fontFamily: fonts.body,
    fontSize: 12,
    color: onboarding.accentDeep,
    textAlign: 'center',
  },
});
