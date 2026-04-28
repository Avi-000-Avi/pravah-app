export { useOnboarding } from './hooks/useOnboarding';
export { usePreferences } from './hooks/usePreferences';
export type { Preferences } from './hooks/usePreferences';
export { useOnboardingStore, INITIAL } from './store/onboardingStore';
export type { OnboardingState } from './store/onboardingStore';
export type {
  CookingMode,
  DietType,
  FitnessGoal,
  MealPreferencesRow,
  OnboardingDraft,
} from './types/preferences.types';
