import { router } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { OBShell } from '@/components/onboarding/OBShell';
import { useOBStore } from '@/features/onboarding/store';
import { ob } from '@/features/onboarding/theme';

interface ToggleRowProps {
  label: string;
  value: boolean;
  onToggle: () => void;
}

function ToggleRow({ label, value, onToggle }: ToggleRowProps) {
  return (
    <Pressable style={styles.toggleRow} onPress={onToggle}>
      <Text style={styles.toggleLbl}>{label}</Text>
      <View style={[styles.toggleTrack, !value && styles.toggleTrackOff]}>
        <View style={[styles.toggleKnob, value ? styles.toggleKnobOn : styles.toggleKnobOff]} />
      </View>
    </Pressable>
  );
}

export default function Step5Notifications() {
  const { notifications, setField } = useOBStore();

  function toggle(key: keyof typeof notifications) {
    setField('notifications', { ...notifications, [key]: !notifications[key] });
  }

  return (
    <OBShell
      step={5}
      stepLabel="Step 05 / Your Signal"
      titleLine1="Nudges, not"
      titleLine2="noise."
      desc="Choose only what feels useful. Max twice a day, always."
      navActionLabel="Back"
      onNavAction={() => router.back()}
      ctaLabel="Build my plan"
      onCta={() => router.push('/(onboarding)/step-6')}
    >
      {/* Preview notification card */}
      <View style={styles.previewCard}>
        <View style={styles.previewIcon}>
          <Text style={styles.previewEmoji}>🥗</Text>
        </View>
        <View style={styles.previewText}>
          <Text style={styles.previewTitle}>Pravah · 2:30 pm</Text>
          <Text style={styles.previewBody}>
            You're 40g short on protein today. Quick fix: Greek yogurt with almonds.
          </Text>
        </View>
      </View>

      {/* Toggle rows */}
      <View style={styles.toggleCard}>
        <ToggleRow
          label="Meal & protein reminders"
          value={notifications.mealReminders}
          onToggle={() => toggle('mealReminders')}
        />
        <ToggleRow
          label="Workout prompt"
          value={notifications.workoutPrompt}
          onToggle={() => toggle('workoutPrompt')}
        />
        <ToggleRow
          label="Weekly progress summary"
          value={notifications.weeklyProgress}
          onToggle={() => toggle('weeklyProgress')}
        />
        <ToggleRow
          label="Social kudos & challenges"
          value={notifications.socialKudos}
          onToggle={() => toggle('socialKudos')}
        />
      </View>

      {/* Privacy note */}
      <View style={styles.privacyNote}>
        <Text style={styles.privacyText}>
          No sales calls. No coach upsells. No third-party sharing. Ever.
        </Text>
      </View>
    </OBShell>
  );
}

const styles = StyleSheet.create({
  previewCard: {
    backgroundColor: ob.rosePale,
    borderWidth: 1,
    borderColor: ob.roseSoft,
    borderRadius: 14,
    padding: 14,
    flexDirection: 'row',
    gap: 12,
    alignItems: 'flex-start',
    marginBottom: 14,
  },
  previewIcon: {
    width: 30,
    height: 30,
    borderRadius: 8,
    backgroundColor: ob.rose,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  previewEmoji: { fontSize: 14 },
  previewText: { flex: 1 },
  previewTitle: {
    fontFamily: ob.sansMedium,
    fontSize: 12,
    color: ob.ink,
    marginBottom: 2,
  },
  previewBody: {
    fontFamily: ob.sans,
    fontSize: 11,
    color: ob.ink2,
    lineHeight: 16,
  },

  toggleCard: {
    backgroundColor: ob.surface,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: ob.border2,
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  toggleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 13,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(30,26,24,0.06)',
  },
  toggleLbl: {
    fontFamily: ob.sans,
    fontSize: 13,
    color: ob.ink,
    flex: 1,
    paddingRight: 12,
  },
  toggleTrack: {
    width: 40,
    height: 24,
    borderRadius: 12,
    backgroundColor: ob.rose,
    justifyContent: 'center',
    flexShrink: 0,
  },
  toggleTrackOff: {
    backgroundColor: ob.border,
  },
  toggleKnob: {
    position: 'absolute',
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#ffffff',
    top: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 2,
  },
  toggleKnobOn: {
    right: 3,
  },
  toggleKnobOff: {
    left: 3,
  },

  privacyNote: {
    marginTop: 10,
    padding: 12,
    backgroundColor: ob.rosePale,
    borderRadius: 12,
  },
  privacyText: {
    fontFamily: ob.sans,
    fontSize: 11,
    color: ob.ink3,
    lineHeight: 18,
  },
});
