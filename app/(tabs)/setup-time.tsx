/**
 * Time preferences — "how much time do you usually have to cook?"
 * Two tile rows (weekday breakfast / weekday dinner). Skip = 15/30.
 */
import { router } from 'expo-router';
import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { GhostButton } from '@/components/GhostButton';
import { PrimaryButton } from '@/components/PrimaryButton';
import { ScreenHeader } from '@/components/ScreenHeader';
import { SectionLabel } from '@/components/SectionLabel';
import { TileButton } from '@/components/TileButton';
import { useSetTimeConstraints } from '@/hooks/useHousehold';
import { DEFAULT_TIME_CONSTRAINTS } from '@/lib/planner';
import { colors, fonts, spacing, typography } from '@/lib/theme';

const BREAKFAST_OPTIONS = [5, 15, 30];
const DINNER_OPTIONS = [15, 30, 45];

export default function SetupTimeScreen() {
  const setTimeConstraints = useSetTimeConstraints();
  const [breakfast, setBreakfast] = useState(DEFAULT_TIME_CONSTRAINTS.weekday_breakfast_min);
  const [dinner, setDinner] = useState(DEFAULT_TIME_CONSTRAINTS.weekday_dinner_min);

  const finish = (breakfastMin: number, dinnerMin: number) => {
    setTimeConstraints.mutate(
      { weekday_breakfast_min: breakfastMin, weekday_dinner_min: dinnerMin },
      { onSettled: () => router.replace('/(tabs)') },
    );
  };

  return (
    <View style={styles.screen}>
      <ScreenHeader title="" showBack={false} />
      <View style={styles.content}>
        <Text style={styles.heading}>how much time do you usually have to cook?</Text>
        <Text style={styles.sub}>weekends get extra breathing room automatically.</Text>

        <View style={styles.group}>
          <SectionLabel>weekday breakfast</SectionLabel>
          <View style={styles.row}>
            {BREAKFAST_OPTIONS.map((minutes) => (
              <TileButton
                key={minutes}
                label={`${minutes} min`}
                selected={breakfast === minutes}
                onPress={() => setBreakfast(minutes)}
                style={styles.tile}
              />
            ))}
          </View>
        </View>

        <View style={styles.group}>
          <SectionLabel>weekday dinner</SectionLabel>
          <View style={styles.row}>
            {DINNER_OPTIONS.map((minutes) => (
              <TileButton
                key={minutes}
                label={`${minutes} min`}
                selected={dinner === minutes}
                onPress={() => setDinner(minutes)}
                style={styles.tile}
              />
            ))}
          </View>
        </View>

        <PrimaryButton
          label="done"
          onPress={() => finish(breakfast, dinner)}
          disabled={setTimeConstraints.isPending}
          style={styles.cta}
        />
        <GhostButton
          label="skip"
          onPress={() =>
            finish(
              DEFAULT_TIME_CONSTRAINTS.weekday_breakfast_min,
              DEFAULT_TIME_CONSTRAINTS.weekday_dinner_min,
            )
          }
          style={styles.skip}
        />
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
  sub: {
    fontFamily: fonts.body,
    fontSize: typography.size.base,
    color: colors.text.secondary,
    marginTop: spacing.base,
  },
  group: {
    marginTop: spacing.md,
  },
  row: {
    flexDirection: 'row',
    gap: spacing.base,
  },
  tile: {
    flex: 1,
  },
  cta: {
    marginTop: spacing.lg,
    alignSelf: 'stretch',
    justifyContent: 'center',
  },
  skip: {
    marginTop: spacing.sm,
    alignSelf: 'center',
  },
});
