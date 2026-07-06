/**
 * Seed workout rotation — static 7-day placeholder.
 *
 * Workout programming is out of scope for this pass; the plan card
 * needs a workout row, so the planner reads this fixed rotation:
 * 3 strength, 2 cardio, 2 rest. Indexed by JS getDay() (0 = Sunday).
 */
import type { PlanWorkout } from '@/types/domain';

export const WORKOUT_ROTATION: readonly PlanWorkout[] = [
  { name: 'rest day — gentle stretch if you like', kind: 'rest', duration_min: 10 }, // Sun
  { name: 'full body strength A', kind: 'strength', duration_min: 30 }, // Mon
  { name: 'brisk walk intervals', kind: 'cardio', duration_min: 25 }, // Tue
  { name: 'full body strength B', kind: 'strength', duration_min: 30 }, // Wed
  { name: 'rest day', kind: 'rest', duration_min: 0 }, // Thu
  { name: 'full body strength C', kind: 'strength', duration_min: 30 }, // Fri
  { name: 'easy cardio — walk or cycle', kind: 'cardio', duration_min: 30 }, // Sat
];

export function workoutForDate(date: Date): PlanWorkout {
  const workout = WORKOUT_ROTATION[date.getDay()];
  if (!workout) throw new Error('workout rotation must cover all 7 weekdays');
  return workout;
}
