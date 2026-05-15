import { selectTodayWorkout } from '@/features/workouts/utils/selectTodayWorkout';
import type { Workout, WorkoutPlan } from '@/features/workouts';

const upperBodyWorkout: Workout = {
  id: 'workout-1',
  slug: 'upper-body-strength',
  name: 'Upper Body Strength',
  description: 'Strength focus',
  duration_min: 45,
  focus_area: 'Upper Body',
  is_active: true,
  created_at: '2026-01-01T00:00:00Z',
  updated_at: '2026-01-01T00:00:00Z',
  exercises: [],
};

const lightMobilityWorkout: Workout = {
  id: 'workout-2',
  slug: 'light-mobility-flow',
  name: 'Light Mobility Flow',
  description: 'Recovery focus',
  duration_min: 20,
  focus_area: 'Mobility',
  is_active: true,
  created_at: '2026-01-01T00:00:00Z',
  updated_at: '2026-01-01T00:00:00Z',
  exercises: [],
};

describe('selectTodayWorkout', () => {
  it('prefers the persisted plan when one exists', () => {
    const plan: WorkoutPlan = {
      id: 'plan-1',
      user_id: 'user-1',
      workout_id: upperBodyWorkout.id,
      plan_date: '2026-05-15',
      status: 'completed',
      duration_sec: 2520,
      completed_sets: 15,
      completed_at: '2026-05-15T06:00:00Z',
      created_at: '2026-05-15T05:00:00Z',
      updated_at: '2026-05-15T06:00:00Z',
    };

    const selection = selectTodayWorkout({
      workouts: [upperBodyWorkout, lightMobilityWorkout],
      plan,
      preferredName: lightMobilityWorkout.name,
    });

    expect(selection.workout?.id).toBe(upperBodyWorkout.id);
    expect(selection.plan).toEqual(plan);
    expect(selection.status).toBe('completed');
  });

  it('falls back to the preferred workout name when no plan exists', () => {
    const selection = selectTodayWorkout({
      workouts: [upperBodyWorkout, lightMobilityWorkout],
      plan: null,
      preferredName: lightMobilityWorkout.name,
    });

    expect(selection.workout?.id).toBe(lightMobilityWorkout.id);
    expect(selection.plan).toBeNull();
    expect(selection.status).toBe('pending');
  });

  it('uses the first available workout when there is no plan or preference match', () => {
    const selection = selectTodayWorkout({
      workouts: [upperBodyWorkout, lightMobilityWorkout],
      plan: null,
      preferredName: 'Missing Workout',
    });

    expect(selection.workout?.id).toBe(upperBodyWorkout.id);
    expect(selection.status).toBe('pending');
  });
});
