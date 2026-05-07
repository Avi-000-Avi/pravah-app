import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Slot, useRouter, useSegments } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useAuthStore } from '@/features/auth/store/authStore';
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

/**
 * Route guard: auth is disabled for now — the app starts directly at
 * onboarding and proceeds to tabs once onboarding is complete.
 *
 *   !onboarded  -> /(onboarding)/welcome
 *   onboarded   -> /(tabs)
 *
 * TODO: re-enable auth gate when sign-in is ready:
 *   no session                -> /(auth)/email
 *   session, !onboarded       -> /(onboarding)/welcome
 *   session, onboarded        -> /(tabs)
 */
function RouteGuard() {
  const router = useRouter();
  const segments = useSegments();

  const isOnboarded = useAuthStore((s) => s.isOnboarded);
  const isLoading = useAuthStore((s) => s.isLoading);
  const setLoading = useAuthStore((s) => s.setLoading);

  // Boot: skip session hydration, just hide the splash screen.
  useEffect(() => {
    setLoading(false);
    SplashScreen.hideAsync().catch(() => undefined);
  }, [setLoading]);

  // Drive navigation off isOnboarded only.
  useEffect(() => {
    if (isLoading) return;
    const top = segments[0]; // '(onboarding)' | '(tabs)' | undefined

    if (!isOnboarded && top !== '(onboarding)') {
      router.replace('/(onboarding)/welcome');
    } else if (isOnboarded && top !== '(tabs)') {
      router.replace('/(tabs)');
    }
  }, [isOnboarded, isLoading, segments, router]);

  return <Slot />;
}
