import type { Database } from '@/lib/database.types';

export type DietType = Database['public']['Enums']['diet_type'];
export type FitnessGoal = Database['public']['Enums']['fitness_goal'];
export type CookingMode = Database['public']['Enums']['cooking_mode'];
export type MealPreferencesRow = Database['public']['Tables']['meal_preferences']['Row'];
