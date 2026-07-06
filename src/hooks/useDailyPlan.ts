/**
 * Daily plan hooks — read-or-generate today's plan, swipe-swap a
 * slot, toggle the tired flag.
 *
 * Generation runs client-side through the pure planner; a future
 * server-side generator replaces ensurePlan's body without touching
 * any screen.
 */
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { track } from '@/lib/analytics';
import { dailyTargets } from '@/lib/macros';
import { getTimeConstraints } from '@/lib/household';
import { availableIngredientIds, listPantryItems } from '@/lib/pantry';
import {
  DEFAULT_TIME_CONSTRAINTS,
  formatDateKey,
  generateDayPlan,
  type PlannerInput,
} from '@/lib/planner';
import { getPlan, listRecentPlans, savePlan, updatePlan } from '@/lib/plans';
import { CANONICAL_STAPLES, SEED_DISHES } from '@/lib/seed';
import type { ConditionFlag, DailyPlan, MealSlotName } from '@/types/domain';
import { PLAN_QUERY_KEY } from './usePantry';

const STAPLE_IDS = new Set(CANONICAL_STAPLES.map((staple) => staple.id));

/**
 * Macro profile until goal/weight flow from onboarding storage:
 * maintenance at the default weight. Deliberately conservative.
 */
const DEFAULT_PROFILE = { goal: 'maintenance' as const, weight_kg: null };

async function buildPlannerInput(
  date: Date,
  conditionFlags: ConditionFlag[],
): Promise<PlannerInput> {
  const dateKey = formatDateKey(date);
  const [pantryItems, timeConstraints, recentPlans] = await Promise.all([
    listPantryItems(),
    getTimeConstraints(),
    listRecentPlans(dateKey, 7),
  ]);

  const recentDishIds = recentPlans
    .filter((plan) => plan.date !== dateKey)
    .flatMap((plan) => plan.slots.map((slot) => slot.dish_id));

  return {
    date,
    pantry: availableIngredientIds(pantryItems),
    preferences: { timeConstraints: timeConstraints ?? DEFAULT_TIME_CONSTRAINTS },
    targets: dailyTargets(DEFAULT_PROFILE),
    history: { recentDishIds },
    conditionFlags,
    dishes: SEED_DISHES,
    stapleIngredientIds: STAPLE_IDS,
  };
}

async function ensurePlan(date: Date): Promise<DailyPlan> {
  const dateKey = formatDateKey(date);
  const existing = await getPlan(dateKey);
  if (existing) return existing;

  const input = await buildPlannerInput(date, []);
  const plan = await savePlan(generateDayPlan(input));
  track('plan_generated', { date: dateKey });
  return plan;
}

export function useDailyPlan(date: Date) {
  const dateKey = formatDateKey(date);
  return useQuery({
    queryKey: [PLAN_QUERY_KEY, dateKey],
    queryFn: () => ensurePlan(date),
    staleTime: 60 * 1000,
  });
}

/** Yesterday's plan, read-only — never generated retroactively. */
export function usePlanForDate(dateKey: string) {
  return useQuery({
    queryKey: [PLAN_QUERY_KEY, dateKey, 'readonly'],
    queryFn: () => getPlan(dateKey),
    staleTime: 60 * 1000,
  });
}

/**
 * Accept the pre-computed swap for a slot: the alternative becomes
 * the dish, the previous dish becomes the alternative.
 */
export function useAcceptSwap(date: Date) {
  const queryClient = useQueryClient();
  const dateKey = formatDateKey(date);

  return useMutation({
    mutationFn: async (slotName: MealSlotName) => {
      const plan = await getPlan(dateKey);
      if (!plan) return null;
      const slots = plan.slots.map((slot) => {
        if (slot.slot !== slotName) return slot;
        const swapDish = SEED_DISHES.find((dish) => dish.id === slot.swap_dish_id);
        if (!swapDish) return slot;
        return {
          ...slot,
          dish_id: swapDish.id,
          swap_dish_id: slot.dish_id,
          source: 'swapped' as const,
          protein_g: swapDish.protein_g,
          calories: swapDish.calories,
        };
      });
      return updatePlan(dateKey, { slots });
    },
    onSuccess: (_plan, slotName) => {
      void queryClient.invalidateQueries({ queryKey: [PLAN_QUERY_KEY] });
      track('swap_used', { slot: slotName, date: dateKey });
    },
  });
}

/**
 * Tired chip: toggles the 'tired' condition flag and regenerates
 * dinner only — breakfast and lunch stay as planned/logged.
 */
export function useToggleTired(date: Date) {
  const queryClient = useQueryClient();
  const dateKey = formatDateKey(date);

  return useMutation({
    mutationFn: async () => {
      const plan = await getPlan(dateKey);
      if (!plan) return null;

      const wasTired = plan.condition_flags.includes('tired');
      const conditionFlags: ConditionFlag[] = wasTired ? [] : ['tired'];

      const input = await buildPlannerInput(date, conditionFlags);
      const regenerated = generateDayPlan({
        ...input,
        // Keep regeneration stable per toggle state within the day.
        randomSeed: undefined,
      });

      const regeneratedDinner = regenerated.slots.find((slot) => slot.slot === 'dinner');
      const slots = plan.slots.map((slot) =>
        slot.slot === 'dinner' && regeneratedDinner ? regeneratedDinner : slot,
      );

      const updated = await updatePlan(dateKey, {
        slots,
        condition_flags: conditionFlags,
        plan_version: plan.plan_version + 1,
      });
      return { updated, nowTired: !wasTired };
    },
    onSuccess: (result) => {
      void queryClient.invalidateQueries({ queryKey: [PLAN_QUERY_KEY] });
      if (result) track('tired_chip_tapped', { now_tired: result.nowTired, date: dateKey });
    },
  });
}
