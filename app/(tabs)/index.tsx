import { Feather } from '@expo/vector-icons';
import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Card } from '@/components/Card';
import { GhostButton } from '@/components/GhostButton';
import { HealthRing } from '@/components/HealthRing';
import { Pill, type PillVariant } from '@/components/Pill';
import { PrimaryButton } from '@/components/PrimaryButton';
import { SectionTitle } from '@/components/SectionTitle';
import { colors, fonts, typography } from '@/lib/theme';

interface Meal {
  type: string;
  name: string;
  cal: string;
  status: 'Log' | 'Prepped' | 'Prepare';
}

const TODAY_MEALS: Meal[] = [
  { type: 'Breakfast', name: 'Oatmeal', cal: '423 cal', status: 'Log' },
  { type: 'Lunch', name: 'Khichdi', cal: '567 cal', status: 'Prepped' },
  { type: 'Snack', name: 'Peanuts', cal: '280 cal', status: 'Prepare' },
];

const GROCERIES = [
  { name: 'Paneer', qty: '500gm' },
  { name: 'Eggs', qty: '10pcs' },
  { name: 'Onions', qty: '1kg' },
  { name: 'Tomato', qty: '500gm' },
];

const STATUS_TO_VARIANT: Record<Meal['status'], PillVariant> = {
  Log: 'success',
  Prepped: 'warning',
  Prepare: 'error',
};

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={{
        paddingTop: insets.top + 16,
        paddingBottom: 120, // clear the floating nav
      }}
      showsVerticalScrollIndicator={false}
    >
      {/* Greeting */}
      <View style={styles.greetingWrap}>
        <Text style={styles.greeting}>Hey Avinash</Text>
      </View>

      {/* Health ring */}
      <View style={styles.ringWrap}>
        <HealthRing size={280} />
      </View>

      {/* CTAs */}
      <View style={styles.ctaRow}>
        <PrimaryButton
          label="Log progress"
          leading={<Feather name="plus" size={16} color={colors.white} />}
          onPress={() => undefined}
        />
        <GhostButton
          label="Adjust plan"
          emphasis="strong"
          leading={<Feather name="edit-2" size={13} color={colors.text.primary} />}
          onPress={() => undefined}
        />
      </View>

      {/* Today's meals */}
      <View style={styles.section}>
        <SectionTitle>Today</SectionTitle>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.mealRow}
        >
          {TODAY_MEALS.map((m) => (
            <Card key={m.type} style={styles.mealCard}>
              <Text style={styles.mealType}>{m.type}</Text>
              <Text style={styles.mealName}>{m.name}</Text>
              <Text style={styles.mealCal}>{m.cal}</Text>
              <Pill label={m.status} variant={STATUS_TO_VARIANT[m.status]} block />
            </Card>
          ))}
        </ScrollView>
      </View>

      {/* Groceries */}
      <View style={styles.section}>
        <SectionTitle>Groceries</SectionTitle>
        <Card style={styles.listCard}>
          {GROCERIES.map((item, i) => (
            <View
              key={item.name}
              style={[styles.row, i < GROCERIES.length - 1 && styles.rowDivider]}
            >
              <Text style={styles.rowName}>{item.name}</Text>
              <Text style={styles.rowMeta}>{item.qty}</Text>
            </View>
          ))}
        </Card>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bg },
  greetingWrap: { alignItems: 'center', paddingHorizontal: 20, paddingBottom: 4 },
  greeting: {
    fontFamily: fonts.serif,
    fontSize: typography.size.xl,
    color: colors.text.deep,
    letterSpacing: typography.size.xl * typography.tracking.tight,
  },
  ringWrap: { paddingHorizontal: 20, alignItems: 'center' },
  ctaRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 10,
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 24,
  },
  section: { paddingHorizontal: 20, marginBottom: 28 },
  mealRow: { gap: 10, paddingBottom: 4 },
  mealCard: { padding: 14, minWidth: 122 },
  mealType: {
    fontFamily: fonts.label,
    fontSize: typography.size.xs,
    color: colors.text.muted,
    letterSpacing: 0.4,
    marginBottom: 3,
    textTransform: 'uppercase',
  },
  mealName: {
    fontFamily: fonts.display,
    fontSize: 15,
    color: colors.text.primary,
    marginBottom: 2,
  },
  mealCal: {
    fontFamily: fonts.body,
    fontSize: typography.size.sm - 1,
    color: colors.text.muted,
    marginBottom: 10,
  },
  listCard: { overflow: 'hidden' },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  rowDivider: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.gray[200],
  },
  rowName: {
    fontFamily: fonts.bodySemi,
    fontSize: typography.size.base,
    color: colors.text.primary,
  },
  rowMeta: {
    fontFamily: fonts.bodySemi,
    fontSize: typography.size.sm,
    color: colors.text.muted,
  },
});
