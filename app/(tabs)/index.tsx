/**
 * Today screen — Pravah home tab.
 * Design ref: today.jsx from Pravah.html design bundle.
 */
import { MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useEffect, useRef } from 'react';
import { Animated, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useTodayWorkout } from '@/features/workouts';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ProgressRing } from '@/components/ProgressRing';
import { useAppStore } from '@/stores/appStore';
import { colors, fonts, radii, shadows, spacing, typography } from '@/lib/theme';

function getGreeting(): string {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 17) return 'Good afternoon';
  return 'Good evening';
}

function getFormattedDate(): string {
  return new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' });
}

function formatWorkoutMinutes(durationMin: number): string {
  return `${durationMin} min`;
}

function formatWorkoutMinutesFromSeconds(durationSec: number | null): string | null {
  if (durationSec == null) {
    return null;
  }

  return `${Math.max(1, Math.round(durationSec / 60))} min`;
}

export default function TodayScreen() {
  const insets = useSafeAreaInsets();
  const { user, today, bumpProgress } = useAppStore();
  const workoutQuery = useTodayWorkout(today.workout.name);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 600,
      delay: 200,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim]);

  const hour = new Date().getHours();
  const selectedWorkout = workoutQuery.todayWorkout.workout;
  const workoutName = selectedWorkout?.name ?? today.workout.name;
  const workoutDurationLabel = formatWorkoutMinutes(
    selectedWorkout?.duration_min ?? today.workout.durationMin,
  );
  const completedWorkoutDurationLabel =
    formatWorkoutMinutesFromSeconds(workoutQuery.todayWorkout.plan?.duration_sec ?? null) ??
    workoutDurationLabel;
  const workoutDone =
    workoutQuery.todayWorkout.status === 'completed' || today.workout.status === 'completed';

  const nextAction = (() => {
    if (!workoutDone && hour >= 7 && hour < 10)
      return {
        label: 'Time to train',
        sub: workoutName,
        cta: 'Start Workout',
        screen: '/(tabs)/workout' as const,
        color: colors.mint,
      };
    if (today.meals.done < today.meals.total) {
      const i = Math.min(today.meals.done, 2);
      const labels = ['Breakfast ready', 'Lunch ready', 'Dinner ready'];
      const subs = [
        'Dal Paratha · Curd · Banana',
        'Paneer Bowl · Roti · Salad',
        'Moong Dal · Rice · Sabzi',
      ];
      return {
        label: labels[i] ?? 'Meal ready',
        sub: subs[i] ?? '',
        cta: 'Eat Now',
        screen: '/(tabs)/meals' as const,
        color: colors.sky,
      };
    }
    if (!workoutDone)
      return {
        label: 'Workout pending',
        sub: workoutName,
        cta: 'Start Workout',
        screen: '/(tabs)/workout' as const,
        color: colors.mint,
      };
    return {
      label: "You're crushing it",
      sub: 'All tasks complete for today',
      cta: 'See Progress',
      screen: '/(tabs)/profile' as const,
      color: colors.lavender,
    };
  })();

  const STREAK_DAYS = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

  return (
    <ScrollView
      style={st.screen}
      contentContainerStyle={{ paddingBottom: 120 }}
      showsVerticalScrollIndicator={false}
    >
      {/* Top bar */}
      <View style={[st.topBar, { paddingTop: insets.top + 12 }]}>
        <View style={st.topBarL}>
          <View style={st.avatar}>
            <Text style={st.avatarTxt}>{user.name.charAt(0).toUpperCase()}</Text>
          </View>
          <Text style={st.brand}>Pravah</Text>
        </View>
        <MaterialIcons name="notifications-none" size={22} color={colors.rose} />
      </View>

      {/* Greeting */}
      <View style={st.greet}>
        <Text style={st.greetTxt}>
          {getGreeting()},{'\n'}
          <Text style={st.greetName}>{user.name}.</Text>
        </Text>
        <Text style={st.dateTxt}>{getFormattedDate()}</Text>
      </View>

      {/* Progress + Next Action */}
      <Animated.View style={[st.heroRow, { opacity: fadeAnim }]}>
        <View style={[st.progressCard, shadows.card]}>
          <ProgressRing size={80} strokeWidth={5} percent={today.progress} color={colors.rose}>
            <Text style={st.progressNum}>{today.progress}</Text>
            <Text style={st.progressPct}>%</Text>
          </ProgressRing>
          <Text style={st.progressLbl}>{"Today's\nProgress"}</Text>
          <View style={st.barTrack}>
            <View style={[st.barFill, { width: `${today.progress}%` as `${number}%` }]} />
          </View>
        </View>

        <Pressable
          style={[st.nextCard, shadows.card]}
          onPress={() => {
            bumpProgress(6);
            router.push(nextAction.screen);
          }}
        >
          <View style={[st.nextDecor, { backgroundColor: nextAction.color }]} />
          <Text style={st.nextOverline}>Next Action</Text>
          <Text style={st.nextTitle}>{nextAction.label}</Text>
          <Text style={st.nextSub} numberOfLines={2}>
            {nextAction.sub}
          </Text>
          <View style={st.nextCta}>
            <Text style={st.nextCtaTxt}>{nextAction.cta}</Text>
          </View>
        </Pressable>
      </Animated.View>

      {/* Stat rings */}
      <View style={st.statRow}>
        {[
          { label: 'Protein', val: '89g', pct: 74, color: colors.mint },
          {
            label: 'Sleep',
            val: `${today.sleep}h`,
            pct: Math.round((today.sleep / 8) * 100),
            color: colors.sky,
          },
          { label: 'Steps', val: '4.8k', pct: 48, color: colors.lavender },
        ].map((item) => (
          <View key={item.label} style={[st.statCard, shadows.cardSubtle]}>
            <ProgressRing size={56} strokeWidth={3.5} percent={item.pct} color={item.color}>
              <Text style={st.statVal}>{item.val}</Text>
            </ProgressRing>
            <Text style={st.statLbl}>{item.label}</Text>
          </View>
        ))}
      </View>

      {/* Your day */}
      <View style={st.section}>
        <Text style={st.sectionHead}>Your day</Text>
        <View style={st.rows}>
          <Pressable
            style={({ pressed }) => [st.row, pressed && st.rowP]}
            onPress={() => router.push('/(tabs)/meals')}
          >
            <View style={[st.rowIcon, { backgroundColor: `${colors.sky}88` }]}>
              <MaterialIcons name="restaurant" size={18} color={colors.eggplant} />
            </View>
            <View style={st.rowTxt}>
              <Text
                style={st.rowTitle}
              >{`Meals · ${today.meals.done} of ${today.meals.total} done`}</Text>
              <Text style={st.rowSub}>
                {today.meals.done < today.meals.total
                  ? `Next: ${['Breakfast', 'Lunch', 'Dinner'][today.meals.done] ?? 'Meal'}`
                  : 'All meals logged ✓'}
              </Text>
            </View>
            <View style={st.dotRow}>
              {Array.from({ length: today.meals.total }, (_, i) => (
                <View
                  key={i}
                  style={[
                    st.dot,
                    { backgroundColor: i < today.meals.done ? colors.mint : colors.tonal },
                  ]}
                />
              ))}
            </View>
          </Pressable>

          <Pressable
            style={({ pressed }) => [st.row, pressed && st.rowP]}
            onPress={() => router.push('/(tabs)/workout')}
          >
            <View style={[st.rowIcon, { backgroundColor: `${colors.mint}66` }]}>
              <MaterialIcons name="fitness-center" size={18} color={colors.eggplant} />
            </View>
            <View style={st.rowTxt}>
              <Text style={st.rowTitle}>{workoutDone ? 'Workout complete ✓' : workoutName}</Text>
              <Text style={st.rowSub}>
                {workoutDone
                  ? `${workoutName} · ${completedWorkoutDurationLabel}`
                  : `${workoutDurationLabel} · ${workoutName}`}
              </Text>
            </View>
            <View style={[st.chip, { backgroundColor: workoutDone ? colors.mint : colors.tonal }]}>
              <Text style={st.chipTxt}>{workoutDone ? 'Done' : 'Pending'}</Text>
            </View>
          </Pressable>

          <Pressable
            style={({ pressed }) => [st.row, pressed && st.rowP]}
            onPress={() => router.push('/(tabs)/chat')}
          >
            <View style={[st.rowIcon, { backgroundColor: `${colors.lavender}aa` }]}>
              <MaterialIcons name="bedtime" size={18} color={colors.eggplant} />
            </View>
            <View style={st.rowTxt}>
              <Text style={st.rowTitle}>
                {today.sleep < 6 ? 'Low sleep detected' : 'Recovery good'}
              </Text>
              <Text style={st.rowSub}>
                {today.sleep < 6
                  ? `${today.sleep}h · Light workout suggested`
                  : `${today.sleep}h · You're well rested`}
              </Text>
            </View>
            <MaterialIcons
              name={today.sleep < 6 ? 'warning' : 'check-circle'}
              size={18}
              color={today.sleep < 6 ? colors.rose : colors.mint}
            />
          </Pressable>
        </View>
      </View>

      {/* Streak */}
      <View style={st.section}>
        <View style={[st.streakCard, { backgroundColor: colors.lavender }]}>
          <View>
            <Text style={st.streakTitle}>🔥 {user.streak}-day streak</Text>
            <Text style={st.streakSub}>You're someone who doesn't miss.</Text>
          </View>
          <View style={st.dayDots}>
            {STREAK_DAYS.map((d, i) => (
              <View
                key={i}
                style={[
                  st.dayDot,
                  { backgroundColor: i < user.streak % 7 ? colors.rose : `${colors.warmBrown}22` },
                ]}
              >
                <Text
                  style={[st.dayDotTxt, { color: i < user.streak % 7 ? '#fff' : colors.warmBrown }]}
                >
                  {d}
                </Text>
              </View>
            ))}
          </View>
        </View>
      </View>

      {/* Grocery */}
      <View style={st.section}>
        <Pressable
          style={({ pressed }) => [
            st.groceryCard,
            shadows.cardSubtle,
            pressed && { opacity: 0.85 },
          ]}
          onPress={() => router.push('/(tabs)/grocery')}
        >
          <MaterialIcons name="shopping-cart" size={24} color={colors.rose} />
          <View style={{ flex: 1 }}>
            <Text style={st.groceryTitle}>Grocery restock needed</Text>
            <Text style={st.grocerySub}>Eggs, Paneer, Milk running low</Text>
          </View>
          <MaterialIcons name="chevron-right" size={20} color={colors.warmBrown} />
        </Pressable>
      </View>
    </ScrollView>
  );
}

const st = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bg },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.gutter,
    paddingBottom: 12,
    backgroundColor: colors.tonal,
  },
  topBarL: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.rose,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarTxt: { fontFamily: fonts.bodyBold, fontSize: 14, color: '#fff' },
  brand: {
    fontFamily: fonts.displayItalic,
    fontSize: typography.size.lg,
    color: colors.text.primary,
  },
  greet: {
    paddingHorizontal: spacing.gutter,
    paddingTop: 20,
    paddingBottom: 16,
    backgroundColor: colors.tonal,
  },
  greetTxt: {
    fontFamily: fonts.displayRegular,
    fontSize: 26,
    color: colors.text.primary,
    lineHeight: 31,
  },
  greetName: { fontFamily: fonts.displayItalic, fontSize: 26 },
  dateTxt: {
    fontFamily: fonts.body,
    fontSize: typography.size.sm,
    color: colors.text.secondary,
    marginTop: 4,
  },
  heroRow: {
    flexDirection: 'row',
    gap: 14,
    paddingHorizontal: spacing.gutter,
    paddingTop: 16,
    alignItems: 'stretch',
  },
  progressCard: {
    backgroundColor: colors.surface,
    borderRadius: radii.card,
    padding: 18,
    alignItems: 'center',
    gap: 10,
    width: 110,
  },
  progressNum: {
    fontFamily: fonts.statsThin,
    fontSize: 22,
    color: colors.text.primary,
    lineHeight: 22,
  },
  progressPct: { fontFamily: fonts.body, fontSize: 9, color: colors.text.secondary },
  progressLbl: {
    fontFamily: fonts.label,
    fontSize: 9,
    color: colors.text.secondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    textAlign: 'center',
  },
  barTrack: {
    height: 4,
    width: '100%',
    borderRadius: 2,
    backgroundColor: colors.tonal,
    overflow: 'hidden',
  },
  barFill: { height: '100%', backgroundColor: colors.rose, borderRadius: 2 },
  nextCard: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: radii.card,
    padding: 18,
    overflow: 'hidden',
    position: 'relative',
    gap: 4,
  },
  nextDecor: {
    position: 'absolute',
    top: -10,
    right: -10,
    width: 80,
    height: 80,
    borderRadius: 40,
    opacity: 0.18,
  },
  nextOverline: {
    fontFamily: fonts.label,
    fontSize: typography.size.xs,
    color: colors.primary,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  nextTitle: {
    fontFamily: fonts.display,
    fontSize: typography.size.lg,
    color: colors.text.primary,
    lineHeight: typography.size.lg * 1.2,
  },
  nextSub: {
    fontFamily: fonts.body,
    fontSize: typography.size.sm,
    color: colors.text.secondary,
    lineHeight: typography.size.sm * 1.4,
  },
  nextCta: {
    marginTop: 8,
    backgroundColor: colors.rose,
    borderRadius: radii.pill,
    paddingVertical: 10,
    paddingHorizontal: 18,
    alignSelf: 'flex-start',
  },
  nextCtaTxt: {
    fontFamily: fonts.bodyBold,
    fontSize: 11,
    color: '#fff',
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  statRow: { flexDirection: 'row', gap: 10, paddingHorizontal: spacing.gutter, paddingTop: 14 },
  statCard: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: radii.card,
    padding: 14,
    alignItems: 'center',
    gap: 6,
  },
  statVal: { fontFamily: fonts.statsThin, fontSize: 13, color: colors.text.primary },
  statLbl: {
    fontFamily: fonts.label,
    fontSize: 9,
    color: colors.text.secondary,
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  section: { paddingHorizontal: spacing.gutter, paddingTop: 20 },
  sectionHead: {
    fontFamily: fonts.display,
    fontSize: typography.size.xl,
    color: colors.text.primary,
    marginBottom: 12,
  },
  rows: { gap: 8 },
  row: {
    backgroundColor: colors.surface,
    borderRadius: radii.lg,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  rowP: { backgroundColor: colors.surfaceHigh },
  rowIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  rowTxt: { flex: 1, minWidth: 0 },
  rowTitle: {
    fontFamily: fonts.bodySemi,
    fontSize: typography.size.base,
    color: colors.text.primary,
  },
  rowSub: {
    fontFamily: fonts.body,
    fontSize: typography.size.sm,
    color: colors.text.secondary,
    marginTop: 1,
  },
  dotRow: { flexDirection: 'row', gap: 4 },
  dot: { width: 8, height: 8, borderRadius: 4 },
  chip: { borderRadius: radii.pill, paddingHorizontal: 10, paddingVertical: 4 },
  chipTxt: { fontFamily: fonts.label, fontSize: typography.size.xs, color: colors.eggplant },
  streakCard: {
    borderRadius: radii.card,
    padding: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  streakTitle: { fontFamily: fonts.display, fontSize: typography.size.xl, color: colors.eggplant },
  streakSub: {
    fontFamily: fonts.body,
    fontSize: typography.size.sm,
    color: `${colors.eggplant}aa`,
    marginTop: 2,
  },
  dayDots: { flexDirection: 'row', gap: 4 },
  dayDot: {
    width: 22,
    height: 22,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dayDotTxt: { fontFamily: fonts.bodyBold, fontSize: 9 },
  groceryCard: {
    backgroundColor: colors.surface,
    borderRadius: radii.card,
    padding: 18,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  groceryTitle: {
    fontFamily: fonts.bodySemi,
    fontSize: typography.size.base,
    color: colors.text.primary,
  },
  grocerySub: {
    fontFamily: fonts.body,
    fontSize: typography.size.sm,
    color: colors.text.secondary,
  },
});
