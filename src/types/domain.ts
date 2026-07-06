/**
 * Pravah — Adaptive Pantry Intelligence domain types.
 *
 * Single source of truth for the shapes shared by the planner,
 * leftover engine, seed content, Supabase rows, and screens.
 * Mirrors supabase/migrations/20260612000000_pantry_intelligence.sql —
 * update both together when the schema changes.
 */

export type IngredientCategory =
  | 'vegetable'
  | 'dairy'
  | 'grain'
  | 'protein'
  | 'spice'
  | 'staple'
  | 'fruit'
  | 'other';

export interface Ingredient {
  id: string;
  name: string;
  name_aliases: string[];
  category: IngredientCategory;
  default_shelf_life_days: number | null;
  is_staple: boolean;
}

export type MealSlotName = 'breakfast' | 'lunch' | 'dinner';

export type DishTag =
  | 'no-cook'
  | 'leftover-friendly'
  | 'budget'
  | 'vrat-safe'
  | 'recovery'
  /** Output of a leftover transformation — excluded from the daily planner pool. */
  | 'leftover-transform';

/** 1 = assemble/no-cook, 2 = light cooking, 3 = full cooking. */
export type EffortScore = 1 | 2 | 3;

export interface DishIngredient {
  ingredient_id: string;
  qty_hint: string;
}

export interface Dish {
  id: string;
  name: string;
  slot_tags: (MealSlotName | 'any')[];
  prep_minutes: number;
  effort_score: EffortScore;
  protein_g: number;
  calories: number;
  ingredients: DishIngredient[];
  method_steps: string[];
  tags: DishTag[];
}

export type LeftoverBaseCategory = 'dal' | 'sabzi' | 'rice' | 'roti' | 'curry' | 'paneer';

export interface LeftoverTransformation {
  id: string;
  base_category: LeftoverBaseCategory;
  dish_id: string;
  /** Ingredient ids needed beyond the leftover itself. Empty = floor transform. */
  extra_staples: string[];
  active: boolean;
}

export type PantrySource = 'staple' | 'manual' | 'seed';

export interface PantryItem {
  id: string;
  user_id: string;
  ingredient_id: string;
  source: PantrySource;
  purchased_at: string;
  predicted_empty_at: string | null;
  confidence: number;
  last_confirmed_at: string | null;
}

export type HouseholdSizeBucket = 'solo' | 'couple' | 'family' | 'large';

export interface Household {
  user_id: string;
  size_bucket: HouseholdSizeBucket;
  cooking_context: 'self' | 'shared';
}

export type PlanSource = 'planned' | 'leftover' | 'swapped';

/** The slots jsonb contract on daily_plans — single source of truth. */
export interface PlanSlot {
  slot: MealSlotName;
  dish_id: string;
  source: PlanSource;
  /** Pre-computed alternative, always present. */
  swap_dish_id: string;
  protein_g: number;
  calories: number;
}

export interface PlanWorkout {
  name: string;
  kind: 'strength' | 'cardio' | 'rest';
  duration_min: number;
}

/** v1 consumes only 'tired'; the array is the condition-mode seam. */
export type ConditionFlag = 'tired';

export interface DailyPlan {
  id: string;
  user_id: string;
  date: string; // YYYY-MM-DD
  slots: PlanSlot[];
  workout: PlanWorkout | null;
  condition_flags: ConditionFlag[];
  generated_at: string;
  plan_version: number;
}

export type MealLogStatus = 'ate' | 'swapped' | 'skipped';

export type SwapCategory =
  | 'ordered_in'
  | 'ate_out'
  | 'roti_sabzi'
  | 'rice_dal'
  | 'snack'
  | 'other_home_meal';

export interface MealLog {
  id: string;
  user_id: string;
  plan_date: string; // YYYY-MM-DD
  slot: MealSlotName;
  status: MealLogStatus;
  swap_category: SwapCategory | null;
  custom_text: string | null;
  logged_at: string;
}

export interface LeftoverEvent {
  id: string;
  user_id: string;
  base_category: LeftoverBaseCategory;
  dish_id: string;
  created_at: string;
}

export interface TimeConstraints {
  weekday_breakfast_min: number;
  weekday_dinner_min: number;
}
