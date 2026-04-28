import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { storage } from '@/lib/storage';
import type { Session } from '../types/auth.types';

/**
 * Auth state — persisted to MMKV under `auth-store`.
 *
 * Note: `session` is also persisted by the supabase-js client itself
 * (via the storage adapter in `src/lib/supabase.ts`). We mirror it here
 * so the route guard can render synchronously on cold start without
 * waiting for a network roundtrip. The single source of truth at
 * runtime remains `supabase.auth` — `setSession` is called from
 * `onAuthStateChange` to keep them aligned.
 */
interface AuthState {
  session: Session | null;
  isOnboarded: boolean;
  /** True until the initial supabase.auth.getSession() resolves. */
  isLoading: boolean;
  setSession: (session: Session | null) => void;
  setOnboarded: (val: boolean) => void;
  setLoading: (val: boolean) => void;
  clearAuth: () => void;
}

// MMKV adapter for zustand's `persist` (it expects async-style get/set/remove).
const mmkvJsonAdapter = {
  getItem: (key: string) => storage.getString(key) ?? null,
  setItem: (key: string, value: string) => {
    storage.set(key, value);
  },
  removeItem: (key: string) => {
    storage.remove(key);
  },
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      session: null,
      isOnboarded: false,
      isLoading: true,
      setSession: (session) => set({ session }),
      setOnboarded: (val) => set({ isOnboarded: val }),
      setLoading: (val) => set({ isLoading: val }),
      clearAuth: () => set({ session: null, isOnboarded: false }),
    }),
    {
      name: 'auth-store',
      storage: createJSONStorage(() => mmkvJsonAdapter),
      // Don't persist `isLoading` — it's a transient flag.
      partialize: (state) => ({
        session: state.session,
        isOnboarded: state.isOnboarded,
      }),
    },
  ),
);
