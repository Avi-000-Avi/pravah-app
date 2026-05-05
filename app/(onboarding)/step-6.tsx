import { Pressable, StyleSheet, Text, View } from 'react-native';
import { OBShell } from '@/components/onboarding/OBShell';
import { useAuthStore } from '@/features/auth/store/authStore';
import { useOBStore } from '@/features/onboarding/store';
import { ob } from '@/features/onboarding/theme';

const GOAL_LABELS: Record<string, string> = {
  build_muscle: 'Build muscle',
  lose_fat: 'Lose fat',
  improve_fitness: 'Improve fitness',
  feel_better: 'Feel better',
};

const LOCATION_LABELS: Record<string, string> = {
  gym: 'Gym',
  home: 'Home',
  outdoors: 'Outdoors',
  mix: 'Mix',
};

const WEEK_DAYS = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
/** getDay() returns 0=Sun, so we map to Mon-based index */
const todayIndex = (new Date().getDay() + 6) % 7;

const QUICKSTART = [
  { emoji: '🥗', label: 'Log breakfast' },
  { emoji: '🏋️', label: 'See your plan' },
  { emoji: '🤝', label: 'Find your crew' },
];

export default function Step6Welcome() {
  const setOnboarded = useAuthStore((s) => s.setOnboarded);
  const { goal, sessionsPerWeek, trainingLocation, dietaryTags, reset } = useOBStore();

  function enterPravah() {
    reset(); // clear onboarding draft
    setOnboarded(true); // persisted to MMKV → route guard redirects to /(tabs)
  }

  const planParts = [
    goal ? GOAL_LABELS[goal] : null,
    `${sessionsPerWeek} sessions / week`,
    trainingLocation ? LOCATION_LABELS[trainingLocation] : null,
    dietaryTags.length > 0 ? dietaryTags[0] : null,
    '1,840 kcal',
  ].filter(Boolean);

  return (
    <OBShell
      step={6}
      stepLabel="Your flow begins"
      titleLine1="Day one."
      titleLine2="Already done."
      desc="You showed up. The hardest rep is always the first."
      ctaLabel="Enter Pravah"
      onCta={enterPravah}
    >
      {/* Welcome hero */}
      <View style={styles.welcomeHero}>
        <View style={styles.welcomeBadge}>
          <Text style={styles.welcomeEmoji}>🌊</Text>
        </View>
        <View style={styles.welcomeText}>
          <Text style={styles.welcomeTitle}>First flow unlocked</Text>
          <Text style={styles.welcomeSub}>Pravah member · day 1 streak</Text>
        </View>
      </View>

      {/* Plan summary */}
      <View style={styles.planSummary}>
        <Text style={styles.planSummaryLabel}>Your configuration</Text>
        <Text style={styles.planSummaryText}>{planParts.join(' · ')}</Text>
      </View>

      {/* Week streak */}
      <View style={styles.streakCard}>
        <Text style={styles.streakLbl}>This week</Text>
        <View style={styles.streakDays}>
          {WEEK_DAYS.map((day, i) => (
            <View key={i} style={[styles.streakDay, i === todayIndex && styles.streakDayToday]}>
              <Text style={[styles.streakDayText, i === todayIndex && styles.streakDayTextToday]}>
                {day}
              </Text>
            </View>
          ))}
        </View>
      </View>

      {/* Quickstart actions */}
      <View style={styles.quickstartCard}>
        <Text style={styles.quickstartLbl}>Start here</Text>
        <View style={styles.quickstartActions}>
          {QUICKSTART.map((q) => (
            <Pressable key={q.label} style={styles.qsAction} onPress={enterPravah}>
              <Text style={styles.qsEmoji}>{q.emoji}</Text>
              <Text style={styles.qsLabel}>{q.label}</Text>
            </Pressable>
          ))}
        </View>
      </View>
    </OBShell>
  );
}

const styles = StyleSheet.create({
  welcomeHero: {
    backgroundColor: ob.roseDeep,
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
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  welcomeEmoji: { fontSize: 26 },
  welcomeText: { flex: 1 },
  welcomeTitle: {
    fontFamily: ob.serif,
    fontSize: 20,
    color: '#ffffff',
    letterSpacing: -0.2,
    marginBottom: 3,
  },
  welcomeSub: {
    fontFamily: ob.sans,
    fontSize: 11,
    color: 'rgba(255,255,255,0.55)',
  },

  planSummary: {
    backgroundColor: ob.rosePale,
    borderWidth: 1,
    borderColor: ob.roseSoft,
    borderRadius: 14,
    padding: 14,
    marginBottom: 8,
  },
  planSummaryLabel: {
    fontFamily: ob.sansMedium,
    fontSize: 9,
    letterSpacing: 1.3,
    textTransform: 'uppercase',
    color: ob.rose,
    marginBottom: 6,
  },
  planSummaryText: {
    fontFamily: ob.serif,
    fontSize: 16,
    color: ob.roseDeep,
    lineHeight: 23,
  },

  streakCard: {
    backgroundColor: ob.surface,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: ob.border2,
    padding: 18,
    paddingHorizontal: 20,
    marginBottom: 8,
  },
  streakLbl: {
    fontFamily: ob.sansMedium,
    fontSize: 9,
    letterSpacing: 1.3,
    textTransform: 'uppercase',
    color: ob.ink3,
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
    backgroundColor: ob.bg,
    borderWidth: 1,
    borderColor: ob.border2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  streakDayToday: {
    borderWidth: 1.5,
    borderColor: ob.rose,
    backgroundColor: ob.rosePale,
  },
  streakDayText: {
    fontFamily: ob.sansMedium,
    fontSize: 10,
    color: ob.ink3,
  },
  streakDayTextToday: {
    color: ob.roseDeep,
  },

  quickstartCard: {
    backgroundColor: ob.surface,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: ob.border2,
    padding: 18,
    paddingHorizontal: 20,
    marginBottom: 8,
  },
  quickstartLbl: {
    fontFamily: ob.sansMedium,
    fontSize: 9,
    letterSpacing: 1.3,
    textTransform: 'uppercase',
    color: ob.ink3,
    marginBottom: 12,
  },
  quickstartActions: {
    flexDirection: 'row',
    gap: 8,
  },
  qsAction: {
    flex: 1,
    backgroundColor: ob.rosePale,
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 10,
    alignItems: 'center',
  },
  qsEmoji: {
    fontSize: 20,
    marginBottom: 6,
  },
  qsLabel: {
    fontFamily: ob.sansMedium,
    fontSize: 10,
    color: ob.ink2,
    textAlign: 'center',
  },
});
