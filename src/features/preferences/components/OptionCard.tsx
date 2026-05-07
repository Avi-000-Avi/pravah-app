import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, fonts, radii, typography } from '@/lib/theme';

interface OptionCardProps {
  emoji: string;
  label: string;
  selected: boolean;
  onPress: () => void;
}

/** Tappable card with an emoji glyph + label. Used in steps 1 + 2. */
export function OptionCard({ emoji, label, selected, onPress }: OptionCardProps) {
  return (
    <Pressable onPress={onPress} style={[styles.card, selected && styles.selected]}>
      <View style={styles.glyphWrap}>
        <Text style={styles.glyph}>{emoji}</Text>
      </View>
      <Text style={[styles.label, selected && styles.labelSelected]}>{label}</Text>
    </Pressable>
  );
}

interface PillSelectorProps<T extends string | number> {
  options: { value: T; label: string }[];
  selected: T;
  onSelect: (value: T) => void;
}

/** Horizontal-wrap pill selector. Used in steps 3 + 4. */
export function PillSelector<T extends string | number>({
  options,
  selected,
  onSelect,
}: PillSelectorProps<T>) {
  return (
    <View style={pillStyles.row}>
      {options.map((opt) => {
        const active = opt.value === selected;
        return (
          <Pressable
            key={String(opt.value)}
            onPress={() => onSelect(opt.value)}
            style={[pillStyles.pill, active && pillStyles.pillActive]}
          >
            <Text style={[pillStyles.text, active && pillStyles.textActive]}>{opt.label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    backgroundColor: colors.surface,
    borderRadius: radii.card,
    padding: 16,
    borderWidth: 1.5,
    borderColor: 'transparent',
  },
  selected: {
    borderColor: colors.text.primary,
  },
  glyphWrap: {
    width: 44,
    height: 44,
    borderRadius: radii.md,
    backgroundColor: colors.bg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  glyph: { fontSize: 24 },
  label: {
    fontFamily: fonts.display,
    fontSize: typography.size.md,
    color: colors.text.primary,
    flex: 1,
  },
  labelSelected: { color: colors.text.primary },
});

const pillStyles = StyleSheet.create({
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
