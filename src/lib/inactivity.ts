/**
 * Inactivity detection — pure helpers over meal logs.
 *
 * "Active" = any day with at least one logged meal. Used to detect
 * re-entry so the home screen can greet returning users warmly rather
 * than resuming mid-plan with no acknowledgement.
 */
import type { MealLog } from '@/types/domain';

const DAY_MS = 24 * 60 * 60 * 1000;

/** Number of calendar days since the most-recent log entry. */
export function daysSinceLastActivity(logs: readonly MealLog[], now: Date): number {
  if (logs.length === 0) return Number.POSITIVE_INFINITY;
  const most = logs
    .map((log) => new Date(log.logged_at).getTime())
    .reduce((max, t) => (t > max ? t : max), 0);
  return Math.floor((now.getTime() - most) / DAY_MS);
}

/** True when the gap since the last log is 3 or more calendar days. */
export function isReEntry(logs: readonly MealLog[], now: Date): boolean {
  return daysSinceLastActivity(logs, now) >= 3;
}

/** Counting stats for the Sunday review — computed over `days` lookback. */
export interface WeeklyStats {
  loggedDays: number;
  homeCooked: number;
  totalDays: number;
}

export function weeklyStats(logs: readonly MealLog[], todayKey: string, days = 7): WeeklyStats {
  const since = new Date(`${todayKey}T00:00:00`);
  since.setDate(since.getDate() - days);
  const sinceKey = since.toISOString().slice(0, 10);

  const byDate = new Map<string, MealLog[]>();
  for (const log of logs) {
    if (log.plan_date < sinceKey || log.plan_date > todayKey) continue;
    const list = byDate.get(log.plan_date) ?? [];
    list.push(log);
    byDate.set(log.plan_date, list);
  }

  let loggedDays = 0;
  let homeCooked = 0;
  for (const dayLogs of byDate.values()) {
    if (dayLogs.some((l) => l.status !== 'skipped')) loggedDays += 1;
    const allHome = dayLogs.every(
      (l) =>
        l.status === 'ate' ||
        (l.status === 'swapped' &&
          l.swap_category !== 'ordered_in' &&
          l.swap_category !== 'ate_out'),
    );
    if (allHome && dayLogs.length > 0) homeCooked += 1;
  }

  return { loggedDays, homeCooked, totalDays: days };
}
