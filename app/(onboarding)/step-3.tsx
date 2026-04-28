import { router } from 'expo-router';
import { PillSelector } from '@/features/preferences/components/OptionCard';
import { StepShell } from '@/features/preferences/components/StepShell';
import { useOnboarding } from '@/features/preferences';

const MEAL_COUNTS = [2, 3, 4, 5, 6].map((n) => ({ value: n, label: String(n) }));

export default function Step3Meals() {
  const { draft, setField } = useOnboarding();

  return (
    <StepShell
      step={3}
      title="How many meals a day?"
      subtitle="Including snacks. You can change this any time."
      canNext={true}
      onNext={() => router.push('/(onboarding)/step-4')}
    >
      <PillSelector<number>
        options={MEAL_COUNTS}
        selected={draft.mealCount}
        onSelect={(v) => setField('mealCount', v)}
      />
    </StepShell>
  );
}
