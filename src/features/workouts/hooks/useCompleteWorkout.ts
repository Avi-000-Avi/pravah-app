import { useMutation, useQueryClient } from '@tanstack/react-query';
import { track } from '@/lib/analytics';
import { captureError } from '@/lib/monitoring';
import { supabase } from '@/lib/supabase';
import { TODAY_WORKOUT_PLAN_QUERY_KEY } from './useTodayWorkout';
import type { WorkoutStatus } from '../types';

export interface CompleteWorkoutInput {
  workoutId: string;
  date: string;
  durationSec: number;
  completedSets: number;
}

async function completeWorkout({
  workoutId,
  date,
  durationSec,
  completedSets,
}: CompleteWorkoutInput): Promise<WorkoutStatus> {
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    throw new Error('Sign in again to save this workout.');
  }

  try {
    const { error } = await supabase.from('user_workout_plans').upsert(
      {
        user_id: session.user.id,
        workout_id: workoutId,
        plan_date: date,
        status: 'completed',
        duration_sec: durationSec,
        completed_sets: completedSets,
        completed_at: new Date().toISOString(),
      },
      { onConflict: 'user_id,plan_date' },
    );

    if (error) {
      throw error;
    }
  } catch (error) {
    captureError(error, { action: 'complete_workout' });
    throw error;
  }

  track('workout_completed', {
    duration_sec: durationSec,
    completed_sets: completedSets,
  });

  return 'completed';
}

export function useCompleteWorkout() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: completeWorkout,
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: [TODAY_WORKOUT_PLAN_QUERY_KEY],
      });
    },
  });
}
