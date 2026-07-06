/**
 * Persisted card dismissals — dismissed cards stay dismissed across
 * re-renders and app restarts (MMKV-backed via the storage adapter).
 */
import { storage } from '@/lib/storage';

const STORAGE_KEY = 'home-card-dismissals';

export function readDismissedCardIds(): Set<string> {
  const raw = storage.getString(STORAGE_KEY);
  if (!raw) return new Set();
  try {
    const parsed: unknown = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      return new Set(parsed.filter((id): id is string => typeof id === 'string'));
    }
  } catch {
    // Corrupt value — treat as no dismissals rather than crashing home.
  }
  return new Set();
}

export function persistDismissedCardId(id: string): Set<string> {
  const dismissed = readDismissedCardIds();
  dismissed.add(id);
  storage.set(STORAGE_KEY, JSON.stringify([...dismissed]));
  return dismissed;
}

export function clearDismissedCardId(id: string): Set<string> {
  const dismissed = readDismissedCardIds();
  dismissed.delete(id);
  storage.set(STORAGE_KEY, JSON.stringify([...dismissed]));
  return dismissed;
}
