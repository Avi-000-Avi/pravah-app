/**
 * Flow / Workout screen — Pravah tab.
 * Design ref: workout.jsx from Pravah.html design bundle.
 *
 * Phases: overview → active → rest (countdown ring) → done
 * Interactive: set counter, rest timer, workout completion → updates global state
 */
import { MaterialIcons } from '@expo/vector-icons';
import React, { useEffect, useRef, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ProgressRing } from '@/components/ProgressRing';
import { useAppStore } from '@/stores/appStore';
import { colors, fonts, radii, shadows, spacing, typography } from '@/lib/theme';

type Phase = 'overview' | 'active' | 'rest' | 'done';

const WORKOUT = {
  name: 'Upper Body Strength',
  duration: '45 min',
  exercises: [
    {
      name: 'Bench Press',
      sets: 3,
      reps: '8–10',
      weight: '60kg',
      prevWeight: '58kg',
      muscle: 'Chest',
    },
    {
      name: 'Overhead Press',
      sets: 3,
      reps: '8–10',
      weight: '40kg',
      prevWeight: '38kg',
      muscle: 'Shoulders',
    },
    {
      name: 'Bent Over Row',
      sets: 3,
      reps: '10–12',
      weight: '55kg',
      prevWeight: '55kg',
      muscle: 'Back',
    },
    {
      name: 'Tricep Dips',
      sets: 3,
      reps: '12–15',
      weight: 'Body',
      prevWeight: 'Body',
      muscle: 'Triceps',
    },
    {
      name: 'Bicep Curl',
      sets: 3,
      reps: '12',
      weight: '15kg',
      prevWeight: '14kg',
      muscle: 'Biceps',
    },
  ],
};

const fmt = (s: number) =>
  `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;

export default function WorkoutScreen() {
  const insets = useSafeAreaInsets();
  const { user, today, setWorkoutDone } = useAppStore();
  const [phase, setPhase] = useState<Phase>('overview');
  const [exIdx, setExIdx] = useState(0);
  const [setNum, setSetNum] = useState(1);
  const [restSec, setRestSec] = useState(60);
  const [restActive, setRestActive] = useState(false);
  const [completedSets, setCompletedSets] = useState<Record<string, number>>({});
  const [elapsed, setElapsed] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const ex = WORKOUT.exercises[exIdx]!;
  const totalSets = WORKOUT.exercises.reduce((a, e) => a + e.sets, 0);
  const doneSets = Object.values(completedSets).reduce((a, b) => a + b, 0);
  const pct = Math.round((doneSets / totalSets) * 100);

  useEffect(() => {
    if (phase === 'active') {
      timerRef.current = setInterval(() => setElapsed((e) => e + 1), 1000);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [phase]);

  useEffect(() => {
    if (!restActive) return;
    const iv = setInterval(() => {
      setRestSec((s) => {
        if (s <= 1) {
          clearInterval(iv);
          setRestActive(false);
          setPhase('active');
          return 60;
        }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(iv);
  }, [restActive]);

  const doneSet = () => {
    const key = `${exIdx}-${setNum}`;
    setCompletedSets((c) => ({ ...c, [key]: 1 }));
    if (setNum < ex.sets) {
      setSetNum((n) => n + 1);
      setRestSec(60);
      setRestActive(true);
      setPhase('rest');
    } else if (exIdx < WORKOUT.exercises.length - 1) {
      setExIdx((i) => i + 1);
      setSetNum(1);
      setRestSec(90);
      setRestActive(true);
      setPhase('rest');
    } else {
      setPhase('done');
      setWorkoutDone();
    }
  };

  // ── Overview ─────────────────────────────────────────────────────────────
  if (phase === 'overview')
    return (
      <ScrollView
        style={st.screen}
        contentContainerStyle={{ paddingBottom: 120 }}
        showsVerticalScrollIndicator={false}
      >
        <View style={[st.topBar, { paddingTop: insets.top + 12 }]}>
          <View style={st.topBarL}>
            <View style={st.avatar}>
              <Text style={st.avatarTxt}>{user.name.charAt(0).toUpperCase()}</Text>
            </View>
            <Text style={st.brand}>Pravah</Text>
          </View>
          <MaterialIcons name="notifications-none" size={22} color={colors.rose} />
        </View>
        <View style={st.content}>
          <Text style={st.title}>
            <Text style={st.titleI}>Today's workout</Text>
          </Text>
          <Text style={st.subtitle}>
            {today.sleep < 6
              ? '⚠️ Low sleep — intensity reduced 10%'
              : 'Recovery optimal · Full intensity'}
          </Text>

          <View style={[st.heroCard, shadows.card]}>
            <View style={st.heroDecor} />
            <Text style={st.overline}>Ready to train</Text>
            <Text style={st.heroTitle}>{WORKOUT.name}</Text>
            <View style={st.heroChips}>
              <View style={[st.chip, { backgroundColor: colors.mint }]}>
                <Text style={st.chipTxt}>⏱ {WORKOUT.duration}</Text>
              </View>
              <View style={[st.chip, { backgroundColor: colors.lavender }]}>
                <Text style={st.chipTxt}>{WORKOUT.exercises.length} exercises</Text>
              </View>
              <View style={[st.chip, { backgroundColor: colors.sky }]}>
                <Text style={st.chipTxt}>{totalSets} sets</Text>
              </View>
            </View>
            <Pressable style={st.startBtn} onPress={() => setPhase('active')}>
              <Text style={st.startBtnTxt}>🔥 Start Workout</Text>
            </Pressable>
          </View>

          <Text style={st.sectionHead}>Exercises</Text>
          <View style={st.exList}>
            {WORKOUT.exercises.map((e, i) => (
              <View key={i} style={[st.exRow, shadows.cardSubtle]}>
                <View style={[st.exIcon, { backgroundColor: `${colors.mint}55` }]}>
                  <MaterialIcons name="fitness-center" size={18} color={colors.eggplant} />
                </View>
                <View style={st.exTxt}>
                  <Text style={st.exName}>{e.name}</Text>
                  <Text style={st.exMeta}>
                    {e.sets} sets · {e.reps} reps · {e.weight}
                  </Text>
                </View>
                {e.weight !== e.prevWeight && <Text style={st.pr}>↑ PR</Text>}
              </View>
            ))}
          </View>

          {today.sleep < 6 && (
            <View style={[st.alertCard, { backgroundColor: `${colors.sky}66` }]}>
              <Text style={st.alertTitle}>💤 Low sleep mode active</Text>
              <Text style={st.alertBody}>
                Weights reduced 10% · Rest extended to 90s · Skip to recovery if you feel off
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
    );

  // ── Rest ─────────────────────────────────────────────────────────────────
  if (phase === 'rest')
    return (
      <View style={[st.screen, st.centered]}>
        <Text style={st.restLabel}>Rest</Text>
        <ProgressRing size={160} strokeWidth={6} percent={(restSec / 90) * 100} color={colors.sky}>
          <Text style={st.restTime}>{fmt(restSec)}</Text>
        </ProgressRing>
        <Text style={st.restNextTitle}>
          {setNum < ex.sets
            ? `Next: Set ${setNum + 1} of ${ex.sets}`
            : `Next: ${WORKOUT.exercises[Math.min(exIdx + 1, WORKOUT.exercises.length - 1)]?.name ?? 'Done'}`}
        </Text>
        <Text style={st.restNextSub}>
          {ex.name} · {ex.weight}
        </Text>
        <Pressable
          style={[st.startBtn, { marginTop: 32 }]}
          onPress={() => {
            setRestActive(false);
            setPhase('active');
          }}
        >
          <Text style={st.startBtnTxt}>Skip Rest</Text>
        </Pressable>
      </View>
    );

  // ── Done ─────────────────────────────────────────────────────────────────
  if (phase === 'done')
    return (
      <View style={[st.screen, st.centered, { padding: 40 }]}>
        <Text style={{ fontSize: 64, marginBottom: 16 }}>🏆</Text>
        <Text style={st.doneTitle}>Workout complete!</Text>
        <Text style={st.doneSub}>
          {fmt(elapsed)} · {totalSets} sets · You're consistent.
        </Text>
        <View style={st.doneChips}>
          <View style={[st.chip, { backgroundColor: colors.mint }]}>
            <Text style={st.chipTxt}>+20% progress</Text>
          </View>
          <View style={[st.chip, { backgroundColor: colors.lavender }]}>
            <Text style={st.chipTxt}>Streak alive 🔥</Text>
          </View>
          <View style={[st.chip, { backgroundColor: colors.sky }]}>
            <Text style={st.chipTxt}>PRs: 2</Text>
          </View>
        </View>
        <Pressable
          style={[st.startBtn, { marginTop: 32 }]}
          onPress={() => {
            setPhase('overview');
            setExIdx(0);
            setSetNum(1);
            setCompletedSets({});
            setElapsed(0);
          }}
        >
          <Text style={st.startBtnTxt}>Back to Today</Text>
        </Pressable>
      </View>
    );

  // ── Active ────────────────────────────────────────────────────────────────
  return (
    <ScrollView
      style={st.screen}
      contentContainerStyle={{ paddingBottom: 120 }}
      showsVerticalScrollIndicator={false}
    >
      <View style={[st.activeHeader, { paddingTop: insets.top + 12 }]}>
        <View style={st.activeHeaderTop}>
          <Text style={st.overline}>
            Exercise {exIdx + 1} / {WORKOUT.exercises.length}
          </Text>
          <Text style={st.overline}>{fmt(elapsed)}</Text>
        </View>
        <View style={st.progressBarTrack}>
          <View style={[st.progressBarFill, { width: `${pct}%` as `${number}%` }]} />
        </View>
        <Text style={st.heroTitle}>{ex.name}</Text>
        <View style={st.heroChips}>
          <View style={[st.chip, { backgroundColor: colors.lavender }]}>
            <Text style={st.chipTxt}>{ex.muscle}</Text>
          </View>
          <View style={[st.chip, { backgroundColor: colors.mint }]}>
            <Text style={st.chipTxt}>{ex.weight}</Text>
          </View>
          {ex.weight !== ex.prevWeight && (
            <View style={[st.chip, { backgroundColor: colors.sky }]}>
              <Text style={st.chipTxt}>↑ vs {ex.prevWeight}</Text>
            </View>
          )}
        </View>
      </View>

      <View style={st.content}>
        {/* Set tracker */}
        <View style={st.setRow}>
          {Array.from({ length: ex.sets }, (_, i) => {
            const done = !!completedSets[`${exIdx}-${i + 1}`];
            const active = i + 1 === setNum;
            return (
              <View
                key={i}
                style={[
                  st.setBox,
                  { backgroundColor: done ? colors.mint : active ? colors.rose : colors.tonal },
                ]}
              >
                <Text
                  style={[st.setBoxNum, { color: done || active ? '#fff' : colors.text.secondary }]}
                >
                  {done ? '✓' : `${i + 1}`}
                </Text>
                <Text
                  style={[
                    st.setBoxLbl,
                    { color: done || active ? 'rgba(255,255,255,0.8)' : colors.text.secondary },
                  ]}
                >
                  Set
                </Text>
              </View>
            );
          })}
        </View>

        {/* Current set */}
        <View style={[st.setCard, shadows.card]}>
          <Text style={st.overline}>
            Set {setNum} · {ex.reps} reps
          </Text>
          <View style={st.setStats}>
            <View style={[st.setStat, { backgroundColor: colors.tonal }]}>
              <Text style={st.setStatVal}>{ex.weight}</Text>
              <Text style={st.setStatLbl}>Weight</Text>
            </View>
            <View style={[st.setStat, { backgroundColor: colors.tonal }]}>
              <Text style={st.setStatVal}>{ex.reps}</Text>
              <Text style={st.setStatLbl}>Target reps</Text>
            </View>
          </View>
          <Pressable style={st.doneSetBtn} onPress={doneSet}>
            <Text style={st.doneSetBtnTxt}>✓ Done Set {setNum}</Text>
          </Pressable>
        </View>

        {/* Quote */}
        <View style={[st.quoteCard, { backgroundColor: colors.lavender }]}>
          <Text style={st.quoteTxt}>
            "
            {ex.prevWeight !== ex.weight
              ? `You lifted ${ex.prevWeight} last time. Today you do ${ex.weight}. That's what progress looks like.`
              : 'Consistency is the foundation of mastery. Show up again today.'}
            "
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}

const st = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bg },
  centered: { alignItems: 'center', justifyContent: 'center' },
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
  content: { padding: spacing.gutter, gap: 14 },
  title: { fontFamily: fonts.display, fontSize: 26, color: colors.text.primary },
  titleI: { fontFamily: fonts.displayItalic, fontSize: 26 },
  subtitle: { fontFamily: fonts.body, fontSize: typography.size.sm, color: colors.text.secondary },
  overline: {
    fontFamily: fonts.label,
    fontSize: typography.size.xs,
    color: colors.primary,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  sectionHead: {
    fontFamily: fonts.display,
    fontSize: typography.size.xl,
    color: colors.text.primary,
  },
  heroCard: {
    backgroundColor: colors.surface,
    borderRadius: radii.card,
    padding: 22,
    overflow: 'hidden',
    position: 'relative',
    gap: 8,
  },
  heroDecor: {
    position: 'absolute',
    top: -20,
    right: -20,
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: colors.mint,
    opacity: 0.15,
  },
  heroTitle: { fontFamily: fonts.display, fontSize: 28, color: colors.text.primary },
  heroChips: { flexDirection: 'row', gap: 10, flexWrap: 'wrap' },
  chip: { borderRadius: radii.pill, paddingHorizontal: 10, paddingVertical: 4 },
  chipTxt: { fontFamily: fonts.label, fontSize: typography.size.xs, color: colors.eggplant },
  startBtn: {
    backgroundColor: colors.rose,
    borderRadius: radii.pill,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 4,
  },
  startBtnTxt: {
    fontFamily: fonts.bodyBold,
    fontSize: 13,
    color: '#fff',
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  exList: { gap: 8 },
  exRow: {
    backgroundColor: colors.surface,
    borderRadius: radii.lg,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  exIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  exTxt: { flex: 1 },
  exName: { fontFamily: fonts.bodySemi, fontSize: 14, color: colors.text.primary },
  exMeta: { fontFamily: fonts.body, fontSize: 12, color: colors.text.secondary },
  pr: { fontFamily: fonts.bodyBold, fontSize: 11, color: colors.mint },
  alertCard: { borderRadius: radii.card, padding: 18, gap: 8 },
  alertTitle: { fontFamily: fonts.bodyBold, fontSize: 13, color: colors.eggplant },
  alertBody: { fontFamily: fonts.body, fontSize: 12, color: colors.text.secondary, lineHeight: 18 },
  restLabel: {
    fontFamily: fonts.label,
    fontSize: 13,
    color: colors.text.secondary,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: 24,
  },
  restTime: {
    fontFamily: fonts.statsThin,
    fontSize: 48,
    color: colors.text.primary,
    lineHeight: 48,
  },
  restNextTitle: {
    fontFamily: fonts.displayItalic,
    fontSize: 20,
    color: colors.text.secondary,
    marginTop: 24,
  },
  restNextSub: { fontFamily: fonts.body, fontSize: 14, color: `${colors.text.secondary}88` },
  doneTitle: {
    fontFamily: fonts.display,
    fontSize: 32,
    color: colors.text.primary,
    textAlign: 'center',
    marginBottom: 8,
  },
  doneSub: {
    fontFamily: fonts.body,
    fontSize: 14,
    color: colors.text.secondary,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 16,
  },
  doneChips: { flexDirection: 'row', gap: 8, flexWrap: 'wrap', justifyContent: 'center' },
  activeHeader: {
    backgroundColor: colors.tonal,
    paddingHorizontal: spacing.gutter,
    paddingBottom: 16,
    gap: 10,
  },
  activeHeaderTop: { flexDirection: 'row', justifyContent: 'space-between' },
  progressBarTrack: {
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.outlineVariant,
    overflow: 'hidden',
  },
  progressBarFill: { height: '100%', backgroundColor: colors.rose, borderRadius: 2 },
  setRow: { flexDirection: 'row', gap: 10 },
  setBox: { flex: 1, paddingVertical: 14, borderRadius: 16, alignItems: 'center' },
  setBoxNum: { fontFamily: fonts.bodyBold, fontSize: 18 },
  setBoxLbl: { fontFamily: fonts.body, fontSize: 10 },
  setCard: { backgroundColor: colors.surface, borderRadius: radii.card, padding: 24, gap: 14 },
  setStats: { flexDirection: 'row', gap: 16 },
  setStat: { flex: 1, borderRadius: 16, padding: 16, alignItems: 'center' },
  setStatVal: { fontFamily: fonts.statsThin, fontSize: 36, color: colors.text.primary },
  setStatLbl: { fontFamily: fonts.body, fontSize: 11, color: colors.text.secondary },
  doneSetBtn: {
    backgroundColor: colors.rose,
    borderRadius: radii.pill,
    paddingVertical: 16,
    alignItems: 'center',
  },
  doneSetBtnTxt: {
    fontFamily: fonts.bodyBold,
    fontSize: 14,
    color: '#fff',
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  quoteCard: { borderRadius: radii.card, padding: 18 },
  quoteTxt: {
    fontFamily: fonts.displayItalic,
    fontSize: 14,
    color: colors.eggplant,
    lineHeight: 22,
  },
});
