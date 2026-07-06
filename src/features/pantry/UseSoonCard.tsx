/**
 * UseSoonCard — low-priority home card for ingredients expiring today.
 *
 * Shows only the most urgent item (one per day). Tapping navigates to
 * cook-now pre-filtered to dishes that use that ingredient. Never
 * announces a save that didn't happen.
 */
import { router } from 'expo-router';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Card } from '@/components/Card';
import { registerHomeCard } from '@/components/cards';
import type { HomeCardProps } from '@/components/cards/types';
import { track } from '@/lib/analytics';
import { getIngredient, listPantryItems } from '@/lib/pantry';
import { itemsToUseToday } from '@/lib/freshness';
import { colors, fonts, spacing, typography } from '@/lib/theme';

async function getUrgentIngredientId(): Promise<string | null> {
  const items = await listPantryItems();
  const toUse = itemsToUseToday(items, new Date());
  return toUse[0]?.ingredient_id ?? null;
}

function UseSoonCard({ dismiss }: HomeCardProps) {
  const [ingredientId, setIngredientId] = React.useState<string | null>(null);

  React.useEffect(() => {
    void getUrgentIngredientId().then(setIngredientId);
  }, []);

  const ingredient = ingredientId ? getIngredient(ingredientId) : undefined;
  if (!ingredient || !ingredientId) return null;

  const handleAccept = () => {
    track('use_soon_card_accepted', { ingredient_id: ingredientId });
    router.push({
      pathname: '/(tabs)/cook-now',
      params: { ingredientId },
    });
    dismiss();
  };

  return (
    <Card style={styles.card}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`use ${ingredient.name} today — see what to make`}
        onPress={handleAccept}
        style={({ pressed }) => [styles.inner, pressed && styles.pressed]}
      >
        <View style={styles.textBlock}>
          <Text style={styles.label}>use it today</Text>
          <Text style={styles.title}>{ingredient.name}</Text>
          <Text style={styles.body}>it won't keep much longer — let's cook something with it.</Text>
        </View>
        <Text style={styles.chevron}>›</Text>
      </Pressable>
    </Card>
  );
}

registerHomeCard({
  id: 'use-soon',
  priority: 40,
  visibilityPredicate: async () => {
    const id = await getUrgentIngredientId();
    if (!id) return false;
    track('use_soon_card_shown', { ingredient_id: id });
    return true;
  },
  dismissible: true,
  Component: UseSoonCard,
});

const styles = StyleSheet.create({
  card: {
    padding: spacing.gutter,
  },
  inner: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 56,
  },
  textBlock: { flex: 1 },
  pressed: { opacity: 0.7 },
  label: {
    fontFamily: fonts.label,
    fontSize: typography.size.xs,
    color: colors.text.secondary,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
    marginBottom: spacing.xs,
  },
  title: {
    fontFamily: fonts.display,
    fontSize: typography.size.xl,
    color: colors.text.primary,
  },
  body: {
    fontFamily: fonts.body,
    fontSize: typography.size.sm,
    color: colors.text.secondary,
    lineHeight: typography.size.sm * 1.5,
    marginTop: spacing.xs,
  },
  chevron: {
    fontFamily: fonts.bodySemi,
    fontSize: typography.size.xl,
    color: colors.text.secondary,
    marginLeft: spacing.base,
  },
});
