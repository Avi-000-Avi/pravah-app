/**
 * SundayReviewCard — a once-a-week 3-slide horizontal scroll.
 *
 * Visible only on Sundays. Three slides:
 *  1. Days logged this week.
 *  2. Days cooked at home.
 *  3. Next-week readiness — kitchen set-up link.
 *
 * Dot indicator shows which slide is active. Dismisses permanently
 * per-week by using a date-scoped dismissal key.
 */
import { router } from 'expo-router';
import React, { useRef, useState } from 'react';
import type { NativeScrollEvent, NativeSyntheticEvent } from 'react-native';
import { Dimensions, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Card } from '@/components/Card';
import { GhostButton } from '@/components/GhostButton';
import { registerHomeCard } from '@/components/cards';
import type { HomeCardProps } from '@/components/cards/types';
import { track } from '@/lib/analytics';
import { formatDateKey } from '@/lib/planner';
import { listLogs } from '@/lib/mealLogs';
import { weeklyStats } from '@/lib/inactivity';
import { colors, fonts, radii, spacing, typography } from '@/lib/theme';

const SCREEN_W = Dimensions.get('window').width;
const SLIDE_GUTTER = spacing.gutter * 2; // card has padding on both sides
const SLIDE_W = SCREEN_W - SLIDE_GUTTER - spacing.gutter * 2; // outer scroll gutter

function isSunday(): boolean {
  return new Date().getDay() === 0;
}

async function loadStats() {
  const todayKey = formatDateKey(new Date());
  // Build date list for last 7 days
  const dates: string[] = [];
  for (let i = 0; i <= 7; i++) {
    const d = new Date(`${todayKey}T00:00:00`);
    d.setDate(d.getDate() - i);
    dates.push(d.toISOString().slice(0, 10));
  }
  const logs = await listLogs(dates);
  return weeklyStats(logs, todayKey, 7);
}

interface Slide {
  id: string;
  headline: string;
  subtext: string;
  action?: { label: string; onPress: () => void };
}

function makeSlides(loggedDays: number, homeCooked: number, dismiss: () => void): Slide[] {
  return [
    {
      id: 'logged',
      headline: `${loggedDays} of 7`,
      subtext: 'days with at least one meal logged.',
    },
    {
      id: 'home',
      headline: `${homeCooked} of 7`,
      subtext: 'days cooked at home.',
    },
    {
      id: 'next',
      headline: 'next week',
      subtext: "your kitchen's ready — plans are already being built around it.",
      action: {
        label: 'see your kitchen',
        onPress: () => {
          dismiss();
          router.push('/(tabs)/kitchen');
        },
      },
    },
  ];
}

function SundayReviewCard({ dismiss }: HomeCardProps) {
  const [stats, setStats] = React.useState<{ loggedDays: number; homeCooked: number } | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollRef = useRef<ScrollView>(null);

  React.useEffect(() => {
    void loadStats().then((s) => {
      setStats(s);
      track('sunday_review_opened', { logged_days: s.loggedDays, home_cooked: s.homeCooked });
    });
  }, []);

  const handleScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const index = Math.round(e.nativeEvent.contentOffset.x / SLIDE_W);
    setActiveIndex(index);
  };

  if (!stats) return null;

  const slides = makeSlides(stats.loggedDays, stats.homeCooked, dismiss);

  return (
    <Card style={styles.card}>
      <Text style={styles.eyebrow}>this week</Text>
      <ScrollView
        ref={scrollRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={handleScroll}
        style={styles.slideScroll}
        contentContainerStyle={styles.slideContainer}
      >
        {slides.map((slide) => (
          <View key={slide.id} style={[styles.slide, { width: SLIDE_W }]}>
            <Text style={styles.headline}>{slide.headline}</Text>
            <Text style={styles.subtext}>{slide.subtext}</Text>
            {slide.action ? (
              <GhostButton
                label={slide.action.label}
                onPress={slide.action.onPress}
                style={styles.slideAction}
              />
            ) : null}
          </View>
        ))}
      </ScrollView>
      <View style={styles.dots}>
        {slides.map((slide, i) => (
          <View
            key={slide.id}
            style={[styles.dot, i === activeIndex ? styles.dotActive : styles.dotInactive]}
          />
        ))}
      </View>
      <GhostButton label="close review" onPress={dismiss} style={styles.closeButton} />
    </Card>
  );
}

registerHomeCard({
  id: 'sunday-review',
  priority: 50,
  visibilityPredicate: () => isSunday(),
  dismissible: true,
  Component: SundayReviewCard,
});

const styles = StyleSheet.create({
  card: {
    padding: spacing.gutter,
    gap: spacing.base,
    overflow: 'hidden',
  },
  eyebrow: {
    fontFamily: fonts.label,
    fontSize: typography.size.xs,
    color: colors.text.secondary,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  slideScroll: {
    marginHorizontal: -spacing.xs,
  },
  slideContainer: {
    gap: 0,
  },
  slide: {
    paddingHorizontal: spacing.xs,
    gap: spacing.xs,
    minHeight: 80,
  },
  headline: {
    fontFamily: fonts.display,
    fontSize: typography.size['2xl'],
    color: colors.text.primary,
  },
  subtext: {
    fontFamily: fonts.body,
    fontSize: typography.size.base,
    color: colors.text.secondary,
    lineHeight: typography.size.base * typography.leading.normal,
  },
  slideAction: {
    alignSelf: 'flex-start',
    marginTop: spacing.xs,
  },
  dots: {
    flexDirection: 'row',
    gap: spacing.xs,
    justifyContent: 'center',
    marginTop: spacing.xs,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: radii.full,
  },
  dotActive: { backgroundColor: colors.primary },
  dotInactive: { backgroundColor: colors.gray[300] },
  closeButton: {
    alignSelf: 'center',
  },
});
