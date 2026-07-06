import type { DailyPlan, MealLog } from '@/types/domain';
import { dailyTargets, remainingGap, runningTally, SWAP_ESTIMATES } from '../macros';

function makePlan(overrides: Partial<DailyPlan> = {}): DailyPlan {
  return {
    id: 'plan-1',
    user_id: 'user-1',
    date: '2026-06-12',
    slots: [
      {
        slot: 'breakfast',
        dish_id: 'dish-b',
        source: 'planned',
        swap_dish_id: 'dish-b2',
        protein_g: 12,
        calories: 300,
      },
      {
        slot: 'lunch',
        dish_id: 'dish-l',
        source: 'planned',
        swap_dish_id: 'dish-l2',
        protein_g: 20,
        calories: 520,
      },
      {
        slot: 'dinner',
        dish_id: 'dish-d',
        source: 'planned',
        swap_dish_id: 'dish-d2',
        protein_g: 18,
        calories: 480,
      },
    ],
    workout: null,
    condition_flags: [],
    generated_at: '2026-06-12T05:00:00Z',
    plan_version: 1,
    ...overrides,
  };
}

function makeLog(overrides: Partial<MealLog>): MealLog {
  return {
    id: 'log-1',
    user_id: 'user-1',
    plan_date: '2026-06-12',
    slot: 'breakfast',
    status: 'ate',
    swap_category: null,
    custom_text: null,
    logged_at: '2026-06-12T09:00:00Z',
    ...overrides,
  };
}

describe('dailyTargets', () => {
  it('scales protein with bodyweight and goal', () => {
    const cut = dailyTargets({ goal: 'fat_loss', weight_kg: 70 });
    const bulk = dailyTargets({ goal: 'muscle_gain', weight_kg: 70 });
    const maintain = dailyTargets({ goal: 'maintenance', weight_kg: 70 });

    expect(cut.protein_g).toBeCloseTo(70 * 1.6);
    expect(bulk.protein_g).toBeCloseTo(70 * 1.8);
    expect(maintain.protein_g).toBeCloseTo(70 * 1.2);
  });

  it('sets calories around weight-based maintenance, adjusted by goal', () => {
    const maintain = dailyTargets({ goal: 'maintenance', weight_kg: 70 });
    const cut = dailyTargets({ goal: 'fat_loss', weight_kg: 70 });
    const bulk = dailyTargets({ goal: 'muscle_gain', weight_kg: 70 });

    expect(maintain.calories).toBe(70 * 32);
    expect(cut.calories).toBe(70 * 32 - 400);
    expect(bulk.calories).toBe(70 * 32 + 300);
  });

  it('never returns calories below the safe floor', () => {
    const tiny = dailyTargets({ goal: 'fat_loss', weight_kg: 40 });
    expect(tiny.calories).toBeGreaterThanOrEqual(1400);
  });

  it('falls back to a sensible default weight when none is known', () => {
    const targets = dailyTargets({ goal: 'maintenance', weight_kg: null });
    expect(targets.protein_g).toBeGreaterThan(0);
    expect(targets.calories).toBeGreaterThan(1400);
  });
});

describe('runningTally', () => {
  it('counts planned macros for slots logged as ate', () => {
    const tally = runningTally(makePlan(), [makeLog({ slot: 'breakfast', status: 'ate' })]);
    expect(tally.protein_g).toBe(12);
    expect(tally.calories).toBe(300);
    expect(tally.logged_slots).toEqual(['breakfast']);
  });

  it('counts zero for skipped slots but still marks them logged', () => {
    const tally = runningTally(makePlan(), [makeLog({ slot: 'lunch', status: 'skipped' })]);
    expect(tally.protein_g).toBe(0);
    expect(tally.calories).toBe(0);
    expect(tally.logged_slots).toEqual(['lunch']);
  });

  it('uses the swap-category estimate for swapped slots', () => {
    const tally = runningTally(makePlan(), [
      makeLog({ slot: 'dinner', status: 'swapped', swap_category: 'ordered_in' }),
    ]);
    expect(tally.protein_g).toBe(SWAP_ESTIMATES.ordered_in.protein_g);
    expect(tally.calories).toBe(SWAP_ESTIMATES.ordered_in.calories);
  });

  it('falls back to planned slot macros for swaps without a category', () => {
    const tally = runningTally(makePlan(), [
      makeLog({ slot: 'dinner', status: 'swapped', custom_text: 'leftover biryani' }),
    ]);
    expect(tally.protein_g).toBe(18);
    expect(tally.calories).toBe(480);
  });

  it('sums across multiple logs', () => {
    const tally = runningTally(makePlan(), [
      makeLog({ slot: 'breakfast', status: 'ate' }),
      makeLog({ id: 'log-2', slot: 'lunch', status: 'ate' }),
    ]);
    expect(tally.protein_g).toBe(32);
    expect(tally.calories).toBe(820);
  });
});

describe('remainingGap', () => {
  const targets = { protein_g: 90, calories: 2100 };

  it('spreads the remaining budget across remaining slots', () => {
    const tally = { protein_g: 30, calories: 700, logged_slots: ['breakfast' as const] };
    const gap = remainingGap(targets, tally, 2);
    expect(gap.protein_g).toBeCloseTo(30);
    expect(gap.calories).toBeCloseTo(700);
  });

  it('clamps at zero when the day is already covered', () => {
    const tally = { protein_g: 120, calories: 2500, logged_slots: [] };
    const gap = remainingGap(targets, tally, 1);
    expect(gap.protein_g).toBe(0);
    expect(gap.calories).toBe(0);
  });

  it('returns the full remaining gap when one slot is left', () => {
    const tally = { protein_g: 70, calories: 1600, logged_slots: [] };
    const gap = remainingGap(targets, tally, 1);
    expect(gap.protein_g).toBeCloseTo(20);
    expect(gap.calories).toBeCloseTo(500);
  });

  it('handles zero remaining slots without dividing by zero', () => {
    const tally = { protein_g: 10, calories: 200, logged_slots: [] };
    const gap = remainingGap(targets, tally, 0);
    expect(gap.protein_g).toBe(0);
    expect(gap.calories).toBe(0);
  });
});
