/**
 * Demo seam — long-press the app version in profile to toggle.
 *
 * Seed: 20 items with staggered purchase dates, one expiring tomorrow
 * (triggers the use-it-soon card). Clear: wipes non-staple rows.
 *
 * Both actions go through replaceNonStapleItems so they work with
 * both remote and local backends.
 */
import { ING } from './seed';
import { replaceNonStapleItems, replaceStaples, listPantryItems } from './pantry';
import { CANONICAL_STAPLES } from './seed';

function daysAgo(n: number): string {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d.toISOString();
}

/** ~20 diverse items, one expiring tomorrow (tomatoes bought 4 days ago). */
const DEMO_ITEMS: { ingredient_id: string; source: 'seed'; purchased_at: string }[] = [
  // Expiring tomorrow — triggers use-it-soon card
  { ingredient_id: ING.tomatoes.id, source: 'seed', purchased_at: daysAgo(4) },

  // Vegetables — bought over the last week
  { ingredient_id: ING.potatoes.id, source: 'seed', purchased_at: daysAgo(2) },
  { ingredient_id: ING.palak.id, source: 'seed', purchased_at: daysAgo(1) },
  { ingredient_id: ING.coriander.id, source: 'seed', purchased_at: daysAgo(1) },
  { ingredient_id: ING.capsicum.id, source: 'seed', purchased_at: daysAgo(3) },
  { ingredient_id: ING.baingan.id, source: 'seed', purchased_at: daysAgo(2) },
  { ingredient_id: ING.cucumber.id, source: 'seed', purchased_at: daysAgo(1) },
  { ingredient_id: ING.ginger.id, source: 'seed', purchased_at: daysAgo(5) },
  { ingredient_id: ING.garlic.id, source: 'seed', purchased_at: daysAgo(7) },
  { ingredient_id: ING.lemon.id, source: 'seed', purchased_at: daysAgo(3) },
  { ingredient_id: ING.greenChillies.id, source: 'seed', purchased_at: daysAgo(2) },

  // Dairy & protein — bought recently
  { ingredient_id: ING.paneer.id, source: 'seed', purchased_at: daysAgo(1) },
  { ingredient_id: ING.chicken.id, source: 'seed', purchased_at: daysAgo(1) },
  { ingredient_id: ING.mushrooms.id, source: 'seed', purchased_at: daysAgo(1) },

  // Pantry grains
  { ingredient_id: ING.oats.id, source: 'seed', purchased_at: daysAgo(14) },
  { ingredient_id: ING.bread.id, source: 'seed', purchased_at: daysAgo(2) },
  { ingredient_id: ING.besan.id, source: 'seed', purchased_at: daysAgo(10) },

  // Protein staples
  { ingredient_id: ING.soyaChunks.id, source: 'seed', purchased_at: daysAgo(14) },
  { ingredient_id: ING.chana.id, source: 'seed', purchased_at: daysAgo(10) },

  // Fruit
  { ingredient_id: ING.bananas.id, source: 'seed', purchased_at: daysAgo(2) },
];

/** Seed ~20 pantry items with staggered dates. */
export async function seedDemoPantry(): Promise<void> {
  // Ensure all 12 staples are set first (replaceNonStapleItems keeps existing staples)
  const existing = await listPantryItems();
  const hasStaples = existing.some((item) => item.source === 'staple');
  if (!hasStaples) {
    await replaceStaples(CANONICAL_STAPLES.map((s) => s.id));
  }
  await replaceNonStapleItems(DEMO_ITEMS);
}

/** Remove all non-staple items, leaving only the 12 canonical staples. */
export async function clearToStaples(): Promise<void> {
  await replaceStaples(CANONICAL_STAPLES.map((s) => s.id));
  await replaceNonStapleItems([]);
}
