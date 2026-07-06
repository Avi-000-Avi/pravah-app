/**
 * Household size — "who are you usually cooking for?"
 * One tap selects and advances. Skip defaults to '2 of us'.
 */
import { router } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { GhostButton } from '@/components/GhostButton';
import { ScreenHeader } from '@/components/ScreenHeader';
import { TileButton } from '@/components/TileButton';
import { useSetHousehold } from '@/hooks/useHousehold';
import { colors, fonts, spacing, typography } from '@/lib/theme';
import type { HouseholdSizeBucket } from '@/types/domain';

const OPTIONS: { bucket: HouseholdSizeBucket; label: string }[] = [
  { bucket: 'solo', label: 'just me' },
  { bucket: 'couple', label: '2 of us' },
  { bucket: 'family', label: 'family of 3–4' },
  { bucket: 'large', label: 'more' },
];

export default function SetupHouseholdScreen() {
  const setHousehold = useSetHousehold();

  const choose = (bucket: HouseholdSizeBucket) => {
    setHousehold.mutate(bucket, {
      onSettled: () => router.replace('/(tabs)/setup-time'),
    });
  };

  return (
    <View style={styles.screen}>
      <ScreenHeader title="" showBack={false} />
      <View style={styles.content}>
        <Text style={styles.heading}>who are you usually cooking for?</Text>
        <View style={styles.options}>
          {OPTIONS.map((option) => (
            <TileButton
              key={option.bucket}
              label={option.label}
              onPress={() => choose(option.bucket)}
              style={styles.tile}
            />
          ))}
        </View>
        <GhostButton label="skip" onPress={() => choose('couple')} style={styles.skip} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bg },
  content: { flex: 1, paddingHorizontal: spacing.gutter },
  heading: {
    fontFamily: fonts.displayRegular,
    fontSize: typography.size['2xl'],
    color: colors.text.primary,
    lineHeight: typography.size['2xl'] * typography.leading.snug,
    marginTop: spacing.base,
  },
  options: {
    gap: spacing.sm,
    marginTop: spacing.md,
  },
  tile: {
    minHeight: 64,
  },
  skip: {
    marginTop: spacing.md,
    alignSelf: 'center',
  },
});
