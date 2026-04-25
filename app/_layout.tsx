import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Stack } from 'expo-router';
import { useEffect } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { initAnalytics } from '@/lib/analytics';
import { initMonitoring } from '@/lib/monitoring';

const queryClient = new QueryClient();

export default function RootLayout() {
  useEffect(() => {
    initMonitoring();
    initAnalytics();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <SafeAreaProvider>
        <Stack screenOptions={{ headerShown: false }} />
      </SafeAreaProvider>
    </QueryClientProvider>
  );
}
