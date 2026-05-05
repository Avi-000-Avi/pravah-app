import { router } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ob } from '@/features/onboarding/theme';

const PILLARS = ['Nutrition', 'Training', 'Recovery', 'Community'];

/**
 * Gradient top is approximated with two layered Views:
 * - base layer: dark maroon (#3d1f1f)
 * - overlay: semi-transparent rose that fades in toward the bottom-right
 * This avoids expo-linear-gradient's native module dependency.
 */
export default function WelcomeScreen() {
  const insets = useSafeAreaInsets();

  return (
    <View style={styles.root}>
      {/* Gradient top — pure RN, no native module */}
      <View style={styles.gradientTop}>
        {/* Warm rose overlay to simulate gradient */}
        <View style={styles.gradientOverlay} />
        {/* Decorative circles */}
        <View style={styles.decor1} />
        <View style={styles.decor2} />

        <View style={[styles.gradientContent, { paddingTop: insets.top + 32 }]}>
          <Text style={styles.wordmark}>Pravah</Text>
          <Text style={styles.tagline}>configure your flow</Text>
          <View style={styles.pillars}>
            {PILLARS.map((p) => (
              <View key={p} style={styles.pillar}>
                <Text style={styles.pillarText}>{p}</Text>
              </View>
            ))}
          </View>
        </View>
      </View>

      {/* Bottom section */}
      <View style={[styles.bottom, { paddingBottom: insets.bottom + 28 }]}>
        <Text style={styles.headline}>The Zero-Decision{'\n'}System</Text>
        <Text style={styles.subtitle}>
          We handle the cognitive load.{'\n'}You focus on the movement.
        </Text>
        <Pressable style={styles.ctaBtn} onPress={() => router.push('/(onboarding)/step-1')}>
          <Text style={styles.ctaBtnText}>Begin your flow</Text>
        </Pressable>
        <Pressable style={styles.ghostBtn} onPress={() => router.push('/(onboarding)/step-1')}>
          <Text style={styles.ghostBtnText}>I already have an account</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: ob.bg },

  gradientTop: {
    flex: 1,
    backgroundColor: '#3d1f1f',
    overflow: 'hidden',
    position: 'relative',
  },
  // Semi-transparent rose layer shifted to bottom-right to simulate the gradient angle
  gradientOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: ob.rose,
    opacity: 0.45,
  },
  gradientContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 28,
    paddingBottom: 40,
  },
  decor1: {
    position: 'absolute',
    width: 400,
    height: 400,
    borderRadius: 200,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
    bottom: -160,
    right: -120,
  },
  decor2: {
    position: 'absolute',
    width: 280,
    height: 280,
    borderRadius: 140,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
    bottom: -80,
    right: -50,
  },

  wordmark: {
    fontFamily: ob.serif,
    fontSize: 52,
    color: '#ffffff',
    letterSpacing: -1.5,
    marginBottom: 8,
  },
  tagline: {
    fontFamily: ob.serifItalic,
    fontSize: 13,
    color: 'rgba(255,255,255,0.6)',
    marginBottom: 40,
  },
  pillars: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    justifyContent: 'center',
  },
  pillar: {
    backgroundColor: 'rgba(255,255,255,0.12)',
    borderRadius: 40,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
    paddingHorizontal: 14,
    paddingVertical: 7,
  },
  pillarText: {
    fontFamily: ob.sans,
    fontSize: 12,
    color: 'rgba(255,255,255,0.9)',
    letterSpacing: 0.3,
  },

  bottom: {
    backgroundColor: ob.bg,
    paddingHorizontal: 22,
    paddingTop: 22,
  },
  headline: {
    fontFamily: ob.serif,
    fontSize: 22,
    color: ob.ink,
    lineHeight: 27,
    letterSpacing: -0.2,
    marginBottom: 6,
  },
  subtitle: {
    fontFamily: ob.sans,
    fontSize: 12,
    color: ob.ink3,
    lineHeight: 20,
    marginBottom: 20,
  },
  ctaBtn: {
    backgroundColor: ob.rose,
    borderRadius: 40,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 8,
  },
  ctaBtnText: {
    fontFamily: ob.sansRegular,
    fontSize: 15,
    color: '#ffffff',
    letterSpacing: 0.3,
  },
  ghostBtn: {
    paddingVertical: 10,
    alignItems: 'center',
  },
  ghostBtnText: {
    fontFamily: ob.sans,
    fontSize: 12,
    color: ob.ink3,
    letterSpacing: 0.5,
  },
});
