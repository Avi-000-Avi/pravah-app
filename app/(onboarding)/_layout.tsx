import { Stack } from 'expo-router';
import { ob } from '@/features/onboarding/theme';

/**
 * Onboarding v2 stack.
 *
 * welcome  — splash, no back gesture (entry point).
 * step-1   — goal selection, no back gesture (prevents swipe back to welcome).
 * step-2-6 — allow back gesture so users can edit prior answers.
 *
 * The in-memory `useOBStore` retains answers across navigation.
 */
export default function OnboardingLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: ob.bg },
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen name="welcome" options={{ gestureEnabled: false }} />
      <Stack.Screen name="step-1" options={{ gestureEnabled: false }} />
      <Stack.Screen name="step-2" options={{ gestureEnabled: true }} />
      <Stack.Screen name="step-3" options={{ gestureEnabled: true }} />
      <Stack.Screen name="step-4" options={{ gestureEnabled: true }} />
      <Stack.Screen name="step-5" options={{ gestureEnabled: true }} />
      <Stack.Screen name="step-6" options={{ gestureEnabled: false }} />
    </Stack>
  );
}
