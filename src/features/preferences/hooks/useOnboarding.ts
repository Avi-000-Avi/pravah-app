import { create } from 'zustand';
import { supabase } from '@/lib/supabase';
import { useAuthStore } from '@/features/auth/store/authStore';
import type { OnboardingDraft } from '../types/preferences.types';

/**
 * Onboarding draft store — non-persisted. Holds the user's selections
 * across the 4-step flow so that back navigation restores prior choices.
 * Cleared on submit or sign-out.
 */
interface OnboardingState extends OnboardingDraft {
  setField: <K extends keyof OnboardingDraft>(key: K, value: OnboardingDraft[K]) => void;
  reset: () => void;
}

const INITIAL: OnboardingDraft = {
  dietType: null,
  goal: null,
  mealCount: 3,
  prepTimeMaxMin: 30,
};

const useOnboardingStore = create<OnboardingState>((set) => ({
  ...INITIAL,
  setField: (key, value) => set({ [key]: value } as Partial<OnboardingState>),
  reset: () => set(INITIAL),
}));

export function useOnboarding() {
  const draft = useOnboardingStore();
  const setOnboarded = useAuthStore((s) => s.setOnboarded);

  /**
   * Persist the draft to `meal_preferences` and flip `isOnboarded`.
   * Throws on failure so the caller can show retry UI without losing state.
   */
  const submit = async (): Promise<void> => {
    if (!draft.dietType || !draft.goal) {
      throw new Error('Missing diet type or goal — go back and select.');
    }
    const userId = (await supabase.auth.getUser()).data.user?.id;
    if (!userId) throw new Error('No authenticated user.');

    const { error } = await supabase.from('meal_preferences').upsert(
      {
        user_id: userId,
        diet_type: draft.dietType,
        goal: draft.goal,
        meal_count: draft.mealCount,
        prep_time_max_min: draft.prepTimeMaxMin,
      },
      { onConflict: 'user_id' },
    );
    if (error) throw error;

    setOnboarded(true);
    draft.reset();
  };

  return {
    draft,
    setField: draft.setField,
    submit,
  };
}
