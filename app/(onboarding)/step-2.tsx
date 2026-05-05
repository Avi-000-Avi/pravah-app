import { router } from 'expo-router';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { OBShell } from '@/components/onboarding/OBShell';
import { useOBStore } from '@/features/onboarding/store';
import { ob } from '@/features/onboarding/theme';
import type { OBSex } from '@/features/onboarding/store';

const SEX_OPTIONS: OBSex[] = ['Male', 'Female', 'Prefer not to say'];

export default function Step2Body() {
  const { age, height, weight, sex, setField } = useOBStore();

  const canContinue = age.length > 0 && height.length > 0 && weight.length > 0 && sex !== null;

  return (
    <OBShell
      step={2}
      stepLabel="Step 02 / Baseline"
      titleLine1="Your body,"
      titleLine2="calibrated."
      desc="Used only to calculate targets. Never shared, never sold."
      navActionLabel="Back"
      onNavAction={() => router.back()}
      ctaLabel="Continue"
      ctaDisabled={!canContinue}
      onCta={() => router.push('/(onboarding)/step-3')}
    >
      {/* Input fields */}
      <View style={styles.fieldCard}>
        <View style={[styles.fieldRow, styles.fieldRowBorder]}>
          <Text style={styles.fieldLbl}>Age</Text>
          <TextInput
            style={styles.fieldInp}
            value={age}
            onChangeText={(v) => setField('age', v)}
            placeholder="28"
            placeholderTextColor={ob.ink3 + '80'}
            keyboardType="number-pad"
            returnKeyType="next"
          />
          <Text style={styles.fieldUnit}>yrs</Text>
        </View>
        <View style={[styles.fieldRow, styles.fieldRowBorder]}>
          <Text style={styles.fieldLbl}>Height</Text>
          <TextInput
            style={styles.fieldInp}
            value={height}
            onChangeText={(v) => setField('height', v)}
            placeholder="175"
            placeholderTextColor={ob.ink3 + '80'}
            keyboardType="number-pad"
            returnKeyType="next"
          />
          <Text style={styles.fieldUnit}>cm</Text>
        </View>
        <View style={styles.fieldRow}>
          <Text style={styles.fieldLbl}>Weight</Text>
          <TextInput
            style={styles.fieldInp}
            value={weight}
            onChangeText={(v) => setField('weight', v)}
            placeholder="72"
            placeholderTextColor={ob.ink3 + '80'}
            keyboardType="decimal-pad"
            returnKeyType="done"
          />
          <Text style={styles.fieldUnit}>kg</Text>
        </View>
      </View>

      {/* Sex selector */}
      <Text style={styles.sectionLabel}>Biological sex</Text>
      <View style={styles.sexRow}>
        {SEX_OPTIONS.map((opt) => {
          const selected = sex === opt;
          return (
            <Pressable
              key={opt}
              style={[styles.sexPill, selected && styles.sexPillSelected]}
              onPress={() => setField('sex', opt)}
            >
              <Text style={[styles.sexPillText, selected && styles.sexPillTextSelected]}>
                {opt}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </OBShell>
  );
}

const styles = StyleSheet.create({
  fieldCard: {
    backgroundColor: ob.surface,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: ob.border2,
    overflow: 'hidden',
    marginBottom: 8,
  },
  fieldRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    gap: 12,
  },
  fieldRowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(30,26,24,0.06)',
  },
  fieldLbl: {
    fontFamily: ob.sansMedium,
    fontSize: 11,
    letterSpacing: 0.6,
    textTransform: 'uppercase',
    color: ob.ink3,
    width: 64,
    flexShrink: 0,
  },
  fieldInp: {
    flex: 1,
    fontFamily: ob.serif,
    fontSize: 22,
    color: ob.ink,
    letterSpacing: -0.2,
    padding: 0,
  },
  fieldUnit: {
    fontFamily: ob.sansRegular,
    fontSize: 11,
    color: ob.ink3,
  },

  sectionLabel: {
    fontFamily: ob.sansMedium,
    fontSize: 9,
    letterSpacing: 1.3,
    textTransform: 'uppercase',
    color: ob.ink3,
    marginTop: 20,
    marginBottom: 10,
  },
  sexRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 8,
  },
  sexPill: {
    flex: 1,
    paddingVertical: 14,
    alignItems: 'center',
    backgroundColor: ob.surface,
    borderWidth: 1,
    borderColor: ob.border2,
    borderRadius: 14,
  },
  sexPillSelected: {
    backgroundColor: ob.rosePale,
    borderColor: ob.roseDeep,
  },
  sexPillText: {
    fontFamily: ob.serif,
    fontSize: 16,
    color: ob.ink,
  },
  sexPillTextSelected: {
    color: ob.roseDeep,
  },
});
