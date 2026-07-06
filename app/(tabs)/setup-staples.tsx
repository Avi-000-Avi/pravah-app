/**
 * Staples baseline — "what's always in your kitchen?"
 *
 * 12-tile grid, all pre-selected; the user deselects what they don't
 * keep. One primary action. Skipping accepts all 12. ~15 seconds.
 */
import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { GhostButton } from '@/components/GhostButton';
import { PrimaryButton } from '@/components/PrimaryButton';
import { ScreenHeader } from '@/components/ScreenHeader';
import { TileButton } from '@/components/TileButton';
import { usePantryItems, useReplaceStaples } from '@/hooks/usePantry';
import { CANONICAL_STAPLES } from '@/lib/seed';
import { colors, fonts, spacing, typography } from '@/lib/theme';

const ALL_STAPLE_IDS = CANONICAL_STAPLES.map((staple) => staple.id);

export default function SetupStaplesScreen() {
  const { from } = useLocalSearchParams<{ from?: string }>();
  const fromSettings = from === 'settings';

  const { data: pantryItems } = usePantryItems();
  const replaceStaples = useReplaceStaples();

  const [selected, setSelected] = useState<Set<string>>(new Set(ALL_STAPLE_IDS));
  const [hydrated, setHydrated] = useState(false);

  // Revisits start from the current baseline instead of the default 12.
  useEffect(() => {
    if (hydrated || !fromSettings || !pantryItems) return;
    const current = pantryItems
      .filter((item) => item.source === 'staple')
      .map((item) => item.ingredient_id);
    if (current.length > 0) setSelected(new Set(current));
    setHydrated(true);
  }, [hydrated, fromSettings, pantryItems]);

  const toggle = (id: string) => {
    setSelected((previous) => {
      const next = new Set(previous);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const finish = (ids: string[]) => {
    replaceStaples.mutate(ids, {
      onSettled: () => {
        if (fromSettings) router.back();
        else router.replace('/(tabs)/setup-household');
      },
    });
  };

  return (
    <View style={styles.screen}>
      <ScreenHeader title={fromSettings ? 'my staples' : ''} showBack={fromSettings} />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.heading}>what’s always in your kitchen?</Text>
        <Text style={styles.sub}>
          we’ve ticked the usual dozen — untick anything you don’t keep.
        </Text>

        <View style={styles.grid}>
          {CANONICAL_STAPLES.map((staple) => (
            <TileButton
              key={staple.id}
              label={staple.name}
              selected={selected.has(staple.id)}
              onPress={() => toggle(staple.id)}
              style={styles.tile}
            />
          ))}
        </View>

        <PrimaryButton
          label="done"
          onPress={() => finish([...selected])}
          disabled={replaceStaples.isPending}
          style={styles.cta}
        />
        {!fromSettings ? (
          <GhostButton
            label="skip — keep all 12"
            onPress={() => finish(ALL_STAPLE_IDS)}
            style={styles.skip}
          />
        ) : null}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bg },
  content: {
    paddingHorizontal: spacing.gutter,
    paddingBottom: 120,
  },
  heading: {
    fontFamily: fonts.displayRegular,
    fontSize: typography.size['2xl'],
    color: colors.text.primary,
    lineHeight: typography.size['2xl'] * typography.leading.snug,
    marginTop: spacing.base,
  },
  sub: {
    fontFamily: fonts.body,
    fontSize: typography.size.base,
    color: colors.text.secondary,
    marginTop: spacing.base,
    lineHeight: typography.size.base * typography.leading.normal,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.base,
    marginTop: spacing.md,
  },
  tile: {
    width: '31%',
    flexGrow: 1,
  },
  cta: {
    marginTop: spacing.md,
    alignSelf: 'stretch',
    justifyContent: 'center',
  },
  skip: {
    marginTop: spacing.sm,
    alignSelf: 'center',
  },
});
