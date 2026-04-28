import { Feather } from '@expo/vector-icons';
import React, { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Card } from '@/components/Card';
import { Pill, type PillVariant } from '@/components/Pill';
import { SectionTitle } from '@/components/SectionTitle';
import { colors, fonts, radii, typography } from '@/lib/theme';

interface Meal {
  type: string;
  name: string;
  cal: string;
  status: 'Log' | 'Prepped' | 'Prepare';
}

const STATUS_TO_VARIANT: Record<Meal['status'], PillVariant> = {
  Log: 'success',
  Prepped: 'warning',
  Prepare: 'error',
};

const WEEK = [
  { day: 'Sun', date: 2 },
  { day: 'Mon', date: 3 },
  { day: 'Tue', date: 4 },
  { day: 'Wed', date: 5 },
  { day: 'Thu', date: 6 },
  { day: 'Fri', date: 7 },
  { day: 'Sat', date: 8 },
];

const MEAL_DATA: Record<number, Meal[]> = {
  2: [
    { type: 'Breakfast', name: 'Oatmeal', cal: '423 cal', status: 'Log' },
    { type: 'Lunch', name: 'Veg Pulao', cal: '567 cal', status: 'Prepped' },
    { type: 'Snack', name: 'Peanuts', cal: '280 cal', status: 'Prepare' },
    { type: 'Dinner', name: 'Dal & Rice', cal: '520 cal', status: 'Prepare' },
  ],
  5: [
    { type: 'Breakfast', name: 'Poha', cal: '380 cal', status: 'Log' },
    { type: 'Lunch', name: 'Khichdi', cal: '490 cal', status: 'Log' },
    { type: 'Snack', name: 'Fruit Bowl', cal: '180 cal', status: 'Prepped' },
    { type: 'Dinner', name: 'Sabzi & Roti', cal: '560 cal', status: 'Prepare' },
  ],
};

const GROCERIES = [
  { name: 'Paneer', qty: '500gm', note: '4 meals of 25g protein' },
  { name: 'Eggs', qty: '10pcs', note: '40g protein' },
  { name: 'Lentils', qty: '1kg', note: '5 days/week' },
];

export default function MealsScreen() {
  const insets = useSafeAreaInsets();
  const [selectedDate, setSelectedDate] = useState<number>(5);
  const meals = MEAL_DATA[selectedDate] ?? MEAL_DATA[2] ?? [];

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
      <Text style={styles.screenTitle}>Meals</Text>

      {/* Week strip */}
      <View style={styles.weekRow}>
        {WEEK.map((d) => {
          const active = d.date === selectedDate;
          return (
            <Pressable
              key={d.date}
              onPress={() => setSelectedDate(d.date)}
              style={[styles.dayCell, active && styles.dayCellActive]}
            >
              <Text style={[styles.dayLabel, active && styles.dayLabelActive]}>{d.day}</Text>
              <Text style={[styles.dayDate, active && styles.dayDateActive]}>{d.date}</Text>
            </Pressable>
          );
        })}
      </View>

      {/* Plan banner */}
      <View style={styles.banner}>
        <View style={{ flex: 1 }}>
          <Text style={styles.bannerTitle}>Weight loss · 1800 cals/day</Text>
          <Text style={styles.bannerMeta}>AI-generated plan · Oct 6–12</Text>
        </View>
        <Pressable style={styles.bannerBtn}>
          <Feather name="refresh-cw" size={11} color={colors.white} />
          <Text style={styles.bannerBtnText}>Regenerate</Text>
        </Pressable>
      </View>

      {/* Meal grid */}
      <View style={styles.grid}>
        {meals.map((m) => (
          <Card key={m.type} style={styles.gridCard}>
            <Text style={styles.mealType}>{m.type}</Text>
            <Text style={styles.mealName}>{m.name}</Text>
            <Text style={styles.mealCal}>{m.cal}</Text>
            <Pill label={m.status} variant={STATUS_TO_VARIANT[m.status]} block />
          </Card>
        ))}
      </View>

      {/* Groceries */}
      <SectionTitle>Groceries</SectionTitle>
      <Card style={styles.listCard}>
        {GROCERIES.map((item, i) => (
          <View
            key={item.name}
            style={[styles.gItem, i < GROCERIES.length - 1 && styles.gItemDivider]}
          >
            <View style={styles.gItemHead}>
              <Text style={styles.gItemName}>{item.name}</Text>
              <Text style={styles.gItemQty}>{item.qty}</Text>
            </View>
            <Text style={styles.gItemNote}>{item.note}</Text>
          </View>
        ))}
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bg },
  screenTitle: {
    fontFamily: fonts.display,
    fontSize: typography.size['2xl'],
    color: colors.text.primary,
    textAlign: 'center',
    marginBottom: 20,
    letterSpacing: typography.size['2xl'] * typography.tracking.display,
  },
  weekRow: {
    flexDirection: 'row',
    gap: 4,
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  dayCell: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
    borderRadius: radii.md,
    gap: 4,
  },
  dayCellActive: { backgroundColor: colors.text.primary },
  dayLabel: {
    fontFamily: fonts.display,
    fontSize: typography.size.xs,
    color: 'rgba(28,23,23,0.5)',
    letterSpacing: 0.2,
  },
  dayLabelActive: { color: 'rgba(255,255,255,0.7)' },
  dayDate: {
    fontFamily: fonts.ui,
    fontSize: typography.size.lg,
    color: colors.text.primary,
  },
  dayDateActive: { color: colors.white },

  banner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.text.primary,
    borderRadius: radii.card,
    paddingHorizontal: 16,
    paddingVertical: 14,
    marginBottom: 20,
    gap: 12,
  },
  bannerTitle: {
    fontFamily: fonts.display,
    fontSize: typography.size.base,
    color: colors.white,
    marginBottom: 3,
  },
  bannerMeta: {
    fontFamily: fonts.body,
    fontSize: 11,
    color: 'rgba(255,255,255,0.6)',
  },
  bannerBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderColor: 'rgba(255,255,255,0.3)',
    borderWidth: 1,
    borderRadius: radii.pill,
    paddingHorizontal: 12,
    paddingVertical: 7,
  },
  bannerBtnText: {
    fontFamily: fonts.uiSemi,
    fontSize: 11,
    color: colors.white,
  },

  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 24,
  },
  gridCard: {
    flexBasis: '48.5%',
    flexGrow: 1,
    padding: 14,
  },
  mealType: {
    fontFamily: fonts.label,
    fontSize: typography.size.xs,
    color: colors.text.muted,
    textTransform: 'uppercase',
    letterSpacing: 0.4,
    marginBottom: 2,
  },
  mealName: {
    fontFamily: fonts.display,
    fontSize: 15,
    color: colors.text.primary,
    marginBottom: 2,
  },
  mealCal: {
    fontFamily: fonts.body,
    fontSize: 11,
    color: colors.text.muted,
    marginBottom: 10,
  },

  listCard: { overflow: 'hidden', marginBottom: 8 },
  gItem: { paddingHorizontal: 16, paddingVertical: 12 },
  gItemDivider: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.gray[200],
  },
  gItemHead: { flexDirection: 'row', justifyContent: 'space-between' },
  gItemName: {
    fontFamily: fonts.bodyBold,
    fontSize: typography.size.base,
    color: colors.text.primary,
  },
  gItemQty: {
    fontFamily: fonts.bodySemi,
    fontSize: typography.size.sm,
    color: colors.text.muted,
  },
  gItemNote: {
    fontFamily: fonts.body,
    fontSize: 11,
    color: colors.gray[400],
    marginTop: 2,
  },
});
