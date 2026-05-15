import type { Database } from '@/lib/database.types';

export type MealSlot = Database['public']['Enums']['meal_slot'];
export type DietType = Database['public']['Enums']['diet_type'];
type MealRow = Database['public']['Tables']['meals']['Row'];

export type Meal = Omit<MealRow, 'protein_g' | 'carbs_g' | 'fat_g'> & {
  protein_g: number;
  carbs_g: number;
  fat_g: number;
};

export interface UseMealsFilters {
  slot?: MealSlot;
  dietType?: DietType;
}
