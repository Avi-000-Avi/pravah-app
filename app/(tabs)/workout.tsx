import { Feather } from '@expo/vector-icons';
import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Card } from '@/components/Card';
import { GhostButton } from '@/components/GhostButton';
import { Pill } from '@/components/Pill';
import { SectionTitle } from '@/components/SectionTitle';
import { colors, fonts, radii, typography } from '@/lib/theme';

const DAYS = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
const DONE = [true, true, true, true, true, false, false];

const STATS: { value: string; label: string; color: string }[] = [
  { value: '1,230', label: 'Calories\nBurnt', color: colors.text.dark },
  { value: '5/6', label: 'Workouts\nDone', color: '#0B1928' },
  { value: '4hrs', label: 'Active\nTime', color: '#04302A' },
];

interface Workout {
  name: string;
  duration: string;
  type: 'Gym' | 'Home';
  done: boolean;
}

const WORKOUTS: Workout[] = [
  { name: 'Strength training', duration: '45 min', type: 'Gym', done: true },
  { name: 'Morning mobility', duration: '20 min', type: 'Home', done: false },
  { name: 'HIIT session', duration: '30 min', type: 'Gym', done: false },
];

export default function WorkoutScreen() {
  const insets = useSafeAreaInsets();
  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={{
        paddingTop: insets.top + 16,
        paddingHorizontal: 20,
        paddingBottom: 120,
      }}
      showsVerticalScrollIndicator={false}
    >
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Workout</Text>
        <GhostButton label="Edit prefs" size="sm" />
      </View>

      {/* Week's insights */}
      <Card style={styles.insightsCard}>
        <SectionTitle style={{ marginBottom: 14 }}>Week’s insights</SectionTitle>

        {/* Bar chart */}
        <View style={styles.barRow}>
          {DAYS.map((d, i) => (
            <View key={i} style={styles.barCol}>
              <View
                style={[
                  styles.bar,
                  {
                    height: DONE[i] ? 40 : 16,
                    backgroundColor: DONE[i] ? colors.text.primary : colors.gray[200],
                  },
                ]}
              />
              <Text style={styles.dayLabel}>{d}</Text>
            </View>
          ))}
        </View>

        {/* Stats */}
        <View style={styles.statRow}>
          {STATS.map((s) => (
            <View key={s.label} style={styles.statCell}>
              <Text style={[styles.statValue, { color: s.color }]}>{s.value}</Text>
              <Text style={styles.statLabel}>{s.label}</Text>
            </View>
          ))}
        </View>
      </Card>

      {/* Today's workouts */}
      <SectionTitle>Today’s workouts</SectionTitle>
      {WORKOUTS.map((w) => (
        <WorkoutCard key={w.name} {...w} />
      ))}
    </ScrollView>
  );
}

function WorkoutCard({ name, duration, type, done }: Workout) {
  return (
    <Card style={styles.wCard}>
      <View style={styles.wLeft}>
        <View style={[styles.wIcon, { backgroundColor: done ? colors.text.primary : colors.bg }]}>
          <Feather name="activity" size={20} color={done ? colors.white : colors.text.muted} />
        </View>
        <View>
          <Text style={styles.wName}>{name}</Text>
          <View style={styles.wMetaRow}>
            <Text style={styles.wMeta}>{duration}</Text>
            <View style={styles.dot} />
            <Pill label={type} variant={type === 'Gym' ? 'lavender' : 'info'} />
          </View>
        </View>
      </View>
      <Pressable style={[styles.wCta, done ? styles.wCtaDone : styles.wCtaStart]}>
        <Text style={[styles.wCtaText, { color: done ? colors.text.muted : colors.white }]}>
          {done ? 'Done' : 'Start'}
        </Text>
      </Pressable>
    </Card>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bg },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontFamily: fonts.display,
    fontSize: typography.size['2xl'],
    color: colors.text.primary,
    letterSpacing: typography.size['2xl'] * typography.tracking.display,
  },

  insightsCard: { padding: 16, marginBottom: 24 },
  barRow: { flexDirection: 'row', gap: 6, marginBottom: 16, alignItems: 'flex-end' },
  barCol: { flex: 1, alignItems: 'center', gap: 4 },
  bar: { width: '100%', borderRadius: 4 },
  dayLabel: {
    fontFamily: fonts.bodySemi,
    fontSize: typography.size.xs,
    color: colors.text.muted,
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: 12,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.gray[200],
  },
  statCell: { alignItems: 'center' },
  statValue: {
    fontFamily: fonts.ui,
    fontSize: typography.size.xl,
  },
  statLabel: {
    fontFamily: fonts.bodySemi,
    fontSize: typography.size.xs,
    color: colors.text.muted,
    textAlign: 'center',
    marginTop: 3,
    lineHeight: 13,
  },

  wCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 14,
    marginBottom: 10,
  },
  wLeft: { flexDirection: 'row', alignItems: 'center', gap: 12, flex: 1 },
  wIcon: {
    width: 44,
    height: 44,
    borderRadius: radii.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  wName: {
    fontFamily: fonts.display,
    fontSize: 15,
    color: colors.text.primary,
    marginBottom: 4,
  },
  wMetaRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  wMeta: {
    fontFamily: fonts.body,
    fontSize: 11,
    color: colors.text.muted,
  },
  dot: {
    width: 3,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: colors.gray[300],
  },

  wCta: {
    borderRadius: radii.pill,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  wCtaStart: { backgroundColor: colors.text.primary },
  wCtaDone: { backgroundColor: colors.gray[200] },
  wCtaText: {
    fontFamily: fonts.ui,
    fontSize: typography.size.sm,
  },
});
