import { Stack } from 'expo-router';
import { colors } from '@/lib/theme';

/**
 * Onboarding stack.
 * - `gestureEnabled: false` on step-1 prevents swipe-back into auth.
 * - Steps 2-4 allow swipe-back so users can edit prior answers.
 *   The in-memory `useOnboardingStore` retains selections across nav.
 */
export default function OnboardingLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: colors.bg },
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen name="step-1" options={{ gestureEnabled: false }} />
      <Stack.Screen name="step-2" options={{ gestureEnabled: true }} />
      <Stack.Screen name="step-3" options={{ gestureEnabled: true }} />
      <Stack.Screen name="step-4" options={{ gestureEnabled: true }} />
    </Stack>
  );
}
