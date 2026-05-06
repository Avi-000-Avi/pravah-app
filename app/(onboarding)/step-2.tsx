import { router } from 'expo-router';
import { OnboardingLayout } from '@/components/onboarding/OnboardingLayout';
import { OptionCard } from '@/components/onboarding/OptionCard';
import { useOnboarding } from '@/features/preferences';
import type { FitnessGoal } from '@/features/preferences';

const GOALS: { value: FitnessGoal; emoji: string; label: string }[] = [
  { value: 'fat_loss', emoji: '🔥', label: 'Lose fat' },
  { value: 'muscle_gain', emoji: '💪', label: 'Build muscle' },
  { value: 'maintenance', emoji: '⚖️', label: 'Stay balanced' },
];

export default function Step2Goal() {
  const { answers, setField } = useOnboarding();

  return (
    <OnboardingLayout
      step={2}
      title="What's your goal?"
      subtitle="This shapes your macro targets and meal choices."
      canNext={!!answers.goal}
      onNext={() => router.push('/(onboarding)/step-3')}
    >
      {GOALS.map((g) => (
        <OptionCard
          key={g.value}
          emoji={g.emoji}
          label={g.label}
          selected={answers.goal === g.value}
          onPress={() => setField('goal', g.value)}
        />
      ))}
    </OnboardingLayout>
  );
}
