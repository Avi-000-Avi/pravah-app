import { router } from 'expo-router';
import { OptionCard } from '@/features/preferences/components/OptionCard';
import { StepShell } from '@/features/preferences/components/StepShell';
import { useOnboarding } from '@/features/preferences';
import type { DietType } from '@/features/preferences';

const DIETS: { value: DietType; emoji: string; label: string }[] = [
  { value: 'vegetarian', emoji: '🌱', label: 'Vegetarian' },
  { value: 'non_vegetarian', emoji: '🍗', label: 'Non-vegetarian' },
  { value: 'vegan', emoji: '🌿', label: 'Vegan' },
  { value: 'eggetarian', emoji: '🥚', label: 'Eggetarian' },
];

export default function Step1Diet() {
  const { draft, setField } = useOnboarding();

  return (
    <StepShell
      step={1}
      title="What do you eat?"
      subtitle="Helps us pick recipes you'll actually enjoy."
      canBack={false}
      canNext={!!draft.dietType}
      onNext={() => router.push('/(onboarding)/step-2')}
    >
      {DIETS.map((d) => (
        <OptionCard
          key={d.value}
          emoji={d.emoji}
          label={d.label}
          selected={draft.dietType === d.value}
          onPress={() => setField('dietType', d.value)}
        />
      ))}
    </StepShell>
  );
}
