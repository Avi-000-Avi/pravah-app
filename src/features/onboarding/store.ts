/**
 * Onboarding v2 data store — non-persisted in-memory state.
 *
 * Holds all answers from the 7-screen onboarding flow.
 * Persisting is handled by the auth store (`isOnboarded` flag in MMKV).
 * This store is cleared after onboarding completes.
 */

import { create } from 'zustand';

export type OBGoal = 'build_muscle' | 'lose_fat' | 'improve_fitness' | 'feel_better';
export type OBSex = 'Male' | 'Female' | 'Prefer not to say';
export type OBActivityLevel = 'lightly_active' | 'moderately_active' | 'very_active';
export type OBTrainingLocation = 'gym' | 'home' | 'outdoors' | 'mix';

export interface OBData {
  goal: OBGoal | null;
  age: string;
  height: string;
  weight: string;
  sex: OBSex | null;
  sessionsPerWeek: number;
  activityLevel: OBActivityLevel | null;
  dietaryTags: string[];
  trainingLocation: OBTrainingLocation | null;
  notifications: {
    mealReminders: boolean;
    workoutPrompt: boolean;
    weeklyProgress: boolean;
    socialKudos: boolean;
  };
}

interface OBStore extends OBData {
  setField: <K extends keyof OBData>(key: K, value: OBData[K]) => void;
  toggleDietaryTag: (tag: string) => void;
  reset: () => void;
}

const INITIAL: OBData = {
  goal: null,
  age: '',
  height: '',
  weight: '',
  sex: null,
  sessionsPerWeek: 4,
  activityLevel: null,
  dietaryTags: [],
  trainingLocation: null,
  notifications: {
    mealReminders: true,
    workoutPrompt: true,
    weeklyProgress: true,
    socialKudos: false,
  },
};

export const useOBStore = create<OBStore>((set) => ({
  ...INITIAL,
  setField: (key, value) => set({ [key]: value } as Partial<OBStore>),
  toggleDietaryTag: (tag) =>
    set((state) => ({
      dietaryTags: state.dietaryTags.includes(tag)
        ? state.dietaryTags.filter((t) => t !== tag)
        : [...state.dietaryTags, tag],
    })),
  reset: () => set(INITIAL),
}));
