import { View } from 'react-native';
import { colors } from '@/lib/theme';

/**
 * Root entry — renders nothing. The route guard in `app/_layout.tsx`
 * handles the redirect to `(auth)`, `(onboarding)`, or `(tabs)` based
 * on session + onboarding state.
 */
export default function Index() {
  return <View style={{ flex: 1, backgroundColor: colors.bg }} />;
}
