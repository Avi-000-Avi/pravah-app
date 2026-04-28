import { Feather } from '@expo/vector-icons';
import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Card } from '@/components/Card';
import { GhostButton } from '@/components/GhostButton';
import { colors, fonts, radii, typography } from '@/lib/theme';

const STATS = [
  { label: 'Current weight', value: '72 kg' },
  { label: 'Target weight', value: '67 kg' },
  { label: 'Daily calories', value: '1,800 cal' },
  { label: 'Active days', value: '5 / week' },
];

const MEAL_PREFS = [
  { label: 'Lentils', value: '5 days/week' },
  { label: 'Lactose', value: 'Preferred' },
  { label: 'Vegetarian', value: 'Strictly' },
];

const WORKOUT_PREFS = [
  { label: 'Training objective', value: 'Strength' },
  { label: 'Split type', value: 'Bro Split' },
  { label: 'Equipment', value: 'Gym' },
  { label: 'Priority', value: 'Shoulders' },
];

const SECTIONS = ['Stats', 'Goal setting', 'Preferences', 'Settings', 'Integrations'];

export default function ProfileScreen() {
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
        <View style={styles.avatar}>
          <Feather name="user" size={32} color={colors.text.muted} />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.name}>Avinash Toppo</Text>
          <Text style={styles.tagline}>Weight loss · 1800 cal/day</Text>
        </View>
        <GhostButton label="Settings" size="sm" />
      </View>

      {/* Stat rows */}
      <Card style={styles.listCard}>
        {STATS.map((s, i) => (
          <View key={s.label} style={[styles.statRow, i < STATS.length - 1 && styles.divider]}>
            <Text style={styles.statLabel}>{s.label}</Text>
            <Text style={styles.statValue}>{s.value}</Text>
          </View>
        ))}
      </Card>

      <PrefsBlock title="Meal preferences" items={MEAL_PREFS} />
      <PrefsBlock title="Workout preferences" items={WORKOUT_PREFS} />

      {/* Sections list */}
      <Card style={styles.listCard}>
        {SECTIONS.map((s, i) => (
          <Pressable key={s} style={[styles.sectionRow, i < SECTIONS.length - 1 && styles.divider]}>
            <Text style={styles.sectionText}>{s}</Text>
            <Feather name="chevron-right" size={18} color={colors.gray[300]} />
          </Pressable>
        ))}
      </Card>
    </ScrollView>
  );
}

function PrefsBlock({
  title,
  items,
}: {
  title: string;
  items: { label: string; value: string }[];
}) {
  return (
    <Card style={styles.prefsCard}>
      <View style={[styles.prefsHead, styles.divider]}>
        <Text style={styles.prefsTitle}>{title}</Text>
        <GhostButton label="Edit" size="sm" />
      </View>
      {items.map((item, i) => (
        <View key={item.label} style={[styles.prefsRow, i < items.length - 1 && styles.divider]}>
          <Text style={styles.prefsLabel}>{item.label}</Text>
          <View style={styles.prefsChip}>
            <Text style={styles.prefsValue}>{item.value}</Text>
          </View>
        </View>
      ))}
    </Card>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bg },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    marginBottom: 24,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.gray[200],
    alignItems: 'center',
    justifyContent: 'center',
  },
  name: {
    fontFamily: fonts.display,
    fontSize: typography.size.lg + 2,
    color: colors.text.primary,
    letterSpacing: typography.size.lg * typography.tracking.display,
  },
  tagline: {
    fontFamily: fonts.body,
    fontSize: typography.size.sm,
    color: colors.text.muted,
    marginTop: 2,
  },

  listCard: { overflow: 'hidden', marginBottom: 20 },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  statLabel: {
    fontFamily: fonts.bodySemi,
    fontSize: typography.size.base,
    color: colors.text.secondary,
  },
  statValue: {
    fontFamily: fonts.ui,
    fontSize: typography.size.base,
    color: colors.text.primary,
  },

  prefsCard: { overflow: 'hidden', marginBottom: 14 },
  prefsHead: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  prefsTitle: {
    fontFamily: fonts.display,
    fontSize: typography.size.md,
    color: colors.text.primary,
  },
  prefsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  prefsLabel: {
    fontFamily: fonts.bodySemi,
    fontSize: 13,
    color: colors.text.primary,
  },
  prefsChip: {
    backgroundColor: colors.bg,
    borderRadius: radii.pill,
    paddingHorizontal: 10,
    paddingVertical: 3,
  },
  prefsValue: {
    fontFamily: fonts.body,
    fontSize: typography.size.sm,
    color: colors.text.muted,
  },

  sectionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  sectionText: {
    fontFamily: fonts.uiSemi,
    fontSize: typography.size.base,
    color: colors.text.primary,
  },

  divider: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.gray[200],
  },
});
