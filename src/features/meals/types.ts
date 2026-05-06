/**
 * Meals — types
 *
 * Shape of public.meals rows and the related enums.
 * Mirrors the schema in supabase/migrations/20260506000000_meals_catalog.sql.
 * Update both files together when the catalog schema changes.
 */

export type MealSlot = 'breakfast' | 'lunch' | 'dinner' | 'snack';

// Reuses the existing public.diet_type enum from migration 20260428000302.
export type DietType = 'vegetarian' | 'non_vegetarian' | 'vegan' | 'eggetarian';

export interface Meal {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  meal_slot: MealSlot;
  diet_type: DietType;
  cuisine: string | null;
  image_url: string | null;
  prep_time_min: number;
  calories_kcal: number;
  protein_g: number;
  carbs_g: number;
  fat_g: number;
  tags: string[];
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface UseMealsFilters {
  slot?: MealSlot;
  dietType?: DietType;
}
