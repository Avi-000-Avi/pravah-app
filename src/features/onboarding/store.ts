import { create } from 'zustand';
import type { DietType, FitnessGoal } from '@/features/preferences';

export interface OnboardingDraft {
  dietType: DietType | null;
  goal: FitnessGoal | null;
  mealCount: number;
  prepTimeMaxMin: number;
}

export interface OnboardingState extends OnboardingDraft {
  setField: <K extends keyof OnboardingDraft>(key: K, value: OnboardingDraft[K]) => void;
  reset: () => void;
}

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
