import * as Linking from 'expo-linking';
import { useCallback, useState } from 'react';
import { supabase } from '@/lib/supabase';

// Lazy-load expo-web-browser so the module doesn't crash when the native
// module is absent (Expo Go). Google SSO requires a dev build; the hook
// will surface a friendly error if called in an unsupported environment.
import type * as ExpoWebBrowser from 'expo-web-browser';
let WebBrowser: typeof ExpoWebBrowser | null = null;
try {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  WebBrowser = require('expo-web-browser') as typeof ExpoWebBrowser;
} catch {
  // Native module unavailable — running in Expo Go or web.
}

/**
 * Google SSO via Supabase OAuth.
 *
 * Setup required on the Supabase dashboard:
 *   1. Auth → Providers → Google: enable, paste Google OAuth client id+secret.
 *   2. Auth → URL Configuration → Redirect URLs:
 *      add `pravah://auth-callback` (matches the scheme in app.json).
 *
 * Flow on native:
 *   1. Get the provider URL from Supabase (skipBrowserRedirect = true).
 *   2. openAuthSessionAsync hands it to the system browser; on success
 *      the OS deep-links back to `pravah://auth-callback#access_token=...`.
 *   3. Parse the URL fragment and exchange tokens via `setSession`.
 */
export function useGoogleSSO() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const signInWithGoogle = useCallback(async (): Promise<void> => {
    setIsLoading(true);
    setError(null);
    try {
      const redirectTo = Linking.createURL('auth-callback');

      if (!WebBrowser) {
        throw new Error('Google sign-in requires a dev build — not available in Expo Go.');
      }

      const { data, error: sbError } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: { redirectTo, skipBrowserRedirect: true },
      });
      if (sbError) throw sbError;
      if (!data?.url) throw new Error('No OAuth URL returned by Supabase.');

      const result = await WebBrowser.openAuthSessionAsync(data.url, redirectTo);
      if (result.type !== 'success' || !result.url) {
        throw new Error('Sign-in was cancelled.');
      }

      // Tokens are returned in the URL fragment: `#access_token=…&refresh_token=…`
      const fragment = result.url.split('#')[1] ?? '';
      const params = new URLSearchParams(fragment);
      const access_token = params.get('access_token');
      const refresh_token = params.get('refresh_token');
      if (!access_token || !refresh_token) {
        throw new Error('Auth callback missing tokens.');
      }

      const { error: setErr } = await supabase.auth.setSession({
        access_token,
        refresh_token,
      });
      if (setErr) throw setErr;
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Google sign-in failed.';
      setError(msg);
      throw e;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { signInWithGoogle, isLoading, error };
}
