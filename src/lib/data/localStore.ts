/**
 * Local JSON collections on the storage adapter (MMKV in builds,
 * in-memory in Expo Go/web).
 *
 * This is the offline/no-session persistence used by the data layer.
 * Each repo stores one collection under one key; rows mirror the
 * Supabase tables exactly, so swapping a repo to its remote adapter
 * changes no shapes anywhere upstream.
 */
import { storage } from '@/lib/storage';

/** The pseudo user that owns local rows until real auth is wired in. */
export const LOCAL_USER_ID = 'local-user';

export function readCollection<T>(key: string): T[] {
  const raw = storage.getString(key);
  if (!raw) return [];
  try {
    const parsed: unknown = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as T[]) : [];
  } catch {
    return [];
  }
}

export function writeCollection<T>(key: string, rows: T[]): void {
  storage.set(key, JSON.stringify(rows));
}

export function newLocalId(): string {
  // Not a UUID — local ids only need uniqueness within this device.
  return `local-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}
