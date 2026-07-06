/**
 * Catalog access — bundled seed content keyed for lookup.
 *
 * Catalog rows are deterministic and identical to the database seed,
 * so the app reads them directly; a fetched catalog can replace this
 * module behind the same functions when content goes server-side.
 */
import type { Dish } from '@/types/domain';
import { SEED_DISHES } from './seed';

const dishesById = new Map(SEED_DISHES.map((dish) => [dish.id, dish]));

export function getDish(id: string): Dish | undefined {
  return dishesById.get(id);
}

export function listDishes(): readonly Dish[] {
  return SEED_DISHES;
}
