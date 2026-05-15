import type { WorkoutExercise, WorkoutExerciseRow, WorkoutRow } from '../types';

export function mapWorkoutRow(
  row: WorkoutRow,
  exercises: WorkoutExercise[],
): WorkoutRow & {
  exercises: WorkoutExercise[];
} {
  return {
    ...row,
    exercises,
  };
}

export function mapWorkoutExerciseRow(row: WorkoutExerciseRow): WorkoutExercise {
  return {
    ...row,
  };
}
