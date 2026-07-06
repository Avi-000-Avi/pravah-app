/**
 * Leftover event log — feeds the usage metric and the 7-day variety
 * ranking in the leftover engine.
 */
import type { LeftoverBaseCategory, LeftoverEvent } from '@/types/domain';
import { supabase } from '@/lib/supabase';
import { getBackendSession } from './data/backend';
import { newLocalId, readCollection, writeCollection } from './data/localStore';

const KEY = 'db:leftover_events';
const LOCAL_RETENTION = 100; // events, not days — plenty for variety + review

export async function listRecentLeftoverEvents(days: number): Promise<LeftoverEvent[]> {
  const since = new Date();
  since.setDate(since.getDate() - days);
  const sinceIso = since.toISOString();

  const session = await getBackendSession();
  if (session.mode === 'remote') {
    const { data, error } = await supabase
      .from('leftover_events')
      .select('*')
      .gte('created_at', sinceIso)
      .order('created_at', { ascending: false });
    if (error) throw error;
    return (data ?? []) as LeftoverEvent[];
  }
  return readCollection<LeftoverEvent>(KEY)
    .filter((event) => event.created_at >= sinceIso)
    .sort((a, b) => b.created_at.localeCompare(a.created_at));
}

export async function logLeftoverEvent(
  baseCategory: LeftoverBaseCategory,
  dishId: string,
): Promise<LeftoverEvent> {
  const session = await getBackendSession();
  const event: LeftoverEvent = {
    id: newLocalId(),
    user_id: session.userId,
    base_category: baseCategory,
    dish_id: dishId,
    created_at: new Date().toISOString(),
  };

  if (session.mode === 'remote') {
    const { id: _localId, ...row } = event;
    const { data, error } = await supabase.from('leftover_events').insert(row).select().single();
    if (error) throw error;
    return data as LeftoverEvent;
  }

  const rows = readCollection<LeftoverEvent>(KEY);
  rows.unshift(event);
  writeCollection(KEY, rows.slice(0, LOCAL_RETENTION));
  return event;
}
