/**
 * Fuel / Meals screen — Pravah tab.
 * Design ref: meals.jsx from Pravah.html design bundle.
 * Interactive: log meal → fill animation → state update; swap alternatives; skip.
 */
import { MaterialIcons } from '@expo/vector-icons';
import React, { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useLogMeal, useMeals } from '@/features/meals';
import type { Meal, MealSlot } from '@/features/meals';
import { useAppStore } from '@/stores/appStore';
import { colors, fonts, radii, shadows, spacing, typography } from '@/lib/theme';

type Phase = 'ready' | 'logging' | 'logged' | 'swapping';

/**
 * Slot → display label / time-of-day. The catalog stores meal_slot but
 * not a wall-clock time; the time shown next to each card is a UI-level
 * convention until per-user scheduling lands in user_meal_plans.
 */
const SLOT_ORDER: readonly MealSlot[] = ['breakfast', 'lunch', 'dinner', 'snack'] as const;
const SLOT_LABEL: Record<MealSlot, string> = {
  breakfast: 'Breakfast',
  lunch: 'Lunch',
  dinner: 'Dinner',
  snack: 'Snack',
};
const SLOT_TIME: Record<MealSlot, string> = {
  breakfast: '8:00 AM',
  lunch: '1:00 PM',
  snack: '4:00 PM',
  dinner: '7:30 PM',
};

/** Display shape derived from the catalog Meal row. */
interface MealCard {
  /** UUID of the public.meals row — needed to write user_meal_plans. */
  mealId: string;
  /** Enum key used as part of the user_meal_plans unique constraint. */
  slot: MealSlot;
  name: string; // slot label, e.g. "Breakfast"
  time: string;
  items: string;
  protein: number;
  carbs: number;
  fat: number;
  cal: number;
}

function toMealCard(meal: Meal): MealCard {
  return {
    mealId: meal.id,
    slot: meal.meal_slot,
    name: SLOT_LABEL[meal.meal_slot],
    time: SLOT_TIME[meal.meal_slot],
    items: meal.description ?? meal.name,
    protein: meal.protein_g,
    carbs: meal.carbs_g,
    fat: meal.fat_g,
    cal: meal.calories_kcal,
  };
}

/**
 * Pick one meal per slot, in canonical order, from the catalog rows.
 * Until per-user plan generation lands, this acts as today's plan.
 */
function buildTodayPlan(meals: readonly Meal[]): MealCard[] {
  const bySlot = new Map<MealSlot, Meal>();
  for (const m of meals) {
    if (!bySlot.has(m.meal_slot)) bySlot.set(m.meal_slot, m);
  }
  return SLOT_ORDER.flatMap((slot) => {
    const m = bySlot.get(slot);
    return m ? [toMealCard(m)] : [];
  });
}

// Smart-swap suggestions remain hardcoded for now. A follow-up will source
// these from the same catalog (calorie-matched alternatives in the same slot).
const SWAPS = [
  { name: 'Tofu Stir Fry', protein: 36, cal: 490 },
  { name: 'Egg Bhurji Bowl', protein: 42, cal: 510 },
  { name: 'Greek Yogurt Bowl', protein: 34, cal: 460 },
];

export default function MealsScreen() {
  const insets = useSafeAreaInsets();
  const { user, today, setMealLogged } = useAppStore();
  const { data: catalog, isLoading, error, refetch } = useMeals();
  const logMeal = useLogMeal();
  const MEALS = useMemo<readonly MealCard[]>(() => buildTodayPlan(catalog ?? []), [catalog]);
  const [activeMeal, setActiveMeal] = useState(today.meals.done);
  const [phase, setPhase] = useState<Phase>('ready');
  const [fillPct, setFillPct] = useState(0);
  const [swapIdx, setSwapIdx] = useState<number | null>(null);
  const [logErrorMessage, setLogErrorMessage] = useState<string | null>(null);
  const allDone = MEALS.length > 0 && activeMeal >= MEALS.length;
  const plannedMeals = MEALS.length || today.meals.total;
  const loggedMeals = Math.min(activeMeal, plannedMeals);

  const handleEat = async () => {
    const meal = MEALS[activeMeal];
    if (!meal || logMeal.isPending) return;

    setLogErrorMessage(null);
    setPhase('logging');
    setFillPct(35);

    try {
      const todayDate = new Date().toISOString().split('T')[0] ?? '';
      await logMeal.mutateAsync({ mealId: meal.mealId, slot: meal.slot, date: todayDate });

      setFillPct(100);
      setTimeout(() => {
        setPhase('logged');
        setMealLogged();
        setTimeout(() => {
          setActiveMeal((value) => value + 1);
          setPhase('ready');
          setFillPct(0);
        }, 1200);
      }, 180);
    } catch (nextError) {
      setPhase('ready');
      setFillPct(0);
      setLogErrorMessage(
        nextError instanceof Error ? nextError.message : 'Could not log this meal.',
      );
    }
  };

  const doneMeals = MEALS.slice(0, activeMeal);
  const totalCal = doneMeals.reduce((a, m) => a + m.cal, 0);
  const totalProtein = doneMeals.reduce((a, m) => a + m.protein, 0);
  const totalCarbs = doneMeals.reduce((a, m) => a + m.carbs, 0);

  return (
    <ScrollView
      style={st.screen}
      contentContainerStyle={{ paddingBottom: 120 }}
      showsVerticalScrollIndicator={false}
    >
      <View style={[st.topBar, { paddingTop: insets.top + 12 }]}>
        <View style={st.topBarL}>
          <View style={st.avatar}>
            <Text style={st.avatarTxt}>{user.name.charAt(0).toUpperCase()}</Text>
          </View>
          <Text style={st.brand}>Pravah</Text>
        </View>
        <MaterialIcons name="notifications-none" size={22} color={colors.rose} />
      </View>

      <View style={st.content}>
        <Text style={st.title}>
          <Text style={st.titleI}>Your meals today</Text>
        </Text>
        <Text style={st.subtitle}>
          {loggedMeals} of {plannedMeals} logged · {1440 - totalCal} kcal remaining
        </Text>

        {/* Macro summary */}
        <View style={[st.macroCard, shadows.card]}>
          {[
            {
              label: 'Calories',
              val: String(totalCal),
              unit: 'kcal',
              pct: Math.min(100, (totalCal / 1440) * 100),
              color: colors.rose,
            },
            {
              label: 'Protein',
              val: String(totalProtein),
              unit: 'g',
              pct: Math.min(100, (totalProtein / 90) * 100),
              color: colors.mint,
            },
            {
              label: 'Carbs',
              val: String(totalCarbs),
              unit: 'g',
              pct: Math.min(100, (totalCarbs / 184) * 100),
              color: colors.sky,
            },
          ].map((m, i) => (
            <View key={m.label} style={[st.macroCell, i < 2 && st.macroDiv]}>
              <Text style={st.macroVal}>{m.val}</Text>
              <Text style={st.macroUnit}>
                {m.unit} {m.label}
              </Text>
              <View style={st.barTrack}>
                <View
                  style={[
                    st.barFill,
                    { width: `${m.pct}%` as `${number}%`, backgroundColor: m.color },
                  ]}
                />
              </View>
            </View>
          ))}
        </View>

        {/* Loading skeleton — 3 placeholder cards while the catalog query resolves. */}
        {isLoading && (
          <View style={st.skeletonGroup}>
            {[0, 1, 2].map((i) => (
              <View key={i} style={[st.mealCard, st.skeletonCard]}>
                <View style={st.skeletonLineWide} />
                <View style={st.skeletonLineNarrow} />
              </View>
            ))}
          </View>
        )}

        {/* Error fallback — surface the message with a retry. */}
        {error && !isLoading && (
          <View style={st.errorCard}>
            <Text style={st.errorTitle}>Could not load meals</Text>
            <Text style={st.errorBody}>{error.message}</Text>
            <Pressable style={st.errorRetry} onPress={() => refetch()}>
              <Text style={st.errorRetryTxt}>Try again</Text>
            </Pressable>
          </View>
        )}

        {/* Empty catalog — defensive: schema is live but seed is missing. */}
        {!isLoading && !error && MEALS.length === 0 && (
          <View style={st.errorCard}>
            <Text style={st.errorTitle}>No meals available</Text>
            <Text style={st.errorBody}>
              The meal catalog is empty. Run the local seed or contact an admin.
            </Text>
          </View>
        )}

        {/* Meal cards */}
        {MEALS.map((meal, i) => {
          const isDone = i < activeMeal;
          const isCurrent = i === activeMeal && !allDone;
          return (
            <View
              key={meal.name}
              style={[
                st.mealCard,
                shadows.cardSubtle,
                isCurrent && st.mealActive,
                i > activeMeal && { opacity: 0.55 },
              ]}
            >
              <View style={st.mealHead}>
                <View style={st.mealHeadL}>
                  <View
                    style={[
                      st.mealDot,
                      {
                        backgroundColor: isDone
                          ? colors.mint
                          : isCurrent
                            ? colors.rose
                            : colors.tonal,
                      },
                    ]}
                  />
                  <View>
                    <Text style={st.mealName}>{meal.name}</Text>
                    <Text style={st.mealTime}>{meal.time}</Text>
                  </View>
                </View>
                <View
                  style={[
                    st.chip,
                    {
                      backgroundColor: isDone
                        ? colors.mint
                        : isCurrent
                          ? `${colors.rose}33`
                          : colors.tonal,
                    },
                  ]}
                >
                  <Text style={st.chipTxt}>
                    {isDone ? 'Logged ✓' : isCurrent ? 'Up next' : 'Scheduled'}
                  </Text>
                </View>
              </View>

              {isCurrent && (
                <View style={st.mealBody}>
                  <Text style={st.mealItems}>{meal.items}</Text>
                  <View style={st.chips4}>
                    {[
                      { l: 'Protein', v: `${meal.protein}g`, bg: colors.mint },
                      { l: 'Carbs', v: `${meal.carbs}g`, bg: colors.sky },
                      { l: 'Fat', v: `${meal.fat}g`, bg: colors.lavender },
                      { l: 'Cal', v: String(meal.cal), bg: colors.tonal },
                    ].map((mc) => (
                      <View key={mc.l} style={[st.chip4, { backgroundColor: mc.bg }]}>
                        <Text style={st.chip4Val}>{mc.v}</Text>
                        <Text style={st.chip4Lbl}>{mc.l}</Text>
                      </View>
                    ))}
                  </View>

                  {phase === 'logging' && (
                    <View style={st.fillWrap}>
                      <View style={st.fillTrack}>
                        <View style={[st.fillBar, { width: `${fillPct}%` as `${number}%` }]} />
                      </View>
                      <Text style={st.fillLbl}>Logging…</Text>
                    </View>
                  )}
                  {phase === 'logged' && (
                    <View style={st.loggedRow}>
                      <Text style={st.loggedEmoji}>✅</Text>
                      <Text style={st.loggedTxt}>Logged! +8% progress</Text>
                    </View>
                  )}
                  {logErrorMessage && phase === 'ready' && (
                    <Text style={st.logErrorText}>{logErrorMessage}</Text>
                  )}
                  {phase === 'swapping' && (
                    <View style={st.swapList}>
                      <Text style={st.swapLbl}>Smart swaps</Text>
                      {SWAPS.map((sw, si) => (
                        <Pressable
                          key={si}
                          style={[st.swapRow, swapIdx === si && { backgroundColor: colors.mint }]}
                          onPress={() => {
                            setSwapIdx(si);
                            setPhase('ready');
                          }}
                        >
                          <Text style={st.swapName}>{sw.name}</Text>
                          <Text style={st.swapMeta}>
                            {sw.protein}g P · {sw.cal} cal
                          </Text>
                        </Pressable>
                      ))}
                    </View>
                  )}
                  {(phase === 'ready' || phase === 'swapping') && (
                    <View style={st.ctaRow}>
                      <Pressable style={[st.ctaPrimary, { flex: 2 }]} onPress={handleEat}>
                        <Text style={st.ctaPrimaryTxt}>✓ Ate This</Text>
                      </Pressable>
                      <Pressable
                        style={[st.ctaGhost, { flex: 1 }]}
                        onPress={() => setPhase((p) => (p === 'swapping' ? 'ready' : 'swapping'))}
                      >
                        <Text style={st.ctaGhostTxt}>Swap</Text>
                      </Pressable>
                      <Pressable
                        style={[st.ctaOutline, { flex: 1 }]}
                        onPress={() => setActiveMeal((m) => m + 1)}
                      >
                        <Text style={st.ctaOutlineTxt}>Skip</Text>
                      </Pressable>
                    </View>
                  )}
                </View>
              )}
              {isDone && (
                <View style={st.doneSub}>
                  <Text style={st.doneSubTxt}>{meal.items}</Text>
                </View>
              )}
            </View>
          );
        })}

        {allDone && (
          <View style={[st.allDone, { backgroundColor: colors.mint }]}>
            <Text style={{ fontSize: 36 }}>🎉</Text>
            <Text style={st.allDoneTitle}>All meals logged!</Text>
            <Text style={st.allDoneSub}>You hit your nutrition targets today.</Text>
          </View>
        )}
      </View>
    </ScrollView>
  );
}

const st = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bg },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.gutter,
    paddingBottom: 12,
    backgroundColor: colors.tonal,
  },
  topBarL: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.rose,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarTxt: { fontFamily: fonts.bodyBold, fontSize: 14, color: '#fff' },
  brand: {
    fontFamily: fonts.displayItalic,
    fontSize: typography.size.lg,
    color: colors.text.primary,
  },
  content: { padding: spacing.gutter, gap: 14 },
  title: { fontFamily: fonts.display, fontSize: 26, color: colors.text.primary },
  titleI: { fontFamily: fonts.displayItalic, fontSize: 26 },
  subtitle: { fontFamily: fonts.body, fontSize: typography.size.sm, color: colors.text.secondary },
  macroCard: {
    backgroundColor: colors.surface,
    borderRadius: radii.card,
    padding: 18,
    flexDirection: 'row',
  },
  macroCell: { flex: 1, alignItems: 'center', paddingHorizontal: 8 },
  macroDiv: { borderRightWidth: 1, borderRightColor: colors.outlineVariant },
  macroVal: {
    fontFamily: fonts.statsThin,
    fontSize: 26,
    color: colors.text.primary,
    lineHeight: 26,
  },
  macroUnit: {
    fontFamily: fonts.body,
    fontSize: 10,
    color: colors.text.secondary,
    marginBottom: 6,
  },
  barTrack: {
    height: 3,
    width: '100%',
    borderRadius: 2,
    backgroundColor: colors.tonal,
    overflow: 'hidden',
  },
  barFill: { height: '100%', borderRadius: 2 },
  mealCard: { backgroundColor: colors.surface, borderRadius: radii.card, overflow: 'hidden' },
  mealActive: { borderWidth: 2, borderColor: colors.rose },
  mealHead: {
    padding: 18,
    paddingBottom: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  mealHeadL: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  mealDot: { width: 10, height: 10, borderRadius: 5 },
  mealName: { fontFamily: fonts.bodySemi, fontSize: 14, color: colors.text.primary },
  mealTime: { fontFamily: fonts.body, fontSize: 11, color: colors.text.secondary },
  chip: { borderRadius: radii.pill, paddingHorizontal: 10, paddingVertical: 4 },
  chipTxt: { fontFamily: fonts.label, fontSize: typography.size.xs, color: colors.eggplant },
  mealBody: { padding: 18, paddingTop: 12, gap: 10 },
  mealItems: { fontFamily: fonts.body, fontSize: 14, color: colors.text.primary },
  chips4: { flexDirection: 'row', gap: 10 },
  chip4: { flex: 1, borderRadius: 10, paddingVertical: 7, alignItems: 'center' },
  chip4Val: { fontFamily: fonts.bodyBold, fontSize: 13, color: colors.eggplant },
  chip4Lbl: {
    fontFamily: fonts.body,
    fontSize: 9,
    color: `${colors.eggplant}88`,
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  fillWrap: { gap: 6 },
  fillTrack: { height: 6, borderRadius: 3, backgroundColor: colors.tonal, overflow: 'hidden' },
  fillBar: { height: '100%', backgroundColor: colors.mint, borderRadius: 3 },
  fillLbl: {
    fontFamily: fonts.body,
    fontSize: 11,
    color: colors.text.secondary,
    textAlign: 'center',
  },
  loggedRow: { alignItems: 'center', paddingVertical: 8 },
  loggedEmoji: { fontSize: 32 },
  loggedTxt: { fontFamily: fonts.bodySemi, fontSize: 13, color: colors.mint },
  logErrorText: {
    marginTop: 4,
    fontFamily: fonts.body,
    fontSize: 12,
    color: colors.status.errorText,
  },
  swapList: { gap: 8 },
  swapLbl: {
    fontFamily: fonts.label,
    fontSize: 12,
    color: colors.text.secondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  swapRow: {
    backgroundColor: colors.surfaceLow,
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  swapName: { fontFamily: fonts.bodySemi, fontSize: 13, color: colors.text.primary },
  swapMeta: { fontFamily: fonts.body, fontSize: 11, color: colors.text.secondary },
  ctaRow: { flexDirection: 'row', gap: 8 },
  ctaPrimary: {
    backgroundColor: colors.rose,
    borderRadius: radii.pill,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ctaPrimaryTxt: {
    fontFamily: fonts.bodyBold,
    fontSize: 12,
    color: '#fff',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  ctaGhost: {
    backgroundColor: colors.tonal,
    borderRadius: radii.pill,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ctaGhostTxt: { fontFamily: fonts.bodySemi, fontSize: 12, color: colors.warmBrown },
  ctaOutline: {
    borderRadius: radii.pill,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: colors.outlineVariant,
  },
  ctaOutlineTxt: { fontFamily: fonts.bodySemi, fontSize: 12, color: colors.warmBrown },
  doneSub: { paddingHorizontal: 18, paddingBottom: 14, paddingTop: 8 },
  doneSubTxt: { fontFamily: fonts.body, fontSize: 12, color: colors.text.secondary },
  allDone: { borderRadius: radii.card, padding: 20, alignItems: 'center', gap: 8 },
  allDoneTitle: { fontFamily: fonts.display, fontSize: 22, color: colors.eggplant },
  allDoneSub: { fontFamily: fonts.body, fontSize: 13, color: `${colors.eggplant}aa` },
  skeletonGroup: { gap: 14 },
  skeletonCard: { padding: 18, gap: 10 },
  skeletonLineWide: { height: 14, width: '60%', borderRadius: 4, backgroundColor: colors.tonal },
  skeletonLineNarrow: { height: 10, width: '35%', borderRadius: 4, backgroundColor: colors.tonal },
  errorCard: {
    backgroundColor: colors.surface,
    borderRadius: radii.card,
    padding: 18,
    gap: 8,
    alignItems: 'center',
  },
  errorTitle: { fontFamily: fonts.bodySemi, fontSize: 14, color: colors.text.primary },
  errorBody: {
    fontFamily: fonts.body,
    fontSize: 12,
    color: colors.text.secondary,
    textAlign: 'center',
  },
  errorRetry: {
    marginTop: 6,
    backgroundColor: colors.rose,
    borderRadius: radii.pill,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  errorRetryTxt: {
    fontFamily: fonts.bodyBold,
    fontSize: 12,
    color: '#fff',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
});
