import * as SplashScreen from 'expo-splash-screen';
import { useCallback, useEffect } from 'react';
import { captureError } from '@/lib/monitoring';
import { supabase } from '@/lib/supabase';
import { useAuthStore } from '../store/authStore';
import type { Session } from '../types/auth.types';

export function useAuthBootstrap() {
  const setLoading = useAuthStore((state) => state.setLoading);
  const setSession = useAuthStore((state) => state.setSession);
  const setOnboarded = useAuthStore((state) => state.setOnboarded);

  const syncSession = useCallback(
    async (nextSession: Session | null) => {
      setLoading(true);
      setSession(nextSession);

      try {
        if (!nextSession) {
          setOnboarded(false);
          return;
        }

        const { data, error } = await supabase
          .from('meal_preferences')
          .select('user_id')
          .eq('user_id', nextSession.user.id)
          .maybeSingle();

        if (error) {
          throw error;
        }

        setOnboarded(Boolean(data));
      } catch (error) {
        captureError(error, { action: 'sync_session' });
        setOnboarded(false);
      } finally {
        setLoading(false);
        SplashScreen.hideAsync().catch(() => undefined);
      }
    },
    [setLoading, setOnboarded, setSession],
  );

  useEffect(() => {
    void supabase.auth
      .getSession()
      .then(({ data }) => syncSession(data.session))
      .catch((error) => {
        captureError(error, { action: 'boot_session' });
        setLoading(false);
        SplashScreen.hideAsync().catch(() => undefined);
      });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      void syncSession(nextSession);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [setLoading, syncSession]);
}
