import { OnboardingLayout } from '@/components/onboarding/OnboardingLayout';
import { PillSelector } from '@/components/onboarding/PillSelector';
import { useOnboarding } from '@/features/preferences';

// `240` doubles as our "no limit" sentinel — the column max in the migration.
const NO_LIMIT = 240;
const PREP_OPTIONS = [
  { value: 15, label: '15 min' },
  { value: 30, label: '30 min' },
  { value: 45, label: '45 min' },
  { value: 60, label: '1 hour' },
  { value: NO_LIMIT, label: 'No limit' },
];

export default function Step4PrepTime() {
  const { answers, setField, isSubmitting, submitError, submit, clearError } = useOnboarding();

  async function onFinish() {
    clearError();
    await submit();
    // Navigation + state update happen inside submit() on success.
  }

  return (
    <OnboardingLayout
      step={4}
      title="How much time can you spend cooking?"
      subtitle="Per meal, not per day."
      canNext={true}
      nextLabel="Let's go"
      isSubmitting={isSubmitting}
      errorMessage={submitError}
      onNext={onFinish}
    >
      <PillSelector<number>
        options={PREP_OPTIONS}
        selected={answers.prepTimeMaxMin}
        onSelect={(v) => setField('prepTimeMaxMin', v)}
      />
    </OnboardingLayout>
  );
}
