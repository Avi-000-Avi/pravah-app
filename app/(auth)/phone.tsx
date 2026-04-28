import { Feather } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { GhostButton } from '@/components/GhostButton';
import { PrimaryButton } from '@/components/PrimaryButton';
import { useGoogleSSO, usePhoneOTP, toE164India } from '@/features/auth';
import { colors, fonts, radii, typography } from '@/lib/theme';

export default function PhoneScreen() {
  const insets = useSafeAreaInsets();
  const [digits, setDigits] = useState('');
  const { sendOTP, isLoading: otpLoading, error: otpError } = usePhoneOTP();
  const { signInWithGoogle, isLoading: ssoLoading, error: ssoError } = useGoogleSSO();

  const valid = digits.length === 10;
  const error = otpError ?? ssoError;

  async function onContinue() {
    const phone = toE164India(digits);
    try {
      await sendOTP(phone);
      router.push({ pathname: '/(auth)/otp', params: { phone } });
    } catch {
      /* error already surfaced via otpError */
    }
  }

  async function onGoogle() {
    try {
      await signInWithGoogle();
      // Route guard in app/_layout.tsx will handle redirect once session lands.
    } catch {
      /* error already surfaced via ssoError */
    }
  }

  return (
    <KeyboardAvoidingView
      style={styles.screen}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={[styles.body, { paddingTop: insets.top + 48 }]}>
        {/* Wordmark */}
        <Text style={styles.wordmark}>pravah</Text>
        <Text style={styles.tagline}>Conscious living, one meal at a time.</Text>

        {/* Phone input */}
        <Text style={styles.label}>Enter your mobile number</Text>
        <View style={styles.inputRow}>
          <View style={styles.cc}>
            <Text style={styles.ccFlag}>🇮🇳</Text>
            <Text style={styles.ccText}>+91</Text>
          </View>
          <TextInput
            value={digits}
            onChangeText={(v) => setDigits(v.replace(/\D/g, '').slice(0, 10))}
            placeholder="98765 43210"
            placeholderTextColor={colors.text.muted}
            keyboardType="number-pad"
            style={styles.input}
            autoFocus
            maxLength={10}
          />
        </View>
        {error ? <Text style={styles.error}>{error}</Text> : null}

        {/* Primary CTA */}
        <PrimaryButton
          label={otpLoading ? 'Sending code…' : 'Continue'}
          onPress={onContinue}
          disabled={!valid || otpLoading}
          style={[styles.cta, (!valid || otpLoading) && styles.ctaDisabled]}
        />

        {/* Divider */}
        <View style={styles.dividerRow}>
          <View style={styles.divider} />
          <Text style={styles.dividerText}>or</Text>
          <View style={styles.divider} />
        </View>

        {/* Google SSO */}
        <Pressable
          onPress={onGoogle}
          disabled={ssoLoading}
          style={[styles.googleBtn, ssoLoading && styles.ctaDisabled]}
        >
          <Feather name="chrome" size={18} color={colors.text.primary} />
          <Text style={styles.googleText}>
            {ssoLoading ? 'Opening Google…' : 'Continue with Google'}
          </Text>
        </Pressable>

        <View style={{ flex: 1 }} />

        <Text style={styles.legal}>By continuing you agree to our terms and privacy policy.</Text>
      </View>
    </KeyboardAvoidingView>
  );
}

// Re-export the secondary GhostButton import to keep TS happy if unused.
void GhostButton;

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bg },
  body: { flex: 1, paddingHorizontal: 24 },
  wordmark: {
    fontFamily: fonts.display,
    fontSize: typography.size['3xl'],
    color: colors.text.deep,
    letterSpacing: typography.size['3xl'] * typography.tracking.tight,
  },
  tagline: {
    fontFamily: fonts.body,
    fontSize: typography.size.base,
    color: colors.text.muted,
    marginTop: 6,
    marginBottom: 40,
  },
  label: {
    fontFamily: fonts.label,
    fontSize: typography.size.xs,
    color: colors.text.muted,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
    marginBottom: 8,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: radii.card,
    paddingHorizontal: 12,
    paddingVertical: 4,
    gap: 8,
  },
  cc: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 8,
    paddingVertical: 12,
    borderRightWidth: StyleSheet.hairlineWidth,
    borderRightColor: colors.gray[200],
  },
  ccFlag: { fontSize: 18 },
  ccText: {
    fontFamily: fonts.ui,
    fontSize: typography.size.base,
    color: colors.text.primary,
  },
  input: {
    flex: 1,
    fontFamily: fonts.ui,
    fontSize: typography.size.lg,
    color: colors.text.primary,
    paddingVertical: 14,
    letterSpacing: 1,
  },
  error: {
    fontFamily: fonts.body,
    fontSize: typography.size.sm,
    color: colors.rose,
    marginTop: 8,
  },
  cta: { alignSelf: 'stretch', justifyContent: 'center', marginTop: 24 },
  ctaDisabled: { opacity: 0.45 },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginVertical: 24,
  },
  divider: { flex: 1, height: StyleSheet.hairlineWidth, backgroundColor: colors.gray[300] },
  dividerText: {
    fontFamily: fonts.body,
    fontSize: typography.size.sm,
    color: colors.text.muted,
  },
  googleBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: colors.surface,
    borderRadius: radii.pill,
    paddingVertical: 14,
    paddingHorizontal: 22,
    borderWidth: 1,
    borderColor: colors.gray[200],
  },
  googleText: {
    fontFamily: fonts.ui,
    fontSize: typography.size.base,
    color: colors.text.primary,
  },
  legal: {
    fontFamily: fonts.body,
    fontSize: typography.size.sm,
    color: colors.text.muted,
    textAlign: 'center',
    marginBottom: 24,
  },
});
