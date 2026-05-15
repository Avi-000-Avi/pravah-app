import { useQuery } from '@tanstack/react-query';
import { captureError } from '@/lib/monitoring';
import { supabase } from '@/lib/supabase';
import { mapWorkoutExerciseRow, mapWorkoutRow } from '../utils/mapWorkoutRow';
import type { Workout, WorkoutExerciseRow, WorkoutRow } from '../types';

export const WORKOUTS_QUERY_KEY = 'workouts' as const;

async function fetchWorkouts(): Promise<Workout[]> {
  const { data: workoutsData, error: workoutsError } = await supabase
    .from('workouts')
    .select('*')
    .eq('is_active', true)
    .order('name');

  if (workoutsError) {
    captureError(workoutsError, { action: 'read_workouts' });
    throw workoutsError;
  }

  const workouts = workoutsData ?? [];

  if (workouts.length === 0) {
    return [];
  }

  const workoutIds = workouts.map((workout) => workout.id);
  const { data: exercisesData, error: exercisesError } = await supabase
    .from('workout_exercises')
    .select('*')
    .in('workout_id', workoutIds)
    .order('sort_order');

  if (exercisesError) {
    captureError(exercisesError, { action: 'read_workout_exercises' });
    throw exercisesError;
  }

  const exercisesByWorkoutId = new Map<string, WorkoutExerciseRow[]>();

  for (const exercise of exercisesData ?? []) {
    const exercises = exercisesByWorkoutId.get(exercise.workout_id) ?? [];
    exercises.push(exercise);
    exercisesByWorkoutId.set(exercise.workout_id, exercises);
  }

  return workouts.map((workout: WorkoutRow) =>
    mapWorkoutRow(
      workout,
      (exercisesByWorkoutId.get(workout.id) ?? []).map((exercise) =>
        mapWorkoutExerciseRow(exercise),
      ),
    ),
  );
}

export function useWorkouts() {
  return useQuery({
    queryKey: [WORKOUTS_QUERY_KEY] as const,
    queryFn: fetchWorkouts,
    staleTime: 5 * 60 * 1000,
  });
}
