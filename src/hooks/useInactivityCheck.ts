/**
 * useInactivityCheck — detects whether the user is returning after a
 * 3+ day gap. Runs once on mount and re-runs whenever the query data
 * refreshes. Used by the home screen to show re-entry copy.
 */
import { useMemo } from 'react';
import { formatDateKey } from '@/lib/planner';
import { isReEntry } from '@/lib/inactivity';
import { useMealLogs } from './useMealLogs';

const LOOKBACK_DAYS = 30;

function lastDays(n: number): string[] {
  const now = new Date();
  return Array.from({ length: n }, (_, i) => {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    return formatDateKey(d);
  });
}

export function useInactivityCheck() {
  const dates = useMemo(() => lastDays(LOOKBACK_DAYS), []);
  const { data: logs } = useMealLogs(dates);

  return useMemo(() => {
    const now = new Date();
    const reEntry = isReEntry(logs ?? [], now);
    return { reEntry, logs: logs ?? [] };
  }, [logs]);
}
