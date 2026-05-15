/**
 * Pravah shared app state — cross-screen reactive data.
 *
 * All fields are in-memory (Zustand, no persistence). This store
 * represents the "live session" state: meals logged today, workout
 * progress, sleep hours, recovery score, etc.
 *
 * Mutated by: Today, Meals, Workout, Recovery screens.
 * Read by: all screens + the Today "Next Action" logic.
 */
import { create } from 'zustand';

export type WorkoutStatus = 'pending' | 'completed';

interface TodayState {
  progress: number; // 0–100 overall day progress
  meals: { total: number; done: number };
  workout: { status: WorkoutStatus; name: string; durationMin: number };
  sleep: number; // hours
  recoveryScore: number; // 0–100
}

interface UserState {
  name: string;
  streak: number;
}

interface AppState {
  user: UserState;
  today: TodayState;

  // Mutators
  setMealLogged: () => void;
  setWorkoutDone: () => void;
  setWorkoutSelection: (workout: { name: string; durationMin: number }) => void;
  bumpProgress: (by?: number) => void;
  resetDay: () => void;
}

const DEFAULT_TODAY: TodayState = {
  progress: 38,
  meals: { total: 4, done: 1 },
  workout: { status: 'pending', name: 'Upper Body Strength', durationMin: 45 },
  sleep: 5.2,
  recoveryScore: 68,
};

export const useAppStore = create<AppState>((set) => ({
  user: { name: 'Avinash', streak: 6 },
  today: { ...DEFAULT_TODAY },

  setMealLogged: () =>
    set((s) => ({
      today: {
        ...s.today,
        meals: {
          ...s.today.meals,
          done: Math.min(s.today.meals.total, s.today.meals.done + 1),
        },
        progress: Math.min(100, s.today.progress + 8),
      },
    })),

  setWorkoutDone: () =>
    set((s) => ({
      today: {
        ...s.today,
        workout: { ...s.today.workout, status: 'completed' },
        progress: Math.min(100, s.today.progress + 20),
      },
    })),

  setWorkoutSelection: (workout) =>
    set((s) => ({
      today: {
        ...s.today,
        workout: {
          ...s.today.workout,
          ...workout,
          status: 'pending',
        },
      },
    })),

  bumpProgress: (by = 6) =>
    set((s) => ({
      today: { ...s.today, progress: Math.min(100, s.today.progress + by) },
    })),

  resetDay: () =>
    set(() => ({
      today: { ...DEFAULT_TODAY },
    })),
}));
