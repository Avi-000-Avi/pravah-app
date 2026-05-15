import { Stack } from 'expo-router';
import { onboarding } from '@/lib/theme';

/**
 * Canonical 6-step onboarding stack.
 *
 * `welcome` is the entry screen.
 * `step-1` disables the back gesture so the first committed choice feels intentional.
 * `step-2` through `step-5` allow back navigation for edits.
 * `step-6` disables the gesture while the final save CTA is shown.
 */
export default function OnboardingLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: onboarding.bg },
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
