/**
 * Freshness — pure helpers over pantry predictions.
 *
 * Buckets are presentation-friendly and deliberately gentle: Pravah
 * never alarms about food. 'use-today' feeds the use-it-soon card.
 */
import type { PantryItem } from '@/types/domain';

export type FreshnessBucket = 'fresh' | 'use-soon' | 'use-today' | 'always-on';

const DAY_MS = 24 * 60 * 60 * 1000;

export function daysUntilEmpty(item: PantryItem, now: Date): number | null {
  if (!item.predicted_empty_at) return null;
  return (new Date(item.predicted_empty_at).getTime() - now.getTime()) / DAY_MS;
}

export function freshnessBucket(item: PantryItem, now: Date): FreshnessBucket {
  const days = daysUntilEmpty(item, now);
  if (days === null) return 'always-on';
  if (days <= 1) return 'use-today';
  if (days <= 2) return 'use-soon';
  return 'fresh';
}

/** Items entering their final day — candidates for the use-it-soon card. */
export function itemsToUseToday(items: readonly PantryItem[], now: Date): PantryItem[] {
  return items
    .filter((item) => item.source !== 'staple' && freshnessBucket(item, now) === 'use-today')
    .sort((a, b) => {
      const aDays = daysUntilEmpty(a, now) ?? Number.POSITIVE_INFINITY;
      const bDays = daysUntilEmpty(b, now) ?? Number.POSITIVE_INFINITY;
      return aDays - bDays;
    });
}
