import * as Linking from 'expo-linking';
import { useCallback, useState } from 'react';
import { track } from '@/lib/analytics';
import { captureError } from '@/lib/monitoring';
import { supabase } from '@/lib/supabase';

/**
 * Email + password auth.
 *
 * Uses Supabase's built-in Email provider, which is enabled by default
 * on every project. Phone OTP is the long-term plan; email keeps us
 * unblocked until SMS is configured.
 *
 * Behaviour:
 *   - `signIn(email, password)` → signInWithPassword
 *   - `signUp(email, password)` → signUp; if "Confirm email" is on in
 *      Supabase Auth settings, no session is returned and the user
 *      must click the link in the verification email before they can
 *      sign in. Hook surfaces `pendingConfirmation: true` for that case.
 *   - Validation: minimum 8-char password, basic email regex.
 */

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MIN_PASSWORD_LENGTH = 8;

export function useEmailAuth() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pendingConfirmation, setPendingConfirmation] = useState(false);

  const validate = useCallback((email: string, password: string): string | null => {
    if (!EMAIL_REGEX.test(email.trim())) return "That doesn't look like a valid email.";
    if (password.length < MIN_PASSWORD_LENGTH) {
      return `Password must be at least ${MIN_PASSWORD_LENGTH} characters.`;
    }
    return null;
  }, []);

  const signIn = useCallback(
    async (email: string, password: string): Promise<void> => {
      const validationError = validate(email, password);
      if (validationError) {
        setError(validationError);
        throw new Error(validationError);
      }
      setIsLoading(true);
      setError(null);
      setPendingConfirmation(false);
      try {
        const { error: sbError } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password,
        });
        if (sbError) throw sbError;
        track('sign_in', { method: 'email' });
        // Route guard handles redirect once session lands.
      } catch (e) {
        const msg = e instanceof Error ? e.message : "Couldn't sign in.";
        setError(msg);
        captureError(e, { action: 'email_sign_in' });
        throw e;
      } finally {
        setIsLoading(false);
      }
    },
    [validate],
  );

  const signUp = useCallback(
    async (email: string, password: string): Promise<void> => {
      const validationError = validate(email, password);
      if (validationError) {
        setError(validationError);
        throw new Error(validationError);
      }
      setIsLoading(true);
      setError(null);
      setPendingConfirmation(false);
      try {
        const { data, error: sbError } = await supabase.auth.signUp({
          email: email.trim(),
          password,
          options: {
            emailRedirectTo: Linking.createURL('auth-callback'),
          },
        });
        if (sbError) throw sbError;
        track('sign_up', { method: 'email' });

        // When "Confirm email" is enabled, signUp returns a user but no session.
        // The user must click the verification link before they can sign in.
        if (data.user && !data.session) {
          setPendingConfirmation(true);
        }
      } catch (e) {
        const msg = e instanceof Error ? e.message : "Couldn't create your account.";
        setError(msg);
        captureError(e, { action: 'email_sign_up' });
        throw e;
      } finally {
        setIsLoading(false);
      }
    },
    [validate],
  );

  const clearError = useCallback(() => {
    setError(null);
    setPendingConfirmation(false);
  }, []);

  return { signIn, signUp, isLoading, error, pendingConfirmation, clearError };
}
