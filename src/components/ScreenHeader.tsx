import { MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, fonts, spacing, typography } from '@/lib/theme';

interface ScreenHeaderProps {
  title: string;
  /** Hide the back chevron on flow screens that shouldn't pop. */
  showBack?: boolean;
}

/** Minimal in-screen header for non-tab routes (kitchen, setup, recipe). */
export function ScreenHeader({ title, showBack = true }: ScreenHeaderProps) {
  const insets = useSafeAreaInsets();
  return (
    <View style={[styles.header, { paddingTop: insets.top + spacing.sm }]}>
      {showBack ? (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="back"
          onPress={() => (router.canGoBack() ? router.back() : router.replace('/(tabs)'))}
          style={({ pressed }) => [styles.back, pressed && styles.pressed]}
          hitSlop={8}
        >
          <MaterialIcons name="arrow-back" size={22} color={colors.text.primary} />
        </Pressable>
      ) : (
        <View style={styles.back} />
      )}
      <Text style={styles.title} numberOfLines={1}>
        {title}
      </Text>
      <View style={styles.back} />
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.gutter,
    paddingBottom: spacing.sm,
    backgroundColor: colors.bg,
    gap: spacing.base,
  },
  back: {
    width: 44,
    height: 44,
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  pressed: { opacity: 0.6 },
  title: {
    flex: 1,
    textAlign: 'center',
    fontFamily: fonts.displayItalic,
    fontSize: typography.size.lg,
    color: colors.text.primary,
  },
});
