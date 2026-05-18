import { router } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuth } from '@/features/auth';
import { onboarding } from '@/lib/theme';
import { fonts } from '@/lib/theme';

const PILLARS = ['Nutrition', 'Training', 'Recovery', 'Consistency'];

export default function WelcomeScreen() {
  const insets = useSafeAreaInsets();
  const { signOut } = useAuth();

  return (
    <View style={styles.root}>
      <View style={styles.gradientTop}>
        <View style={styles.gradientOverlay} />
        <View style={styles.decor1} />
        <View style={styles.decor2} />

        <View style={[styles.gradientContent, { paddingTop: insets.top + 32 }]}>
          <Text style={styles.wordmark}>Pravah</Text>
          <Text style={styles.tagline}>configure your flow</Text>
          <View style={styles.pillars}>
            {PILLARS.map((pill) => (
              <View key={pill} style={styles.pillar}>
                <Text style={styles.pillarText}>{pill}</Text>
              </View>
            ))}
          </View>
        </View>
      </View>

      <View style={[styles.bottom, { paddingBottom: insets.bottom + 28 }]}>
        <Text style={styles.headline}>The zero-decision{'\n'}system</Text>
        <Text style={styles.subtitle}>
          We set your food rhythm and prep boundaries up front, then the daily decisions get
          lighter.
        </Text>
        <Pressable style={styles.ctaBtn} onPress={() => router.push('/(onboarding)/step-1')}>
          <Text style={styles.ctaBtnText}>Begin your flow</Text>
        </Pressable>
        <Pressable
          style={styles.ghostBtn}
          onPress={() => {
            void signOut();
          }}
        >
          <Text style={styles.ghostBtnText}>Use a different account</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: onboarding.bg },
  gradientTop: {
    flex: 1,
    backgroundColor: onboarding.heroBg,
    overflow: 'hidden',
    position: 'relative',
  },
  gradientOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: onboarding.heroOverlay,
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
    borderColor: onboarding.heroOutline,
    bottom: -160,
    right: -120,
  },
  decor2: {
    position: 'absolute',
    width: 280,
    height: 280,
    borderRadius: 140,
    borderWidth: 1,
    borderColor: onboarding.heroOutline,
    bottom: -80,
    right: -50,
  },
  wordmark: {
    fontFamily: fonts.displayRegular,
    fontSize: 52,
    color: onboarding.heroText,
    letterSpacing: -1.5,
    marginBottom: 8,
  },
  tagline: {
    fontFamily: fonts.displayItalic,
    fontSize: 13,
    color: onboarding.heroTextMuted,
    marginBottom: 40,
  },
  pillars: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    justifyContent: 'center',
  },
  pillar: {
    backgroundColor: onboarding.heroChip,
    borderRadius: 40,
    borderWidth: 1,
    borderColor: onboarding.heroChipBorder,
    paddingHorizontal: 14,
    paddingVertical: 7,
  },
  pillarText: {
    fontFamily: fonts.body,
    fontSize: 12,
    color: onboarding.heroTextStrong,
    letterSpacing: 0.3,
  },
  bottom: {
    backgroundColor: onboarding.bg,
    paddingHorizontal: 22,
    paddingTop: 22,
  },
  headline: {
    fontFamily: fonts.displayRegular,
    fontSize: 22,
    color: onboarding.accentDeep,
    lineHeight: 27,
    letterSpacing: -0.2,
    marginBottom: 6,
  },
  subtitle: {
    fontFamily: fonts.body,
    fontSize: 12,
    color: onboarding.textSecondary,
    lineHeight: 20,
    marginBottom: 20,
  },
  ctaBtn: {
    backgroundColor: onboarding.accent,
    borderRadius: 40,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 8,
  },
  ctaBtnText: {
    fontFamily: fonts.body,
    fontSize: 15,
    color: onboarding.heroText,
    letterSpacing: 0.3,
  },
  ghostBtn: {
    paddingVertical: 10,
    alignItems: 'center',
  },
  ghostBtnText: {
    fontFamily: fonts.body,
    fontSize: 12,
    color: onboarding.textSecondary,
    letterSpacing: 0.5,
  },
});
