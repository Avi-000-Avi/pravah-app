/**
 * "Cook with what I have" picker — pure, no I/O.
 *
 * Shares the planner's rankDishes ranker but is not slot-constrained:
 * it picks the single best dish the current pantry can produce, along
 * with one swap built around a different primary ingredient.
 *
 * mustIngredientId: if provided (use-it-soon flow), the pool is
 * pre-filtered to dishes that include that ingredient. Neutral jitter
 * (0.5 constant) keeps the result deterministic within a session.
 */
import type { Dish } from '@/types/domain';
import type { MacroTargets } from './macros';
import type { PlanHistory } from './planner';
import { rankDishes } from './planner';

export interface CookSuggestion {
  dish: Dish;
  swap: Dish | null;
  mustIngredientSatisfied: boolean;
}

export function pickCookSuggestion(
  pantry: ReadonlySet<string>,
  dishes: readonly Dish[],
  history: PlanHistory,
  targets: MacroTargets,
  excludeIngredientIds?: ReadonlySet<string>,
  mustIngredientId?: string,
): CookSuggestion | null {
  const excluded = excludeIngredientIds ?? new Set<string>();

  const base = dishes.filter(
    (d) =>
      !d.tags.includes('leftover-transform') &&
      d.ingredients.every((ref) => pantry.has(ref.ingredient_id)) &&
      !d.ingredients.some((ref) => excluded.has(ref.ingredient_id)),
  );

  if (base.length === 0) return null;

  // narrow to must-include ingredient when requested
  let pool = mustIngredientId
    ? base.filter((d) => d.ingredients.some((ref) => ref.ingredient_id === mustIngredientId))
    : base;

  const mustIngredientSatisfied = pool.length > 0;
  if (!mustIngredientSatisfied) pool = base; // graceful fallback

  const recent = new Set(history.recentDishIds);
  const ranked = rankDishes(pool, {
    proteinTarget: targets.protein_g / 3,
    recentDishIds: recent,
    jitter: () => 0.5,
  });

  const dish = ranked[0];
  if (!dish) return null;

  const primaryIng = dish.ingredients[0]?.ingredient_id ?? null;
  const swap =
    ranked.find((d) => d.id !== dish.id && d.ingredients[0]?.ingredient_id !== primaryIng) ?? null;

  return { dish, swap, mustIngredientSatisfied };
}
