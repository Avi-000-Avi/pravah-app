import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Slot, useRouter, useSegments } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useAuthBootstrap } from '@/features/auth';
import { useAuthStore } from '@/features/auth/store/authStore';
import { resolveProtectedRoute } from '@/features/auth/utils/resolveProtectedRoute';
import { initAnalytics } from '@/lib/analytics';
import { usePravahFonts } from '@/lib/fonts';
import { initMonitoring } from '@/lib/monitoring';

const queryClient = new QueryClient();

// Hold splash until brand fonts AND the initial getSession() resolve.
SplashScreen.preventAutoHideAsync().catch(() => undefined);

export default function RootLayout() {
  const fontsLoaded = usePravahFonts();

  useEffect(() => {
    initMonitoring();
    initAnalytics();
  }, []);

  if (!fontsLoaded) return null;

  return (
    <QueryClientProvider client={queryClient}>
      <SafeAreaProvider>
        <StatusBar style="dark" />
        <RouteGuard />
      </SafeAreaProvider>
    </QueryClientProvider>
  );
}

function RouteGuard() {
  const router = useRouter();
  const segments = useSegments();

  useAuthBootstrap();

  const session = useAuthStore((s) => s.session);
  const isOnboarded = useAuthStore((s) => s.isOnboarded);
  const isLoading = useAuthStore((s) => s.isLoading);

  useEffect(() => {
    if (isLoading) return;
    const nextRoute = resolveProtectedRoute({
      currentTop: segments[0],
      hasSession: Boolean(session),
      isOnboarded,
    });

    if (nextRoute) {
      router.replace(nextRoute);
    }
  }, [isLoading, isOnboarded, router, segments, session]);

  return <Slot />;
}
