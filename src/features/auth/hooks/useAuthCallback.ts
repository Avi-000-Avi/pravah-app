import * as Linking from 'expo-linking';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { captureError } from '@/lib/monitoring';
import { supabase } from '@/lib/supabase';

type AuthCallbackState = 'loading' | 'done' | 'error';

function getTokenParams(url: string): URLSearchParams {
  const fragment = url.split('#')[1];
  if (fragment) {
    return new URLSearchParams(fragment);
  }

  const query = url.split('?')[1] ?? '';
  return new URLSearchParams(query);
}

export function useAuthCallback() {
  const [state, setState] = useState<AuthCallbackState>('loading');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function applyCallback(): Promise<void> {
      try {
        const url = await Linking.getInitialURL();
        if (!url) {
          throw new Error('Missing auth callback URL.');
        }

        const params = getTokenParams(url);
        const accessToken = params.get('access_token');
        const refreshToken = params.get('refresh_token');

        if (!accessToken || !refreshToken) {
          throw new Error('Auth callback is missing the session tokens.');
        }

        const { error: sessionError } = await supabase.auth.setSession({
          access_token: accessToken,
          refresh_token: refreshToken,
        });

        if (sessionError) {
          throw sessionError;
        }

        if (!cancelled) {
          setState('done');
          router.replace('/');
        }
      } catch (nextError) {
        if (cancelled) {
          return;
        }

        captureError(nextError, { action: 'auth_callback' });
        setError(nextError instanceof Error ? nextError.message : 'Could not finish sign-in.');
        setState('error');
      }
    }

    void applyCallback();

    return () => {
      cancelled = true;
    };
  }, []);

  return { state, error };
}
