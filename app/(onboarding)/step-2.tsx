import { router } from 'expo-router';
import { OptionCard } from '@/features/preferences/components/OptionCard';
import { StepShell } from '@/features/preferences/components/StepShell';
import { useOnboarding } from '@/features/preferences';
import type { FitnessGoal } from '@/features/preferences';

const GOALS: { value: FitnessGoal; emoji: string; label: string }[] = [
  { value: 'fat_loss', emoji: '🔥', label: 'Lose fat' },
  { value: 'muscle_gain', emoji: '💪', label: 'Build muscle' },
  { value: 'maintenance', emoji: '⚖️', label: 'Stay balanced' },
];

export default function Step2Goal() {
  const { draft, setField } = useOnboarding();

  return (
    <StepShell
      step={2}
      title="What are you working towards?"
      canNext={!!draft.goal}
      onNext={() => router.push('/(onboarding)/step-3')}
    >
      {GOALS.map((g) => (
        <OptionCard
          key={g.value}
          emoji={g.emoji}
          label={g.label}
          selected={draft.goal === g.value}
          onPress={() => setField('goal', g.value)}
        />
      ))}
    </StepShell>
  );
}
