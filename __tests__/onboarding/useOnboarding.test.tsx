import { act, renderHook } from '@testing-library/react-native';
import { router } from 'expo-router';
import { supabase } from '@/lib/supabase';
import { track } from '@/lib/analytics';
import { useAuthStore } from '@/features/auth/store/authStore';
import { useOnboarding } from '@/features/onboarding/hooks/useOnboarding';
import { useOnboardingStore } from '@/features/onboarding/store';

const mockSupabase = supabase as unknown as {
  auth: {
    getSession: jest.Mock;
  };
  from: jest.Mock;
};

describe('useOnboarding', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useAuthStore.setState({
      session: { user: { id: 'user-1' } } as never,
      isOnboarded: false,
      isLoading: false,
    });
    useOnboardingStore.setState({
      dietType: 'vegetarian',
      goal: 'muscle_gain',
      mealCount: 4,
      prepTimeMaxMin: 30,
    });
  });

  it('persists the onboarding answers and resets local draft state', async () => {
    const mockUpsert = jest.fn().mockResolvedValue({ error: null });
    mockSupabase.from.mockReturnValue({ upsert: mockUpsert });
    const { result } = renderHook(() => useOnboarding());

    await act(async () => {
      await result.current.submit();
    });

    expect(mockSupabase.from).toHaveBeenCalledWith('meal_preferences');
    expect(mockUpsert).toHaveBeenCalledWith(
      {
        user_id: 'user-1',
        diet_type: 'vegetarian',
        goal: 'muscle_gain',
        meal_count: 4,
        prep_time_max_min: 30,
      },
      { onConflict: 'user_id' },
    );
    expect(track).toHaveBeenCalledWith('onboarding_completed', {
      diet_type: 'vegetarian',
      goal: 'muscle_gain',
      meal_count: 4,
      prep_time_max_min: 30,
    });
    expect(router.replace).toHaveBeenCalledWith('/(tabs)');
    expect(useAuthStore.getState().isOnboarded).toBe(true);
    expect(useOnboardingStore.getState().dietType).toBeNull();
  });
});
