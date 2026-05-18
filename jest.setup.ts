import { notifyManager } from '@tanstack/react-query';
import { act } from '@testing-library/react-native';

const mockRouter = {
  replace: jest.fn(),
  push: jest.fn(),
  back: jest.fn(),
};

const mockStorageData = new Map<string, string>();
const mockSubscription = { unsubscribe: jest.fn() };
const mockSupabase = {
  auth: {
    getSession: jest.fn(),
    signInWithPassword: jest.fn(),
    signUp: jest.fn(),
    signOut: jest.fn(),
    signInWithOtp: jest.fn(),
    verifyOtp: jest.fn(),
    signInWithOAuth: jest.fn(),
    setSession: jest.fn(),
    onAuthStateChange: jest.fn(() => ({ data: { subscription: mockSubscription } })),
  },
  functions: {
    invoke: jest.fn(),
  },
  from: jest.fn(),
};

jest.mock('expo-router', () => ({
  router: mockRouter,
  useRouter: () => mockRouter,
  useSegments: () => [],
}));

jest.mock('expo-linking', () => ({
  createURL: jest.fn((path = '') => `pravah://${path}`),
  getInitialURL: jest.fn(async () => 'pravah://auth-callback'),
}));

jest.mock('@/lib/analytics', () => ({
  initAnalytics: jest.fn(),
  track: jest.fn(),
  identify: jest.fn(),
  resetAnalytics: jest.fn(),
}));

jest.mock('@/lib/monitoring', () => ({
  initMonitoring: jest.fn(),
  captureError: jest.fn(),
  captureMessage: jest.fn(),
}));

jest.mock('@/lib/storage', () => ({
  storage: {
    getString: jest.fn((key: string) => mockStorageData.get(key)),
    set: jest.fn((key: string, value: string) => {
      mockStorageData.set(key, value);
    }),
    remove: jest.fn((key: string) => {
      mockStorageData.delete(key);
    }),
  },
}));

jest.mock('@/lib/supabase', () => ({
  supabase: mockSupabase,
}));

notifyManager.setNotifyFunction((callback) => {
  act(() => {
    callback();
  });
});
