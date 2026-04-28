export type DietType = 'vegetarian' | 'non_vegetarian' | 'vegan' | 'eggetarian';
export type FitnessGoal = 'fat_loss' | 'muscle_gain' | 'maintenance';
export type CookingMode = 'i_cook' | 'someone_cooks_for_me' | 'mix';

/** The 4 fields collected during the onboarding flow. */
export interface OnboardingDraft {
  dietType: DietType | null;
  goal: FitnessGoal | null;
  mealCount: number; // 2..6, default 3
  prepTimeMaxMin: number; // 5..240, default 30
}

/** Row shape in `public.meal_preferences`. */
export interface MealPreferencesRow {
  user_id: string;
  diet_type: DietType;
  goal: FitnessGoal;
  meal_count: number;
  prep_time_max_min: number;
  budget_weekly_inr: number | null;
  cooking_mode: CookingMode | null;
  cuisines: string[];
  allergies: string[];
  avoid: string[];
  health_conditions: string[];
  created_at: string;
  updated_at: string;
}
