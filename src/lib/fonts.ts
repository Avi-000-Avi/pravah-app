/**
 * Pravah font loading.
 *
 * Loads the brand families used in the design system. Hook returns
 * `loaded` so the root layout can hold the splash screen until fonts
 * are ready (prevents the FOUT of system fonts swapping to brand).
 */

import { useFonts as useExpoFonts } from 'expo-font';
import { Syne_400Regular, Syne_700Bold } from '@expo-google-fonts/syne';
import { Urbanist_600SemiBold, Urbanist_700Bold } from '@expo-google-fonts/urbanist';
import {
  OpenSans_400Regular,
  OpenSans_600SemiBold,
  OpenSans_700Bold,
} from '@expo-google-fonts/open-sans';
import { PlusJakartaSans_600SemiBold } from '@expo-google-fonts/plus-jakarta-sans';
import { Inter_700Bold } from '@expo-google-fonts/inter';

export function usePravahFonts(): boolean {
  const [loaded] = useExpoFonts({
    Syne_400Regular,
    Syne_700Bold,
    Urbanist_600SemiBold,
    Urbanist_700Bold,
    OpenSans_400Regular,
    OpenSans_600SemiBold,
    OpenSans_700Bold,
    PlusJakartaSans_600SemiBold,
    Inter_700Bold,
  });
  return loaded;
}
