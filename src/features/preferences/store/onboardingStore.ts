import { create } from 'zustand';
import type { OnboardingDraft } from '../types/preferences.types';

/**
 * Onboarding draft store — non-persisted. Holds the user's selections
 * across the 4-step flow so back navigation restores prior choices.
 * Cleared on submit success or sign-out. Lost on app kill (acceptable
 * for a 4-screen flow).
 */
export interface OnboardingState extends OnboardingDraft {
  setField: <K extends keyof OnboardingDraft>(key: K, value: OnboardingDraft[K]) => void;
  reset: () => void;
}

/** Sensible defaults — meal count + prep time get pre-selected. */
export const INITIAL: OnboardingDraft = {
  dietType: null,
  goal: null,
  mealCount: 3,
  prepTimeMaxMin: 30,
};

export const useOnboardingStore = create<OnboardingState>((set) => ({
  ...INITIAL,
  setField: (key, value) => set({ [key]: value } as Partial<OnboardingState>),
  reset: () => set(INITIAL),
}));
