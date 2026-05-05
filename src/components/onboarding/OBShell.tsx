/**
 * OBShell — shared shell for onboarding v2 screens (S1–S6).
 *
 * Renders: navbar → progress rail → page header → scrollable content → footer CTA.
 * The welcome screen (S0) bypasses this shell entirely.
 */

import React from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ob } from '@/features/onboarding/theme';

interface OBShellProps {
  /** 1–6: controls rail state (0 would mean no rail, but all v2 steps have one). */
  step: number;
  stepLabel: string;
  /** First line of the serif headline (before the italic second line). */
  titleLine1: string;
  /** Second line rendered in italic rose-deep. */
  titleLine2: string;
  desc: string;
  navActionLabel?: string;
  onNavAction?: () => void;
  ctaLabel: string;
  ctaDisabled?: boolean;
  onCta: () => void;
  children: React.ReactNode;
}

const RAIL_SEGMENTS = 6;

export function OBShell({
  step,
  stepLabel,
  titleLine1,
  titleLine2,
  desc,
  navActionLabel,
  onNavAction,
  ctaLabel,
  ctaDisabled = false,
  onCta,
  children,
}: OBShellProps) {
  const insets = useSafeAreaInsets();

  return (
    <KeyboardAvoidingView
      style={[styles.root, { backgroundColor: ob.bg }]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={0}
    >
      {/* Navbar */}
      <View style={[styles.navbar, { paddingTop: insets.top + 8 }]}>
        <Text style={styles.brand}>Pravah</Text>
        {navActionLabel != null && onNavAction != null ? (
          <Pressable onPress={onNavAction} hitSlop={12}>
            <Text style={styles.navAction}>{navActionLabel}</Text>
          </Pressable>
        ) : (
          <View style={styles.navPlaceholder} />
        )}
      </View>

      {/* Progress rail */}
      <View style={styles.rail}>
        {Array.from({ length: RAIL_SEGMENTS }, (_, i) => {
          const isDone = i < step - 1;
          const isActive = i === step - 1;
          const fillWidth = isDone ? '100%' : isActive ? '50%' : '0%';
          return (
            <View key={i} style={styles.railSeg}>
              <View style={[styles.railFill, { width: fillWidth }]} />
            </View>
          );
        })}
      </View>

      {/* Page header */}
      <View style={styles.pageHeader}>
        <Text style={styles.stepLabel}>{stepLabel}</Text>
        <Text style={styles.pageTitle}>
          {titleLine1 + '\n'}
          <Text style={styles.pageTitleItalic}>{titleLine2}</Text>
        </Text>
        <Text style={styles.pageDesc}>{desc}</Text>
      </View>

      {/* Scrollable content */}
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {children}
      </ScrollView>

      {/* Footer CTA */}
      <View style={[styles.footer, { paddingBottom: insets.bottom + 28 }]}>
        <Pressable
          style={[styles.ctaBtn, ctaDisabled && styles.ctaBtnDisabled]}
          onPress={onCta}
          disabled={ctaDisabled}
        >
          <Text style={styles.ctaBtnText}>{ctaLabel}</Text>
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },

  navbar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 22,
    paddingBottom: 14,
  },
  brand: {
    fontFamily: ob.serif,
    fontSize: 20,
    color: ob.ink,
    letterSpacing: -0.2,
  },
  navAction: {
    fontFamily: ob.sans,
    fontSize: 12,
    color: ob.ink3,
    letterSpacing: 0.5,
  },
  navPlaceholder: { width: 40 },

  rail: {
    flexDirection: 'row',
    gap: 5,
    paddingHorizontal: 22,
    paddingBottom: 20,
  },
  railSeg: {
    flex: 1,
    height: 2,
    borderRadius: 1,
    backgroundColor: ob.border,
    overflow: 'hidden',
  },
  railFill: {
    height: '100%',
    backgroundColor: ob.rose,
    borderRadius: 1,
  },

  pageHeader: {
    paddingHorizontal: 22,
    paddingBottom: 22,
  },
  stepLabel: {
    fontFamily: ob.sansMedium,
    fontSize: 9,
    letterSpacing: 1.3,
    textTransform: 'uppercase',
    color: ob.ink3,
    marginBottom: 10,
  },
  pageTitle: {
    fontFamily: ob.serif,
    fontSize: 32,
    lineHeight: 37,
    color: ob.ink,
    letterSpacing: -0.6,
    marginBottom: 8,
  },
  pageTitleItalic: {
    fontFamily: ob.serifItalic,
    fontSize: 32,
    color: ob.roseDeep,
    letterSpacing: -0.6,
  },
  pageDesc: {
    fontFamily: ob.sans,
    fontSize: 13,
    color: ob.ink2,
    lineHeight: 21,
  },

  scroll: { flex: 1 },
  content: { paddingHorizontal: 22, paddingBottom: 20 },

  footer: {
    paddingHorizontal: 22,
    paddingTop: 16,
  },
  ctaBtn: {
    backgroundColor: ob.rose,
    borderRadius: 40,
    paddingVertical: 16,
    alignItems: 'center',
  },
  ctaBtnDisabled: {
    opacity: 0.4,
  },
  ctaBtnText: {
    fontFamily: ob.sansRegular,
    fontSize: 15,
    color: '#ffffff',
    letterSpacing: 0.3,
  },
});
