/**
 * Macro engine — pure functions, no I/O.
 *
 * goal → daily targets → running tally from logs → gap per remaining
 * slot. Everything downstream (planner ranking, leftover ranking,
 * tired-chip regeneration) consumes these.
 */
import type { DailyPlan, MealLog, MealSlotName, SwapCategory } from '@/types/domain';

export interface MacroTargets {
  protein_g: number;
  calories: number;
}

export interface MacroTally extends MacroTargets {
  logged_slots: MealSlotName[];
}

export interface MacroProfile {
  goal: 'fat_loss' | 'muscle_gain' | 'maintenance';
  weight_kg: number | null;
}

/** Median adult bodyweight fallback when onboarding didn't capture it. */
const DEFAULT_WEIGHT_KG = 65;

/** Never target below this — aggressive deficits are not Pravah's job. */
const CALORIE_FLOOR = 1400;

/**
 * Protein: g per kg bodyweight by goal. 1.2 g/kg maintenance and
 * 1.6–1.8 g/kg for recomposition goals, per the ISSN position stand
 * on protein and exercise (Jäger et al., 2017); comfortably above the
 * ICMR-NIN 2020 RDA of 0.83 g/kg for sedentary adults.
 */
const PROTEIN_PER_KG: Record<MacroProfile['goal'], number> = {
  fat_loss: 1.6,
  muscle_gain: 1.8,
  maintenance: 1.2,
};

/**
 * Calories: 32 kcal/kg approximates maintenance for a lightly active
 * adult (FAO/WHO/UNU factorial method, activity factor ~1.5), then a
 * modest goal adjustment: −400 for fat loss, +300 for muscle gain.
 */
const MAINTENANCE_KCAL_PER_KG = 32;
const GOAL_CALORIE_DELTA: Record<MacroProfile['goal'], number> = {
  fat_loss: -400,
  muscle_gain: 300,
  maintenance: 0,
};

export function dailyTargets(profile: MacroProfile): MacroTargets {
  const weight = profile.weight_kg ?? DEFAULT_WEIGHT_KG;
  const protein = weight * PROTEIN_PER_KG[profile.goal];
  const calories = weight * MAINTENANCE_KCAL_PER_KG + GOAL_CALORIE_DELTA[profile.goal];
  return {
    protein_g: Math.round(protein),
    calories: Math.max(CALORIE_FLOOR, Math.round(calories)),
  };
}

/**
 * Coarse estimates for "ate something else" tiles. Deliberately
 * conservative round numbers — a wrong precise number erodes trust
 * faster than an honest estimate.
 */
export const SWAP_ESTIMATES: Record<SwapCategory, MacroTargets> = {
  ordered_in: { protein_g: 20, calories: 650 },
  ate_out: { protein_g: 22, calories: 700 },
  roti_sabzi: { protein_g: 10, calories: 430 },
  rice_dal: { protein_g: 14, calories: 480 },
  snack: { protein_g: 6, calories: 250 },
  other_home_meal: { protein_g: 15, calories: 450 },
};

/**
 * What's been consumed so far today.
 * - 'ate' → the planned slot's macros
 * - 'skipped' → zero
 * - 'swapped' → the swap-category estimate, else the planned slot's
 *   macros as the closest honest proxy
 */
export function runningTally(plan: DailyPlan, logs: MealLog[]): MacroTally {
  const tally: MacroTally = { protein_g: 0, calories: 0, logged_slots: [] };

  for (const log of logs) {
    const slot = plan.slots.find((s) => s.slot === log.slot);
    if (!slot) continue;
    tally.logged_slots.push(log.slot);

    if (log.status === 'skipped') continue;
    if (log.status === 'swapped' && log.swap_category) {
      const estimate = SWAP_ESTIMATES[log.swap_category];
      tally.protein_g += estimate.protein_g;
      tally.calories += estimate.calories;
      continue;
    }
    tally.protein_g += slot.protein_g;
    tally.calories += slot.calories;
  }

  return tally;
}

/** Per-remaining-slot protein/calorie budget, clamped at zero. */
export function remainingGap(
  targets: MacroTargets,
  tally: MacroTally,
  remainingSlots: number,
): MacroTargets {
  if (remainingSlots <= 0) return { protein_g: 0, calories: 0 };
  return {
    protein_g: Math.max(0, (targets.protein_g - tally.protein_g) / remainingSlots),
    calories: Math.max(0, (targets.calories - tally.calories) / remainingSlots),
  };
}
