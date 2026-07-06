/**
 * Bundled seed catalog — single source of truth for content.
 *
 * These modules generate supabase/seed/02_pantry_intelligence.sql
 * (via scripts/generate-seed-sql.ts) and double as the app's offline
 * catalog: ids are deterministic, so rows match the database exactly.
 */
export { CANONICAL_STAPLES, ING, SEED_INGREDIENTS } from './ingredients';
export type { IngredientKey } from './ingredients';
export { DISH, SEED_DISHES } from './dishes';
export type { DishKey } from './dishes';
export { SEED_TRANSFORMATIONS } from './transformations';
export { WORKOUT_ROTATION, workoutForDate } from './workouts';
