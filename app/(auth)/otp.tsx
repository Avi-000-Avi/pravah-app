import { Feather } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import {
  Animated,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { PrimaryButton } from '@/components/PrimaryButton';
import { usePhoneOTP } from '@/features/auth';
import { colors, fonts, radii, typography } from '@/lib/theme';

const OTP_LENGTH = 6;
const RESEND_SECONDS = 60;

export default function OtpScreen() {
  const insets = useSafeAreaInsets();
  const { phone } = useLocalSearchParams<{ phone: string }>();
  const { sendOTP, verifyOTP, isLoading, error } = usePhoneOTP();

  const [digits, setDigits] = useState<string[]>(Array(OTP_LENGTH).fill(''));
  const [seconds, setSeconds] = useState(RESEND_SECONDS);
  const inputs = useRef<(TextInput | null)[]>([]);
  const shake = useRef(new Animated.Value(0)).current;

  // Resend countdown
  useEffect(() => {
    if (seconds <= 0) return;
    const t = setTimeout(() => setSeconds((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [seconds]);

  // Auto-verify on full code
  const code = digits.join('');
  useEffect(() => {
    if (code.length === OTP_LENGTH && phone) onVerify(code);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [code, phone]);

  function setDigit(idx: number, raw: string) {
    const ch = raw.replace(/\D/g, '').slice(-1);
    setDigits((prev) => {
      const next = [...prev];
      next[idx] = ch;
      return next;
    });
    if (ch && idx < OTP_LENGTH - 1) inputs.current[idx + 1]?.focus();
  }

  function onKeyPress(idx: number, key: string) {
    if (key === 'Backspace' && !digits[idx] && idx > 0) {
      inputs.current[idx - 1]?.focus();
    }
  }

  async function onVerify(token: string) {
    if (!phone) return;
    try {
      await verifyOTP(phone, token);
      // Route guard handles the redirect once the session updates.
    } catch {
      shakeAndClear();
    }
  }

  function shakeAndClear() {
    Animated.sequence([
      Animated.timing(shake, { toValue: 8, duration: 50, useNativeDriver: true }),
      Animated.timing(shake, { toValue: -8, duration: 50, useNativeDriver: true }),
      Animated.timing(shake, { toValue: 8, duration: 50, useNativeDriver: true }),
      Animated.timing(shake, { toValue: 0, duration: 50, useNativeDriver: true }),
    ]).start();
    setDigits(Array(OTP_LENGTH).fill(''));
    inputs.current[0]?.focus();
  }

  async function onResend() {
    if (!phone || seconds > 0) return;
    try {
      await sendOTP(phone);
      setSeconds(RESEND_SECONDS);
      setDigits(Array(OTP_LENGTH).fill(''));
      inputs.current[0]?.focus();
    } catch {
      /* noop — error rendered below */
    }
  }

  return (
    <KeyboardAvoidingView
      style={styles.screen}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={[styles.body, { paddingTop: insets.top + 16 }]}>
        <Pressable onPress={() => router.back()} hitSlop={12} style={styles.backBtn}>
          <Feather name="chevron-left" size={24} color={colors.text.primary} />
        </Pressable>

        <Text style={styles.title}>Enter the 6-digit code</Text>
        <Text style={styles.sub}>We sent it to {phone ?? 'your number'}.</Text>

        <Animated.View style={[styles.boxRow, { transform: [{ translateX: shake }] }]}>
          {digits.map((d, i) => (
            <TextInput
              key={i}
              ref={(r) => {
                inputs.current[i] = r;
              }}
              value={d}
              onChangeText={(v) => setDigit(i, v)}
              onKeyPress={(e) => onKeyPress(i, e.nativeEvent.key)}
              keyboardType="number-pad"
              maxLength={1}
              style={[styles.box, d && styles.boxFilled]}
              autoFocus={i === 0}
              textContentType="oneTimeCode"
            />
          ))}
        </Animated.View>

        {error ? <Text style={styles.error}>{error}</Text> : null}

        <PrimaryButton
          label={isLoading ? 'Verifying…' : 'Verify'}
          onPress={() => onVerify(code)}
          disabled={code.length !== OTP_LENGTH || isLoading}
          style={[styles.cta, (code.length !== OTP_LENGTH || isLoading) && styles.ctaDisabled]}
        />

        <Pressable onPress={onResend} disabled={seconds > 0} style={styles.resend}>
          <Text style={[styles.resendText, seconds === 0 && styles.resendActive]}>
            {seconds > 0 ? `Resend in ${seconds}s` : 'Resend code'}
          </Text>
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bg },
  body: { flex: 1, paddingHorizontal: 24 },
  backBtn: { width: 36, height: 36, justifyContent: 'center', marginBottom: 16 },
  title: {
    fontFamily: fonts.display,
    fontSize: typography.size['2xl'],
    color: colors.text.primary,
    letterSpacing: typography.size['2xl'] * typography.tracking.display,
    marginTop: 16,
  },
  sub: {
    fontFamily: fonts.body,
    fontSize: typography.size.base,
    color: colors.text.muted,
    marginTop: 6,
    marginBottom: 32,
  },
  boxRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
    marginBottom: 8,
  },
  box: {
    flex: 1,
    aspectRatio: 1,
    backgroundColor: colors.surface,
    borderRadius: radii.card,
    fontFamily: fonts.ui,
    fontSize: typography.size['2xl'],
    color: colors.text.primary,
    textAlign: 'center',
    borderWidth: 1.5,
    borderColor: 'transparent',
  },
  boxFilled: { borderColor: colors.text.primary },
  error: {
    fontFamily: fonts.body,
    fontSize: typography.size.sm,
    color: colors.rose,
    marginTop: 8,
  },
  cta: { alignSelf: 'stretch', justifyContent: 'center', marginTop: 24 },
  ctaDisabled: { opacity: 0.45 },
  resend: { alignSelf: 'center', marginTop: 24, padding: 8 },
  resendText: {
    fontFamily: fonts.body,
    fontSize: typography.size.base,
    color: colors.text.muted,
  },
  resendActive: { color: colors.text.primary },
});
