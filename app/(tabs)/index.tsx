/**
 * Today — the home screen and the morning ritual's resting state.
 *
 * Greeting, date, one observation line, the plan card (always
 * primary), then at most two system cards from the priority queue.
 * Open → see → close. No streaks, no scores, no guilt.
 */
import React, { useCallback, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useFocusEffect } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { HomeCardStack, useHomeCards } from '@/components/cards';
import { PlanCard } from '@/features/meals/components/PlanCard';
import { useObservation } from '@/hooks/useObservation';
import { useAppStore } from '@/stores/appStore';
import { colors, fonts, spacing, typography } from '@/lib/theme';
import '@/features/pantry/cards';

function getGreeting(): string {
  const h = new Date().getHours();
  if (h < 12) return 'good morning';
  if (h < 17) return 'good afternoon';
  return 'good evening';
}

function getFormattedDate(): string {
  return new Date()
    .toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' })
    .toLowerCase();
}

export default function TodayScreen() {
  const insets = useSafeAreaInsets();
  const userName = useAppStore((s) => s.user.name);
  const { cards, dismiss, refresh } = useHomeCards();
  const { data: observation } = useObservation();
  const [viewing, setViewing] = useState<'today' | 'yesterday'>('today');

  // Re-run card predicates whenever home regains focus — cards react
  // to pantry/plan changes made on other screens.
  useFocusEffect(
    useCallback(() => {
      refresh();
    }, [refresh]),
  );

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={[styles.content, { paddingTop: insets.top + spacing.sm }]}
      showsVerticalScrollIndicator={false}
    >
      <Text style={styles.brand}>Pravah</Text>

      <View style={styles.greetingBlock}>
        <Text style={styles.greeting}>
          {getGreeting()},{'\n'}
          <Text style={styles.greetingName}>{userName.toLowerCase()}.</Text>
        </Text>
        <Text style={styles.date}>{getFormattedDate()}</Text>
        {observation ? <Text style={styles.observation}>{observation.text}</Text> : null}
      </View>

      <PlanCard
        viewing={viewing}
        onToggleViewing={() =>
          setViewing((current) => (current === 'today' ? 'yesterday' : 'today'))
        }
      />

      <View style={styles.stack}>
        <HomeCardStack cards={cards} onDismiss={dismiss} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  content: {
    paddingHorizontal: spacing.gutter,
    paddingBottom: 140,
  },
  brand: {
    fontFamily: fonts.displayItalic,
    fontSize: typography.size.lg,
    color: colors.text.primary,
  },
  greetingBlock: {
    marginTop: spacing.gutter,
    marginBottom: spacing.gutter,
  },
  greeting: {
    fontFamily: fonts.displayRegular,
    fontSize: typography.size['2xl'],
    color: colors.text.primary,
    lineHeight: typography.size['2xl'] * typography.leading.snug,
  },
  greetingName: {
    fontFamily: fonts.displayItalic,
  },
  date: {
    fontFamily: fonts.body,
    fontSize: typography.size.sm,
    color: colors.text.secondary,
    marginTop: spacing.xs,
  },
  observation: {
    fontFamily: fonts.displayItalic,
    fontSize: typography.size.md,
    color: colors.text.dark,
    marginTop: spacing.base,
  },
  stack: {
    marginTop: spacing.sm,
  },
});
