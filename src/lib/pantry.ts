/**
 * Pantry data layer — the single owner of pantry_items access.
 *
 * Deliberately separated from the screens so grocery-ingested rows
 * (source 'swiggy' in v1.5) slot in later without UI changes: an
 * ingestion job calls the same upsert path with a different source.
 *
 * Repos run remote (Supabase + RLS) when a session exists, local
 * (MMKV) otherwise — see src/lib/data/backend.ts.
 */
import type { Ingredient, PantryItem, PantrySource } from '@/types/domain';
import { supabase } from '@/lib/supabase';
import { getBackendSession } from './data/backend';
import { newLocalId, readCollection, writeCollection } from './data/localStore';
import { SEED_INGREDIENTS } from './seed';

const KEY = 'db:pantry_items';

const ingredientById = new Map(SEED_INGREDIENTS.map((i) => [i.id, i]));

export function getIngredient(id: string): Ingredient | undefined {
  return ingredientById.get(id);
}

/** predicted_empty_at from the catalog's default shelf life, if known. */
export function predictEmptyAt(ingredientId: string, purchasedAt: Date): string | null {
  const shelfDays = ingredientById.get(ingredientId)?.default_shelf_life_days ?? null;
  if (shelfDays === null) return null;
  const empty = new Date(purchasedAt);
  empty.setDate(empty.getDate() + shelfDays);
  return empty.toISOString();
}

export async function listPantryItems(): Promise<PantryItem[]> {
  const session = await getBackendSession();
  if (session.mode === 'remote') {
    const { data, error } = await supabase
      .from('pantry_items')
      .select('*')
      .order('created_at', { ascending: true });
    if (error) throw error;
    return (data ?? []) as PantryItem[];
  }
  return readCollection<PantryItem>(KEY);
}

export async function addPantryItem(
  ingredientId: string,
  source: PantrySource,
  purchasedAt: Date = new Date(),
): Promise<PantryItem> {
  const session = await getBackendSession();
  const item: PantryItem = {
    id: newLocalId(),
    user_id: session.userId,
    ingredient_id: ingredientId,
    source,
    purchased_at: purchasedAt.toISOString(),
    predicted_empty_at: source === 'staple' ? null : predictEmptyAt(ingredientId, purchasedAt),
    confidence: 1,
    last_confirmed_at: null,
  };

  if (session.mode === 'remote') {
    const { id: _localId, ...row } = item;
    const { data, error } = await supabase
      .from('pantry_items')
      .upsert(row, { onConflict: 'user_id,ingredient_id' })
      .select()
      .single();
    if (error) throw error;
    return data as PantryItem;
  }

  const rows = readCollection<PantryItem>(KEY).filter(
    (existing) => existing.ingredient_id !== ingredientId,
  );
  rows.push(item);
  writeCollection(KEY, rows);
  return item;
}

/** "Finished it" — remove the ingredient from the active pantry. */
export async function removePantryItem(ingredientId: string): Promise<void> {
  const session = await getBackendSession();
  if (session.mode === 'remote') {
    const { error } = await supabase
      .from('pantry_items')
      .delete()
      .eq('ingredient_id', ingredientId);
    if (error) throw error;
    return;
  }
  writeCollection(
    KEY,
    readCollection<PantryItem>(KEY).filter((item) => item.ingredient_id !== ingredientId),
  );
}

/** Replace the staple baseline with exactly these ingredient ids. */
export async function replaceStaples(ingredientIds: string[]): Promise<void> {
  const session = await getBackendSession();
  if (session.mode === 'remote') {
    const { error: deleteError } = await supabase
      .from('pantry_items')
      .delete()
      .eq('source', 'staple');
    if (deleteError) throw deleteError;
    if (ingredientIds.length > 0) {
      const { error } = await supabase.from('pantry_items').insert(
        ingredientIds.map((ingredient_id) => ({
          user_id: session.userId,
          ingredient_id,
          source: 'staple',
          predicted_empty_at: null,
        })),
      );
      if (error) throw error;
    }
    return;
  }

  const now = new Date().toISOString();
  const nonStaples = readCollection<PantryItem>(KEY).filter((item) => item.source !== 'staple');
  const staples: PantryItem[] = ingredientIds.map((ingredient_id) => ({
    id: newLocalId(),
    user_id: session.userId,
    ingredient_id,
    source: 'staple',
    purchased_at: now,
    predicted_empty_at: null,
    confidence: 1,
    last_confirmed_at: null,
  }));
  writeCollection(KEY, [...staples, ...nonStaples]);
}

/**
 * Demo/ingestion path: replace all non-staple rows in one shot.
 * This is exactly the call a grocery sync will make.
 */
export async function replaceNonStapleItems(
  items: { ingredient_id: string; source: PantrySource; purchased_at: string }[],
): Promise<void> {
  const session = await getBackendSession();
  const rows: PantryItem[] = items.map((item) => ({
    id: newLocalId(),
    user_id: session.userId,
    ingredient_id: item.ingredient_id,
    source: item.source,
    purchased_at: item.purchased_at,
    predicted_empty_at: predictEmptyAt(item.ingredient_id, new Date(item.purchased_at)),
    confidence: 1,
    last_confirmed_at: null,
  }));

  if (session.mode === 'remote') {
    const { error: deleteError } = await supabase
      .from('pantry_items')
      .delete()
      .neq('source', 'staple');
    if (deleteError) throw deleteError;
    if (rows.length > 0) {
      const { error } = await supabase
        .from('pantry_items')
        .insert(rows.map(({ id: _id, ...row }) => row));
      if (error) throw error;
    }
    return;
  }

  const staples = readCollection<PantryItem>(KEY).filter((item) => item.source === 'staple');
  writeCollection(KEY, [...staples, ...rows]);
}

/** Ingredient ids currently on hand — the planner's pantry input. */
export function availableIngredientIds(items: readonly PantryItem[]): Set<string> {
  return new Set(items.map((item) => item.ingredient_id));
}
