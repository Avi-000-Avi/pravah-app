import { router } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { OnboardingShell, PREP_TIME_OPTIONS, useOnboardingStore } from '@/features/onboarding';
import { fonts, onboarding } from '@/lib/theme';

export default function Step4PrepTime() {
  const prepTimeMaxMin = useOnboardingStore((state) => state.prepTimeMaxMin);
  const setField = useOnboardingStore((state) => state.setField);

  return (
    <OnboardingShell
      step={4}
      stepLabel="Step 04 / Prep window"
      titleLine1="How much kitchen"
      titleLine2="time feels realistic?"
      desc="We’ll bias the meal suggestions toward what you can actually cook or assemble on repeat."
      navActionLabel="Back"
      onNavAction={() => router.back()}
      ctaLabel="Continue"
      ctaDisabled={prepTimeMaxMin === null}
      onCta={() => router.push('/(onboarding)/step-5')}
    >
      <View style={styles.card}>
        {PREP_TIME_OPTIONS.map((minutes, index) => {
          const selected = prepTimeMaxMin === minutes;

          return (
            <Pressable
              key={minutes}
              style={[
                styles.row,
                selected && styles.rowSelected,
                index < PREP_TIME_OPTIONS.length - 1 && styles.rowBorder,
              ]}
              onPress={() => setField('prepTimeMaxMin', minutes)}
            >
              <View style={styles.textWrap}>
                <Text style={styles.title}>Up to {minutes} minutes</Text>
                <Text style={styles.sub}>
                  {minutes <= 15
                    ? 'Mostly quick assembly, low-friction weekday meals.'
                    : minutes <= 30
                      ? 'A balanced middle ground for most working days.'
                      : 'More room for cooked meals and batch-friendly recipes.'}
                </Text>
              </View>
              <View style={[styles.radio, selected && styles.radioOn]}>
                {selected ? <View style={styles.radioInner} /> : null}
              </View>
            </Pressable>
          );
        })}
      </View>
    </OnboardingShell>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: onboarding.surface,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: onboarding.borderSubtle,
    overflow: 'hidden',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 18,
  },
  rowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: onboarding.borderSubtle,
  },
  rowSelected: {
    backgroundColor: onboarding.accentPale,
  },
  textWrap: {
    flex: 1,
    paddingRight: 12,
  },
  title: {
    fontFamily: fonts.displayRegular,
    fontSize: 20,
    color: onboarding.accentDeep,
    letterSpacing: -0.2,
    marginBottom: 2,
  },
  sub: {
    fontFamily: fonts.body,
    fontSize: 12,
    color: onboarding.textSecondary,
    lineHeight: 17,
    maxWidth: 230,
  },
  radio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: onboarding.border,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  radioOn: {
    backgroundColor: onboarding.accentDeep,
    borderColor: onboarding.accentDeep,
  },
  radioInner: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: onboarding.heroText,
  },
});
