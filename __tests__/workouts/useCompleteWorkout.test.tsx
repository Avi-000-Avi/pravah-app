import { act, renderHook } from '@testing-library/react-native';
import { supabase } from '@/lib/supabase';
import { track } from '@/lib/analytics';
import { TODAY_WORKOUT_PLAN_QUERY_KEY, useCompleteWorkout } from '@/features/workouts';
import { createQueryWrapper } from '../testUtils';

const mockSupabase = supabase as unknown as {
  auth: {
    getSession: jest.Mock;
  };
  from: jest.Mock;
};

describe('useCompleteWorkout', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('rejects when no authenticated session exists', async () => {
    mockSupabase.auth.getSession.mockResolvedValue({ data: { session: null } });
    const { wrapper } = createQueryWrapper();
    const { result } = renderHook(() => useCompleteWorkout(), { wrapper });

    await expect(
      act(async () => {
        await result.current.mutateAsync({
          workoutId: 'workout-1',
          date: '2026-05-15',
          durationSec: 2400,
          completedSets: 15,
        });
      }),
    ).rejects.toThrow('Sign in again to save this workout.');
  });

  it('upserts the workout completion and tracks success', async () => {
    const mockUpsert = jest.fn().mockResolvedValue({ error: null });

    mockSupabase.auth.getSession.mockResolvedValue({
      data: { session: { user: { id: 'user-1' } } },
    });
    mockSupabase.from.mockReturnValue({ upsert: mockUpsert });

    const { queryClient, wrapper } = createQueryWrapper();
    const invalidateSpy = jest.spyOn(queryClient, 'invalidateQueries');
    const { result } = renderHook(() => useCompleteWorkout(), { wrapper });

    await act(async () => {
      await result.current.mutateAsync({
        workoutId: 'workout-1',
        date: '2026-05-15',
        durationSec: 2520,
        completedSets: 15,
      });
    });

    expect(mockUpsert).toHaveBeenCalledWith(
      expect.objectContaining({
        user_id: 'user-1',
        workout_id: 'workout-1',
        plan_date: '2026-05-15',
        status: 'completed',
        duration_sec: 2520,
        completed_sets: 15,
      }),
      { onConflict: 'user_id,plan_date' },
    );
    expect(track).toHaveBeenCalledWith('workout_completed', {
      duration_sec: 2520,
      completed_sets: 15,
    });
    expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: [TODAY_WORKOUT_PLAN_QUERY_KEY] });
  });

  it('surfaces Supabase write failures without tracking success', async () => {
    const supabaseError = new Error('write failed');
    const mockUpsert = jest.fn().mockRejectedValue(supabaseError);

    mockSupabase.auth.getSession.mockResolvedValue({
      data: { session: { user: { id: 'user-1' } } },
    });
    mockSupabase.from.mockReturnValue({ upsert: mockUpsert });

    const { wrapper } = createQueryWrapper();
    const { result } = renderHook(() => useCompleteWorkout(), { wrapper });

    await expect(
      act(async () => {
        await result.current.mutateAsync({
          workoutId: 'workout-1',
          date: '2026-05-15',
          durationSec: 2520,
          completedSets: 15,
        });
      }),
    ).rejects.toThrow('write failed');

    expect(track).not.toHaveBeenCalled();
  });
});
