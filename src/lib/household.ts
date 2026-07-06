/**
 * Household + capture preferences data layer.
 *
 * Owns the household row and the time-constraint extension on
 * meal_preferences. Same remote/local seam as the pantry repo.
 */
import type { Household, HouseholdSizeBucket, TimeConstraints } from '@/types/domain';
import type { Json } from '@/lib/database.types';
import { supabase } from '@/lib/supabase';
import { storage } from '@/lib/storage';
import { getBackendSession } from './data/backend';

const HOUSEHOLD_KEY = 'db:household';
const TIME_CONSTRAINTS_KEY = 'db:time_constraints';

export async function getHousehold(): Promise<Household | null> {
  const session = await getBackendSession();
  if (session.mode === 'remote') {
    const { data, error } = await supabase.from('household').select('*').maybeSingle();
    if (error) throw error;
    return (data as Household | null) ?? null;
  }
  const raw = storage.getString(HOUSEHOLD_KEY);
  return raw ? (JSON.parse(raw) as Household) : null;
}

export async function setHousehold(sizeBucket: HouseholdSizeBucket): Promise<Household> {
  const session = await getBackendSession();
  const household: Household = {
    user_id: session.userId,
    size_bucket: sizeBucket,
    cooking_context: 'self',
  };
  if (session.mode === 'remote') {
    const { error } = await supabase.from('household').upsert(household);
    if (error) throw error;
    return household;
  }
  storage.set(HOUSEHOLD_KEY, JSON.stringify(household));
  return household;
}

export async function getTimeConstraints(): Promise<TimeConstraints | null> {
  const session = await getBackendSession();
  if (session.mode === 'remote') {
    const { data, error } = await supabase
      .from('meal_preferences')
      .select('time_constraints')
      .maybeSingle();
    if (error) throw error;
    return (data?.time_constraints as TimeConstraints | null) ?? null;
  }
  const raw = storage.getString(TIME_CONSTRAINTS_KEY);
  return raw ? (JSON.parse(raw) as TimeConstraints) : null;
}

export async function setTimeConstraints(constraints: TimeConstraints): Promise<void> {
  const session = await getBackendSession();
  if (session.mode === 'remote') {
    const { error } = await supabase
      .from('meal_preferences')
      // TimeConstraints serialises to jsonb; cast at the boundary only.
      .update({ time_constraints: constraints as unknown as Json })
      .eq('user_id', session.userId);
    if (error) throw error;
    return;
  }
  storage.set(TIME_CONSTRAINTS_KEY, JSON.stringify(constraints));
}
