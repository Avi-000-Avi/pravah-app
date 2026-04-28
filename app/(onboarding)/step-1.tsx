import { router } from 'expo-router';
import { OnboardingLayout } from '@/components/onboarding/OnboardingLayout';
import { OptionCard } from '@/components/onboarding/OptionCard';
import { useOnboarding } from '@/features/preferences';
import type { DietType } from '@/features/preferences';

const DIETS: { value: DietType; emoji: string; label: string }[] = [
  { value: 'vegetarian', emoji: '🌱', label: 'Vegetarian' },
  { value: 'non_vegetarian', emoji: '🍗', label: 'Non-vegetarian' },
  { value: 'vegan', emoji: '🌿', label: 'Vegan' },
  { value: 'eggetarian', emoji: '🥚', label: 'Eggetarian' },
];

export default function Step1Diet() {
  const { answers, setField } = useOnboarding();

  return (
    <OnboardingLayout
      step={1}
      title="What's your diet?"
      subtitle="We'll only suggest meals that match."
      canBack={false}
      canNext={!!answers.dietType}
      onNext={() => router.push('/(onboarding)/step-2')}
    >
      {DIETS.map((d) => (
        <OptionCard
          key={d.value}
          emoji={d.emoji}
          label={d.label}
          selected={answers.dietType === d.value}
          onPress={() => setField('dietType', d.value)}
        />
      ))}
    </OnboardingLayout>
  );
}
