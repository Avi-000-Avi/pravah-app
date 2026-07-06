import { resolveProtectedRoute } from '@/features/auth/utils/resolveProtectedRoute';

describe('resolveProtectedRoute', () => {
  it('routes signed-out users to email auth', () => {
    expect(
      resolveProtectedRoute({
        currentTop: undefined,
        hasSession: false,
        isOnboarded: false,
      }),
    ).toBe('/(auth)/email');
  });

  it('routes signed-in but not onboarded users to onboarding', () => {
    expect(
      resolveProtectedRoute({
        currentTop: '(tabs)',
        hasSession: true,
        isOnboarded: false,
      }),
    ).toBe('/(onboarding)/welcome');
  });

  it('routes fully active users to tabs', () => {
    expect(
      resolveProtectedRoute({
        currentTop: '(auth)',
        hasSession: true,
        isOnboarded: true,
      }),
    ).toBe('/(tabs)');
  });

  it('does not redirect the auth callback route', () => {
    expect(
      resolveProtectedRoute({
        currentTop: 'auth-callback',
        hasSession: false,
        isOnboarded: false,
      }),
    ).toBeNull();
  });
});
