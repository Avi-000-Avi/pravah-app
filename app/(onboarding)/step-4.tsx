import { router } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { OBShell } from '@/components/onboarding/OBShell';
import { useOBStore } from '@/features/onboarding/store';
import { ob } from '@/features/onboarding/theme';
import type { OBTrainingLocation } from '@/features/onboarding/store';

const DIETARY_TAGS = [
  'Vegetarian',
  'Vegan',
  'High protein',
  'Keto',
  'Mediterranean',
  'Jain',
  'Halal',
  'Gluten-free',
];

const LOCATIONS: { value: OBTrainingLocation; title: string; sub: string }[] = [
  { value: 'gym', title: 'Gym', sub: 'Full equipment access' },
  { value: 'home', title: 'Home', sub: 'Bodyweight or minimal gear' },
  { value: 'outdoors', title: 'Outdoors', sub: 'Running, parks, open space' },
  { value: 'mix', title: 'Mix', sub: 'Varies week to week' },
];

export default function Step4Fuel() {
  const { dietaryTags, trainingLocation, toggleDietaryTag, setField } = useOBStore();

  return (
    <OBShell
      step={4}
      stepLabel="Step 04 / Fuel Constraints"
      titleLine1="How you"
      titleLine2="eat."
      desc="Select all that apply. We'll build recipes around your boundaries."
      navActionLabel="Back"
      onNavAction={() => router.back()}
      ctaLabel="Continue"
      ctaDisabled={trainingLocation === null}
      onCta={() => router.push('/(onboarding)/step-5')}
    >
      {/* Dietary pattern tags */}
      <Text style={styles.sectionLabel}>Dietary pattern</Text>
      <View style={styles.tagsCard}>
        <View style={styles.tagsWrap}>
          {DIETARY_TAGS.map((tag) => {
            const selected = dietaryTags.includes(tag);
            return (
              <Pressable
                key={tag}
                style={[styles.tag, selected && styles.tagSelected]}
                onPress={() => toggleDietaryTag(tag)}
              >
                <Text style={[styles.tagText, selected && styles.tagTextSelected]}>{tag}</Text>
              </Pressable>
            );
          })}
        </View>
      </View>

      {/* Training location */}
      <Text style={styles.sectionLabel}>Training location</Text>
      <View style={styles.card}>
        {LOCATIONS.map((loc, idx) => {
          const selected = trainingLocation === loc.value;
          return (
            <Pressable
              key={loc.value}
              style={[
                styles.radioRow,
                selected && styles.radioRowSelected,
                idx < LOCATIONS.length - 1 && styles.radioRowBorder,
              ]}
              onPress={() => setField('trainingLocation', loc.value)}
            >
              <View style={styles.radioText}>
                <Text style={styles.radioTitle}>{loc.title}</Text>
                <Text style={styles.radioSub}>{loc.sub}</Text>
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
  sectionLabel: {
    fontFamily: ob.sansMedium,
    fontSize: 9,
    letterSpacing: 1.3,
    textTransform: 'uppercase',
    color: ob.ink3,
    marginTop: 20,
    marginBottom: 10,
  },
  tagsCard: {
    backgroundColor: ob.surface,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: ob.border2,
    padding: 18,
    paddingBottom: 12,
    marginBottom: 8,
  },
  tagsWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tag: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 40,
    borderWidth: 1,
    borderColor: ob.border,
    backgroundColor: ob.bg,
  },
  tagSelected: {
    backgroundColor: ob.roseSoft,
    borderColor: ob.rose,
  },
  tagText: {
    fontFamily: ob.sansRegular,
    fontSize: 13,
    color: ob.ink2,
  },
  tagTextSelected: {
    color: ob.roseDeep,
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
});
