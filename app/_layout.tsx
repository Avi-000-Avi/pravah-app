import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { initAnalytics } from '@/lib/analytics';
import { usePravahFonts } from '@/lib/fonts';
import { initMonitoring } from '@/lib/monitoring';
import { colors } from '@/lib/theme';

const queryClient = new QueryClient();

// Hold splash until brand fonts load — avoids the FOUT of system
// fonts swapping to Syne/Urbanist after first paint.
SplashScreen.preventAutoHideAsync().catch(() => undefined);

export default function RootLayout() {
  const fontsLoaded = usePravahFonts();

  useEffect(() => {
    initMonitoring();
    initAnalytics();
  }, []);

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync().catch(() => undefined);
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) return null;

  return (
    <QueryClientProvider client={queryClient}>
      <SafeAreaProvider>
        <StatusBar style="dark" />
        <Stack
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: colors.bg },
          }}
        />
      </SafeAreaProvider>
    </QueryClientProvider>
  );
}
