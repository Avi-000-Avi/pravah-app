import { useCallback } from 'react';
import { track } from '@/lib/analytics';
import { captureError } from '@/lib/monitoring';
import { supabase } from '@/lib/supabase';
import { useAuthStore } from '../store/authStore';

/**
 * Top-level auth surface used by feature code (Profile screen, settings, etc).
 * Orchestrates supabase + the persisted Zustand store.
 */
export function useAuth() {
  const session = useAuthStore((s) => s.session);
  const isOnboarded = useAuthStore((s) => s.isOnboarded);
  const clearAuth = useAuthStore((s) => s.clearAuth);

  const signOut = useCallback(async (): Promise<void> => {
    try {
      await supabase.auth.signOut();
      clearAuth();
      track('sign_out');
    } catch (error) {
      captureError(error, { action: 'sign_out' });
      throw error;
    }
  }, [clearAuth]);

  /**
   * DPDP-compliant hard delete via the `delete-account` edge function.
   * Cascades through public.users → public.meal_preferences via FK.
   */
  const deleteAccount = useCallback(async (): Promise<void> => {
    try {
      const { error } = await supabase.functions.invoke('delete-account', {
        method: 'DELETE',
      });
      if (error) throw error;
      await supabase.auth.signOut();
      clearAuth();
    } catch (error) {
      captureError(error, { action: 'delete_account' });
      throw error;
    }
  }, [clearAuth]);

  return {
    user: session?.user ?? null,
    session,
    isOnboarded,
    signOut,
    deleteAccount,
  };
}
