/**
 * Home card system — types.
 *
 * The home screen is a priority-queued stack: the plan card is always
 * primary and never part of the queue; system cards render below it,
 * at most two visible, ordered by priority. Every later feature
 * (staples setup, leftovers, use-it-soon, Sunday review, re-entry)
 * plugs in as a card definition — no feature renders directly on home.
 */
import type React from 'react';

export interface HomeCardProps {
  /** Dismiss this card (persists, the card won't resurrect). */
  dismiss: () => void;
}

export interface HomeCardDefinition {
  /** Stable id — also the dismissal key and analytics card id. */
  id: string;
  /** Higher shows first. Ties break by registration order. */
  priority: number;
  /** Whether the card applies right now. Async is fine. */
  visibilityPredicate: () => boolean | Promise<boolean>;
  Component: React.ComponentType<HomeCardProps>;
  /** Cards that can't be dismissed (e.g. the leftover card) omit this. */
  dismissible?: boolean;
}

export const MAX_VISIBLE_SYSTEM_CARDS = 2;
