import type { LeftoverBaseCategory, LeftoverEvent } from '@/types/domain';
import { rankLeftoverTransforms } from '../leftovers';
import { ING, SEED_TRANSFORMATIONS } from '../seed';

const ALL_STAPLE_IDS = new Set([
  ING.atta.id,
  ING.rice.id,
  ING.dal.id,
  ING.onions.id,
  ING.ghee.id,
  ING.oil.id,
  ING.salt.id,
  ING.sugar.id,
  ING.tea.id,
  ING.milk.id,
  ING.curd.id,
  ING.eggs.id,
]);

const EMPTY_PANTRY = new Set<string>();
const NO_EVENTS: LeftoverEvent[] = [];
const DEFAULT_GAP = { protein_g: 25, calories: 400 };

const ALL_CATEGORIES: LeftoverBaseCategory[] = ['dal', 'sabzi', 'rice', 'roti', 'curry', 'paneer'];

describe('rankLeftoverTransforms', () => {
  it('returns results for all 6 categories with a full staples pantry', () => {
    for (const category of ALL_CATEGORIES) {
      const results = rankLeftoverTransforms(category, ALL_STAPLE_IDS, NO_EVENTS, DEFAULT_GAP);
      expect(results.length).toBeGreaterThan(0);
    }
  });

  it('always returns at least 1 result (floor fallback) with an empty pantry', () => {
    for (const category of ALL_CATEGORIES) {
      const results = rankLeftoverTransforms(category, EMPTY_PANTRY, NO_EVENTS, DEFAULT_GAP);
      expect(results.length).toBeGreaterThanOrEqual(1);
    }
  });

  it('floor fallback result has no missing staples (its extra_staples ≤ 1)', () => {
    for (const category of ALL_CATEGORIES) {
      const [result] = rankLeftoverTransforms(category, EMPTY_PANTRY, NO_EVENTS, DEFAULT_GAP);
      // floor has fewest extra_staples in its category
      const categoryTransforms = SEED_TRANSFORMATIONS.filter((t) => t.base_category === category);
      const minExtras = Math.min(...categoryTransforms.map((t) => t.extra_staples.length));
      expect(result?.transform.extra_staples.length).toBe(minExtras);
    }
  });

  it('excludes transforms whose extra_staples are not in the pantry', () => {
    // sabziParatha requires atta + oil. With an empty pantry, it should be excluded.
    const sabziParatha = SEED_TRANSFORMATIONS.find(
      (t) => t.base_category === 'sabzi' && t.extra_staples.length === 2,
    );
    expect(sabziParatha).toBeDefined();

    const results = rankLeftoverTransforms('sabzi', EMPTY_PANTRY, NO_EVENTS, DEFAULT_GAP);
    const ids = results.map((r) => r.transform.id);
    expect(ids).not.toContain(sabziParatha!.id);
  });

  it('applies variety penalty: recently used dish ranks lower', () => {
    const results = rankLeftoverTransforms('dal', ALL_STAPLE_IDS, NO_EVENTS, DEFAULT_GAP);
    expect(results.length).toBeGreaterThanOrEqual(2);
    const topDish = results[0]!;

    // Simulate that topDish was used twice recently
    const recentEvents: LeftoverEvent[] = [
      {
        id: 'e1',
        user_id: 'u1',
        base_category: 'dal',
        dish_id: topDish.dish.id,
        created_at: new Date().toISOString(),
      },
      {
        id: 'e2',
        user_id: 'u1',
        base_category: 'dal',
        dish_id: topDish.dish.id,
        created_at: new Date().toISOString(),
      },
    ];

    const reranked = rankLeftoverTransforms('dal', ALL_STAPLE_IDS, recentEvents, DEFAULT_GAP);
    // The dish that was top without penalty should no longer be top
    expect(reranked[0]!.dish.id).not.toBe(topDish.dish.id);
  });

  it('ignores events older than 7 days for variety penalty', () => {
    const results = rankLeftoverTransforms('rice', ALL_STAPLE_IDS, NO_EVENTS, DEFAULT_GAP);
    const topDish = results[0]!;

    const oldDate = new Date();
    oldDate.setDate(oldDate.getDate() - 10);
    const oldEvents: LeftoverEvent[] = Array.from({ length: 5 }, (_, i) => ({
      id: `e${i}`,
      user_id: 'u1',
      base_category: 'rice' as LeftoverBaseCategory,
      dish_id: topDish.dish.id,
      created_at: oldDate.toISOString(),
    }));

    const reranked = rankLeftoverTransforms('rice', ALL_STAPLE_IDS, oldEvents, DEFAULT_GAP);
    // Old events should not penalise — top dish unchanged
    expect(reranked[0]!.dish.id).toBe(topDish.dish.id);
  });

  it('ranks results in descending score order', () => {
    for (const category of ALL_CATEGORIES) {
      const results = rankLeftoverTransforms(category, ALL_STAPLE_IDS, NO_EVENTS, DEFAULT_GAP);
      for (let i = 0; i < results.length - 1; i++) {
        expect(results[i]!.score).toBeGreaterThanOrEqual(results[i + 1]!.score);
      }
    }
  });

  it('includes dish and transform on every result', () => {
    const results = rankLeftoverTransforms('curry', ALL_STAPLE_IDS, NO_EVENTS, DEFAULT_GAP);
    for (const r of results) {
      expect(r.dish).toBeDefined();
      expect(r.transform).toBeDefined();
      expect(r.dish.id).toBe(r.transform.dish_id);
    }
  });

  it('only counts variety events for the same base_category', () => {
    const results = rankLeftoverTransforms('paneer', ALL_STAPLE_IDS, NO_EVENTS, DEFAULT_GAP);
    const topDish = results[0]!;

    // Use the same dish_id but for a DIFFERENT category — should not penalise paneer ranking
    const crossCategoryEvents: LeftoverEvent[] = Array.from({ length: 5 }, (_, i) => ({
      id: `ec${i}`,
      user_id: 'u1',
      base_category: 'dal' as LeftoverBaseCategory,
      dish_id: topDish.dish.id,
      created_at: new Date().toISOString(),
    }));

    const reranked = rankLeftoverTransforms(
      'paneer',
      ALL_STAPLE_IDS,
      crossCategoryEvents,
      DEFAULT_GAP,
    );
    expect(reranked[0]!.dish.id).toBe(topDish.dish.id);
  });
});
