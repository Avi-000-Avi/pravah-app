import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { useAuthCallback } from '@/features/auth';
import { colors, fonts, typography } from '@/lib/theme';

export default function AuthCallbackScreen() {
  const { state, error } = useAuthCallback();

  return (
    <View style={styles.screen}>
      {state === 'loading' ? (
        <>
          <ActivityIndicator color={colors.rose} size="small" />
          <Text style={styles.title}>Finishing sign-in…</Text>
          <Text style={styles.body}>Hold on while we connect your session.</Text>
        </>
      ) : (
        <>
          <Text style={styles.title}>Sign-in could not be completed</Text>
          <Text style={styles.body}>{error ?? 'Please head back and try again.'}</Text>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.bg,
    paddingHorizontal: 24,
    gap: 10,
  },
  title: {
    fontFamily: fonts.display,
    fontSize: typography.size.xl,
    color: colors.text.primary,
    textAlign: 'center',
  },
  body: {
    fontFamily: fonts.body,
    fontSize: typography.size.base,
    color: colors.text.secondary,
    textAlign: 'center',
  },
});
