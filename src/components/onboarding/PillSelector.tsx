import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, fonts, radii, typography } from '@/lib/theme';

export interface PillSelectorProps<T extends string | number> {
  options: { value: T; label: string }[];
  selected: T;
  onSelect: (value: T) => void;
}

/** Horizontal-wrap pill selector. Used in onboarding steps 3 + 4. */
export function PillSelector<T extends string | number>({
  options,
  selected,
  onSelect,
}: PillSelectorProps<T>) {
  return (
    <View style={styles.row}>
      {options.map((opt) => {
        const active = opt.value === selected;
        return (
          <Pressable
            key={String(opt.value)}
            onPress={() => onSelect(opt.value)}
            style={[styles.pill, active && styles.pillActive]}
          >
            <Text style={[styles.text, active && styles.textActive]}>{opt.label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  pill: {
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: radii.pill,
    backgroundColor: colors.surface,
    borderWidth: 1.5,
    borderColor: 'transparent',
  },
  pillActive: {
    backgroundColor: colors.text.primary,
    borderColor: colors.text.primary,
  },
  text: {
    fontFamily: fonts.ui,
    fontSize: typography.size.base,
    color: colors.text.primary,
  },
  textActive: { color: colors.white },
});
