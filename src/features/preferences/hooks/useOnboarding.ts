import { router } from 'expo-router';
import { useCallback, useState } from 'react';
import { useAuthStore } from '@/features/auth/store/authStore';
import { useOnboardingStore } from '../store/onboardingStore';
import type { OnboardingDraft } from '../types/preferences.types';

/**
 * Onboarding orchestration hook — auth disabled.
 *
 * Reads the user's answers from the (in-memory) draft store, exposes a
 * single `submit()` that:
 *   1. Validates required answers (diet + goal).
 *   2. Flips `isOnboarded = true` (persisted to MMKV by authStore).
 *   3. Resets the draft store and replaces navigation to /(tabs).
 *
 * Supabase upsert is skipped while auth is disabled — re-enable when
 * auth is wired back in.
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
      // Auth disabled — skip Supabase upsert, persist flag locally only.
      setOnboarded(true);
      reset();
      router.replace('/(tabs)');
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Couldn't save your preferences.";
      setSubmitError(msg);
    } finally {
      setIsSubmitting(false);
    }
  }, [dietType, goal, reset, setOnboarded]);

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
