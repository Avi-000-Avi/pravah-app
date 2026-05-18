import { useCallback, useState } from 'react';
import { track } from '@/lib/analytics';
import { captureError } from '@/lib/monitoring';
import { supabase } from '@/lib/supabase';

/**
 * Phone OTP flow (Supabase Phone Auth).
 *
 * Requires a SMS provider configured on the Supabase project
 * (Auth → Providers → Phone). v1 is locked to India: phone numbers
 * are formatted as +91XXXXXXXXXX (E.164) before being sent.
 */

export const PHONE_E164_REGEX = /^\+91\d{10}$/;

/** Format a 10-digit Indian number into E.164 (+91XXXXXXXXXX). */
export function toE164India(raw: string): string {
  const digits = raw.replace(/\D/g, '').slice(-10);
  return `+91${digits}`;
}

export function usePhoneOTP() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sendOTP = useCallback(async (phone: string): Promise<void> => {
    if (!PHONE_E164_REGEX.test(phone)) {
      const msg = 'Enter a valid 10-digit Indian mobile number.';
      setError(msg);
      throw new Error(msg);
    }
    setIsLoading(true);
    setError(null);
    try {
      const { error: sbError } = await supabase.auth.signInWithOtp({ phone });
      if (sbError) throw sbError;
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Failed to send code.';
      setError(msg);
      captureError(e, { action: 'phone_otp_send' });
      throw e;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const verifyOTP = useCallback(async (phone: string, token: string): Promise<void> => {
    if (token.length !== 6) {
      const msg = 'Enter the 6-digit code.';
      setError(msg);
      throw new Error(msg);
    }
    setIsLoading(true);
    setError(null);
    try {
      const { error: sbError } = await supabase.auth.verifyOtp({
        phone,
        token,
        type: 'sms',
      });
      if (sbError) throw sbError;
      track('sign_in', { method: 'phone' });
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Invalid code. Try again.';
      setError(msg);
      captureError(e, { action: 'phone_otp_verify' });
      throw e;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { sendOTP, verifyOTP, isLoading, error };
}
