import { router } from 'expo-router';
import { useCallback, useState } from 'react';
import { useAuthStore } from '@/features/auth/store/authStore';
import { supabase } from '@/lib/supabase';
import { useOnboardingStore } from '../store/onboardingStore';
import type { OnboardingDraft } from '../types/preferences.types';

/**
 * Onboarding orchestration hook.
 *
 * Reads the user's answers from the (in-memory) draft store, exposes a
 * single `submit()` that:
 *   1. Validates required answers (diet + goal — meal count and prep
 *      time always have defaults).
 *   2. Upserts the row into `meal_preferences`.
 *   3. Flips `isOnboarded = true` (persisted to MMKV by authStore).
 *   4. Resets the draft store and replaces navigation to /(tabs).
 *
 * Errors are surfaced via `submitError` rather than thrown so the
 * step-4 screen can render a friendly retry without losing answers.
 */
export function useOnboarding() {
  const dietType = useOnboardingStore((s) => s.dietType);
  const goal = useOnboardingStore((s) => s.goal);
  const mealCount = useOnboardingStore((s) => s.mealCount);
  const prepTimeMaxMin = useOnboardingStore((s) => s.prepTimeMaxMin);
  const setField = useOnboardingStore((s) => s.setField);
  const reset = useOnboardingStore((s) => s.reset);

  const setOnboarded = useAuthStore((s) => s.setOnboarded);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const answers: OnboardingDraft = {
    dietType,
    goal,
    mealCount,
    prepTimeMaxMin,
  };

  const submit = useCallback(async (): Promise<void> => {
    if (!dietType || !goal) {
      setSubmitError('Pick a diet and a goal before continuing.');
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);
    try {
      const { data: userData, error: userErr } = await supabase.auth.getUser();
      if (userErr || !userData.user) {
        throw new Error('Your session expired. Sign in again to continue.');
      }

      const { error } = await supabase.from('meal_preferences').upsert(
        {
          user_id: userData.user.id,
          diet_type: dietType,
          goal,
          meal_count: mealCount,
          prep_time_max_min: prepTimeMaxMin,
        },
        { onConflict: 'user_id' },
      );
      if (error) throw error;

      setOnboarded(true);
      reset();
      router.replace('/(tabs)');
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Couldn't save your preferences.";
      setSubmitError(msg);
    } finally {
      setIsSubmitting(false);
    }
  }, [dietType, goal, mealCount, prepTimeMaxMin, reset, setOnboarded]);

  const clearError = useCallback(() => setSubmitError(null), []);

  return {
    answers,
    setField,
    isSubmitting,
    submitError,
    submit,
    clearError,
  };
}
