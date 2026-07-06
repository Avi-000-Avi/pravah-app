/**
 * Cook-now — on-demand "what can I make right now?"
 *
 * Shared by the home screen button and the use-it-soon card.
 * Optional `ingredientId` param: when provided (use-it-soon flow),
 * the pool is pre-filtered to dishes that include that ingredient.
 */
import { router, useLocalSearchParams } from 'expo-router';
import React, { useMemo } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { GhostButton } from '@/components/GhostButton';
import { Pill } from '@/components/Pill';
import { PrimaryButton } from '@/components/PrimaryButton';
import { ScreenHeader } from '@/components/ScreenHeader';
import { track } from '@/lib/analytics';
import { listDishes } from '@/lib/catalog';
import { pickCookSuggestion } from '@/lib/cookWithWhatIHave';
import { dailyTargets } from '@/lib/macros';
import { getIngredient } from '@/lib/pantry';
import { colors, fonts, radii, spacing, typography } from '@/lib/theme';
import { usePantryItems } from '@/hooks/usePantry';

const DEFAULT_PROFILE = { goal: 'maintenance' as const, weight_kg: null };

export default function CookNowScreen() {
  const insets = useSafeAreaInsets();
  const { ingredientId } = useLocalSearchParams<{ ingredientId?: string }>();

  const { data: pantryItems, isLoading } = usePantryItems();

  const suggestion = useMemo(() => {
    if (!pantryItems) return undefined;
    const pantrySet = new Set(pantryItems.map((item) => item.ingredient_id));
    const dishes = listDishes();
    const targets = dailyTargets(DEFAULT_PROFILE);
    return pickCookSuggestion(
      pantrySet,
      dishes,
      { recentDishIds: [] },
      targets,
      undefined,
      ingredientId,
    );
  }, [pantryItems, ingredientId]);

  const ingredientName = ingredientId ? getIngredient(ingredientId)?.name : undefined;

  const goToRecipe = (dishId: string) => {
    track('cook_with_what_i_have_used', { dish_id: dishId, has_ingredient_filter: !!ingredientId });
    router.push({ pathname: '/(tabs)/recipe/[dishId]', params: { dishId } });
  };

  return (
    <View style={[styles.screen, { paddingTop: insets.top }]}>
      <ScreenHeader title="cook with what's here" />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {ingredientName ? (
          <Text style={styles.context}>using up your {ingredientName}.</Text>
        ) : null}

        {isLoading ? (
          <View style={styles.centred}>
            <ActivityIndicator size="small" color={colors.primary} />
            <Text style={styles.loadingText}>checking your kitchen…</Text>
          </View>
        ) : !suggestion ? (
          <View style={styles.empty}>
            <Text style={styles.emptyTitle}>kitchen's pretty bare.</Text>
            <Text style={styles.emptyBody}>
              add a few ingredients to your pantry and come back.
            </Text>
          </View>
        ) : (
          <>
            <View style={styles.dishCard}>
              <Text style={styles.dishName}>{suggestion.dish.name}</Text>
              <View style={styles.badges}>
                <Pill label={`${suggestion.dish.prep_minutes} min`} variant="info" />
                <Pill label={`${suggestion.dish.protein_g}g protein`} variant="success" />
                {suggestion.dish.tags.includes('no-cook') ? (
                  <Pill label="no cooking" variant="success" />
                ) : null}
              </View>
              {!suggestion.mustIngredientSatisfied ? (
                <Text style={styles.fallbackNote}>
                  couldn't find a recipe for that ingredient — here's the next best thing.
                </Text>
              ) : null}
            </View>

            <PrimaryButton
              label="start cooking"
              onPress={() => goToRecipe(suggestion.dish.id)}
              style={styles.cta}
            />

            {suggestion.swap ? (
              <GhostButton
                label={`or try ${suggestion.swap.name.toLowerCase()}`}
                onPress={() => goToRecipe(suggestion.swap!.id)}
                style={styles.swapButton}
              />
            ) : null}
          </>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bg },
  content: {
    paddingHorizontal: spacing.gutter,
    paddingBottom: spacing.xl,
  },
  context: {
    fontFamily: fonts.displayItalic,
    fontSize: typography.size.md,
    color: colors.text.secondary,
    marginBottom: spacing.md,
  },
  centred: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.base,
    marginTop: spacing.md,
  },
  loadingText: {
    fontFamily: fonts.body,
    fontSize: typography.size.base,
    color: colors.text.secondary,
  },
  empty: {
    marginTop: spacing.gutter,
  },
  emptyTitle: {
    fontFamily: fonts.display,
    fontSize: typography.size.xl,
    color: colors.text.primary,
  },
  emptyBody: {
    fontFamily: fonts.body,
    fontSize: typography.size.base,
    color: colors.text.secondary,
    lineHeight: typography.size.base * 1.5,
    marginTop: spacing.base,
  },
  dishCard: {
    backgroundColor: colors.surface,
    borderRadius: radii.card,
    padding: spacing.md,
    gap: spacing.base,
    marginTop: spacing.gutter,
  },
  dishName: {
    fontFamily: fonts.display,
    fontSize: typography.size['2xl'],
    color: colors.text.primary,
  },
  badges: {
    flexDirection: 'row',
    gap: spacing.base,
    flexWrap: 'wrap',
  },
  fallbackNote: {
    fontFamily: fonts.displayItalic,
    fontSize: typography.size.sm,
    color: colors.text.secondary,
    marginTop: spacing.xs,
  },
  cta: {
    marginTop: spacing.md,
  },
  swapButton: {
    alignSelf: 'center',
    marginTop: spacing.sm,
  },
});
