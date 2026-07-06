/**
 * Plan presentation logic — small pure helpers the plan card uses.
 */
import type { MealLog, MealSlotName } from '@/types/domain';

/** Hour of day after which a slot invites logging. */
const LOG_AFTER_HOUR: Record<MealSlotName, number> = {
  breakfast: 9,
  lunch: 13,
  dinner: 20,
};

export const SLOT_LABELS: Record<MealSlotName, string> = {
  breakfast: 'breakfast',
  lunch: 'lunch',
  dinner: 'dinner',
};

export function isSlotLoggable(slot: MealSlotName, now: Date, isToday: boolean): boolean {
  if (!isToday) return true; // yesterday: every slot is editable
  return now.getHours() >= LOG_AFTER_HOUR[slot];
}

export function logForSlot(
  logs: readonly MealLog[],
  dateKey: string,
  slot: MealSlotName,
): MealLog | undefined {
  return logs.find((log) => log.plan_date === dateKey && log.slot === slot);
}

export function loggedStateCopy(log: MealLog): string {
  if (log.status === 'ate') return 'ate it';
  if (log.status === 'skipped') return 'skipped — no stress';
  return log.custom_text?.trim() ? `had ${log.custom_text.trim()}` : 'had something else';
}
