/**
 * Rest / Recovery screen — Pravah tab.
 * Design ref: recovery.jsx from Pravah.html design bundle.
 *
 * Interactive:
 * - Recovery score ring (dynamic colour based on score)
 * - Low-sleep adaptation alert → "Accept Plan" / "Low Effort Mode"
 * - Mode state: default | accepted | loweffort
 * - Streak calendar with grace-day indicator
 * - Sleep tips
 */
import { MaterialIcons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ProgressRing } from '@/components/ProgressRing';
import { useAppStore } from '@/stores/appStore';
import { colors, fonts, radii, shadows, spacing, typography } from '@/lib/theme';

type RecoveryMode = 'default' | 'accepted' | 'loweffort';

const STREAK_DAYS = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
const STREAK_DATA = [1, 1, 1, 1, 0, 1, 0]; // 1=done, 0=missed

export default function RecoveryScreen() {
  const insets = useSafeAreaInsets();
  const { user, today, setWorkoutSelection } = useAppStore();
  const [mode, setMode] = useState<RecoveryMode>('default');
  const lowSleep = today.sleep < 6;
  const score = today.recoveryScore;

  const accept = () => {
    setMode('accepted');
    setWorkoutSelection({ name: 'Light Mobility Flow', durationMin: 20 });
  };

  const ringColor = score > 75 ? colors.mint : score > 50 ? colors.sky : colors.rose;

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
          <Text style={st.titleI}>Recovery</Text>
        </Text>
        <Text style={st.subtitle}>How your body is doing right now</Text>

        {/* Recovery score */}
        <View style={[st.scoreCard, shadows.card]}>
          <ProgressRing size={100} strokeWidth={5} percent={score} color={ringColor}>
            <Text style={st.scoreNum}>{score}</Text>
            <Text style={st.scoreDenom}>/ 100</Text>
          </ProgressRing>
          <View style={st.scoreText}>
            <Text style={st.overline}>Recovery Score</Text>
            <Text style={st.scoreTitle}>
              {score > 75
                ? 'Fully recovered'
                : score > 50
                  ? 'Moderate fatigue'
                  : 'Low energy detected'}
            </Text>
            <Text style={st.scoreSub}>
              {score > 75 ? 'Train at full intensity today.' : 'Your body needs lighter stimulus.'}
            </Text>
          </View>
        </View>

        {/* Biometric cards */}
        <View style={st.bioRow}>
          {[
            {
              label: 'Sleep',
              val: `${today.sleep}h`,
              sub: today.sleep < 6 ? 'Low' : 'Good',
              color: today.sleep < 6 ? colors.rose : colors.mint,
              icon: 'bedtime' as const,
            },
            {
              label: 'HRV',
              val: '42ms',
              sub: 'Moderate',
              color: colors.sky,
              icon: 'favorite' as const,
            },
            {
              label: 'Fatigue',
              val: lowSleep ? 'High' : 'Low',
              sub: lowSleep ? 'Rest?' : 'All good',
              color: lowSleep ? `${colors.rose}33` : `${colors.mint}44`,
              icon: 'bolt' as const,
            },
          ].map((m) => (
            <View key={m.label} style={[st.bioCard, shadows.cardSubtle]}>
              <MaterialIcons name={m.icon} size={22} color={colors.eggplant} />
              <Text style={st.bioVal}>{m.val}</Text>
              <Text style={st.bioLabel}>{m.label}</Text>
              <View style={[st.chip, { backgroundColor: m.color }]}>
                <Text style={st.chipTxt}>{m.sub}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* Low sleep adaptation alert */}
        {lowSleep && mode === 'default' && (
          <View
            style={[st.alertCard, { backgroundColor: `${colors.sky}55`, borderColor: colors.sky }]}
          >
            <Text style={st.alertTitle}>💤 Pravah detected low sleep</Text>
            <Text style={st.alertBody}>
              You slept <Text style={{ fontFamily: fonts.bodySemi }}>{today.sleep}h</Text>. Your
              adapted plan for today:
            </Text>
            <View style={st.alertItems}>
              {[
                { icon: '🏃', text: 'Light Mobility Flow · 20 min (instead of 45 min strength)' },
                { icon: '🍚', text: 'Higher carbs today — +40g for energy' },
                { icon: '💧', text: 'Extra hydration reminder at 3PM' },
              ].map((item, i) => (
                <View key={i} style={st.alertItem}>
                  <Text style={{ fontSize: 16 }}>{item.icon}</Text>
                  <Text style={st.alertItemTxt}>{item.text}</Text>
                </View>
              ))}
            </View>
            <View style={st.alertBtns}>
              <Pressable style={[st.ctaPrimary, { flex: 2 }]} onPress={accept}>
                <Text style={st.ctaPrimaryTxt}>Accept Plan</Text>
              </Pressable>
              <Pressable style={[st.ctaGhost, { flex: 1 }]} onPress={() => setMode('loweffort')}>
                <Text style={st.ctaGhostTxt}>Low Effort</Text>
              </Pressable>
            </View>
          </View>
        )}

        {mode === 'accepted' && (
          <View style={[st.successCard, { backgroundColor: colors.mint }]}>
            <Text style={st.successTitle}>Plan adapted ✓</Text>
            <Text style={st.successSub}>Your streak is safe. Light day = smart day.</Text>
          </View>
        )}

        {mode === 'loweffort' && (
          <View style={[st.lowEffortCard, { backgroundColor: colors.lavender }]}>
            <Text style={st.overline}>Low Effort Mode</Text>
            <Text style={st.successTitle}>Minimum viable day</Text>
            <View style={st.lowEffortItems}>
              {['10 min walk outside', 'One high-protein meal logged', 'Sleep by 10PM'].map(
                (t, i) => (
                  <View key={i} style={st.lowEffortItem}>
                    <View style={[st.stepBubble, { backgroundColor: colors.rose }]}>
                      <Text style={st.stepNum}>{i + 1}</Text>
                    </View>
                    <Text style={st.lowEffortTxt}>{t}</Text>
                  </View>
                ),
              )}
            </View>
            <Pressable style={st.ctaPrimary} onPress={accept}>
              <Text style={st.ctaPrimaryTxt}>That works — let's go</Text>
            </Pressable>
          </View>
        )}

        {/* Streak calendar */}
        <Text style={st.sectionHead}>Your streak</Text>
        <View style={[st.streakCard, shadows.cardSubtle]}>
          <View style={st.streakDays}>
            {STREAK_DAYS.map((d, i) => (
              <View key={i} style={st.streakDayCol}>
                <Text style={st.streakDayLabel}>{d}</Text>
                <View
                  style={[
                    st.streakDayBox,
                    {
                      backgroundColor:
                        STREAK_DATA[i] === 1
                          ? colors.rose
                          : i === 4
                            ? `${colors.rose}22`
                            : colors.tonal,
                    },
                  ]}
                >
                  <Text
                    style={[
                      st.streakDayMark,
                      {
                        color:
                          STREAK_DATA[i] === 1 ? '#fff' : i === 4 ? colors.rose : 'transparent',
                      },
                    ]}
                  >
                    {STREAK_DATA[i] === 1 ? '✓' : '–'}
                  </Text>
                </View>
              </View>
            ))}
          </View>
          <Text style={st.streakNote}>
            You missed Friday — grace day used. Streak continues. 🔥
          </Text>
        </View>

        {/* Sleep tips */}
        <Text style={st.sectionHead}>Sleep better tonight</Text>
        <View style={st.tipList}>
          {[
            { icon: 'mobile-off' as const, text: 'No screens after 9:30 PM' },
            { icon: 'thermostat' as const, text: 'Keep room cool — 18–20°C' },
            { icon: 'self-improvement' as const, text: '5 min breathing before bed' },
          ].map((tip, i) => (
            <View key={i} style={[st.tipRow, shadows.cardSubtle]}>
              <View style={[st.tipIcon, { backgroundColor: `${colors.sky}66` }]}>
                <MaterialIcons name={tip.icon} size={18} color={colors.eggplant} />
              </View>
              <Text style={st.tipTxt}>{tip.text}</Text>
            </View>
          ))}
        </View>
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
  content: { padding: spacing.gutter, gap: 16 },
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
  scoreCard: {
    backgroundColor: colors.surface,
    borderRadius: radii.card,
    padding: 24,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
  },
  scoreNum: {
    fontFamily: fonts.statsThin,
    fontSize: 28,
    color: colors.text.primary,
    lineHeight: 28,
  },
  scoreDenom: { fontFamily: fonts.body, fontSize: 9, color: colors.text.secondary },
  scoreText: { flex: 1, gap: 4 },
  scoreTitle: { fontFamily: fonts.display, fontSize: 20, color: colors.text.primary },
  scoreSub: { fontFamily: fonts.body, fontSize: 12, color: colors.text.secondary, lineHeight: 18 },
  bioRow: { flexDirection: 'row', gap: 10 },
  bioCard: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: radii.lg,
    padding: 14,
    alignItems: 'center',
    gap: 4,
  },
  bioVal: { fontFamily: fonts.statsThin, fontSize: 22, color: colors.text.primary },
  bioLabel: { fontFamily: fonts.body, fontSize: 10, color: colors.text.secondary },
  chip: { borderRadius: radii.pill, paddingHorizontal: 8, paddingVertical: 3 },
  chipTxt: { fontFamily: fonts.label, fontSize: typography.size.xs, color: colors.eggplant },
  alertCard: { borderRadius: radii.card, padding: 20, borderWidth: 1.5, gap: 12 },
  alertTitle: { fontFamily: fonts.bodyBold, fontSize: 14, color: colors.eggplant },
  alertBody: { fontFamily: fonts.body, fontSize: 13, color: colors.text.primary, lineHeight: 20 },
  alertItems: { gap: 10 },
  alertItem: { flexDirection: 'row', alignItems: 'flex-start', gap: 10 },
  alertItemTxt: {
    fontFamily: fonts.body,
    fontSize: 13,
    color: colors.text.primary,
    lineHeight: 20,
    flex: 1,
  },
  alertBtns: { flexDirection: 'row', gap: 10 },
  ctaPrimary: {
    backgroundColor: colors.rose,
    borderRadius: radii.pill,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ctaPrimaryTxt: {
    fontFamily: fonts.bodyBold,
    fontSize: 12,
    color: '#fff',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  ctaGhost: {
    backgroundColor: colors.tonal,
    borderRadius: radii.pill,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ctaGhostTxt: { fontFamily: fonts.bodySemi, fontSize: 12, color: colors.warmBrown },
  successCard: { borderRadius: radii.card, padding: 18, gap: 4 },
  successTitle: { fontFamily: fonts.display, fontSize: 18, color: colors.eggplant },
  successSub: { fontFamily: fonts.body, fontSize: 13, color: `${colors.eggplant}bb` },
  lowEffortCard: { borderRadius: radii.card, padding: 20, gap: 14 },
  lowEffortItems: { gap: 10 },
  lowEffortItem: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  stepBubble: {
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepNum: { fontFamily: fonts.bodyBold, fontSize: 10, color: '#fff' },
  lowEffortTxt: { fontFamily: fonts.body, fontSize: 13, color: colors.text.primary, flex: 1 },
  streakCard: { backgroundColor: colors.surface, borderRadius: radii.card, padding: 18, gap: 12 },
  streakDays: { flexDirection: 'row', justifyContent: 'space-between' },
  streakDayCol: { alignItems: 'center', gap: 6 },
  streakDayLabel: { fontFamily: fonts.body, fontSize: 10, color: colors.text.secondary },
  streakDayBox: {
    width: 32,
    height: 32,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  streakDayMark: { fontFamily: fonts.bodyBold, fontSize: 14 },
  streakNote: {
    fontFamily: fonts.body,
    fontSize: 12,
    color: colors.text.secondary,
    lineHeight: 18,
  },
  tipList: { gap: 8 },
  tipRow: {
    backgroundColor: colors.surface,
    borderRadius: radii.lg,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  tipIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tipTxt: { fontFamily: fonts.body, fontSize: 14, color: colors.text.primary, flex: 1 },
});
