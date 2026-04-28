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
import { supabase } from '@/lib/supabase';

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
 * Route guard: subscribes to supabase auth + the persisted onboarding flag,
 * then redirects between (auth) / (onboarding) / (tabs) based on state.
 *
 *   no session                -> /(auth)/phone
 *   session, !onboarded       -> /(onboarding)/step-1
 *   session, onboarded        -> /(tabs)
 */
function RouteGuard() {
  const router = useRouter();
  const segments = useSegments();

  const session = useAuthStore((s) => s.session);
  const isOnboarded = useAuthStore((s) => s.isOnboarded);
  const isLoading = useAuthStore((s) => s.isLoading);
  const setSession = useAuthStore((s) => s.setSession);
  const setLoading = useAuthStore((s) => s.setLoading);
  const setOnboarded = useAuthStore((s) => s.setOnboarded);
  const clearAuth = useAuthStore((s) => s.clearAuth);

  // Boot: hydrate session from supabase, then check onboarding state.
  useEffect(() => {
    let cancelled = false;
    (async () => {
      const { data } = await supabase.auth.getSession();
      if (cancelled) return;
      setSession(data.session);

      if (data.session) {
        const { data: prefs } = await supabase
          .from('meal_preferences')
          .select('user_id')
          .eq('user_id', data.session.user.id)
          .maybeSingle();
        if (!cancelled) setOnboarded(!!prefs);
      }
      setLoading(false);
      SplashScreen.hideAsync().catch(() => undefined);
    })();

    const { data: sub } = supabase.auth.onAuthStateChange(async (event, nextSession) => {
      setSession(nextSession);
      if (event === 'SIGNED_OUT') {
        clearAuth();
        return;
      }
      if (nextSession) {
        const { data: prefs } = await supabase
          .from('meal_preferences')
          .select('user_id')
          .eq('user_id', nextSession.user.id)
          .maybeSingle();
        setOnboarded(!!prefs);
      }
    });

    return () => {
      cancelled = true;
      sub.subscription.unsubscribe();
    };
  }, [setSession, setLoading, setOnboarded, clearAuth]);

  // Drive navigation off (session, isOnboarded, current segment).
  useEffect(() => {
    if (isLoading) return;
    const top = segments[0]; // '(auth)' | '(onboarding)' | '(tabs)' | undefined

    if (!session && top !== '(auth)') {
      router.replace('/(auth)/phone');
    } else if (session && !isOnboarded && top !== '(onboarding)') {
      router.replace('/(onboarding)/step-1');
    } else if (session && isOnboarded && top !== '(tabs)') {
      router.replace('/(tabs)');
    }
  }, [session, isOnboarded, isLoading, segments, router]);

  return <Slot />;
}
