import { act, renderHook } from '@testing-library/react-native';
import { supabase } from '@/lib/supabase';
import { track } from '@/lib/analytics';
import { useEmailAuth } from '@/features/auth/hooks/useEmailAuth';

const mockSupabase = supabase as unknown as {
  auth: {
    signInWithPassword: jest.Mock;
    signUp: jest.Mock;
  };
};

describe('useEmailAuth', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('rejects invalid credentials before calling Supabase', async () => {
    const { result } = renderHook(() => useEmailAuth());

    await expect(
      act(async () => {
        await result.current.signIn('invalid-email', 'short');
      }),
    ).rejects.toThrow("That doesn't look like a valid email.");

    expect(mockSupabase.auth.signInWithPassword).not.toHaveBeenCalled();
  });

  it('tracks successful sign-in', async () => {
    mockSupabase.auth.signInWithPassword.mockResolvedValue({ error: null });
    const { result } = renderHook(() => useEmailAuth());

    await act(async () => {
      await result.current.signIn('user@example.com', 'password123');
    });

    expect(track).toHaveBeenCalledWith('sign_in', { method: 'email' });
  });

  it('surfaces pending confirmation after sign-up without a session', async () => {
    mockSupabase.auth.signUp.mockResolvedValue({
      data: {
        user: { id: 'user-1' },
        session: null,
      },
      error: null,
    });

    const { result } = renderHook(() => useEmailAuth());

    await act(async () => {
      await result.current.signUp('user@example.com', 'password123');
    });

    expect(result.current.pendingConfirmation).toBe(true);
    expect(track).toHaveBeenCalledWith('sign_up', { method: 'email' });
  });
});
