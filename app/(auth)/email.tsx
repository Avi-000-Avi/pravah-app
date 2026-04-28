import { Feather } from '@expo/vector-icons';
import { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { PrimaryButton } from '@/components/PrimaryButton';
import { useEmailAuth, useGoogleSSO } from '@/features/auth';
import { colors, fonts, radii, typography } from '@/lib/theme';

type Mode = 'signin' | 'signup';

export default function EmailScreen() {
  const insets = useSafeAreaInsets();
  const [mode, setMode] = useState<Mode>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const {
    signIn,
    signUp,
    isLoading: emailLoading,
    error: emailError,
    pendingConfirmation,
    clearError,
  } = useEmailAuth();
  const { signInWithGoogle, isLoading: ssoLoading, error: ssoError } = useGoogleSSO();

  const valid = email.length > 0 && password.length >= 8;
  const error = emailError ?? ssoError;

  async function onContinue() {
    try {
      if (mode === 'signin') {
        await signIn(email, password);
      } else {
        await signUp(email, password);
      }
      // Route guard handles redirect once session lands.
    } catch {
      /* error already surfaced via emailError */
    }
  }

  async function onGoogle() {
    try {
      await signInWithGoogle();
    } catch {
      /* error already surfaced via ssoError */
    }
  }

  function toggleMode() {
    clearError();
    setMode((m) => (m === 'signin' ? 'signup' : 'signin'));
  }

  return (
    <KeyboardAvoidingView
      style={styles.screen}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        contentContainerStyle={[styles.body, { paddingTop: insets.top + 48 }]}
        keyboardShouldPersistTaps="handled"
      >
        {/* Wordmark */}
        <Text style={styles.wordmark}>pravah</Text>
        <Text style={styles.tagline}>Conscious living, one meal at a time.</Text>

        {/* Mode label */}
        <Text style={styles.label}>
          {mode === 'signin' ? 'Sign in to continue' : 'Create your account'}
        </Text>

        {/* Email input */}
        <View style={styles.inputRow}>
          <Feather name="mail" size={18} color={colors.text.muted} />
          <TextInput
            value={email}
            onChangeText={setEmail}
            placeholder="you@example.com"
            placeholderTextColor={colors.text.muted}
            keyboardType="email-address"
            autoCapitalize="none"
            autoComplete="email"
            autoCorrect={false}
            style={styles.input}
            autoFocus
          />
        </View>

        {/* Password input */}
        <View style={[styles.inputRow, { marginTop: 12 }]}>
          <Feather name="lock" size={18} color={colors.text.muted} />
          <TextInput
            value={password}
            onChangeText={setPassword}
            placeholder="At least 8 characters"
            placeholderTextColor={colors.text.muted}
            secureTextEntry={!showPassword}
            autoCapitalize="none"
            autoComplete={mode === 'signin' ? 'current-password' : 'new-password'}
            autoCorrect={false}
            style={styles.input}
          />
          <Pressable onPress={() => setShowPassword((v) => !v)} hitSlop={8}>
            <Feather name={showPassword ? 'eye-off' : 'eye'} size={18} color={colors.text.muted} />
          </Pressable>
        </View>

        {error ? <Text style={styles.error}>{error}</Text> : null}
        {pendingConfirmation ? (
          <Text style={styles.notice}>
            Check {email} for a confirmation link, then come back and sign in.
          </Text>
        ) : null}

        {/* Primary CTA */}
        <PrimaryButton
          label={
            emailLoading
              ? mode === 'signin'
                ? 'Signing in…'
                : 'Creating account…'
              : mode === 'signin'
                ? 'Sign in'
                : 'Sign up'
          }
          onPress={onContinue}
          disabled={!valid || emailLoading}
          style={[styles.cta, (!valid || emailLoading) && styles.ctaDisabled]}
        />

        {/* Mode toggle */}
        <Pressable onPress={toggleMode} style={styles.toggle} hitSlop={8}>
          <Text style={styles.toggleText}>
            {mode === 'signin' ? 'New here? ' : 'Have an account? '}
            <Text style={styles.toggleAction}>{mode === 'signin' ? 'Sign up' : 'Sign in'}</Text>
          </Text>
        </Pressable>

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
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bg },
  body: { flexGrow: 1, paddingHorizontal: 24, paddingBottom: 24 },
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
    marginBottom: 12,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: radii.card,
    paddingHorizontal: 16,
    gap: 12,
  },
  input: {
    flex: 1,
    fontFamily: fonts.ui,
    fontSize: typography.size.base,
    color: colors.text.primary,
    paddingVertical: 14,
  },
  error: {
    fontFamily: fonts.body,
    fontSize: typography.size.sm,
    color: colors.rose,
    marginTop: 12,
  },
  notice: {
    fontFamily: fonts.body,
    fontSize: typography.size.sm,
    color: colors.text.secondary,
    marginTop: 12,
  },
  cta: { alignSelf: 'stretch', justifyContent: 'center', marginTop: 24 },
  ctaDisabled: { opacity: 0.45 },
  toggle: { alignSelf: 'center', marginTop: 16, padding: 8 },
  toggleText: {
    fontFamily: fonts.body,
    fontSize: typography.size.sm,
    color: colors.text.muted,
  },
  toggleAction: { color: colors.text.primary, fontFamily: fonts.uiSemi },
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
    marginTop: 24,
  },
});
