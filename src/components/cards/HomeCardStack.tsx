/**
 * HomeCardStack — renders the visible system cards below the plan
 * card. The plan card itself is not part of the stack: it is always
 * primary and always present.
 */
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { spacing } from '@/lib/theme';
import type { HomeCardDefinition } from './types';

interface HomeCardStackProps {
  cards: HomeCardDefinition[];
  onDismiss: (id: string) => void;
}

export function HomeCardStack({ cards, onDismiss }: HomeCardStackProps) {
  if (cards.length === 0) return null;
  return (
    <View style={styles.stack}>
      {cards.map(({ id, Component }) => (
        <Component key={id} dismiss={() => onDismiss(id)} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  stack: {
    gap: spacing.sm,
  },
});
