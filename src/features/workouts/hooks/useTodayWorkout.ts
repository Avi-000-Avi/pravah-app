import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAuthStore } from '@/features/auth/store/authStore';
import { captureError } from '@/lib/monitoring';
import { supabase } from '@/lib/supabase';
import { useWorkouts } from './useWorkouts';
import { selectTodayWorkout } from '../utils/selectTodayWorkout';
import type { TodayWorkoutSelection, WorkoutPlan } from '../types';

export const TODAY_WORKOUT_PLAN_QUERY_KEY = 'user_workout_plans' as const;

function getTodayIsoDate(date = new Date()): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

async function fetchTodayWorkoutPlan(userId: string, date: string): Promise<WorkoutPlan | null> {
  const { data, error } = await supabase
    .from('user_workout_plans')
    .select('*')
    .eq('user_id', userId)
    .eq('plan_date', date)
    .maybeSingle();

  if (error) {
    captureError(error, { action: 'read_today_workout_plan' });
    throw error;
  }

  return data;
}

export function useTodayWorkout(preferredName?: string | null, date = getTodayIsoDate()) {
  const userId = useAuthStore((state) => state.session?.user?.id);
  const workoutsQuery = useWorkouts();
  const planQuery = useQuery({
    queryKey: [TODAY_WORKOUT_PLAN_QUERY_KEY, userId, date] as const,
    enabled: userId != null,
    queryFn: () => fetchTodayWorkoutPlan(userId!, date),
  });

  const todayWorkout = useMemo<TodayWorkoutSelection>(() => {
    return selectTodayWorkout({
      workouts: workoutsQuery.data ?? [],
      plan: planQuery.data ?? null,
      preferredName,
    });
  }, [planQuery.data, preferredName, workoutsQuery.data]);

  const error =
    workoutsQuery.error instanceof Error
      ? workoutsQuery.error.message
      : planQuery.error instanceof Error
        ? planQuery.error.message
        : null;

  return {
    date,
    todayWorkout,
    isLoading: workoutsQuery.isLoading || planQuery.isLoading,
    error,
    refetch: async () => {
      await Promise.all([workoutsQuery.refetch(), planQuery.refetch()]);
    },
  };
}
