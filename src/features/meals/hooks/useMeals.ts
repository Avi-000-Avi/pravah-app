/**
 * useMeals — TanStack Query hook reading public.meals.
 *
 * First TanStack Query hook in the codebase — sets the pattern future
 * server-state hooks (workouts, grocery, insights) will copy.
 *
 * Conventions established here:
 *   - queryKey is a const tuple: ['meals', filters]
 *   - queryFn throws on Supabase error so TanStack Query surfaces it via `error`
 *   - captureError() called in queryFn for unexpected failures (Sentry)
 *   - filters are part of the queryKey so changing them refetches automatically
 */

import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { captureError } from '@/lib/monitoring';
import type { Meal, UseMealsFilters } from '../types';

/** Stable key root — also exported so other code can invalidate this cache. */
export const MEALS_QUERY_KEY = 'meals' as const;

async function fetchMeals(filters: UseMealsFilters): Promise<Meal[]> {
  let query = supabase.from('meals').select('*').eq('is_active', true).order('name');

  if (filters.slot) query = query.eq('meal_slot', filters.slot);
  if (filters.dietType) query = query.eq('diet_type', filters.dietType);

  const { data, error } = await query;

  if (error) {
    captureError(error);
    throw error;
  }

  // Postgres `numeric` columns come back as strings from supabase-js
  // (to preserve precision). Coerce here so the rest of the app sees
  // protein/carbs/fat as numbers.
  return (data ?? []).map(
    (row): Meal => ({
      ...(row as Meal),
      protein_g: Number((row as { protein_g: number | string }).protein_g),
      carbs_g: Number((row as { carbs_g: number | string }).carbs_g),
      fat_g: Number((row as { fat_g: number | string }).fat_g),
    }),
  );
}

/**
 * Read meals from the public.meals catalog.
 * Returns active meals only (is_active = true). Pass filters to scope the result.
 *
 * @example
 *   const { data: meals, isLoading, error } = useMeals();
 *   const { data: breakfasts } = useMeals({ slot: 'breakfast' });
 *   const { data: vegMeals } = useMeals({ dietType: 'vegetarian' });
 */
export function useMeals(filters: UseMealsFilters = {}) {
  return useQuery({
    queryKey: [MEALS_QUERY_KEY, filters] as const,
    queryFn: () => fetchMeals(filters),
    // Catalog rarely changes — keep cache fresh for 5 min.
    staleTime: 5 * 60 * 1000,
  });
}
