/**
 * Recipe detail — shared route for plan rows, leftover results and
 * cook-with-what-I-have. `note` carries optional context framing.
 */
import { useLocalSearchParams } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { ScreenHeader } from '@/components/ScreenHeader';
import { RecipeView } from '@/features/meals/components/RecipeView';
import { getDish } from '@/lib/catalog';
import { colors, fonts, spacing, typography } from '@/lib/theme';

export default function RecipeScreen() {
  const { dishId, note } = useLocalSearchParams<{ dishId: string; note?: string }>();
  const dish = dishId ? getDish(dishId) : undefined;

  return (
    <View style={styles.screen}>
      <ScreenHeader title="how to make it" />
      {dish ? (
        <RecipeView dish={dish} note={note} />
      ) : (
        <Text style={styles.missing}>couldn’t find that recipe — head back and try again.</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bg },
  missing: {
    fontFamily: fonts.body,
    fontSize: typography.size.md,
    color: colors.text.secondary,
    paddingHorizontal: spacing.gutter,
    marginTop: spacing.md,
  },
});
