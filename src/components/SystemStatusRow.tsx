import { MaterialIcons } from '@expo/vector-icons';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, fonts, radii, spacing, typography } from '@/lib/theme';

interface SystemStatusRowProps {
  /** MaterialIcons icon name */
  iconName: React.ComponentProps<typeof MaterialIcons>['name'];
  /** Background color of the icon circle (e.g. 'rgba(236,208,242,0.4)') */
  iconBg: string;
  /** Row title — e.g. "Meals" */
  title: string;
  /** Row subtitle — e.g. "2 of 4 tracks logged" */
  subtitle: string;
  onPress?: () => void;
}

/**
 * Tappable status row used in the Today screen "System Status" section.
 * Icon in a tinted circle, title + subtitle, right chevron.
 */
export function SystemStatusRow({
  iconName,
  iconBg,
  title,
  subtitle,
  onPress,
}: SystemStatusRowProps) {
  return (
    <Pressable
      style={({ pressed }) => [styles.row, pressed && styles.rowPressed]}
      onPress={onPress}
    >
      <View style={[styles.iconCircle, { backgroundColor: iconBg }]}>
        <MaterialIcons name={iconName} size={20} color={colors.eggplant} />
      </View>
      <View style={styles.textBlock}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.subtitle}>{subtitle}</Text>
      </View>
      <MaterialIcons name="chevron-right" size={20} color={colors.warmBrown} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.md,
    paddingVertical: 14,
    borderRadius: radii.lg,
    gap: spacing.md,
  },
  rowPressed: {
    backgroundColor: colors.surface2,
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textBlock: {
    flex: 1,
  },
  title: {
    fontFamily: fonts.bodySemi,
    fontSize: typography.size.lg,
    color: colors.text.primary,
  },
  subtitle: {
    fontFamily: fonts.body,
    fontSize: typography.size.sm,
    color: colors.text.muted,
    opacity: 0.6,
    marginTop: 2,
  },
});
