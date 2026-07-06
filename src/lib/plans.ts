/**
 * Daily plan persistence — daily_plans access plus the MMKV cache
 * that keeps today's plan renderable offline.
 */
import type { ConditionFlag, DailyPlan, PlanSlot } from '@/types/domain';
import type { Database } from '@/lib/database.types';
import { supabase } from '@/lib/supabase';
import { getBackendSession } from './data/backend';
import { newLocalId, readCollection, writeCollection } from './data/localStore';
import type { GeneratedDayPlan } from './planner';

const KEY = 'db:daily_plans';
/** Keep a rolling window locally — enough for history + Sunday review. */
const LOCAL_RETENTION_DAYS = 30;

export async function getPlan(date: string): Promise<DailyPlan | null> {
  const session = await getBackendSession();
  if (session.mode === 'remote') {
    const { data, error } = await supabase
      .from('daily_plans')
      .select('*')
      .eq('date', date)
      .maybeSingle();
    if (error) throw error;
    return (data as DailyPlan | null) ?? null;
  }
  return readCollection<DailyPlan>(KEY).find((plan) => plan.date === date) ?? null;
}

export async function listRecentPlans(beforeOrOn: string, days: number): Promise<DailyPlan[]> {
  const since = new Date(`${beforeOrOn}T00:00:00`);
  since.setDate(since.getDate() - days);
  const sinceKey = since.toISOString().slice(0, 10);

  const session = await getBackendSession();
  if (session.mode === 'remote') {
    const { data, error } = await supabase
      .from('daily_plans')
      .select('*')
      .gte('date', sinceKey)
      .lte('date', beforeOrOn)
      .order('date', { ascending: false });
    if (error) throw error;
    // slots/workout are jsonb — the PlanSlot[] contract lives in domain.ts.
    return (data ?? []) as unknown as DailyPlan[];
  }
  return readCollection<DailyPlan>(KEY)
    .filter((plan) => plan.date >= sinceKey && plan.date <= beforeOrOn)
    .sort((a, b) => b.date.localeCompare(a.date));
}

export async function savePlan(generated: GeneratedDayPlan): Promise<DailyPlan> {
  const session = await getBackendSession();
  const plan: DailyPlan = {
    id: newLocalId(),
    user_id: session.userId,
    date: generated.date,
    slots: generated.slots,
    workout: generated.workout,
    condition_flags: generated.condition_flags,
    generated_at: new Date().toISOString(),
    plan_version: 1,
  };

  if (session.mode === 'remote') {
    const { id: _localId, ...row } = plan;
    const { data, error } = await supabase
      .from('daily_plans')
      // slots/workout serialise to jsonb; cast at the boundary only.
      .upsert(row as unknown as Database['public']['Tables']['daily_plans']['Insert'], {
        onConflict: 'user_id,date',
      })
      .select()
      .single();
    if (error) throw error;
    return data as unknown as DailyPlan;
  }

  const existing = await getPlan(generated.date);
  if (existing) {
    return updatePlan(generated.date, {
      slots: generated.slots,
      condition_flags: generated.condition_flags,
      plan_version: existing.plan_version + 1,
    }) as Promise<DailyPlan>;
  }

  const rows = readCollection<DailyPlan>(KEY);
  rows.push(plan);
  pruneAndWrite(rows);
  return plan;
}

export async function updatePlan(
  date: string,
  changes: Partial<Pick<DailyPlan, 'slots' | 'condition_flags' | 'plan_version'>> & {
    slots?: PlanSlot[];
    condition_flags?: ConditionFlag[];
  },
): Promise<DailyPlan | null> {
  const session = await getBackendSession();
  if (session.mode === 'remote') {
    const { data, error } = await supabase
      .from('daily_plans')
      .update(changes as unknown as Database['public']['Tables']['daily_plans']['Update'])
      .eq('date', date)
      .select()
      .maybeSingle();
    if (error) throw error;
    return (data as unknown as DailyPlan | null) ?? null;
  }

  const rows = readCollection<DailyPlan>(KEY);
  const index = rows.findIndex((plan) => plan.date === date);
  const current = rows[index];
  if (current === undefined) return null;
  const updated: DailyPlan = { ...current, ...changes };
  rows[index] = updated;
  pruneAndWrite(rows);
  return updated;
}

function pruneAndWrite(rows: DailyPlan[]): void {
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - LOCAL_RETENTION_DAYS);
  const cutoffKey = cutoff.toISOString().slice(0, 10);
  writeCollection(
    KEY,
    rows.filter((plan) => plan.date >= cutoffKey),
  );
}
