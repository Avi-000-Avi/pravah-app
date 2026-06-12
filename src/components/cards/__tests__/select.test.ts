/**
 * Home card system acceptance: three dummy cards with different
 * priorities and predicates — only two show, ordering is correct,
 * dismissal persists across a simulated app restart.
 */
import type React from 'react';
import { clearDismissedCardId, persistDismissedCardId, readDismissedCardIds } from '../dismissals';
import { selectVisibleCards } from '../select';
import type { HomeCardDefinition } from '../types';

const NullComponent = (() => null) as unknown as React.ComponentType<{ dismiss: () => void }>;

function makeCard(id: string, priority: number): HomeCardDefinition {
  return { id, priority, visibilityPredicate: () => true, Component: NullComponent };
}

const dummyLow = makeCard('dummy-low', 10);
const dummyMid = makeCard('dummy-mid', 50);
const dummyHigh = makeCard('dummy-high', 90);

const allVisible = new Map([
  ['dummy-low', true],
  ['dummy-mid', true],
  ['dummy-high', true],
]);

describe('selectVisibleCards', () => {
  it('shows at most two cards, highest priority first', () => {
    const visible = selectVisibleCards([dummyLow, dummyMid, dummyHigh], allVisible, new Set());
    expect(visible.map((c) => c.id)).toEqual(['dummy-high', 'dummy-mid']);
  });

  it('promotes the queued card when a visible one is dismissed', () => {
    const visible = selectVisibleCards(
      [dummyLow, dummyMid, dummyHigh],
      allVisible,
      new Set(['dummy-high']),
    );
    expect(visible.map((c) => c.id)).toEqual(['dummy-mid', 'dummy-low']);
  });

  it('hides cards whose predicate said no', () => {
    const visibility = new Map([
      ['dummy-low', true],
      ['dummy-mid', false],
      ['dummy-high', true],
    ]);
    const visible = selectVisibleCards([dummyLow, dummyMid, dummyHigh], visibility, new Set());
    expect(visible.map((c) => c.id)).toEqual(['dummy-high', 'dummy-low']);
  });

  it('treats unevaluated predicates as hidden (no flash before data loads)', () => {
    const visible = selectVisibleCards([dummyLow, dummyMid, dummyHigh], new Map(), new Set());
    expect(visible).toEqual([]);
  });

  it('breaks priority ties by registration order', () => {
    const a = makeCard('tie-a', 50);
    const b = makeCard('tie-b', 50);
    const visibility = new Map([
      ['tie-a', true],
      ['tie-b', true],
    ]);
    const visible = selectVisibleCards([a, b], visibility, new Set());
    expect(visible.map((c) => c.id)).toEqual(['tie-a', 'tie-b']);
  });
});

describe('dismissal persistence', () => {
  afterEach(() => {
    clearDismissedCardId('dummy-high');
  });

  it('survives an app restart (fresh read from storage)', () => {
    persistDismissedCardId('dummy-high');

    // Simulated restart: nothing held in memory, read storage again.
    const afterRestart = readDismissedCardIds();
    expect(afterRestart.has('dummy-high')).toBe(true);

    const visible = selectVisibleCards([dummyLow, dummyMid, dummyHigh], allVisible, afterRestart);
    expect(visible.map((c) => c.id)).toEqual(['dummy-mid', 'dummy-low']);
  });
});
