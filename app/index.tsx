import { Redirect } from 'expo-router';

/**
 * Root entry — redirect into the tab navigator.
 * Auth/onboarding gating will be added once the auth feature lands.
 */
export default function Index() {
  return <Redirect href="/(tabs)" />;
}
