/**
 * Pravah font loading — "Serene Flow" + onboarding "Warm Serif" edition.
 *
 * Newsreader (serif) + Manrope (sans) — main tab screens.
 * Cormorant Garamond (serif) + Jost (sans) — onboarding v2 screens.
 *
 * Hook returns `loaded` so the root layout can hold the splash screen
 * until fonts are ready, preventing FOUT.
 */

import {
  CormorantGaramond_300Light,
  CormorantGaramond_300Light_Italic,
  CormorantGaramond_500Medium,
} from '@expo-google-fonts/cormorant-garamond';
import { Jost_300Light, Jost_400Regular, Jost_500Medium } from '@expo-google-fonts/jost';
import {
  Manrope_200ExtraLight,
  Manrope_400Regular,
  Manrope_600SemiBold,
  Manrope_700Bold,
} from '@expo-google-fonts/manrope';
import {
  Newsreader_400Regular,
  Newsreader_400Regular_Italic,
  Newsreader_600SemiBold,
} from '@expo-google-fonts/newsreader';
import { useFonts as useExpoFonts } from 'expo-font';

export function usePravahFonts(): boolean {
  const [loaded] = useExpoFonts({
    // Serene Flow (main app)
    Newsreader_400Regular,
    Newsreader_400Regular_Italic,
    Newsreader_600SemiBold,
    Manrope_200ExtraLight,
    Manrope_400Regular,
    Manrope_600SemiBold,
    Manrope_700Bold,
    // Warm Serif (onboarding v2)
    CormorantGaramond_300Light,
    CormorantGaramond_300Light_Italic,
    CormorantGaramond_500Medium,
    Jost_300Light,
    Jost_400Regular,
    Jost_500Medium,
  });
  return loaded;
}
