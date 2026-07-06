/**
 * MealRow — one slot on the plan card.
 *
 * Tap → recipe. Swipe left → the one pre-computed swap, tap to
 * accept. After the slot's window: three-tap logging inline.
 */
import { router } from 'expo-router';
import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Pill } from '@/components/Pill';
import { SwipeRevealRow } from '@/components/SwipeRevealRow';
import { getDish } from '@/lib/catalog';
import { colors, fonts, radii, spacing, typography } from '@/lib/theme';
import type { MealLog, PlanSlot, SwapCategory } from '@/types/domain';
import { isSlotLoggable, loggedStateCopy, SLOT_LABELS } from '../planLogic';
import { SwapSheet } from './SwapSheet';

interface MealRowProps {
  slot: PlanSlot;
  isToday: boolean;
  log: MealLog | undefined;
  onAcceptSwap: (slot: PlanSlot) => void;
  onLog: (
    slot: PlanSlot,
    status: 'ate' | 'swapped' | 'skipped',
    swapCategory?: SwapCategory,
    customText?: string | null,
  ) => void;
}

export function MealRow({ slot, isToday, log, onAcceptSwap, onLog }: MealRowProps) {
  const [sheetOpen, setSheetOpen] = useState(false);
  const dish = getDish(slot.dish_id);
  const swapDish = getDish(slot.swap_dish_id);
  if (!dish) return null;

  const showLogging = !log && isSlotLoggable(slot.slot, new Date(), isToday);

  return (
    <View>
      <SwipeRevealRow
        actionWidth={132}
        action={
          swapDish ? (
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={`swap to ${swapDish.name}`}
              onPress={() => onAcceptSwap(slot)}
              style={({ pressed }) => [styles.swapAction, pressed && styles.pressed]}
            >
              <Text style={styles.swapActionLabel} numberOfLines={2}>
                {swapDish.name}
              </Text>
              <Text style={styles.swapActionHint}>tap to swap</Text>
            </Pressable>
          ) : (
            <View style={styles.swapAction} />
          )
        }
      >
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={`${SLOT_LABELS[slot.slot]}: ${dish.name}`}
          onPress={() =>
            router.push({ pathname: '/(tabs)/recipe/[dishId]', params: { dishId: dish.id } })
          }
          style={({ pressed }) => [styles.row, pressed && styles.rowPressed]}
        >
          <View style={styles.rowText}>
            <Text style={styles.slotLabel}>{SLOT_LABELS[slot.slot]}</Text>
            <Text style={styles.dishName} numberOfLines={1}>
              {dish.name}
            </Text>
            {slot.source === 'leftover' ? (
              <Text style={styles.leftoverNote}>from your leftovers</Text>
            ) : null}
          </View>
          <Pill label={`${dish.prep_minutes} min`} variant="info" />
        </Pressable>
      </SwipeRevealRow>

      {log ? (
        <Text style={styles.loggedLine}>{loggedStateCopy(log)}</Text>
      ) : showLogging ? (
        <View style={styles.logRow}>
          <Pressable
            accessibilityRole="button"
            onPress={() => onLog(slot, 'ate')}
            style={({ pressed }) => [styles.ateButton, pressed && styles.pressed]}
          >
            <Text style={styles.ateLabel}>ate it</Text>
          </Pressable>
          <Pressable
            accessibilityRole="button"
            onPress={() => setSheetOpen(true)}
            style={({ pressed }) => [styles.quietButton, pressed && styles.pressed]}
          >
            <Text style={styles.quietLabel}>ate something else</Text>
          </Pressable>
          <Pressable
            accessibilityRole="button"
            onPress={() => onLog(slot, 'skipped')}
            style={({ pressed }) => [styles.quietButton, pressed && styles.pressed]}
          >
            <Text style={styles.quietLabel}>skipped</Text>
          </Pressable>
        </View>
      ) : null}

      <SwapSheet
        visible={sheetOpen}
        onClose={() => setSheetOpen(false)}
        onLog={(category, customText) => {
          setSheetOpen(false);
          onLog(slot, 'swapped', category, customText);
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: colors.surface,
    borderRadius: radii.lg,
    paddingHorizontal: spacing.gutter,
    paddingVertical: 14,
    minHeight: 64,
  },
  rowPressed: { backgroundColor: colors.surfaceHigh },
  pressed: { opacity: 0.85 },
  rowText: { flex: 1, minWidth: 0 },
  slotLabel: {
    fontFamily: fonts.label,
    fontSize: typography.size.xs,
    color: colors.text.secondary,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  dishName: {
    fontFamily: fonts.bodySemi,
    fontSize: typography.size.md,
    color: colors.text.primary,
    marginTop: 2,
  },
  leftoverNote: {
    fontFamily: fonts.displayItalic,
    fontSize: typography.size.sm,
    color: colors.text.secondary,
    marginTop: 2,
  },
  swapAction: {
    flex: 1,
    alignSelf: 'stretch',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.lavender,
    borderRadius: radii.lg,
    marginLeft: spacing.base,
    paddingHorizontal: spacing.base,
  },
  swapActionLabel: {
    fontFamily: fonts.bodySemi,
    fontSize: typography.size.sm,
    color: colors.eggplant,
    textAlign: 'center',
  },
  swapActionHint: {
    fontFamily: fonts.body,
    fontSize: typography.size.xs,
    color: colors.eggplant,
    marginTop: 2,
  },
  loggedLine: {
    fontFamily: fonts.displayItalic,
    fontSize: typography.size.sm,
    color: colors.text.secondary,
    marginTop: spacing.xs,
    marginLeft: spacing.gutter,
  },
  logRow: {
    flexDirection: 'row',
    gap: spacing.base,
    marginTop: spacing.base,
  },
  ateButton: {
    flex: 1.4,
    backgroundColor: colors.rose,
    borderRadius: radii.pill,
    paddingVertical: 12,
    alignItems: 'center',
    minHeight: 44,
    justifyContent: 'center',
  },
  ateLabel: {
    fontFamily: fonts.ui,
    fontSize: typography.size.sm,
    color: colors.white,
  },
  quietButton: {
    flex: 1,
    borderRadius: radii.pill,
    borderWidth: 1.5,
    borderColor: colors.gray[200],
    paddingVertical: 12,
    alignItems: 'center',
    minHeight: 44,
    justifyContent: 'center',
  },
  quietLabel: {
    fontFamily: fonts.bodySemi,
    fontSize: typography.size.xs,
    color: colors.text.secondary,
  },
});
