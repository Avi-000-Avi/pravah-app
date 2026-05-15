import { act, renderHook } from '@testing-library/react-native';
import { supabase } from '@/lib/supabase';
import { useAuthStore } from '@/features/auth/store/authStore';
import { useAuth } from '@/features/auth/hooks/useAuth';

const mockSupabase = supabase as unknown as {
  auth: {
    signOut: jest.Mock;
  };
  functions: {
    invoke: jest.Mock;
  };
};

describe('useAuth', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useAuthStore.setState({
      session: { user: { id: 'user-1' } } as never,
      isOnboarded: true,
      isLoading: false,
    });
  });

  it('signs out and clears auth state', async () => {
    mockSupabase.auth.signOut.mockResolvedValue(undefined);
    const { result } = renderHook(() => useAuth());

    await act(async () => {
      await result.current.signOut();
    });

    expect(mockSupabase.auth.signOut).toHaveBeenCalled();
    expect(useAuthStore.getState().session).toBeNull();
    expect(useAuthStore.getState().isOnboarded).toBe(false);
  });

  it('deletes the account and clears auth state', async () => {
    mockSupabase.functions.invoke.mockResolvedValue({ error: null });
    mockSupabase.auth.signOut.mockResolvedValue(undefined);
    const { result } = renderHook(() => useAuth());

    await act(async () => {
      await result.current.deleteAccount();
    });

    expect(mockSupabase.functions.invoke).toHaveBeenCalledWith('delete-account', {
      method: 'DELETE',
    });
    expect(mockSupabase.auth.signOut).toHaveBeenCalled();
    expect(useAuthStore.getState().session).toBeNull();
  });
});
