import type { TodayWorkoutSelection, Workout, WorkoutPlan } from '../types';

interface SelectTodayWorkoutInput {
  workouts: Workout[];
  plan: WorkoutPlan | null;
  preferredName?: string | null;
}

export function selectTodayWorkout({
  workouts,
  plan,
  preferredName,
}: SelectTodayWorkoutInput): TodayWorkoutSelection {
  let plannedWorkout: Workout | null = null;

  if (plan) {
    plannedWorkout = workouts.find((workout) => workout.id === plan.workout_id) ?? null;
  }

  if (plan && plannedWorkout) {
    return {
      workout: plannedWorkout,
      plan,
      status: plan.status,
    };
  }

  const preferredWorkout =
    preferredName != null
      ? (workouts.find((workout) => workout.name === preferredName) ?? null)
      : null;

  return {
    workout: preferredWorkout ?? workouts[0] ?? null,
    plan,
    status: 'pending',
  };
}
