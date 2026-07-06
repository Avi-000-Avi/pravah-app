/**
 * Observation line — one rotating, always-true positive fact for the
 * morning ritual. Never a guilt fact; never repeats two days running;
 * warm neutral fallback for brand-new users.
 */
import type { DailyPlan, LeftoverEvent, MealLog } from '@/types/domain';
import { storage } from '@/lib/storage';

export interface ObservationContext {
  /** Today as YYYY-MM-DD. */
  todayKey: string;
  /** Recent plans, any order. */
  plans: readonly DailyPlan[];
  /** Recent meal logs, any order. */
  logs: readonly MealLog[];
  /** Recent leftover events (last 30 days). */
  leftoverEvents: readonly LeftoverEvent[];
}

export interface Observation {
  id: string;
  text: string;
}

const NEUTRAL: Observation = {
  id: 'neutral',
  text: 'your kitchen’s ready when you are.',
};

function previousDays(todayKey: string, count: number): string[] {
  const base = new Date(`${todayKey}T12:00:00`);
  return Array.from({ length: count }, (_, i) => {
    const d = new Date(base);
    d.setDate(d.getDate() - (i + 1));
    return d.toISOString().slice(0, 10);
  });
}

/** A day counts as home-cooked when nothing was logged away from home. */
function cookedAtHome(logsForDay: MealLog[]): boolean {
  if (logsForDay.length === 0) return false;
  return logsForDay.every(
    (log) =>
      log.status === 'ate' ||
      (log.status === 'swapped' &&
        log.swap_category !== 'ordered_in' &&
        log.swap_category !== 'ate_out'),
  );
}

/** All always-true candidates, strongest first. */
export function observationCandidates(context: ObservationContext): Observation[] {
  const candidates: Observation[] = [];
  const logsByDate = new Map<string, MealLog[]>();
  for (const log of context.logs) {
    const list = logsByDate.get(log.plan_date) ?? [];
    list.push(log);
    logsByDate.set(log.plan_date, list);
  }

  let homeRun = 0;
  for (const day of previousDays(context.todayKey, 14)) {
    if (cookedAtHome(logsByDate.get(day) ?? [])) homeRun += 1;
    else break;
  }
  if (homeRun >= 2) {
    candidates.push({
      id: 'home-run',
      text: `you’ve cooked at home ${homeRun} days running.`,
    });
  }

  const yesterdayKey = previousDays(context.todayKey, 1)[0];
  const yesterdayLogs = yesterdayKey ? (logsByDate.get(yesterdayKey) ?? []) : [];
  if (yesterdayLogs.length >= 3 && cookedAtHome(yesterdayLogs)) {
    candidates.push({
      id: 'kitchen-covered',
      text: 'your kitchen covered every meal yesterday.',
    });
  }

  const rescues = context.leftoverEvents.length;
  if (rescues >= 1) {
    candidates.push({
      id: 'leftover-rescues',
      text:
        rescues === 1
          ? 'one leftover meal rescued this month.'
          : `${rescues} leftover meals rescued this month.`,
    });
  }

  const plannedDays = new Set(context.plans.map((plan) => plan.date)).size;
  if (plannedDays >= 3) {
    candidates.push({
      id: 'planned-days',
      text: `${plannedDays} days planned around your kitchen this week.`,
    });
  }

  return candidates;
}

const LAST_KEY = 'observation:last';

interface LastObservation {
  date: string;
  id: string;
}

function readLast(): LastObservation | null {
  const raw = storage.getString(LAST_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as LastObservation;
  } catch {
    return null;
  }
}

/**
 * Pick today's observation: strongest qualifying candidate that
 * wasn't shown yesterday; neutral if nothing qualifies. Stable for
 * the whole day once chosen.
 */
export function chooseObservation(context: ObservationContext): Observation {
  const last = readLast();
  if (last?.date === context.todayKey) {
    const all = [...observationCandidates(context), NEUTRAL];
    const repeat = all.find((candidate) => candidate.id === last.id);
    if (repeat) return repeat;
  }

  const candidates = observationCandidates(context);
  const yesterdayId = last && last.date !== context.todayKey ? last.id : null;
  const fresh = candidates.find((candidate) => candidate.id !== yesterdayId);
  const chosen = fresh ?? NEUTRAL;

  storage.set(LAST_KEY, JSON.stringify({ date: context.todayKey, id: chosen.id }));
  return chosen;
}
