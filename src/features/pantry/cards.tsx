/**
 * Pantry home cards — first-run kitchen setup.
 *
 * Registered declaratively; visible until a pantry baseline exists.
 */
import { router } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Card } from '@/components/Card';
import { PrimaryButton } from '@/components/PrimaryButton';
import { registerHomeCard } from '@/components/cards';
import { listPantryItems } from '@/lib/pantry';
import { colors, fonts, spacing, typography } from '@/lib/theme';

function StaplesSetupCard() {
  return (
    <Card style={styles.card}>
      <Text style={styles.title}>let’s see your kitchen</Text>
      <Text style={styles.body}>
        fifteen seconds, all taps — and every plan starts from what you already have.
      </Text>
      <View style={styles.actions}>
        <PrimaryButton
          label="set up my kitchen"
          onPress={() => router.push('/(tabs)/setup-staples')}
        />
      </View>
    </Card>
  );
}

registerHomeCard({
  id: 'staples-setup',
  priority: 90,
  visibilityPredicate: async () => (await listPantryItems()).length === 0,
  Component: StaplesSetupCard,
});

const styles = StyleSheet.create({
  card: {
    padding: spacing.gutter,
    gap: spacing.base,
  },
  title: {
    fontFamily: fonts.display,
    fontSize: typography.size.xl,
    color: colors.text.primary,
  },
  body: {
    fontFamily: fonts.body,
    fontSize: typography.size.base,
    color: colors.text.secondary,
    lineHeight: typography.size.base * typography.leading.normal,
  },
  actions: {
    marginTop: spacing.xs,
  },
});
