import { Stack } from 'expo-router';
import { colors } from '@/lib/theme';

export default function OnboardingLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: colors.bg },
        animation: 'slide_from_right',
        // Prevent swipe-back from skipping steps; users use the in-screen back button.
        gestureEnabled: false,
      }}
    />
  );
}
