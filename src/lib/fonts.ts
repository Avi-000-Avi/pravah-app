/**
 * Pravah font loading — Newsreader (serif) + Manrope (sans).
 *
 * Used across ALL screens: main tab screens and onboarding v2.
 * The onboarding design specifies "Pravah's existing tokens (Newsreader + Manrope)"
 * so there is no separate font set for onboarding.
 *
 * Hook returns `loaded` so the root layout can hold the splash screen
 * until fonts are ready, preventing FOUT.
 */

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
    Newsreader_400Regular,
    Newsreader_400Regular_Italic,
    Newsreader_600SemiBold,
    Manrope_200ExtraLight,
    Manrope_400Regular,
    Manrope_600SemiBold,
    Manrope_700Bold,
  });
  return loaded;
}
