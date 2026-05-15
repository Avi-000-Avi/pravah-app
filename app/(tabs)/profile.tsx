/**
 * Data / Insights screen — Pravah tab.
 * Design ref: insights.jsx from Pravah.html design bundle.
 *
 * Shows: identity card, consistency ring, week stats grid,
 * activity heatmap, insight quote, muscle volume bars.
 */
import { MaterialIcons } from '@expo/vector-icons';
import React, { useCallback } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ProgressRing } from '@/components/ProgressRing';
import { useAuth } from '@/features/auth';
import { useAppStore } from '@/stores/appStore';
import { colors, fonts, radii, shadows, spacing, typography } from '@/lib/theme';

const HEATMAP = [
  [1, 1, 0, 1, 1, 0, 1],
  [1, 0, 1, 1, 1, 1, 0],
  [1, 1, 1, 0, 1, 1, 1],
  [0, 1, 1, 1, 1, 0, 1],
];
const HMAP_DAYS = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

const BADGES = ['Early Riser', 'Protein Pro', 'Consistent', 'Lifter'];

const MUSCLES = [
  { label: 'Chest', pct: 82, color: colors.rose },
  { label: 'Back', pct: 65, color: colors.mint },
  { label: 'Shoulders', pct: 74, color: colors.sky },
  { label: 'Arms', pct: 90, color: colors.lavender },
  { label: 'Legs', pct: 40, color: colors.tonal },
];

export default function DataScreen() {
  const insets = useSafeAreaInsets();
  const { user } = useAppStore();
  const { signOut } = useAuth();

  const handleSignOut = useCallback(async () => {
    await signOut();
  }, [signOut]);

  const weekStats = [
    { label: 'Workouts', val: '5', prev: '4', unit: '' },
    { label: 'Protein avg', val: '92g', prev: '87g', unit: '' },
    { label: 'Consistency', val: '86%', prev: '79%', unit: '' },
    { label: 'Streak', val: String(user.streak), prev: String(user.streak - 1), unit: 'days' },
  ];

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

      <View style={st.content}>
        {/* Title */}
        <Text style={st.title}>
          <Text style={st.titleI}>Your progress</Text>
        </Text>
        <Text style={st.subtitle}>
          Week of {new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long' })}
        </Text>

        {/* Identity card */}
        <View style={[st.identityCard, shadows.card]}>
          {/* Decorative circle */}
          <View style={st.identityDecor} />
          <Text style={st.overline}>Identity</Text>
          <Text style={st.identityTitle}>
            You're someone who{'\n'}
            <Text style={st.identityTitleI}>shows up every day.</Text>
          </Text>
          <View style={st.badgeRow}>
            {BADGES.map((b) => (
              <View key={b} style={[st.chip, { backgroundColor: 'rgba(255,255,255,0.7)' }]}>
                <Text style={st.chipTxt}>{b}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Consistency score */}
        <View style={[st.scoreCard, shadows.card]}>
          <ProgressRing size={90} strokeWidth={5} percent={86} color={colors.rose}>
            <Text style={st.scoreNum}>86</Text>
            <Text style={st.scorePct}>%</Text>
          </ProgressRing>
          <View style={st.scoreText}>
            <Text style={st.overline}>Consistency score</Text>
            <Text style={st.scoreTitle}>Excellent</Text>
            <Text style={st.scoreSub}>Top 14% of Pravah users this week. Keep going.</Text>
          </View>
        </View>

        {/* Week stats 2×2 grid */}
        <View style={st.statsGrid}>
          {weekStats.map((s) => (
            <View key={s.label} style={[st.statCell, shadows.cardSubtle]}>
              <Text style={st.statCellLabel}>{s.label}</Text>
              <Text style={st.statCellVal}>{s.val}</Text>
              <Text style={st.statCellDiff}>
                ↑ vs {s.prev} {s.unit}
              </Text>
            </View>
          ))}
        </View>

        {/* Activity heatmap */}
        <Text style={st.sectionHead}>Activity heatmap</Text>
        <View style={[st.heatCard, shadows.cardSubtle]}>
          <View style={st.heatDayRow}>
            {HMAP_DAYS.map((d, i) => (
              <Text key={i} style={st.heatDay}>
                {d}
              </Text>
            ))}
          </View>
          {HEATMAP.map((row, ri) => (
            <View key={ri} style={st.heatRow}>
              {row.map((v, ci) => (
                <View
                  key={ci}
                  style={[
                    st.heatCell,
                    {
                      backgroundColor: v
                        ? ri === 3 && ci === 6
                          ? colors.rose
                          : colors.mint
                        : colors.tonal,
                    },
                  ]}
                />
              ))}
            </View>
          ))}
          <View style={st.heatLegend}>
            <View style={[st.heatLegendDot, { backgroundColor: colors.mint }]} />
            <Text style={st.heatLegendTxt}>Active day</Text>
            <View style={[st.heatLegendDot, { backgroundColor: colors.tonal, marginLeft: 8 }]} />
            <Text style={st.heatLegendTxt}>Rest / missed</Text>
          </View>
        </View>

        {/* Insight quote */}
        <View style={[st.quoteCard, { backgroundColor: colors.lavender }]}>
          <Text style={st.overline}>This week's insight</Text>
          <Text style={st.quoteTxt}>
            "Your best protein days follow your best sleep nights. Prioritise sleep to hit your
            muscle goals faster."
          </Text>
        </View>

        {/* Muscle volume */}
        <Text style={st.sectionHead}>Muscle volume this week</Text>
        <View style={[st.muscleCard, shadows.cardSubtle]}>
          {MUSCLES.map((m) => (
            <View key={m.label} style={st.muscleRow}>
              <Text style={st.muscleLbl}>{m.label}</Text>
              <View style={st.muscleBarTrack}>
                <View
                  style={[
                    st.muscleBarFill,
                    {
                      width: `${m.pct}%` as `${number}%`,
                      backgroundColor: m.color === colors.tonal ? colors.outlineVariant : m.color,
                    },
                  ]}
                />
              </View>
              <Text style={st.musclePct}>{m.pct}%</Text>
            </View>
          ))}
        </View>

        {/* Sign out */}
        <Pressable
          style={st.replayBtn}
          onPress={() => {
            void handleSignOut();
          }}
        >
          <MaterialIcons name="refresh" size={14} color={colors.text.muted} />
          <Text style={st.replayBtnTxt}>Sign out</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}

const st = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bg },

  // Top bar
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

  content: { padding: spacing.margin, gap: 16 },

  // Title
  title: { fontFamily: fonts.display, fontSize: 26, color: colors.text.primary },
  titleI: { fontFamily: fonts.displayItalic, fontSize: 26 },
  subtitle: {
    fontFamily: fonts.body,
    fontSize: typography.size.sm,
    color: colors.text.secondary,
    marginTop: -8,
  },

  // Overline label
  overline: {
    fontFamily: fonts.label,
    fontSize: typography.size.xs,
    color: colors.primary,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: 8,
  },

  // Identity card
  identityCard: {
    backgroundColor: colors.lavender,
    borderRadius: radii.card,
    padding: 22,
    overflow: 'hidden',
    position: 'relative',
  },
  identityDecor: {
    position: 'absolute',
    top: -30,
    right: -30,
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: colors.rose,
    opacity: 0.08,
  },
  identityTitle: {
    fontFamily: fonts.display,
    fontSize: 24,
    color: colors.eggplant,
    lineHeight: 30,
    marginBottom: 12,
  },
  identityTitleI: { fontFamily: fonts.displayItalic, fontSize: 24 },
  badgeRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: { borderRadius: radii.pill, paddingHorizontal: 12, paddingVertical: 4 },
  chipTxt: {
    fontFamily: fonts.label,
    fontSize: typography.size.xs,
    color: colors.eggplant,
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },

  // Consistency card
  scoreCard: {
    backgroundColor: colors.surface,
    borderRadius: radii.card,
    padding: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
  },
  scoreText: { flex: 1 },
  scoreNum: {
    fontFamily: fonts.statsThin,
    fontSize: 28,
    color: colors.text.primary,
    lineHeight: 28,
  },
  scorePct: { fontFamily: fonts.body, fontSize: 9, color: colors.text.secondary },
  scoreTitle: {
    fontFamily: fonts.display,
    fontSize: typography.size.lg,
    color: colors.text.primary,
    marginBottom: 4,
  },
  scoreSub: {
    fontFamily: fonts.body,
    fontSize: typography.size.sm,
    color: colors.text.secondary,
    lineHeight: 18,
  },

  // Stats 2×2
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  statCell: {
    width: '47.5%',
    backgroundColor: colors.surface,
    borderRadius: 20,
    padding: spacing.gutter,
  },
  statCellLabel: {
    fontFamily: fonts.label,
    fontSize: typography.size.xs,
    color: colors.text.secondary,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
    marginBottom: 6,
  },
  statCellVal: {
    fontFamily: fonts.statsThin,
    fontSize: 32,
    color: colors.text.primary,
    lineHeight: 32,
  },
  statCellDiff: {
    fontFamily: fonts.body,
    fontSize: 11,
    color: colors.mint,
    marginTop: 4,
  },

  // Heatmap
  sectionHead: {
    fontFamily: fonts.display,
    fontSize: typography.size.xl,
    color: colors.text.primary,
    marginBottom: -4,
  },
  heatCard: {
    backgroundColor: colors.surface,
    borderRadius: 20,
    padding: 18,
  },
  heatDayRow: { flexDirection: 'row', gap: 6, marginBottom: 8 },
  heatDay: {
    flex: 1,
    textAlign: 'center',
    fontFamily: fonts.body,
    fontSize: 10,
    color: colors.text.secondary,
  },
  heatRow: { flexDirection: 'row', gap: 6, marginBottom: 6 },
  heatCell: { flex: 1, aspectRatio: 1, borderRadius: 6 },
  heatLegend: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 10 },
  heatLegendDot: { width: 12, height: 12, borderRadius: 3 },
  heatLegendTxt: {
    fontFamily: fonts.body,
    fontSize: 11,
    color: colors.text.secondary,
  },

  // Quote
  quoteCard: { borderRadius: 20, padding: 18 },
  quoteTxt: {
    fontFamily: fonts.displayItalic,
    fontSize: typography.size.md,
    color: colors.eggplant,
    lineHeight: 26,
  },

  // Muscle bars
  muscleCard: { backgroundColor: colors.surface, borderRadius: 20, padding: 18 },
  muscleRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 10 },
  muscleLbl: {
    fontFamily: fonts.body,
    fontSize: typography.size.sm,
    color: colors.text.secondary,
    width: 70,
  },
  muscleBarTrack: {
    flex: 1,
    height: 6,
    borderRadius: 999,
    backgroundColor: colors.tonal,
    overflow: 'hidden',
  },
  muscleBarFill: { height: '100%', borderRadius: 999 },
  musclePct: {
    fontFamily: fonts.bodyBold,
    fontSize: 11,
    color: colors.text.primary,
    width: 32,
    textAlign: 'right',
  },

  // Return to onboarding
  replayBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    marginTop: 24,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: radii.pill,
    borderWidth: 1,
    borderColor: colors.outlineVariant,
    alignSelf: 'center',
  },
  replayBtnTxt: {
    fontFamily: fonts.body,
    fontSize: typography.size.xs,
    color: colors.text.muted,
  },
});
