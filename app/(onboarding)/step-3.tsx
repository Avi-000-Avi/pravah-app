import { router } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { OBShell } from '@/components/onboarding/OBShell';
import { useOBStore } from '@/features/onboarding/store';
import { ob } from '@/features/onboarding/theme';
import type { OBActivityLevel } from '@/features/onboarding/store';

const ACTIVITY_LEVELS: { value: OBActivityLevel; title: string; sub: string }[] = [
  { value: 'lightly_active', title: 'Lightly active', sub: 'Mostly desk-based, a few sessions' },
  { value: 'moderately_active', title: 'Moderately active', sub: 'Regular movement, 3–5 sessions' },
  { value: 'very_active', title: 'Very active', sub: 'Daily training, physically demanding work' },
];

/** Macro estimates are static; in production these would be computed from body stats. */
const MACROS = { kcal: '1,840', protein: '144g', carbs: '184g', fat: '58g' };

export default function Step3Momentum() {
  const { sessionsPerWeek, activityLevel, setField } = useOBStore();

  return (
    <OBShell
      step={3}
      stepLabel="Step 03 / Weekly Momentum"
      titleLine1="Sessions you'll"
      titleLine2="actually do."
      desc="Honest consistency beats perfect plans."
      navActionLabel="Back"
      onNavAction={() => router.back()}
      ctaLabel="These look right"
      ctaDisabled={activityLevel === null}
      onCta={() => router.push('/(onboarding)/step-4')}
    >
      {/* Sessions stepper */}
      <View style={styles.stepperCard}>
        <Text style={styles.stepperQ}>How many sessions can you commit to without friction?</Text>
        <View style={styles.stepperRow}>
          <Pressable
            style={styles.stepperBtn}
            onPress={() => setField('sessionsPerWeek', Math.max(1, sessionsPerWeek - 1))}
          >
            <Text style={styles.stepperBtnText}>−</Text>
          </Pressable>
          <View style={styles.stepperCenter}>
            <Text style={styles.stepperNum}>{sessionsPerWeek}</Text>
            <Text style={styles.stepperUnit}>Sessions / week</Text>
          </View>
          <Pressable
            style={styles.stepperBtn}
            onPress={() => setField('sessionsPerWeek', Math.min(7, sessionsPerWeek + 1))}
          >
            <Text style={styles.stepperBtnText}>+</Text>
          </Pressable>
        </View>
      </View>

      {/* Activity level */}
      <Text style={styles.sectionLabel}>Activity level</Text>
      <View style={styles.card}>
        {ACTIVITY_LEVELS.map((a, idx) => {
          const selected = activityLevel === a.value;
          return (
            <Pressable
              key={a.value}
              style={[
                styles.radioRow,
                selected && styles.radioRowSelected,
                idx < ACTIVITY_LEVELS.length - 1 && styles.radioRowBorder,
              ]}
              onPress={() => setField('activityLevel', a.value)}
            >
              <View style={styles.radioText}>
                <Text style={styles.radioTitle}>{a.title}</Text>
                <Text style={styles.radioSub}>{a.sub}</Text>
              </View>
              <View style={[styles.radioDot, selected && styles.radioDotOn]}>
                {selected && <View style={styles.radioDotInner} />}
              </View>
            </Pressable>
          );
        })}
      </View>

      {/* Estimated macro targets */}
      <Text style={styles.sectionLabel}>Your estimated targets</Text>
      <View style={styles.macroCard}>
        <View style={styles.macroNums}>
          {[
            { val: MACROS.kcal, lbl: 'kcal' },
            { val: MACROS.protein, lbl: 'protein' },
            { val: MACROS.carbs, lbl: 'carbs' },
            { val: MACROS.fat, lbl: 'fat' },
          ].map((m) => (
            <View key={m.lbl} style={styles.macroNum}>
              <Text style={styles.macroVal}>{m.val}</Text>
              <Text style={styles.macroLbl}>{m.lbl}</Text>
            </View>
          ))}
        </View>
        {/* Macro bar */}
        <View style={styles.macroBar}>
          <View style={[styles.macroBarP, { flex: 35 }]} />
          <View style={[styles.macroBarC, { flex: 40 }]} />
          <View style={[styles.macroBarF, { flex: 25 }]} />
        </View>
        {/* Legend */}
        <View style={styles.macroLegend}>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: ob.roseDeep }]} />
            <Text style={styles.legendText}>Protein 35%</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: '#c4a882' }]} />
            <Text style={styles.legendText}>Carbs 40%</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: '#a8b8c4' }]} />
            <Text style={styles.legendText}>Fat 25%</Text>
          </View>
        </View>
      </View>
    </OBShell>
  );
}

const styles = StyleSheet.create({
  stepperCard: {
    backgroundColor: ob.surface,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: ob.border2,
    padding: 20,
    marginBottom: 8,
  },
  stepperQ: {
    fontFamily: ob.sans,
    fontSize: 13,
    color: ob.ink2,
    lineHeight: 20,
    marginBottom: 18,
  },
  stepperRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  stepperBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: ob.roseSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepperBtnText: {
    fontFamily: ob.sansRegular,
    fontSize: 20,
    color: ob.roseDeep,
    lineHeight: 24,
  },
  stepperCenter: { alignItems: 'center' },
  stepperNum: {
    fontFamily: ob.serif,
    fontSize: 48,
    color: ob.ink,
    letterSpacing: -1.5,
    lineHeight: 52,
  },
  stepperUnit: {
    fontFamily: ob.sansMedium,
    fontSize: 9,
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    color: ob.ink3,
    marginTop: 4,
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

  card: {
    backgroundColor: ob.surface,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: ob.border2,
    overflow: 'hidden',
    marginBottom: 8,
  },
  radioRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  radioRowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(30,26,24,0.06)',
  },
  radioRowSelected: { backgroundColor: ob.rosePale },
  radioText: { flex: 1, paddingRight: 12 },
  radioTitle: {
    fontFamily: ob.serif,
    fontSize: 16,
    color: ob.ink,
    letterSpacing: -0.1,
    marginBottom: 2,
  },
  radioSub: {
    fontFamily: ob.sans,
    fontSize: 12,
    color: ob.ink3,
    lineHeight: 17,
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

  macroCard: {
    backgroundColor: ob.surface,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: ob.border2,
    padding: 20,
    marginBottom: 8,
  },
  macroNums: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  macroNum: { alignItems: 'center' },
  macroVal: {
    fontFamily: ob.serif,
    fontSize: 26,
    color: ob.ink,
    letterSpacing: -0.5,
    lineHeight: 28,
  },
  macroLbl: {
    fontFamily: ob.sansMedium,
    fontSize: 9,
    letterSpacing: 1.0,
    textTransform: 'uppercase',
    color: ob.ink3,
    marginTop: 4,
  },
  macroBar: {
    height: 5,
    borderRadius: 3,
    flexDirection: 'row',
    overflow: 'hidden',
    backgroundColor: ob.border2,
    marginBottom: 10,
    gap: 2,
  },
  macroBarP: {
    height: '100%',
    backgroundColor: ob.roseDeep,
    borderTopLeftRadius: 3,
    borderBottomLeftRadius: 3,
  },
  macroBarC: {
    height: '100%',
    backgroundColor: '#c4a882',
  },
  macroBarF: {
    height: '100%',
    backgroundColor: '#a8b8c4',
    borderTopRightRadius: 3,
    borderBottomRightRadius: 3,
  },
  macroLegend: {
    flexDirection: 'row',
    gap: 14,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  legendDot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
  },
  legendText: {
    fontFamily: ob.sans,
    fontSize: 10,
    color: ob.ink3,
  },
});
