/**
 * LeftoverCard — the home screen's leftover-rescue entry point.
 *
 * Collapsed "got leftovers?" → expands in place to a 6-tile base-
 * category picker → result card with "show me how" and one swipe
 * alternative. After 9 pm: "tomorrow's lunch, sorted."
 *
 * Persistent: never auto-dismissed. Resets to collapsed after each use.
 */
import { router } from 'expo-router';
import React, { useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';
import { Card } from '@/components/Card';
import { GhostButton } from '@/components/GhostButton';
import { Pill } from '@/components/Pill';
import { PrimaryButton } from '@/components/PrimaryButton';
import { TileButton } from '@/components/TileButton';
import { registerHomeCard } from '@/components/cards';
import type { HomeCardProps } from '@/components/cards/types';
import { track } from '@/lib/analytics';
import { getDish } from '@/lib/catalog';
import { logLeftoverEvent } from '@/lib/leftoverEvents';
import { listRecentLeftoverEvents } from '@/lib/leftoverEvents';
import { rankLeftoverTransforms, type RankedTransform } from '@/lib/leftovers';
import type { MacroTargets } from '@/lib/macros';
import { listPantryItems } from '@/lib/pantry';
import { colors, fonts, spacing, typography } from '@/lib/theme';
import type { LeftoverBaseCategory } from '@/types/domain';

type Stage = 'collapsed' | 'picking' | 'loading' | 'result';

const CATEGORIES: { category: LeftoverBaseCategory; label: string }[] = [
  { category: 'dal', label: 'dal' },
  { category: 'sabzi', label: 'sabzi' },
  { category: 'rice', label: 'rice' },
  { category: 'roti', label: 'roti' },
  { category: 'curry', label: 'curry' },
  { category: 'paneer', label: 'paneer' },
];

/** Macro gap default — used when full profile isn't loaded. */
const DEFAULT_GAP: MacroTargets = { protein_g: 25, calories: 400 };
const LATE_NIGHT_HOUR = 21;

function LeftoverCard({ dismiss: _dismiss }: HomeCardProps) {
  const [stage, setStage] = useState<Stage>('collapsed');
  const [ranked, setRanked] = useState<RankedTransform[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<LeftoverBaseCategory | null>(null);

  const handleSelectCategory = async (category: LeftoverBaseCategory) => {
    setStage('loading');
    try {
      const [pantryItems, recentEvents] = await Promise.all([
        listPantryItems(),
        listRecentLeftoverEvents(7),
      ]);
      const availableIds = new Set(pantryItems.map((item) => item.ingredient_id));
      const results = rankLeftoverTransforms(category, availableIds, recentEvents, DEFAULT_GAP);
      setRanked(results);
      setSelectedCategory(category);
      setStage('result');
    } catch {
      setStage('picking');
    }
  };

  const handleAccept = async (transform: RankedTransform) => {
    if (!selectedCategory) return;
    try {
      await logLeftoverEvent(selectedCategory, transform.transform.dish_id);
      track('leftover_card_used', {
        category: selectedCategory,
        dish_id: transform.transform.dish_id,
      });
    } catch {
      // non-fatal — navigation proceeds regardless
    }
    const isLateNight = new Date().getHours() >= LATE_NIGHT_HOUR;
    router.push({
      pathname: '/(tabs)/recipe/[dishId]',
      params: {
        dishId: transform.transform.dish_id,
        ...(isLateNight ? { note: "tomorrow's lunch, sorted." } : {}),
      },
    });
    // reset for next use
    setStage('collapsed');
    setSelectedCategory(null);
    setRanked([]);
  };

  if (stage === 'collapsed') {
    return (
      <Card style={styles.card}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="got leftovers? tap to plan a meal around them"
          onPress={() => setStage('picking')}
          style={({ pressed }) => [styles.collapsedInner, pressed && styles.pressed]}
        >
          <View style={styles.collapsedText}>
            <Text style={styles.prompt}>got leftovers?</Text>
            <Text style={styles.hint}>tell me what, i'll make a plan.</Text>
          </View>
          <Text style={styles.chevron}>›</Text>
        </Pressable>
      </Card>
    );
  }

  if (stage === 'loading') {
    return (
      <Card style={[styles.card, styles.centred]}>
        <ActivityIndicator size="small" color={colors.primary} />
        <Text style={styles.hint}>finding your best options…</Text>
      </Card>
    );
  }

  if (stage === 'picking') {
    return (
      <Card style={styles.card}>
        <Text style={styles.title}>what's in the pot?</Text>
        <View style={styles.grid}>
          {CATEGORIES.map(({ category, label }) => (
            <TileButton
              key={category}
              label={label}
              onPress={() => void handleSelectCategory(category)}
              style={styles.categoryTile}
            />
          ))}
        </View>
        <GhostButton
          label="never mind"
          onPress={() => setStage('collapsed')}
          style={styles.cancel}
        />
      </Card>
    );
  }

  // result stage
  const topResult = ranked[0];
  const altResult = ranked[1];
  if (!topResult) return null;

  const dish = getDish(topResult.transform.dish_id);
  if (!dish) return null;

  const isLateNight = new Date().getHours() >= LATE_NIGHT_HOUR;

  return (
    <Card style={styles.card}>
      <Text style={styles.resultLabel}>
        {selectedCategory ? `your ${selectedCategory}, reinvented` : 'from your leftovers'}
      </Text>
      <Text style={styles.dishName}>{dish.name}</Text>
      <View style={styles.badges}>
        <Pill label={`${dish.prep_minutes} min`} variant="info" />
        <Pill label={`${dish.protein_g}g protein`} variant="success" />
      </View>
      {isLateNight ? <Text style={styles.lateNightCopy}>tomorrow's lunch, sorted.</Text> : null}
      <PrimaryButton
        label="show me how"
        onPress={() => void handleAccept(topResult)}
        style={styles.cta}
      />
      {altResult ? (
        <GhostButton
          label={`or try ${altResult.dish.name.toLowerCase()}`}
          onPress={() => void handleAccept(altResult)}
          style={styles.alt}
        />
      ) : null}
      <GhostButton
        label="pick something else"
        onPress={() => setStage('picking')}
        style={styles.back}
      />
    </Card>
  );
}

registerHomeCard({
  id: 'leftover-card',
  priority: 60,
  // visible once the kitchen is set up
  visibilityPredicate: async () => (await listPantryItems()).length > 0,
  Component: LeftoverCard,
});

const styles = StyleSheet.create({
  card: {
    padding: spacing.gutter,
    gap: spacing.base,
  },
  centred: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  collapsedInner: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 56,
  },
  collapsedText: { flex: 1 },
  pressed: { opacity: 0.7 },
  prompt: {
    fontFamily: fonts.display,
    fontSize: typography.size.xl,
    color: colors.text.primary,
  },
  hint: {
    fontFamily: fonts.body,
    fontSize: typography.size.sm,
    color: colors.text.secondary,
    marginTop: 2,
    marginLeft: spacing.base,
  },
  chevron: {
    fontFamily: fonts.bodySemi,
    fontSize: typography.size.xl,
    color: colors.text.secondary,
  },
  title: {
    fontFamily: fonts.display,
    fontSize: typography.size.xl,
    color: colors.text.primary,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.base,
    marginTop: spacing.xs,
  },
  categoryTile: {
    width: '31%',
    flexGrow: 1,
  },
  cancel: {
    alignSelf: 'center',
    marginTop: spacing.xs,
  },
  resultLabel: {
    fontFamily: fonts.label,
    fontSize: typography.size.xs,
    color: colors.text.secondary,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  dishName: {
    fontFamily: fonts.display,
    fontSize: typography.size.xl,
    color: colors.text.primary,
  },
  badges: {
    flexDirection: 'row',
    gap: spacing.base,
    flexWrap: 'wrap',
  },
  lateNightCopy: {
    fontFamily: fonts.displayItalic,
    fontSize: typography.size.md,
    color: colors.text.dark,
    marginTop: spacing.xs,
  },
  cta: {
    marginTop: spacing.xs,
  },
  alt: {
    alignSelf: 'center',
  },
  back: {
    alignSelf: 'center',
  },
});
