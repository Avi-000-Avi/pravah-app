import { act, renderHook } from '@testing-library/react-native';
import { supabase } from '@/lib/supabase';
import { track } from '@/lib/analytics';
import { useLogMeal } from '@/features/meals/hooks/useLogMeal';
import { createQueryWrapper } from '../testUtils';

const mockSupabase = supabase as unknown as {
  auth: {
    getSession: jest.Mock;
  };
  from: jest.Mock;
};

describe('useLogMeal', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('rejects when no authenticated session exists', async () => {
    mockSupabase.auth.getSession.mockResolvedValue({ data: { session: null } });
    const { wrapper } = createQueryWrapper();
    const { result } = renderHook(() => useLogMeal(), { wrapper });

    await expect(
      act(async () => {
        await result.current.mutateAsync({
          mealId: 'meal-1',
          slot: 'breakfast',
          date: '2026-05-10',
        });
      }),
    ).rejects.toThrow('Sign in again to log this meal.');
  });

  it('upserts the meal log and tracks success', async () => {
    const mockUpsert = jest.fn().mockResolvedValue({ error: null });

    mockSupabase.auth.getSession.mockResolvedValue({
      data: { session: { user: { id: 'user-1' } } },
    });
    mockSupabase.from.mockReturnValue({ upsert: mockUpsert });

    const { queryClient, wrapper } = createQueryWrapper();
    const invalidateSpy = jest.spyOn(queryClient, 'invalidateQueries');
    const { result } = renderHook(() => useLogMeal(), { wrapper });

    await act(async () => {
      await result.current.mutateAsync({
        mealId: 'meal-1',
        slot: 'breakfast',
        date: '2026-05-10',
      });
    });

    expect(mockUpsert).toHaveBeenCalledWith(
      expect.objectContaining({
        user_id: 'user-1',
        meal_id: 'meal-1',
        meal_slot: 'breakfast',
        plan_date: '2026-05-10',
        is_logged: true,
      }),
      { onConflict: 'user_id,plan_date,meal_slot' },
    );
    expect(track).toHaveBeenCalledWith('meal_logged', { slot: 'breakfast' });
    expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: ['meals'] });
  });
});
