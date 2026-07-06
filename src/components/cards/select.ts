/**
 * Pure card selection — the queueing rule, isolated for testing.
 */
import { MAX_VISIBLE_SYSTEM_CARDS, type HomeCardDefinition } from './types';

/**
 * Pick the visible system cards: drop dismissed and not-applicable
 * cards, order by priority (descending; ties keep registration
 * order), and cap at MAX_VISIBLE_SYSTEM_CARDS. The rest stay queued —
 * they surface as visible cards leave.
 */
export function selectVisibleCards(
  definitions: readonly HomeCardDefinition[],
  visibility: ReadonlyMap<string, boolean>,
  dismissedIds: ReadonlySet<string>,
): HomeCardDefinition[] {
  return definitions
    .filter((card) => visibility.get(card.id) === true && !dismissedIds.has(card.id))
    .map((card, index) => ({ card, index }))
    .sort((a, b) => b.card.priority - a.card.priority || a.index - b.index)
    .slice(0, MAX_VISIBLE_SYSTEM_CARDS)
    .map(({ card }) => card);
}
