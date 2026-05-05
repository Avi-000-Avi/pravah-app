import { router } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { OBShell } from '@/components/onboarding/OBShell';
import { useOBStore } from '@/features/onboarding/store';
import { ob } from '@/features/onboarding/theme';
import type { OBGoal } from '@/features/onboarding/store';

const GOALS: { value: OBGoal; title: string; sub: string }[] = [
  {
    value: 'build_muscle',
    title: 'Build muscle',
    sub: 'Progressive overload, volume, and structural growth.',
  },
  { value: 'lose_fat', title: 'Lose fat', sub: 'Sustainable deficit with muscle preservation.' },
  {
    value: 'improve_fitness',
    title: 'Improve fitness',
    sub: 'Endurance-based conditioning and stamina.',
  },
  {
    value: 'feel_better',
    title: 'Feel better',
    sub: 'Sleep, stress, and energy — recovery first.',
  },
];

export default function Step1Goal() {
  const goal = useOBStore((s) => s.goal);
  const setField = useOBStore((s) => s.setField);

  return (
    <OBShell
      step={1}
      stepLabel="Step 01 / Primary Directive"
      titleLine1="What is your"
      titleLine2="intention?"
      desc="One goal shapes everything. You can evolve it later."
      navActionLabel="Exit"
      onNavAction={() => router.replace('/(onboarding)/welcome')}
      ctaLabel="Continue"
      ctaDisabled={goal === null}
      onCta={() => router.push('/(onboarding)/step-2')}
    >
      <View style={styles.card}>
        {GOALS.map((g, idx) => {
          const selected = goal === g.value;
          return (
            <Pressable
              key={g.value}
              style={[
                styles.radioRow,
                selected && styles.radioRowSelected,
                idx < GOALS.length - 1 && styles.radioRowBorder,
              ]}
              onPress={() => setField('goal', g.value)}
            >
              <View style={styles.radioText}>
                <Text style={styles.radioTitle}>{g.title}</Text>
                <Text style={styles.radioSub}>{g.sub}</Text>
              </View>
              <View style={[styles.radioDot, selected && styles.radioDotOn]}>
                {selected && <View style={styles.radioDotInner} />}
              </View>
            </Pressable>
          );
        })}
      </View>
    </OBShell>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: ob.surface,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: ob.border2,
    overflow: 'hidden',
  },
  radioRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 18,
  },
  radioRowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(30,26,24,0.06)',
  },
  radioRowSelected: {
    backgroundColor: ob.rosePale,
  },
  radioText: { flex: 1, paddingRight: 12 },
  radioTitle: {
    fontFamily: ob.serif,
    fontSize: 20,
    color: ob.ink,
    letterSpacing: -0.2,
    marginBottom: 2,
  },
  radioSub: {
    fontFamily: ob.sans,
    fontSize: 12,
    color: ob.ink3,
    lineHeight: 17,
    maxWidth: 210,
  },
  radioDot: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: ob.border,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  radioDotOn: {
    backgroundColor: ob.roseDeep,
    borderColor: ob.roseDeep,
  },
  radioDotInner: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#ffffff',
  },
});
