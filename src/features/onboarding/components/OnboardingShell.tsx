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
import { fonts, onboarding, typography } from '@/lib/theme';

interface OnboardingShellProps {
  step: number;
  stepLabel: string;
  titleLine1: string;
  titleLine2: string;
  desc: string;
  navActionLabel?: string;
  onNavAction?: () => void;
  ctaLabel: string;
  ctaDisabled?: boolean;
  onCta: () => void;
  children: React.ReactNode;
}

const SEGMENTS = 6;

export function OnboardingShell({
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
}: OnboardingShellProps) {
  const insets = useSafeAreaInsets();

  return (
    <KeyboardAvoidingView
      style={styles.root}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={0}
    >
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

      <View style={styles.rail}>
        {Array.from({ length: SEGMENTS }, (_, index) => {
          const isDone = index < step - 1;
          const isActive = index === step - 1;
          const fillWidth = isDone ? '100%' : isActive ? '50%' : '0%';

          return (
            <View key={index} style={styles.railSeg}>
              <View style={[styles.railFill, { width: fillWidth }]} />
            </View>
          );
        })}
      </View>

      <View style={styles.pageHeader}>
        <Text style={styles.stepLabel}>{stepLabel}</Text>
        <Text style={styles.pageTitle}>
          {titleLine1}
          {'\n'}
          <Text style={styles.pageTitleItalic}>{titleLine2}</Text>
        </Text>
        <Text style={styles.pageDesc}>{desc}</Text>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {children}
      </ScrollView>

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
  root: { flex: 1, backgroundColor: onboarding.bg },
  navbar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 22,
    paddingBottom: 14,
  },
  brand: {
    fontFamily: fonts.displayRegular,
    fontSize: 20,
    color: onboarding.accentDeep,
    letterSpacing: -0.2,
  },
  navAction: {
    fontFamily: fonts.body,
    fontSize: 12,
    color: onboarding.accentDeep,
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
    backgroundColor: onboarding.border,
    overflow: 'hidden',
  },
  railFill: {
    height: '100%',
    backgroundColor: onboarding.accent,
    borderRadius: 1,
  },
  pageHeader: {
    paddingHorizontal: 22,
    paddingBottom: 22,
  },
  stepLabel: {
    fontFamily: fonts.uiSemi,
    fontSize: typography.size.xs - 1,
    letterSpacing: 1.3,
    textTransform: 'uppercase',
    color: onboarding.accentDeep,
    marginBottom: 10,
  },
  pageTitle: {
    fontFamily: fonts.displayRegular,
    fontSize: 32,
    lineHeight: 37,
    color: onboarding.textPrimary,
    letterSpacing: -0.6,
    marginBottom: 8,
  },
  pageTitleItalic: {
    fontFamily: fonts.displayItalic,
    fontSize: 32,
    color: onboarding.accentDeep,
    letterSpacing: -0.6,
  },
  pageDesc: {
    fontFamily: fonts.body,
    fontSize: 13,
    color: onboarding.textSecondary,
    lineHeight: 21,
  },
  scroll: { flex: 1 },
  content: { paddingHorizontal: 22, paddingBottom: 20 },
  footer: {
    paddingHorizontal: 22,
    paddingTop: 16,
  },
  ctaBtn: {
    backgroundColor: onboarding.accent,
    borderRadius: 40,
    paddingVertical: 16,
    alignItems: 'center',
  },
  ctaBtnDisabled: {
    opacity: 0.4,
  },
  ctaBtnText: {
    fontFamily: fonts.body,
    fontSize: 15,
    color: onboarding.heroText,
    letterSpacing: 0.3,
  },
});
