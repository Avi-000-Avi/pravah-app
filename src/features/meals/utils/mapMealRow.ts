import type { Database } from '@/lib/database.types';
import type { Meal } from '../types';

type MealRow = Database['public']['Tables']['meals']['Row'];

export function mapMealRow(row: MealRow): Meal {
  return {
    ...row,
    protein_g: Number(row.protein_g),
    carbs_g: Number(row.carbs_g),
    fat_g: Number(row.fat_g),
  };
}
