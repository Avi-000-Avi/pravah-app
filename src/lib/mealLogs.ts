/**
 * Meal log persistence — meal_logs access. One log per (date, slot);
 * re-logging replaces (yesterday is editable, nothing older).
 */
import type { MealLog, MealLogStatus, MealSlotName, SwapCategory } from '@/types/domain';
import { supabase } from '@/lib/supabase';
import { getBackendSession } from './data/backend';
import { newLocalId, readCollection, writeCollection } from './data/localStore';

const KEY = 'db:meal_logs';
const LOCAL_RETENTION_DAYS = 30;

export interface LogMealInput {
  plan_date: string;
  slot: MealSlotName;
  status: MealLogStatus;
  swap_category?: SwapCategory | null;
  custom_text?: string | null;
}

export async function listLogs(dates: string[]): Promise<MealLog[]> {
  const session = await getBackendSession();
  if (session.mode === 'remote') {
    const { data, error } = await supabase.from('meal_logs').select('*').in('plan_date', dates);
    if (error) throw error;
    return (data ?? []) as MealLog[];
  }
  const wanted = new Set(dates);
  return readCollection<MealLog>(KEY).filter((log) => wanted.has(log.plan_date));
}

export async function logMeal(input: LogMealInput): Promise<MealLog> {
  const session = await getBackendSession();
  const log: MealLog = {
    id: newLocalId(),
    user_id: session.userId,
    plan_date: input.plan_date,
    slot: input.slot,
    status: input.status,
    swap_category: input.swap_category ?? null,
    custom_text: input.custom_text ?? null,
    logged_at: new Date().toISOString(),
  };

  if (session.mode === 'remote') {
    const { id: _localId, ...row } = log;
    const { data, error } = await supabase
      .from('meal_logs')
      .upsert(row, { onConflict: 'user_id,plan_date,slot' })
      .select()
      .single();
    if (error) throw error;
    return data as MealLog;
  }

  const rows = readCollection<MealLog>(KEY).filter(
    (existing) => !(existing.plan_date === input.plan_date && existing.slot === input.slot),
  );
  rows.push(log);

  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - LOCAL_RETENTION_DAYS);
  const cutoffKey = cutoff.toISOString().slice(0, 10);
  writeCollection(
    KEY,
    rows.filter((row) => row.plan_date >= cutoffKey),
  );
  return log;
}
