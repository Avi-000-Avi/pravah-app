import { useState } from 'react';
import { PillSelector } from '@/features/preferences/components/OptionCard';
import { StepShell } from '@/features/preferences/components/StepShell';
import { useOnboarding } from '@/features/preferences';

// `240` doubles as our "no limit" sentinel — the column max in the migration.
const NO_LIMIT = 240;
const PREP_OPTIONS = [
  { value: 15, label: '15 min' },
  { value: 30, label: '30 min' },
  { value: 45, label: '45 min' },
  { value: 60, label: '60 min' },
  { value: NO_LIMIT, label: 'No limit' },
];

export default function Step4PrepTime() {
  const { draft, setField, submit } = useOnboarding();
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function onFinish() {
    setError(null);
    setIsSubmitting(true);
    try {
      await submit();
      // Route guard in app/_layout.tsx now sees isOnboarded = true and
      // routes to /(tabs). No explicit navigation needed.
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not save your plan. Try again.');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <StepShell
      step={4}
      title="Max time to prep a meal?"
      subtitle="We'll keep recipes within this window."
      canNext={true}
      nextLabel="Finish"
      isSubmitting={isSubmitting}
      errorMessage={error}
      onNext={onFinish}
    >
      <PillSelector<number>
        options={PREP_OPTIONS}
        selected={draft.prepTimeMaxMin}
        onSelect={(v) => setField('prepTimeMaxMin', v)}
      />
    </StepShell>
  );
}
