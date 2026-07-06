/**
 * RecipeView — the shared recipe steps screen body.
 *
 * One screen, numbered steps (≤6 by content contract), prep and
 * protein badges. Used by the plan card, the leftover flow and
 * cook-with-what-I-have.
 */
import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { Pill } from '@/components/Pill';
import { colors, fonts, radii, spacing, typography } from '@/lib/theme';
import type { Dish } from '@/types/domain';

interface RecipeViewProps {
  dish: Dish;
  /** Optional context line, e.g. "tomorrow's lunch, sorted." */
  note?: string;
}

export function RecipeView({ dish, note }: RecipeViewProps) {
  return (
    <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      <Text style={styles.name}>{dish.name}</Text>
      <View style={styles.badges}>
        <Pill label={`${dish.prep_minutes} min`} variant="info" />
        <Pill label={`${Math.round(dish.protein_g)} g protein`} variant="success" />
      </View>
      {note ? <Text style={styles.note}>{note}</Text> : null}

      <View style={styles.steps}>
        {dish.method_steps.map((step, index) => (
          <View key={index} style={styles.step}>
            <View style={styles.stepNumber}>
              <Text style={styles.stepNumberText}>{index + 1}</Text>
            </View>
            <Text style={styles.stepText}>{step}</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: spacing.gutter,
    paddingBottom: 120,
  },
  name: {
    fontFamily: fonts.displayRegular,
    fontSize: typography.size['2xl'],
    color: colors.text.primary,
    lineHeight: typography.size['2xl'] * typography.leading.snug,
    marginTop: spacing.base,
  },
  badges: {
    flexDirection: 'row',
    gap: spacing.base,
    marginTop: spacing.sm,
  },
  note: {
    fontFamily: fonts.displayItalic,
    fontSize: typography.size.md,
    color: colors.text.secondary,
    marginTop: spacing.sm,
  },
  steps: {
    marginTop: spacing.md,
    gap: spacing.sm,
  },
  step: {
    flexDirection: 'row',
    gap: spacing.sm,
    backgroundColor: colors.surface,
    borderRadius: radii.lg,
    padding: spacing.gutter,
    alignItems: 'flex-start',
  },
  stepNumber: {
    width: 28,
    height: 28,
    borderRadius: radii.pill,
    backgroundColor: colors.lavender,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  stepNumberText: {
    fontFamily: fonts.ui,
    fontSize: typography.size.sm,
    color: colors.eggplant,
  },
  stepText: {
    flex: 1,
    fontFamily: fonts.body,
    fontSize: typography.size.md,
    color: colors.text.primary,
    lineHeight: typography.size.md * typography.leading.normal,
  },
});
