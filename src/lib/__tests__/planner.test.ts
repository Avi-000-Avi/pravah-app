import type { Dish } from '@/types/domain';
import { dailyTargets } from '../macros';
import {
  DEFAULT_TIME_CONSTRAINTS,
  formatDateKey,
  generateDayPlan,
  isWeekend,
  slotBudgetMinutes,
  type PlannerInput,
} from '../planner';
import { CANONICAL_STAPLES, ING, SEED_DISHES, SEED_INGREDIENTS } from '../seed';

const STAPLE_IDS = new Set(CANONICAL_STAPLES.map((i) => i.id));
const FULL_PANTRY = new Set(SEED_INGREDIENTS.map((i) => i.id));
const TARGETS = dailyTargets({ goal: 'maintenance', weight_kg: 70 });
const dishById = new Map(SEED_DISHES.map((d) => [d.id, d]));

// Wednesday — a weekday with a strength workout in the rotation.
const WEDNESDAY = new Date(2026, 5, 10);
const SATURDAY = new Date(2026, 5, 13);

function makeInput(overrides: Partial<PlannerInput> = {}): PlannerInput {
  return {
    date: WEDNESDAY,
    pantry: FULL_PANTRY,
    preferences: { timeConstraints: DEFAULT_TIME_CONSTRAINTS },
    targets: TARGETS,
    history: { recentDishIds: [] },
    conditionFlags: [],
    dishes: SEED_DISHES,
    stapleIngredientIds: STAPLE_IDS,
    randomSeed: 42,
    ...overrides,
  };
}

function getDish(id: string): Dish {
  const dish = dishById.get(id);
  if (!dish) throw new Error(`unknown dish ${id}`);
  return dish;
}

describe('generateDayPlan', () => {
  it('produces three slots and a workout', () => {
    const plan = generateDayPlan(makeInput());
    expect(plan.slots.map((s) => s.slot)).toEqual(['breakfast', 'lunch', 'dinner']);
    expect(plan.workout.name.length).toBeGreaterThan(0);
    expect(plan.date).toBe('2026-06-10');
  });

  it('still generates a full staples-only plan from an empty pantry', () => {
    const plan = generateDayPlan(makeInput({ pantry: new Set<string>() }));
    expect(plan.slots).toHaveLength(3);
    for (const slot of plan.slots) {
      const dish = getDish(slot.dish_id);
      for (const ref of dish.ingredients) {
        expect(STAPLE_IDS.has(ref.ingredient_id)).toBe(true);
      }
    }
  });

  it('respects the prep-time budget for each slot', () => {
    const plan = generateDayPlan(
      makeInput({
        preferences: {
          timeConstraints: { weekday_breakfast_min: 5, weekday_dinner_min: 30 },
        },
      }),
    );
    const breakfast = plan.slots.find((s) => s.slot === 'breakfast');
    expect(breakfast).toBeDefined();
    expect(getDish(breakfast!.dish_id).prep_minutes).toBeLessThanOrEqual(5);
    const dinner = plan.slots.find((s) => s.slot === 'dinner');
    expect(getDish(dinner!.dish_id).prep_minutes).toBeLessThanOrEqual(30);
  });

  it('gives weekends 1.5× the prep budget', () => {
    expect(slotBudgetMinutes('dinner', DEFAULT_TIME_CONSTRAINTS, true)).toBe(45);
    expect(slotBudgetMinutes('breakfast', DEFAULT_TIME_CONSTRAINTS, false)).toBe(15);
    expect(isWeekend(SATURDAY)).toBe(true);
    expect(isWeekend(WEDNESDAY)).toBe(false);
  });

  it('restricts dinner to effort 1 when tired', () => {
    const plan = generateDayPlan(makeInput({ conditionFlags: ['tired'] }));
    const dinner = plan.slots.find((s) => s.slot === 'dinner');
    expect(getDish(dinner!.dish_id).effort_score).toBe(1);
  });

  it('never repeats a dish within 7 days when the pool allows', () => {
    const seen: string[] = [];
    for (let day = 0; day < 7; day += 1) {
      const date = new Date(2026, 5, 8 + day);
      const plan = generateDayPlan(
        makeInput({ date, history: { recentDishIds: [...seen] }, randomSeed: day }),
      );
      for (const slot of plan.slots) {
        expect(seen).not.toContain(slot.dish_id);
        seen.push(slot.dish_id);
      }
    }
  });

  it('always pre-computes a swap that differs from the primary dish', () => {
    for (const seed of [1, 2, 3, 4, 5]) {
      const plan = generateDayPlan(makeInput({ randomSeed: seed }));
      for (const slot of plan.slots) {
        expect(slot.swap_dish_id).toBeTruthy();
        expect(slot.swap_dish_id).not.toBe(slot.dish_id);
      }
    }
  });

  it('prefers a swap built around a different primary ingredient', () => {
    const plan = generateDayPlan(makeInput());
    for (const slot of plan.slots) {
      const primary = getDish(slot.dish_id).ingredients[0]?.ingredient_id;
      const swapPrimary = getDish(slot.swap_dish_id).ingredients[0]?.ingredient_id;
      expect(swapPrimary).not.toBe(primary);
    }
  });

  it('never plans leftover-transform output dishes', () => {
    const plan = generateDayPlan(makeInput());
    for (const slot of plan.slots) {
      expect(getDish(slot.dish_id).tags).not.toContain('leftover-transform');
      expect(getDish(slot.swap_dish_id).tags).not.toContain('leftover-transform');
    }
  });

  it('honours mustInclude when a matching dish exists', () => {
    const plan = generateDayPlan(
      makeInput({ mustInclude: { slot: 'dinner', ingredient_id: ING.palak.id } }),
    );
    const dinner = plan.slots.find((s) => s.slot === 'dinner');
    const ingredients = getDish(dinner!.dish_id).ingredients.map((r) => r.ingredient_id);
    expect(ingredients).toContain(ING.palak.id);
    expect(plan.must_include_satisfied).toBe(true);
  });

  it('reports when mustInclude could not be honoured', () => {
    const plan = generateDayPlan(
      makeInput({ mustInclude: { slot: 'dinner', ingredient_id: ING.tea.id } }),
    );
    expect(plan.slots).toHaveLength(3);
    expect(plan.must_include_satisfied).toBe(false);
  });

  it('excludes dishes containing ingredients the user avoids', () => {
    const avoidMeatAndFish = new Set([ING.chicken.id, ING.fish.id]);
    const plan = generateDayPlan(
      makeInput({
        preferences: {
          timeConstraints: DEFAULT_TIME_CONSTRAINTS,
          excludeIngredientIds: avoidMeatAndFish,
        },
      }),
    );
    for (const slot of plan.slots) {
      for (const dishId of [slot.dish_id, slot.swap_dish_id]) {
        const ingredients = getDish(dishId).ingredients.map((r) => r.ingredient_id);
        expect(ingredients).not.toContain(ING.chicken.id);
        expect(ingredients).not.toContain(ING.fish.id);
      }
    }
  });

  it('is deterministic for the same date and seed', () => {
    const a = generateDayPlan(makeInput());
    const b = generateDayPlan(makeInput());
    expect(a).toEqual(b);
  });

  it('formats date keys as YYYY-MM-DD', () => {
    expect(formatDateKey(new Date(2026, 0, 5))).toBe('2026-01-05');
  });
});
