/**
 * My kitchen — grouped pantry view with tap-first manual add.
 *
 * The v1 stand-in for grocery ingestion: rows added here are
 * source 'manual'; Swiggy-sourced rows will land through the same
 * data layer (src/lib/pantry.ts) with no UI changes.
 *
 * Typing is permitted in the search field but never required — the
 * quick grid keeps the tap-only path first.
 */
import React, { useMemo, useState } from 'react';
import { Keyboard, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { Card } from '@/components/Card';
import { Pill } from '@/components/Pill';
import { ScreenHeader } from '@/components/ScreenHeader';
import { SectionLabel } from '@/components/SectionLabel';
import { SwipeRevealRow } from '@/components/SwipeRevealRow';
import { TileButton } from '@/components/TileButton';
import { useAddPantryItem, usePantryItems, useRemovePantryItem } from '@/hooks/usePantry';
import { freshnessBucket } from '@/lib/freshness';
import { getIngredient } from '@/lib/pantry';
import { ING, SEED_INGREDIENTS } from '@/lib/seed';
import { colors, fonts, radii, spacing, typography } from '@/lib/theme';
import type { PantryItem } from '@/types/domain';

const QUICK_ADD = [ING.tomatoes, ING.paneer, ING.palak, ING.potatoes, ING.chicken, ING.bananas];

const FRESHNESS_COPY = {
  fresh: null,
  'use-soon': { label: 'use soon', variant: 'warning' as const },
  'use-today': { label: 'use today', variant: 'warning' as const },
  'always-on': null,
};

export default function KitchenScreen() {
  const { data: pantryItems, isLoading, isError, refetch } = usePantryItems();
  const addItem = useAddPantryItem();
  const removeItem = useRemovePantryItem();
  const [query, setQuery] = useState('');

  const inPantry = useMemo(
    () => new Set((pantryItems ?? []).map((item) => item.ingredient_id)),
    [pantryItems],
  );

  const results = useMemo(() => {
    const needle = query.trim().toLowerCase();
    if (!needle) return [];
    return SEED_INGREDIENTS.filter(
      (ingredient) =>
        !inPantry.has(ingredient.id) &&
        (ingredient.name.includes(needle) ||
          ingredient.name_aliases.some((alias) => alias.toLowerCase().includes(needle))),
    ).slice(0, 8);
  }, [query, inPantry]);

  const staples = (pantryItems ?? []).filter((item) => item.source === 'staple');
  const freshItems = (pantryItems ?? []).filter((item) => item.source !== 'staple');

  const add = (ingredientId: string) => {
    addItem.mutate({ ingredientId, source: 'manual' });
    setQuery('');
    Keyboard.dismiss();
  };

  return (
    <View style={styles.screen}>
      <ScreenHeader title="my kitchen" />
      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Add items — quick grid first, search for everything else */}
        <SectionLabel>add items</SectionLabel>
        <View style={styles.quickGrid}>
          {QUICK_ADD.map((ingredient) => {
            const added = inPantry.has(ingredient.id);
            return (
              <TileButton
                key={ingredient.id}
                label={added ? `${ingredient.name} ✓` : ingredient.name}
                selected={added}
                onPress={() => {
                  if (!added) add(ingredient.id);
                }}
                style={styles.quickTile}
              />
            );
          })}
        </View>

        <TextInput
          style={styles.search}
          value={query}
          onChangeText={setQuery}
          placeholder="or search — try methi, soya, kheera…"
          placeholderTextColor={colors.gray[400]}
          autoCorrect={false}
          autoCapitalize="none"
          accessibilityLabel="search ingredients"
        />
        {results.length > 0 ? (
          <Card style={styles.results}>
            {results.map((ingredient, index) => (
              <Pressable
                key={ingredient.id}
                accessibilityRole="button"
                onPress={() => add(ingredient.id)}
                style={({ pressed }) => [
                  styles.resultRow,
                  index < results.length - 1 && styles.resultDivider,
                  pressed && styles.rowPressed,
                ]}
              >
                <Text style={styles.resultName}>{ingredient.name}</Text>
                <Text style={styles.resultAdd}>add</Text>
              </Pressable>
            ))}
          </Card>
        ) : null}
        {query.trim().length > 0 && results.length === 0 ? (
          <Text style={styles.noMatch}>nothing matching yet — try another name</Text>
        ) : null}

        {/* Current pantry */}
        {isLoading ? <Text style={styles.stateLine}>opening your kitchen…</Text> : null}
        {isError ? (
          <Pressable onPress={() => void refetch()}>
            <Text style={styles.stateLine}>couldn’t load your kitchen — tap to retry</Text>
          </Pressable>
        ) : null}

        {freshItems.length > 0 ? (
          <View style={styles.section}>
            <SectionLabel>fresh items</SectionLabel>
            <View style={styles.rows}>
              {freshItems.map((item) => (
                <PantryRow key={item.id} item={item} onRemove={removeItem.mutate} />
              ))}
            </View>
          </View>
        ) : null}
        {!isLoading && freshItems.length === 0 ? (
          <View style={styles.section}>
            <SectionLabel>fresh items</SectionLabel>
            <Text style={styles.emptyLine}>
              nothing fresh tracked yet — add what you picked up and meals will plan around it.
            </Text>
          </View>
        ) : null}

        {staples.length > 0 ? (
          <View style={styles.section}>
            <SectionLabel>always in your kitchen</SectionLabel>
            <View style={styles.rows}>
              {staples.map((item) => (
                <PantryRow key={item.id} item={item} onRemove={removeItem.mutate} />
              ))}
            </View>
          </View>
        ) : null}
      </ScrollView>
    </View>
  );
}

function PantryRow({ item, onRemove }: { item: PantryItem; onRemove: (id: string) => void }) {
  const ingredient = getIngredient(item.ingredient_id);
  if (!ingredient) return null;
  const freshness = FRESHNESS_COPY[freshnessBucket(item, new Date())];

  return (
    <SwipeRevealRow
      action={
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={`finished ${ingredient.name}`}
          onPress={() => onRemove(item.ingredient_id)}
          style={({ pressed }) => [styles.finishAction, pressed && styles.rowPressed]}
        >
          <Text style={styles.finishLabel}>finished it</Text>
        </Pressable>
      }
    >
      <View style={styles.row}>
        <View style={styles.rowText}>
          <Text style={styles.rowName}>{ingredient.name}</Text>
          <Text style={styles.rowSub}>{ingredient.category}</Text>
        </View>
        {freshness ? <Pill label={freshness.label} variant={freshness.variant} /> : null}
      </View>
    </SwipeRevealRow>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bg },
  content: {
    paddingHorizontal: spacing.gutter,
    paddingBottom: 120,
  },
  quickGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.base,
  },
  quickTile: {
    width: '31%',
    flexGrow: 1,
  },
  search: {
    backgroundColor: colors.surface,
    borderRadius: radii.lg,
    borderWidth: 1.5,
    borderColor: colors.gray[200],
    paddingHorizontal: spacing.gutter,
    paddingVertical: 14,
    marginTop: spacing.sm,
    fontFamily: fonts.body,
    fontSize: typography.size.md,
    color: colors.text.primary,
    minHeight: 48,
  },
  results: {
    marginTop: spacing.base,
    overflow: 'hidden',
  },
  resultRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.gutter,
    paddingVertical: 14,
    minHeight: 48,
  },
  resultDivider: {
    borderBottomWidth: 1,
    borderBottomColor: colors.gray[100],
  },
  rowPressed: { opacity: 0.7 },
  resultName: {
    fontFamily: fonts.bodySemi,
    fontSize: typography.size.base,
    color: colors.text.primary,
  },
  resultAdd: {
    fontFamily: fonts.uiSemi,
    fontSize: typography.size.sm,
    color: colors.primary,
  },
  noMatch: {
    fontFamily: fonts.body,
    fontSize: typography.size.sm,
    color: colors.text.secondary,
    marginTop: spacing.base,
  },
  stateLine: {
    fontFamily: fonts.body,
    fontSize: typography.size.base,
    color: colors.text.secondary,
    marginTop: spacing.md,
  },
  emptyLine: {
    fontFamily: fonts.body,
    fontSize: typography.size.sm,
    color: colors.text.secondary,
    lineHeight: typography.size.sm * typography.leading.normal,
  },
  section: {
    marginTop: spacing.md,
  },
  rows: {
    gap: spacing.base,
  },
  row: {
    backgroundColor: colors.surface,
    borderRadius: radii.lg,
    paddingHorizontal: spacing.gutter,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    minHeight: 56,
  },
  rowText: { flex: 1 },
  rowName: {
    fontFamily: fonts.bodySemi,
    fontSize: typography.size.base,
    color: colors.text.primary,
  },
  rowSub: {
    fontFamily: fonts.body,
    fontSize: typography.size.sm,
    color: colors.text.secondary,
    marginTop: 1,
  },
  finishAction: {
    flex: 1,
    alignSelf: 'stretch',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.amber,
    borderRadius: radii.lg,
    marginLeft: spacing.base,
  },
  finishLabel: {
    fontFamily: fonts.uiSemi,
    fontSize: typography.size.sm,
    color: colors.status.warningText,
  },
});
