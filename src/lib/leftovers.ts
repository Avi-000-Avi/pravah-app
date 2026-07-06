/**
 * Leftover ranking engine — pure, no I/O.
 *
 * Given a base category and the current pantry, returns an ordered list
 * of feasible transformations. A "floor" transform (fewest extra_staples
 * in the category) is always returned as the last-resort fallback even
 * when the pantry is empty, because its single extra_staple is a
 * canonical staple that setup-staples always provisions.
 */
import type {
  Dish,
  LeftoverBaseCategory,
  LeftoverEvent,
  LeftoverTransformation,
} from '@/types/domain';
import { getDish } from './catalog';
import type { MacroTargets } from './macros';
import { SEED_TRANSFORMATIONS } from './seed';

export interface RankedTransform {
  transform: LeftoverTransformation;
  dish: Dish;
  score: number;
}

/** Days back to count as "recently used" for variety penalty. */
const VARIETY_WINDOW_DAYS = 7;
/** Score deducted per recent use of the same dish. */
const VARIETY_PENALTY_PER_USE = 2;
/** Weight applied to the normalised protein-fit score. */
const PROTEIN_FIT_WEIGHT = 3;

function getFloor(candidates: readonly LeftoverTransformation[]): LeftoverTransformation {
  return candidates.reduce((min, t) =>
    t.extra_staples.length < min.extra_staples.length ? t : min,
  );
}

/**
 * Return all feasible transformations for `baseCategory`, ranked best
 * first. Falls back to the floor transform when no pantry-covered
 * option exists, so the result is never empty for a valid category.
 *
 * @param availableIngredientIds  Set of ingredient ids currently in the pantry
 * @param recentEvents            Leftover events from the past ~7 days
 * @param macroGap                Per-slot macro gap to favour protein-rich options
 */
export function rankLeftoverTransforms(
  baseCategory: LeftoverBaseCategory,
  availableIngredientIds: ReadonlySet<string>,
  recentEvents: readonly LeftoverEvent[],
  macroGap: MacroTargets,
): RankedTransform[] {
  const candidates = SEED_TRANSFORMATIONS.filter(
    (t) => t.base_category === baseCategory && t.active,
  );
  if (candidates.length === 0) return [];

  const floor = getFloor(candidates);

  // count same-category dish uses in the variety window
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - VARIETY_WINDOW_DAYS);
  const cutoffIso = cutoff.toISOString();
  const useCounts = new Map<string, number>();
  for (const event of recentEvents) {
    if (event.created_at >= cutoffIso && event.base_category === baseCategory) {
      useCounts.set(event.dish_id, (useCounts.get(event.dish_id) ?? 0) + 1);
    }
  }

  // filter to what the pantry can actually cover
  const feasible = candidates.filter((t) =>
    t.extra_staples.every((id) => availableIngredientIds.has(id)),
  );

  // always at least the floor, even with an empty pantry
  const pool: LeftoverTransformation[] = feasible.length > 0 ? feasible : [floor];

  const proteinTarget = Math.max(macroGap.protein_g, 1);

  const ranked: RankedTransform[] = [];
  for (const t of pool) {
    const dish = getDish(t.dish_id);
    if (!dish) continue;
    const proteinFit = Math.min(dish.protein_g / proteinTarget, 1);
    const varietyPenalty = (useCounts.get(t.dish_id) ?? 0) * VARIETY_PENALTY_PER_USE;
    const score = proteinFit * PROTEIN_FIT_WEIGHT - varietyPenalty;
    ranked.push({ transform: t, dish, score });
  }

  return ranked.sort((a, b) => b.score - a.score);
}
