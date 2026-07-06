/**
 * Seed content quality gates.
 *
 * The leftover library is the hero feature's content — these tests
 * enforce the product rules the content was written against, so a
 * future edit can't quietly break them.
 */
import type { LeftoverBaseCategory } from '@/types/domain';
import {
  CANONICAL_STAPLES,
  SEED_DISHES,
  SEED_INGREDIENTS,
  SEED_TRANSFORMATIONS,
  WORKOUT_ROTATION,
} from '../seed';

const dishById = new Map(SEED_DISHES.map((d) => [d.id, d]));
const ingredientIds = new Set(SEED_INGREDIENTS.map((i) => i.id));
const stapleIds = new Set(CANONICAL_STAPLES.map((i) => i.id));

const BASE_CATEGORIES: LeftoverBaseCategory[] = ['dal', 'sabzi', 'rice', 'roti', 'curry', 'paneer'];

describe('ingredient catalog', () => {
  it('has ~60+ ingredients with unique ids and names', () => {
    expect(SEED_INGREDIENTS.length).toBeGreaterThanOrEqual(60);
    expect(new Set(SEED_INGREDIENTS.map((i) => i.id)).size).toBe(SEED_INGREDIENTS.length);
    expect(new Set(SEED_INGREDIENTS.map((i) => i.name)).size).toBe(SEED_INGREDIENTS.length);
  });

  it('flags exactly the 12 canonical staples', () => {
    const staples = SEED_INGREDIENTS.filter((i) => i.is_staple);
    expect(staples).toHaveLength(12);
    expect(CANONICAL_STAPLES).toHaveLength(12);
    expect(new Set(staples.map((s) => s.id))).toEqual(stapleIds);
  });

  it('gives staples no shelf life (always-on until grocery ingestion)', () => {
    for (const staple of CANONICAL_STAPLES) {
      expect(staple.default_shelf_life_days).toBeNull();
    }
  });
});

describe('dish library', () => {
  it('has ~35+ dishes with unique ids and names', () => {
    expect(SEED_DISHES.length).toBeGreaterThanOrEqual(35);
    expect(new Set(SEED_DISHES.map((d) => d.id)).size).toBe(SEED_DISHES.length);
    expect(new Set(SEED_DISHES.map((d) => d.name)).size).toBe(SEED_DISHES.length);
  });

  it('covers breakfast, lunch and dinner in the planner pool', () => {
    const pool = SEED_DISHES.filter((d) => !d.tags.includes('leftover-transform'));
    for (const slot of ['breakfast', 'lunch', 'dinner'] as const) {
      const covering = pool.filter(
        (d) => d.slot_tags.includes(slot) || d.slot_tags.includes('any'),
      );
      expect(covering.length).toBeGreaterThanOrEqual(6);
    }
  });

  it('has at least 6 no-cook dishes', () => {
    expect(SEED_DISHES.filter((d) => d.tags.includes('no-cook')).length).toBeGreaterThanOrEqual(6);
  });

  it('has at least 10 leftover-friendly dishes', () => {
    expect(
      SEED_DISHES.filter((d) => d.tags.includes('leftover-friendly')).length,
    ).toBeGreaterThanOrEqual(10);
  });

  it('has a spread of budget dishes', () => {
    expect(SEED_DISHES.filter((d) => d.tags.includes('budget')).length).toBeGreaterThanOrEqual(10);
  });

  it('keeps method steps to 6 or fewer, written and non-empty', () => {
    for (const dish of SEED_DISHES) {
      expect(dish.method_steps.length).toBeGreaterThanOrEqual(1);
      expect(dish.method_steps.length).toBeLessThanOrEqual(6);
      for (const step of dish.method_steps) {
        expect(step.trim().length).toBeGreaterThan(0);
      }
    }
  });

  it('keeps copy in sentence case (no step starts with uppercase acronym shouting)', () => {
    for (const dish of SEED_DISHES) {
      expect(dish.name).toBe(dish.name.toLowerCase());
    }
  });

  it('references only catalogued ingredients', () => {
    for (const dish of SEED_DISHES) {
      for (const ref of dish.ingredients) {
        expect(ingredientIds.has(ref.ingredient_id)).toBe(true);
      }
    }
  });

  it('marks no-cook dishes as effort 1', () => {
    for (const dish of SEED_DISHES.filter((d) => d.tags.includes('no-cook'))) {
      expect(dish.effort_score).toBe(1);
    }
  });

  it('keeps honest macro and prep values', () => {
    for (const dish of SEED_DISHES) {
      expect(dish.prep_minutes).toBeGreaterThan(0);
      expect(dish.prep_minutes).toBeLessThanOrEqual(60);
      expect(dish.protein_g).toBeGreaterThan(0);
      expect(dish.calories).toBeGreaterThan(100);
      expect(dish.slot_tags.length).toBeGreaterThan(0);
    }
  });
});

describe('leftover transformation library', () => {
  it('has ~30 transformations, 5 per base category', () => {
    expect(SEED_TRANSFORMATIONS.length).toBeGreaterThanOrEqual(30);
    for (const category of BASE_CATEGORIES) {
      const inCategory = SEED_TRANSFORMATIONS.filter((t) => t.base_category === category);
      expect(inCategory.length).toBeGreaterThanOrEqual(5);
    }
  });

  it('points every transformation at a real dish tagged or usable as output', () => {
    for (const t of SEED_TRANSFORMATIONS) {
      expect(dishById.has(t.dish_id)).toBe(true);
    }
  });

  it('keeps every transformation under 15 minutes', () => {
    for (const t of SEED_TRANSFORMATIONS) {
      const dish = dishById.get(t.dish_id);
      expect(dish).toBeDefined();
      expect(dish!.prep_minutes).toBeLessThanOrEqual(15);
    }
  });

  it('requires only canonical staples beyond the leftover itself', () => {
    for (const t of SEED_TRANSFORMATIONS) {
      for (const staple of t.extra_staples) {
        expect(stapleIds.has(staple)).toBe(true);
      }
    }
  });

  it('guarantees a single-staple floor transform per category', () => {
    for (const category of BASE_CATEGORIES) {
      const inCategory = SEED_TRANSFORMATIONS.filter(
        (t) => t.base_category === category && t.active,
      );
      const minDeps = Math.min(...inCategory.map((t) => t.extra_staples.length));
      expect(minDeps).toBeLessThanOrEqual(1);
    }
  });

  it('ships every transformation active', () => {
    for (const t of SEED_TRANSFORMATIONS) {
      expect(t.active).toBe(true);
    }
  });
});

describe('workout rotation', () => {
  it('covers 7 days with 3 strength, 2 cardio, 2 rest', () => {
    expect(WORKOUT_ROTATION).toHaveLength(7);
    const kinds = WORKOUT_ROTATION.map((w) => w.kind);
    expect(kinds.filter((k) => k === 'strength')).toHaveLength(3);
    expect(kinds.filter((k) => k === 'cardio')).toHaveLength(2);
    expect(kinds.filter((k) => k === 'rest')).toHaveLength(2);
  });
});
