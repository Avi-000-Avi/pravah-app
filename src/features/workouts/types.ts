import type { Database } from '@/lib/database.types';

export type WorkoutStatus = Database['public']['Enums']['workout_status'];
export type WorkoutRow = Database['public']['Tables']['workouts']['Row'];
export type WorkoutExerciseRow = Database['public']['Tables']['workout_exercises']['Row'];
export type UserWorkoutPlanRow = Database['public']['Tables']['user_workout_plans']['Row'];

export type WorkoutExercise = WorkoutExerciseRow;

export type Workout = WorkoutRow & {
  exercises: WorkoutExercise[];
};

export type WorkoutPlan = UserWorkoutPlanRow;

export interface TodayWorkoutSelection {
  workout: Workout | null;
  plan: WorkoutPlan | null;
  status: WorkoutStatus;
}
