/**
 * Seed leftover transformations — the hero feature's content.
 *
 * Hand-curated, 6 base categories × 5 each. Rules, enforced by
 * src/lib/__tests__/seed.test.ts:
 * - Output dish prep_minutes ≤ 15.
 * - extra_staples reference only the 12 canonical staples — a
 *   transformation must never imply a purchase.
 * - Each category has exactly one floor transform: the minimal-
 *   dependency option the engine can always fall back to.
 *
 * The floor convention: the engine treats the transformation with the
 * fewest extra_staples in a category as its guaranteed fallback (see
 * src/lib/leftovers.ts).
 */
import type { LeftoverBaseCategory, LeftoverTransformation } from '@/types/domain';
import { DISH } from './dishes';
import { ING } from './ingredients';
import { seedId } from './ids';

let counter = 0;

function transform(
  base_category: LeftoverBaseCategory,
  dish: { id: string },
  extraStaples: { id: string }[],
): LeftoverTransformation {
  counter += 1;
  return {
    id: seedId('transformation', counter),
    base_category,
    dish_id: dish.id,
    extra_staples: extraStaples.map((i) => i.id),
    active: true,
  };
}

export const SEED_TRANSFORMATIONS: LeftoverTransformation[] = [
  // ---------- dal ----------
  transform('dal', DISH.dalShorba, [ING.ghee]), // floor — ghee only
  transform('dal', DISH.dalParatha, [ING.atta, ING.oil]),
  transform('dal', DISH.dalTadkaBowl, [ING.rice, ING.ghee]),
  transform('dal', DISH.dalCheela, [ING.atta, ING.oil]),
  transform('dal', DISH.dalKhichdiRefresh, [ING.rice, ING.ghee]),

  // ---------- sabzi ----------
  transform('sabzi', DISH.sabziChaat, [ING.onions]), // floor — onions only
  transform('sabzi', DISH.sabziParatha, [ING.atta, ING.oil]),
  transform('sabzi', DISH.sabziFrankie, [ING.atta, ING.onions, ING.oil]),
  transform('sabzi', DISH.sabziPulao, [ING.rice, ING.oil]),
  transform('sabzi', DISH.sabziEggScramble, [ING.eggs, ING.oil]),

  // ---------- rice ----------
  transform('rice', DISH.jeeraGheeRice, [ING.ghee]), // floor — ghee only
  transform('rice', DISH.curdRice, [ING.curd]),
  transform('rice', DISH.eggFriedRice, [ING.eggs, ING.onions, ING.oil]),
  transform('rice', DISH.riceDalBowl, [ING.dal, ING.ghee]),
  transform('rice', DISH.quickKheer, [ING.milk, ING.sugar]),

  // ---------- roti ----------
  transform('roti', DISH.milkRotiBowl, [ING.milk]), // floor — milk only
  transform('roti', DISH.churmaRoti, [ING.ghee, ING.sugar]),
  transform('roti', DISH.kothuRoti, [ING.eggs, ING.onions, ING.oil]),
  transform('roti', DISH.rotiUpma, [ING.onions, ING.oil]),
  transform('roti', DISH.dalRotiTacos, [ING.dal, ING.onions]),

  // ---------- curry ----------
  transform('curry', DISH.curryRiceBowl, [ING.rice]), // floor — rice only
  transform('curry', DISH.curryParatha, [ING.atta, ING.oil]),
  transform('curry', DISH.curryPulao, [ING.rice, ING.oil]),
  transform('curry', DISH.curryEggRefresh, [ING.eggs]),
  transform('curry', DISH.curryShorba, [ING.ghee]),

  // ---------- paneer ----------
  transform('paneer', DISH.paneerRiceBowl, [ING.rice]), // floor — rice only
  transform('paneer', DISH.paneerBhurjiRefresh, [ING.onions, ING.oil]),
  transform('paneer', DISH.paneerParatha, [ING.atta, ING.ghee]),
  transform('paneer', DISH.paneerKathiRoll, [ING.atta, ING.onions, ING.oil]),
  transform('paneer', DISH.creamyPaneerRefresh, [ING.milk, ING.ghee]),
];
