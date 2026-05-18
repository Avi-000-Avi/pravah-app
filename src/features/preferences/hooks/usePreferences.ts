import { useQuery } from '@tanstack/react-query';
import { useAuthStore } from '@/features/auth/store/authStore';
import { captureError } from '@/lib/monitoring';
import { supabase } from '@/lib/supabase';
import type {
  CookingMode,
  DietType,
  FitnessGoal,
  MealPreferencesRow,
} from '../types/preferences.types';

/** Camel-cased domain shape used by UI code. */
export interface Preferences {
  userId: string;
  dietType: DietType;
  goal: FitnessGoal;
  mealCount: number;
  prepTimeMaxMin: number;
  budgetWeeklyInr: number | null;
  cookingMode: CookingMode | null;
  cuisines: string[];
  allergies: string[];
  avoid: string[];
  healthConditions: string[];
  createdAt: string;
  updatedAt: string;
}

function mapRow(r: MealPreferencesRow): Preferences {
  return {
    userId: r.user_id,
    dietType: r.diet_type,
    goal: r.goal,
    mealCount: r.meal_count,
    prepTimeMaxMin: r.prep_time_max_min,
    budgetWeeklyInr: r.budget_weekly_inr,
    cookingMode: r.cooking_mode,
    cuisines: r.cuisines,
    allergies: r.allergies,
    avoid: r.avoid,
    healthConditions: r.health_conditions,
    createdAt: r.created_at,
    updatedAt: r.updated_at,
  };
}

/**
 * Reads the saved meal_preferences row for the current user.
 * Returns `null` (not an error) when no row exists yet — useful for
 * post-onboarding settings screens that should hide gracefully if the
 * table hasn't been populated.
 *
 * Reads the userId from `useAuthStore.session` (no extra network call).
 */
export function usePreferences() {
  const userId = useAuthStore((s) => s.session?.user?.id);

  const q = useQuery({
    queryKey: ['meal_preferences', userId],
    enabled: !!userId,
    queryFn: async (): Promise<Preferences | null> => {
      const { data, error } = await supabase
        .from('meal_preferences')
        .select('*')
        .eq('user_id', userId!)
        .maybeSingle();
      if (error) {
        captureError(error, { action: 'read_preferences' });
        throw error;
      }
      return data ? mapRow(data) : null;
    },
  });

  return {
    preferences: q.data ?? null,
    isLoading: q.isLoading,
    error: q.error instanceof Error ? q.error.message : null,
    refetch: q.refetch,
  };
}
