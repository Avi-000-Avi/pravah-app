import { router } from 'expo-router';
import { useCallback, useMemo, useState } from 'react';
import { track } from '@/lib/analytics';
import { captureError } from '@/lib/monitoring';
import { supabase } from '@/lib/supabase';
import { useAuthStore } from '@/features/auth/store/authStore';
import { useOnboardingStore } from '../store';
import type { OnboardingDraft } from '../store';

export function useOnboarding() {
  const dietType = useOnboardingStore((state) => state.dietType);
  const goal = useOnboardingStore((state) => state.goal);
  const mealCount = useOnboardingStore((state) => state.mealCount);
  const prepTimeMaxMin = useOnboardingStore((state) => state.prepTimeMaxMin);
  const reset = useOnboardingStore((state) => state.reset);
  const setField = useOnboardingStore((state) => state.setField);

  const sessionUserId = useAuthStore((state) => state.session?.user?.id);
  const setOnboarded = useAuthStore((state) => state.setOnboarded);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const summary = useMemo(
    (): OnboardingDraft => ({
      dietType,
      goal,
      mealCount,
      prepTimeMaxMin,
    }),
    [dietType, goal, mealCount, prepTimeMaxMin],
  );

  const submit = useCallback(async (): Promise<void> => {
    if (
      !summary.dietType ||
      !summary.goal ||
      summary.mealCount === null ||
      summary.prepTimeMaxMin === null
    ) {
      setSubmitError('Finish each onboarding step before continuing.');
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const userId =
        sessionUserId ?? (await supabase.auth.getSession()).data.session?.user?.id ?? null;

      if (!userId) {
        throw new Error('Your session expired. Sign in again to continue.');
      }

      const { error } = await supabase.from('meal_preferences').upsert(
        {
          user_id: userId,
          diet_type: summary.dietType,
          goal: summary.goal,
          meal_count: summary.mealCount,
          prep_time_max_min: summary.prepTimeMaxMin,
        },
        { onConflict: 'user_id' },
      );

      if (error) {
        throw error;
      }

      setOnboarded(true);
      track('onboarding_completed', {
        diet_type: summary.dietType,
        goal: summary.goal,
        meal_count: summary.mealCount,
        prep_time_max_min: summary.prepTimeMaxMin,
      });
      reset();
      router.replace('/(tabs)');
    } catch (error) {
      captureError(error, { action: 'submit_onboarding' });
      setSubmitError(error instanceof Error ? error.message : "Couldn't save your preferences.");
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  }, [reset, sessionUserId, setOnboarded, summary]);

  const clearError = useCallback(() => setSubmitError(null), []);

  return {
    answers: summary,
    setField,
    isSubmitting,
    submitError,
    submit,
    clearError,
  };
}
