/**
 * useHomeCards — evaluates registered card predicates and returns the
 * visible queue plus a persisting dismiss handler.
 */
import { useCallback, useEffect, useMemo, useState } from 'react';
import { captureError } from '@/lib/monitoring';
import { track } from '@/lib/analytics';
import { persistDismissedCardId, readDismissedCardIds } from './dismissals';
import { listHomeCards } from './registry';
import { selectVisibleCards } from './select';
import type { HomeCardDefinition } from './types';

interface UseHomeCardsResult {
  cards: HomeCardDefinition[];
  dismiss: (id: string) => void;
  /** Re-run visibility predicates (after a data change, on focus). */
  refresh: () => void;
}

export function useHomeCards(): UseHomeCardsResult {
  const [visibility, setVisibility] = useState<ReadonlyMap<string, boolean>>(new Map());
  const [dismissedIds, setDismissedIds] = useState<ReadonlySet<string>>(() =>
    readDismissedCardIds(),
  );
  const [refreshCount, setRefreshCount] = useState(0);

  useEffect(() => {
    let cancelled = false;
    const definitions = listHomeCards();

    Promise.all(
      definitions.map(async (card) => {
        try {
          return [card.id, await card.visibilityPredicate()] as const;
        } catch (error) {
          // A broken predicate hides its own card, never the stack.
          captureError(error);
          return [card.id, false] as const;
        }
      }),
    ).then((entries) => {
      if (!cancelled) setVisibility(new Map(entries));
    });

    return () => {
      cancelled = true;
    };
  }, [refreshCount]);

  const dismiss = useCallback((id: string) => {
    setDismissedIds(new Set(persistDismissedCardId(id)));
    track('card_dismissed', { id });
  }, []);

  const refresh = useCallback(() => setRefreshCount((count) => count + 1), []);

  const cards = useMemo(
    () => selectVisibleCards(listHomeCards(), visibility, dismissedIds),
    [visibility, dismissedIds],
  );

  return { cards, dismiss, refresh };
}
