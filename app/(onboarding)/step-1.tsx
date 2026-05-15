import { router } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { DIET_OPTIONS, OnboardingShell, useOnboardingStore } from '@/features/onboarding';
import { fonts, onboarding } from '@/lib/theme';

export default function Step1Diet() {
  const dietType = useOnboardingStore((state) => state.dietType);
  const setField = useOnboardingStore((state) => state.setField);

  return (
    <OnboardingShell
      step={1}
      stepLabel="Step 01 / Food style"
      titleLine1="Meals that fit"
      titleLine2="your plate."
      desc="Choose the pattern you actually follow so every recommendation feels native from day one."
      navActionLabel="Exit"
      onNavAction={() => router.replace('/(onboarding)/welcome')}
      ctaLabel="Continue"
      ctaDisabled={dietType === null}
      onCta={() => router.push('/(onboarding)/step-2')}
    >
      <View style={styles.card}>
        {DIET_OPTIONS.map((option, index) => {
          const selected = dietType === option.value;

          return (
            <Pressable
              key={option.value}
              style={[
                styles.row,
                selected && styles.rowSelected,
                index < DIET_OPTIONS.length - 1 && styles.rowBorder,
              ]}
              onPress={() => setField('dietType', option.value)}
            >
              <View style={styles.textWrap}>
                <Text style={styles.title}>{option.title}</Text>
                <Text style={styles.sub}>{option.sub}</Text>
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
