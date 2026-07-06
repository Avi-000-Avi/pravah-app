/**
 * Deterministic seed UUIDs.
 *
 * Seed rows use fixed, valid v4-shaped UUIDs so the bundled catalog
 * and the database rows generated from it are always identical —
 * the app can reference seed content by id with or without a backend.
 */

const BLOCKS = {
  ingredient: 1,
  dish: 2,
  transformation: 3,
} as const;

export function seedId(kind: keyof typeof BLOCKS, n: number): string {
  return `0000000${BLOCKS[kind]}-0000-4000-8000-${String(n).padStart(12, '0')}`;
}
