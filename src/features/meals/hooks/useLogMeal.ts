/**
 * useLogMeal — TanStack Query mutation writing to public.user_meal_plans.
 *
 * Follows the pattern established by useMeals.ts:
 *   - mutationFn throws on Supabase error so TanStack Query surfaces it via `error`
 *   - captureError() called for unexpected failures (Sentry)
 *   - invalidates the meals query cache on success so downstream reads stay fresh
 *
 * Usage:
 *   const logMeal = useLogMeal();
 *   logMeal.mutate({ mealId: '...', slot: 'breakfast', date: '2026-05-06' });
 */

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { captureError } from '@/lib/monitoring';
import { MEALS_QUERY_KEY } from './useMeals';
import type { MealSlot } from '../types';

export interface LogMealInput {
  /** UUID of the public.meals row being logged. */
  mealId: string;
  /** Slot the meal occupies (used as part of the unique key on user_meal_plans). */
  slot: MealSlot;
  /** ISO calendar date string — 'YYYY-MM-DD'. */
  date: string;
}

async function logMeal({ mealId, slot, date }: LogMealInput): Promise<void> {
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    throw new Error('Cannot log meal: user is not authenticated');
  }

  const { error } = await supabase.from('user_meal_plans').upsert(
    {
      user_id: session.user.id,
      meal_id: mealId,
      meal_slot: slot,
      plan_date: date,
      is_logged: true,
      logged_at: new Date().toISOString(),
    },
    // The table has UNIQUE (user_id, plan_date, meal_slot), so upserting on
    // that constraint lets re-logging the same slot update in place rather
    // than error.
    { onConflict: 'user_id,plan_date,meal_slot' },
  );

  if (error) {
    captureError(error);
    throw error;
  }
}

/**
 * Mutation hook that upserts a logged meal row into public.user_meal_plans.
 *
 * The mutation is fire-and-forget from the UI's perspective — the phase machine
 * advances optimistically via local state (setMealLogged in appStore). Any DB
 * error is captured to Sentry and exposed via `logMeal.error` for optional
 * display.
 *
 * On success, the meals catalog query is invalidated so any derived data
 * (e.g. future daily-plan selectors) refetch automatically.
 */
export function useLogMeal() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: logMeal,
    onSuccess: () => {
      // Invalidate the catalog so future plan-building selectors stay fresh.
      // When a dedicated useUserMealPlans hook exists, invalidate its key here too.
      void queryClient.invalidateQueries({ queryKey: [MEALS_QUERY_KEY] });
    },
  });
}
