export type ProtectedRoute = '/(auth)/email' | '/(onboarding)/welcome' | '/(tabs)';

interface ResolveProtectedRouteInput {
  currentTop: string | undefined;
  hasSession: boolean;
  isOnboarded: boolean;
}

export function resolveProtectedRoute({
  currentTop,
  hasSession,
  isOnboarded,
}: ResolveProtectedRouteInput): ProtectedRoute | null {
  if (currentTop === 'auth-callback') {
    return null;
  }

  if (!hasSession) {
    return currentTop === '(auth)' ? null : '/(auth)/email';
  }

  if (!isOnboarded) {
    return currentTop === '(onboarding)' ? null : '/(onboarding)/welcome';
  }

  return currentTop === '(tabs)' ? null : '/(tabs)';
}
