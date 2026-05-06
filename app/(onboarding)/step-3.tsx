import { router } from 'expo-router';
import { OnboardingLayout } from '@/components/onboarding/OnboardingLayout';
import { PillSelector } from '@/components/onboarding/PillSelector';
import { useOnboarding } from '@/features/preferences';

const MEAL_COUNTS = [2, 3, 4, 5, 6].map((n) => ({ value: n, label: String(n) }));

export default function Step3Meals() {
  const { answers, setField } = useOnboarding();

  return (
    <OnboardingLayout
      step={3}
      title="How many meals a day?"
      subtitle="Includes main meals and snacks."
      canNext={true}
      onNext={() => router.push('/(onboarding)/step-4')}
    >
      <PillSelector<number>
        options={MEAL_COUNTS}
        selected={answers.mealCount}
        onSelect={(v) => setField('mealCount', v)}
      />
    </OnboardingLayout>
  );
}
