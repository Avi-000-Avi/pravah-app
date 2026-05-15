import { renderHook, waitFor } from '@testing-library/react-native';
import { supabase } from '@/lib/supabase';
import { captureError } from '@/lib/monitoring';
import { useWorkouts } from '@/features/workouts';
import { createQueryWrapper } from '../testUtils';

const mockSupabase = supabase as unknown as {
  from: jest.Mock;
};

interface MockQueryChain {
  eq: (column: string, value: unknown) => MockQueryChain;
  in: (column: string, values: unknown[]) => MockQueryChain;
  order: (column: string) => MockQueryChain;
  then: PromiseLike<unknown>['then'];
}

function createQueryResult(result: unknown) {
  const query: MockQueryChain = {
    eq: jest.fn(() => query),
    in: jest.fn(() => query),
    order: jest.fn(() => query),
    then: (onfulfilled, onrejected) => Promise.resolve(result).then(onfulfilled, onrejected),
  };

  return { query, select: jest.fn(() => query) };
}

describe('useWorkouts', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('loads workouts and stitches their exercises together', async () => {
    const workoutResponse = {
      data: [
        {
          id: 'workout-1',
          slug: 'upper-body-strength',
          name: 'Upper Body Strength',
          description: 'Strength focus',
          duration_min: 45,
          focus_area: 'Upper Body',
          is_active: true,
          created_at: '2026-01-01T00:00:00Z',
          updated_at: '2026-01-01T00:00:00Z',
        },
      ],
      error: null,
    };
    const exerciseResponse = {
      data: [
        {
          id: 'exercise-1',
          workout_id: 'workout-1',
          sort_order: 1,
          name: 'Bench Press',
          muscle: 'Chest',
          sets: 3,
          reps: '8-10',
          target_weight: '60kg',
          previous_weight: '58kg',
          rest_after_set_sec: 60,
          rest_after_exercise_sec: 90,
          created_at: '2026-01-01T00:00:00Z',
          updated_at: '2026-01-01T00:00:00Z',
        },
      ],
      error: null,
    };

    const workoutsQuery = createQueryResult(workoutResponse);
    const exercisesQuery = createQueryResult(exerciseResponse);

    mockSupabase.from.mockImplementation((table: string) => {
      if (table === 'workouts') {
        return { select: workoutsQuery.select };
      }

      if (table === 'workout_exercises') {
        return { select: exercisesQuery.select };
      }

      throw new Error(`Unexpected table: ${table}`);
    });

    const { wrapper } = createQueryWrapper();
    const { result } = renderHook(() => useWorkouts(), { wrapper });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(workoutsQuery.select).toHaveBeenCalledWith('*');
    expect(workoutsQuery.query.eq).toHaveBeenCalledWith('is_active', true);
    expect(workoutsQuery.query.order).toHaveBeenCalledWith('name');
    expect(exercisesQuery.query.in).toHaveBeenCalledWith('workout_id', ['workout-1']);
    expect(exercisesQuery.query.order).toHaveBeenCalledWith('sort_order');
    expect(result.current.data?.[0]?.exercises[0]?.target_weight).toBe('60kg');
  });

  it('captures and surfaces workout query errors', async () => {
    const supabaseError = new Error('boom');
    const workoutsQuery = createQueryResult({ data: null, error: supabaseError });
    mockSupabase.from.mockReturnValue({ select: workoutsQuery.select });

    const { wrapper } = createQueryWrapper();
    const { result } = renderHook(() => useWorkouts(), { wrapper });

    await waitFor(() => expect(result.current.error).toBeDefined());

    expect(captureError).toHaveBeenCalledWith(supabaseError, { action: 'read_workouts' });
  });
});
