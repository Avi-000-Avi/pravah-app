/**
 * Planner core — pure, deterministic day-plan generation.
 *
 * No I/O, no AI calls: the AI seam is this function's signature. A
 * future server-side generator satisfies the same contract and the
 * app doesn't change.
 *
 * Selection rules, in priority order:
 * 1. Hard-filter to dishes whose ingredients are all in the pantry.
 * 2. Hard-filter to the slot's prep-time budget (weekends ×1.5).
 * 3. 'tired' flag restricts dinner to effort-score 1.
 * 4. Rank by protein-gap fit, then 7-day variety, then mild seeded
 *    randomness for freshness.
 * 5. The swap is the next-best dish built around a different primary
 *    ingredient (a dish's primary ingredient is its first listed one).
 *
 * Fallback chain when filters empty the pool: relax variety → relax
 * time (+50%) → closest staples-only dish. A plan is never empty.
 */
import type {
  ConditionFlag,
  Dish,
  MealSlotName,
  PlanSlot,
  PlanWorkout,
  TimeConstraints,
} from '@/types/domain';
import type { MacroTargets } from './macros';
import { workoutForDate } from './seed/workouts';

export interface PlannerPreferences {
  timeConstraints: TimeConstraints;
  /** Ingredient ids the user won't eat (derived from diet prefs). */
  excludeIngredientIds?: ReadonlySet<string>;
}

export interface PlanHistory {
  /** Dish ids from the last 7 days, most recent first. */
  recentDishIds: readonly string[];
}

export interface PlannerInput {
  date: Date;
  /** Ingredient ids on hand: staples + active pantry items. */
  pantry: ReadonlySet<string>;
  preferences: PlannerPreferences;
  targets: MacroTargets;
  history: PlanHistory;
  conditionFlags: ConditionFlag[];
  /** The full dish library (bundled seed or fetched catalog). */
  dishes: readonly Dish[];
  /** Ids of the always-on staples, used by the last-resort fallback. */
  stapleIngredientIds: ReadonlySet<string>;
  /** Force an ingredient into a slot (use-it-soon). */
  mustInclude?: { slot: MealSlotName; ingredient_id: string };
  /** Override the date-derived seed (tests). */
  randomSeed?: number;
}

export interface GeneratedDayPlan {
  date: string; // YYYY-MM-DD
  slots: PlanSlot[];
  workout: PlanWorkout;
  condition_flags: ConditionFlag[];
  /** False when mustInclude couldn't be honoured — never announce a save that didn't happen. */
  must_include_satisfied: boolean;
}

export const DEFAULT_TIME_CONSTRAINTS: TimeConstraints = {
  weekday_breakfast_min: 15,
  weekday_dinner_min: 30,
};

/** Lunch isn't asked during capture — assume a standard weekday window. */
const WEEKDAY_LUNCH_MIN = 40;
const WEEKEND_MULTIPLIER = 1.5;
const TIME_RELAX_MULTIPLIER = 1.5;

const SLOTS: MealSlotName[] = ['breakfast', 'lunch', 'dinner'];

export function formatDateKey(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function isWeekend(date: Date): boolean {
  const day = date.getDay();
  return day === 0 || day === 6;
}

export function slotBudgetMinutes(
  slot: MealSlotName,
  constraints: TimeConstraints,
  weekend: boolean,
): number {
  const weekday =
    slot === 'breakfast'
      ? constraints.weekday_breakfast_min
      : slot === 'dinner'
        ? constraints.weekday_dinner_min
        : WEEKDAY_LUNCH_MIN;
  return weekend ? weekday * WEEKEND_MULTIPLIER : weekday;
}

/** mulberry32 — tiny deterministic PRNG so plans are stable per day. */
function createRng(seed: number): () => number {
  let state = seed >>> 0;
  return () => {
    state = (state + 0x6d2b79f5) >>> 0;
    let t = state;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function hashString(value: string): number {
  let hash = 0;
  for (let i = 0; i < value.length; i += 1) {
    hash = (Math.imul(hash, 31) + value.charCodeAt(i)) | 0;
  }
  return hash >>> 0;
}

function fitsSlot(dish: Dish, slot: MealSlotName): boolean {
  return dish.slot_tags.includes(slot) || dish.slot_tags.includes('any');
}

function ingredientsCovered(dish: Dish, available: ReadonlySet<string>): boolean {
  return dish.ingredients.every((ref) => available.has(ref.ingredient_id));
}

function primaryIngredient(dish: Dish): string | null {
  return dish.ingredients[0]?.ingredient_id ?? null;
}

export interface RankOptions {
  /** Per-slot protein target the dish should approach. */
  proteinTarget: number;
  /** Dish ids to push down for 7-day variety. */
  recentDishIds: ReadonlySet<string>;
  /** 0..1 jitter per dish id — pass a constant map for stable tests. */
  jitter: (dishId: string) => number;
}

/**
 * Shared ranker — also used by the leftover engine and
 * cook-with-what-I-have. Higher score is better. Protein fit
 * dominates, variety penalises repeats, jitter only breaks near-ties.
 */
export function rankDishes(candidates: readonly Dish[], options: RankOptions): Dish[] {
  const { proteinTarget, recentDishIds, jitter } = options;
  return [...candidates].sort((a, b) => scoreDish(b) - scoreDish(a));

  function scoreDish(dish: Dish): number {
    // 1 at perfect protein fit, falling toward 0 as the gap grows.
    const gap = Math.abs(dish.protein_g - proteinTarget);
    const proteinFit = 1 / (1 + gap / 10);
    const varietyPenalty = recentDishIds.has(dish.id) ? 1 : 0;
    return proteinFit * 4 - varietyPenalty * 3 + jitter(dish.id) * 0.4;
  }
}

interface SlotPick {
  dish: Dish;
  swap: Dish;
  mustIncludeSatisfied: boolean;
}

export function generateDayPlan(input: PlannerInput): GeneratedDayPlan {
  const dateKey = formatDateKey(input.date);
  const weekend = isWeekend(input.date);
  const rng = createRng(input.randomSeed ?? hashString(dateKey));

  // Stable per-generation jitter, fixed per dish so sort stays coherent.
  const jitterCache = new Map<string, number>();
  const jitter = (dishId: string): number => {
    const cached = jitterCache.get(dishId);
    if (cached !== undefined) return cached;
    const value = rng();
    jitterCache.set(dishId, value);
    return value;
  };

  const excluded = input.preferences.excludeIngredientIds ?? new Set<string>();
  const recent = new Set(input.history.recentDishIds);
  const perSlotProtein = input.targets.protein_g / SLOTS.length;

  // The plannable library: never transform outputs, never excluded ingredients.
  const library = input.dishes.filter(
    (dish) =>
      !dish.tags.includes('leftover-transform') &&
      !dish.ingredients.some((ref) => excluded.has(ref.ingredient_id)),
  );

  const usedToday = new Set<string>();
  const slots: PlanSlot[] = [];
  let mustIncludeSatisfiedOverall = true;

  for (const slot of SLOTS) {
    const pick = pickForSlot(slot);
    usedToday.add(pick.dish.id);
    if (!pick.mustIncludeSatisfied) mustIncludeSatisfiedOverall = false;
    slots.push({
      slot,
      dish_id: pick.dish.id,
      source: 'planned',
      swap_dish_id: pick.swap.id,
      protein_g: pick.dish.protein_g,
      calories: pick.dish.calories,
    });
  }

  return {
    date: dateKey,
    slots,
    workout: workoutForDate(input.date),
    condition_flags: input.conditionFlags,
    must_include_satisfied: mustIncludeSatisfiedOverall,
  };

  function pickForSlot(slot: MealSlotName): SlotPick {
    const budget = slotBudgetMinutes(slot, input.preferences.timeConstraints, weekend);
    const tiredDinner = input.conditionFlags.includes('tired') && slot === 'dinner';
    const mustIncludeId =
      input.mustInclude && input.mustInclude.slot === slot ? input.mustInclude.ingredient_id : null;

    const slotDishes = library.filter(
      (dish) =>
        fitsSlot(dish, slot) &&
        !usedToday.has(dish.id) &&
        (!tiredDinner || dish.effort_score === 1),
    );

    const buildPool = (
      timeBudget: number,
      respectVariety: boolean,
      requiredIngredientId: string | null,
    ): Dish[] =>
      slotDishes.filter(
        (dish) =>
          ingredientsCovered(dish, input.pantry) &&
          dish.prep_minutes <= timeBudget &&
          (!respectVariety || !recent.has(dish.id)) &&
          (!requiredIngredientId ||
            dish.ingredients.some((ref) => ref.ingredient_id === requiredIngredientId)),
      );

    // Fallback chain: strict → relax variety → relax time → staples-only.
    // When an ingredient is forced (use-it-soon), run the chain with the
    // requirement first — saving an expiring item outranks variety and a
    // mild time overrun — and only drop it if nothing can honour it.
    const runChain = (requiredIngredientId: string | null): Dish[] => {
      let pool = buildPool(budget, true, requiredIngredientId);
      if (pool.length === 0) pool = buildPool(budget, false, requiredIngredientId);
      if (pool.length === 0) {
        pool = buildPool(budget * TIME_RELAX_MULTIPLIER, false, requiredIngredientId);
      }
      return pool;
    };

    let mustIncludeSatisfied = true;
    let pool = runChain(mustIncludeId);
    if (pool.length === 0 && mustIncludeId) {
      mustIncludeSatisfied = false;
      pool = runChain(null);
    }
    if (pool.length === 0) {
      pool = slotDishes.filter((dish) => ingredientsCovered(dish, input.stapleIngredientIds));
    }
    if (pool.length === 0) {
      // Truly nothing fits this slot's tags (shouldn't happen with the
      // seeded library) — fall back to any staples-only dish at all.
      pool = library.filter(
        (dish) => !usedToday.has(dish.id) && ingredientsCovered(dish, input.stapleIngredientIds),
      );
    }

    const ranked = rankDishes(pool, {
      proteinTarget: perSlotProtein,
      recentDishIds: recent,
      jitter,
    });

    const dish = ranked[0];
    if (!dish) {
      throw new Error(`Planner invariant broken: empty pool for ${slot}`);
    }

    return { dish, swap: pickSwap(dish, ranked), mustIncludeSatisfied };
  }

  /**
   * The pre-computed swap: next-best dish built around a different
   * primary ingredient; failing that, any next-best different dish;
   * failing that, the closest staples-only dish from the library.
   */
  function pickSwap(chosen: Dish, ranked: readonly Dish[]): Dish {
    const chosenPrimary = primaryIngredient(chosen);
    const differentPrimary = ranked.find(
      (dish) => dish.id !== chosen.id && primaryIngredient(dish) !== chosenPrimary,
    );
    if (differentPrimary) return differentPrimary;

    const anyOther = ranked.find((dish) => dish.id !== chosen.id);
    if (anyOther) return anyOther;

    const stapleFallback = library.find(
      (dish) => dish.id !== chosen.id && ingredientsCovered(dish, input.stapleIngredientIds),
    );
    return stapleFallback ?? chosen;
  }
}
