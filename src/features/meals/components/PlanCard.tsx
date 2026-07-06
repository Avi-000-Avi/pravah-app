/**
 * PlanCard — the home screen's primary card, always present.
 *
 * Three meal rows + one workout row, generated from the pantry-aware
 * planner. Swipe a row for its one pre-computed swap; tap for the
 * recipe. Footer: "planned with what's in your kitchen."
 */
import React, { useEffect } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Card } from '@/components/Card';
import { Pill } from '@/components/Pill';
import { useAcceptSwap, useDailyPlan, usePlanForDate, useToggleTired } from '@/hooks/useDailyPlan';
import { useLogMeal, useMealLogs } from '@/hooks/useMealLogs';
import { track } from '@/lib/analytics';
import { formatDateKey } from '@/lib/planner';
import { colors, fonts, radii, shadows, spacing, typography } from '@/lib/theme';
import type { PlanSlot, SwapCategory } from '@/types/domain';
import { MealRow } from './MealRow';

const TIRED_CHIP_AFTER_HOUR = 18;

interface PlanCardProps {
  /** Which day the card shows — today generates, yesterday is read-only. */
  viewing: 'today' | 'yesterday';
  onToggleViewing: () => void;
}

export function PlanCard({ viewing, onToggleViewing }: PlanCardProps) {
  const now = new Date();
  const isToday = viewing === 'today';
  const yesterday = new Date(now);
  yesterday.setDate(yesterday.getDate() - 1);
  const dateKey = formatDateKey(isToday ? now : yesterday);

  const todayPlanQuery = useDailyPlan(now);
  const yesterdayPlanQuery = usePlanForDate(formatDateKey(yesterday));
  const { data: plan, isLoading, isError, refetch } = isToday ? todayPlanQuery : yesterdayPlanQuery;

  const { data: logs } = useMealLogs([dateKey]);
  const acceptSwap = useAcceptSwap(now);
  const toggleTired = useToggleTired(now);
  const logMeal = useLogMeal();

  useEffect(() => {
    track('plan_viewed', { date: dateKey });
  }, [dateKey]);

  const isTired = plan?.condition_flags.includes('tired') ?? false;
  const showTiredChip = isToday && now.getHours() >= TIRED_CHIP_AFTER_HOUR && plan;

  const handleLog = (
    slot: PlanSlot,
    status: 'ate' | 'swapped' | 'skipped',
    swapCategory?: SwapCategory,
    customText?: string | null,
  ) => {
    logMeal.mutate({
      plan_date: dateKey,
      slot: slot.slot,
      status,
      swap_category: swapCategory ?? null,
      custom_text: customText ?? null,
    });
  };

  return (
    <Card style={[styles.card, shadows.card]}>
      <View style={styles.header}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={isToday ? 'show yesterday' : 'back to today'}
          onPress={onToggleViewing}
          style={({ pressed }) => [styles.dateToggle, pressed && styles.pressed]}
        >
          <Text style={styles.dateToggleText}>{isToday ? 'today' : 'yesterday'}</Text>
          <Text style={styles.dateToggleHint}>{isToday ? 'see yesterday' : 'back to today'}</Text>
        </Pressable>

        {showTiredChip ? (
          <Pressable
            accessibilityRole="button"
            accessibilityState={{ selected: isTired }}
            onPress={() => toggleTired.mutate()}
            disabled={toggleTired.isPending}
            style={({ pressed }) => [
              styles.tiredChip,
              isTired && styles.tiredChipActive,
              pressed && styles.pressed,
            ]}
          >
            <Text style={[styles.tiredChipText, isTired && styles.tiredChipTextActive]}>
              tired today
            </Text>
          </Pressable>
        ) : null}
      </View>

      {isLoading ? (
        <Text style={styles.stateLine}>setting up your day from what’s in the kitchen…</Text>
      ) : null}
      {isError ? (
        <Pressable onPress={() => void refetch()}>
          <Text style={styles.stateLine}>couldn’t load your plan — tap to retry</Text>
        </Pressable>
      ) : null}
      {!isToday && !isLoading && !plan ? (
        <Text style={styles.stateLine}>no plan was made yesterday — today’s a fresh start.</Text>
      ) : null}

      {plan ? (
        <View style={styles.rows}>
          {plan.slots.map((slot) => (
            <MealRow
              key={slot.slot}
              slot={slot}
              isToday={isToday}
              log={(logs ?? []).find((log) => log.plan_date === dateKey && log.slot === slot.slot)}
              onAcceptSwap={(target) => {
                if (isToday) acceptSwap.mutate(target.slot);
              }}
              onLog={handleLog}
            />
          ))}

          {isTired ? <Text style={styles.tiredNote}>switched dinner to no-cook.</Text> : null}

          {plan.workout ? (
            <View style={styles.workoutRow}>
              <View style={styles.rowText}>
                <Text style={styles.workoutLabel}>movement</Text>
                <Text style={styles.workoutName}>{plan.workout.name}</Text>
              </View>
              {plan.workout.kind !== 'rest' ? (
                <Pill label={`${plan.workout.duration_min} min`} variant="lavender" />
              ) : null}
            </View>
          ) : null}
        </View>
      ) : null}

      <Text style={styles.footer}>planned with what’s in your kitchen.</Text>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: spacing.gutter,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
  },
  dateToggle: {
    minHeight: 44,
    justifyContent: 'center',
  },
  dateToggleText: {
    fontFamily: fonts.display,
    fontSize: typography.size.xl,
    color: colors.text.primary,
  },
  dateToggleHint: {
    fontFamily: fonts.body,
    fontSize: typography.size.xs,
    color: colors.text.secondary,
  },
  pressed: { opacity: 0.7 },
  tiredChip: {
    borderRadius: radii.pill,
    borderWidth: 1.5,
    borderColor: colors.lavenderBorder,
    paddingHorizontal: spacing.gutter,
    paddingVertical: 10,
    minHeight: 44,
    justifyContent: 'center',
  },
  tiredChipActive: {
    backgroundColor: colors.lavender,
    borderColor: colors.lavender,
  },
  tiredChipText: {
    fontFamily: fonts.bodySemi,
    fontSize: typography.size.sm,
    color: colors.text.secondary,
  },
  tiredChipTextActive: {
    color: colors.eggplant,
  },
  stateLine: {
    fontFamily: fonts.body,
    fontSize: typography.size.base,
    color: colors.text.secondary,
    lineHeight: typography.size.base * typography.leading.normal,
    paddingVertical: spacing.base,
  },
  rows: {
    gap: spacing.base,
  },
  rowText: { flex: 1 },
  tiredNote: {
    fontFamily: fonts.displayItalic,
    fontSize: typography.size.sm,
    color: colors.text.secondary,
    marginLeft: spacing.gutter,
  },
  workoutRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: colors.surfaceLow,
    borderRadius: radii.lg,
    paddingHorizontal: spacing.gutter,
    paddingVertical: 14,
    minHeight: 56,
  },
  workoutLabel: {
    fontFamily: fonts.label,
    fontSize: typography.size.xs,
    color: colors.text.secondary,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  workoutName: {
    fontFamily: fonts.bodySemi,
    fontSize: typography.size.md,
    color: colors.text.primary,
    marginTop: 2,
  },
  footer: {
    fontFamily: fonts.displayItalic,
    fontSize: typography.size.sm,
    color: colors.text.secondary,
    textAlign: 'center',
    marginTop: spacing.sm,
  },
});
