/**
 * Grocery screen — Pravah tab (hidden, accessed via router.push).
 * Design ref: grocery.jsx from Pravah.html design bundle.
 *
 * Features:
 * - Hero card with live total price (rose Newsreader serif)
 * - Stat chips: "Planned Meals 09" + "Items to Buy XX" (live count)
 * - Category lists with lavender chip headers
 * - Item rows: tap to check/uncheck (strikethrough + price fade)
 * - Live total price recalculation
 * - Sticky "Add all to Cart" CTA → "Order placed!" success banner
 */
import { MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, fonts, radii, shadows, spacing, typography } from '@/lib/theme';

interface GroceryItem {
  id: string;
  name: string;
  sub: string;
  price: number;
  unit: string;
}

interface Category {
  label: string;
  items: GroceryItem[];
}

const CATEGORIES: Category[] = [
  {
    label: 'Lean Proteins',
    items: [
      { id: 'p1', name: 'Chicken Breast', sub: '500g · boneless', price: 180, unit: '₹' },
      { id: 'p2', name: 'Paneer', sub: '200g · fresh', price: 95, unit: '₹' },
      { id: 'p3', name: 'Eggs', sub: '12 pack · free range', price: 72, unit: '₹' },
      { id: 'p4', name: 'Greek Yoghurt', sub: '400g · plain', price: 110, unit: '₹' },
    ],
  },
  {
    label: 'Vitamins & Fiber',
    items: [
      { id: 'v1', name: 'Spinach', sub: '250g · baby leaves', price: 35, unit: '₹' },
      { id: 'v2', name: 'Broccoli', sub: '300g · florets', price: 55, unit: '₹' },
      { id: 'v3', name: 'Bananas', sub: '6 pack · ripe', price: 40, unit: '₹' },
      { id: 'v4', name: 'Sweet Potato', sub: '500g · orange', price: 45, unit: '₹' },
    ],
  },
  {
    label: 'Grains & Carbs',
    items: [
      { id: 'g1', name: 'Brown Rice', sub: '1kg · basmati', price: 85, unit: '₹' },
      { id: 'g2', name: 'Oats', sub: '500g · rolled', price: 65, unit: '₹' },
      { id: 'g3', name: 'Whole Wheat Roti', sub: '10 pack · fresh', price: 50, unit: '₹' },
    ],
  },
  {
    label: 'Dairy & Fats',
    items: [
      { id: 'd1', name: 'Milk', sub: '1L · full fat', price: 58, unit: '₹' },
      { id: 'd2', name: 'Almonds', sub: '100g · raw', price: 120, unit: '₹' },
      { id: 'd3', name: 'Ghee', sub: '200ml · desi', price: 140, unit: '₹' },
    ],
  },
];

const ALL_ITEMS = CATEGORIES.flatMap((c) => c.items);

export default function GroceryScreen() {
  const insets = useSafeAreaInsets();

  const [checked, setChecked] = useState<Set<string>>(new Set());
  const [ordered, setOrdered] = useState(false);

  const toggle = (id: string) => {
    setChecked((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const uncheckedTotal = useMemo(
    () => ALL_ITEMS.filter((i) => !checked.has(i.id)).reduce((a, i) => a + i.price, 0),
    [checked],
  );

  const uncheckedCount = ALL_ITEMS.length - checked.size;

  return (
    <View style={st.screen}>
      <ScrollView
        contentContainerStyle={{ paddingBottom: 120 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Top bar */}
        <View style={[st.topBar, { paddingTop: insets.top + 12 }]}>
          <View style={st.topBarL}>
            <Pressable style={st.backBtn} onPress={() => router.back()}>
              <MaterialIcons name="arrow-back" size={20} color={colors.eggplant} />
            </Pressable>
            <Text style={st.brand}>Pravah</Text>
          </View>
          <MaterialIcons name="notifications-none" size={22} color={colors.rose} />
        </View>

        <View style={st.content}>
          {/* Hero card */}
          <View style={[st.heroCard, shadows.card]}>
            <View style={st.heroDecor} />
            <View style={st.heroTop}>
              <View>
                <Text style={st.heroOverline}>Next 7 days</Text>
                <Text style={st.heroTitle}>Grocery List</Text>
              </View>
              <View style={st.heroPriceWrap}>
                <Text style={st.heroPriceLabel}>Est. Total</Text>
                <Text style={st.heroPrice}>₹{uncheckedTotal}</Text>
              </View>
            </View>
            <View style={st.heroChips}>
              <View style={[st.heroChip, { backgroundColor: '#fff' }]}>
                <Text style={st.heroChipVal}>09</Text>
                <Text style={st.heroChipLbl}>Planned Meals</Text>
              </View>
              <View style={[st.heroChip, { backgroundColor: '#fff' }]}>
                <Text style={st.heroChipVal}>{String(uncheckedCount).padStart(2, '0')}</Text>
                <Text style={st.heroChipLbl}>Items to Buy</Text>
              </View>
            </View>
          </View>

          {/* Success banner */}
          {ordered && (
            <View style={[st.successBanner, { backgroundColor: colors.mint }]}>
              <Text style={{ fontSize: 24 }}>🎉</Text>
              <View>
                <Text style={st.successTitle}>Order placed!</Text>
                <Text style={st.successSub}>Your groceries are on the way.</Text>
              </View>
            </View>
          )}

          {/* Category lists */}
          {CATEGORIES.map((cat) => (
            <View key={cat.label}>
              <View style={st.catHeader}>
                <View style={st.catChip}>
                  <Text style={st.catChipTxt}>{cat.label.toUpperCase()}</Text>
                </View>
              </View>
              <View style={[st.catCard, shadows.cardSubtle]}>
                {cat.items.map((item, i) => {
                  const isChecked = checked.has(item.id);
                  return (
                    <Pressable
                      key={item.id}
                      style={[st.itemRow, i < cat.items.length - 1 && st.itemRowBorder]}
                      onPress={() => toggle(item.id)}
                    >
                      <View style={[st.checkbox, isChecked && st.checkboxChecked]}>
                        {isChecked && <MaterialIcons name="check" size={14} color="#fff" />}
                      </View>
                      <View style={st.itemText}>
                        <Text style={[st.itemName, isChecked && st.itemNameDone]}>{item.name}</Text>
                        <Text style={st.itemSub}>{item.sub}</Text>
                      </View>
                      <Text style={[st.itemPrice, isChecked && st.itemPriceDone]}>
                        {item.unit}
                        {item.price}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
            </View>
          ))}
        </View>
      </ScrollView>

      {/* Sticky CTA */}
      {!ordered && (
        <View style={[st.stickyBar, { paddingBottom: Math.max(insets.bottom, 8) + 8 }]}>
          <View style={st.stickyInner}>
            <View>
              <Text style={st.stickyTotal}>₹{uncheckedTotal}</Text>
              <Text style={st.stickyCount}>{uncheckedCount} items remaining</Text>
            </View>
            <Pressable style={st.ctaBtn} onPress={() => setOrdered(true)}>
              <MaterialIcons name="shopping-cart" size={16} color="#fff" />
              <Text style={st.ctaBtnTxt}>Add all to Cart</Text>
            </Pressable>
          </View>
        </View>
      )}
    </View>
  );
}

const st = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#faf4f4' },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.gutter,
    paddingBottom: 12,
    backgroundColor: colors.tonal,
  },
  topBarL: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.lavender,
    alignItems: 'center',
    justifyContent: 'center',
  },
  brand: {
    fontFamily: fonts.displayItalic,
    fontSize: typography.size.lg,
    color: colors.text.primary,
  },
  content: { padding: spacing.gutter, gap: 16 },

  heroCard: {
    backgroundColor: '#f2e4e4',
    borderRadius: radii.card,
    padding: 22,
    overflow: 'hidden',
    position: 'relative',
    gap: 16,
  },
  heroDecor: {
    position: 'absolute',
    top: -40,
    right: -40,
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: colors.rose,
    opacity: 0.07,
  },
  heroTop: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between' },
  heroOverline: {
    fontFamily: fonts.label,
    fontSize: typography.size.xs,
    color: colors.primary,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: 4,
  },
  heroTitle: { fontFamily: fonts.display, fontSize: 26, color: colors.text.primary },
  heroPriceWrap: { alignItems: 'flex-end' },
  heroPriceLabel: {
    fontFamily: fonts.body,
    fontSize: typography.size.xs,
    color: colors.text.secondary,
    marginBottom: 2,
  },
  heroPrice: { fontFamily: fonts.displayItalic, fontSize: 30, color: colors.rose, lineHeight: 30 },
  heroChips: { flexDirection: 'row', gap: 10 },
  heroChip: {
    flex: 1,
    borderRadius: radii.lg,
    paddingVertical: 12,
    paddingHorizontal: 14,
    gap: 2,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  heroChipVal: {
    fontFamily: fonts.statsThin,
    fontSize: 24,
    color: colors.text.primary,
    lineHeight: 24,
  },
  heroChipLbl: { fontFamily: fonts.body, fontSize: 10, color: colors.text.secondary },

  successBanner: {
    borderRadius: radii.card,
    padding: 18,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  successTitle: { fontFamily: fonts.display, fontSize: 18, color: colors.eggplant },
  successSub: { fontFamily: fonts.body, fontSize: 13, color: `${colors.eggplant}aa` },

  catHeader: { marginBottom: 8 },
  catChip: {
    alignSelf: 'flex-start',
    backgroundColor: colors.lavender,
    borderRadius: radii.pill,
    paddingHorizontal: 12,
    paddingVertical: 5,
  },
  catChipTxt: {
    fontFamily: fonts.label,
    fontSize: typography.size.xs,
    color: colors.eggplant,
    letterSpacing: 0.8,
  },
  catCard: { backgroundColor: colors.surface, borderRadius: radii.card, overflow: 'hidden' },

  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  itemRowBorder: { borderBottomWidth: 1, borderBottomColor: colors.outlineVariant },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: colors.outlineVariant,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  checkboxChecked: { backgroundColor: colors.rose, borderColor: colors.rose },
  itemText: { flex: 1 },
  itemName: { fontFamily: fonts.display, fontSize: 14, color: colors.text.primary, lineHeight: 18 },
  itemNameDone: { textDecorationLine: 'line-through', opacity: 0.45 },
  itemSub: { fontFamily: fonts.body, fontSize: 11, color: colors.text.secondary, marginTop: 1 },
  itemPrice: {
    fontFamily: fonts.bodyBold,
    fontSize: 13,
    color: colors.text.primary,
    flexShrink: 0,
  },
  itemPriceDone: { opacity: 0.35 },

  stickyBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.outlineVariant,
    paddingTop: 12,
    paddingHorizontal: spacing.gutter,
  },
  stickyInner: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  stickyTotal: { fontFamily: fonts.display, fontSize: 20, color: colors.text.primary },
  stickyCount: { fontFamily: fonts.body, fontSize: 12, color: colors.text.secondary },
  ctaBtn: {
    backgroundColor: colors.rose,
    borderRadius: radii.pill,
    paddingVertical: 14,
    paddingHorizontal: 24,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  ctaBtnTxt: {
    fontFamily: fonts.bodyBold,
    fontSize: 13,
    color: '#fff',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
});
