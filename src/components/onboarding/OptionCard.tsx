import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, fonts, radii, typography } from '@/lib/theme';

export interface OptionCardProps {
  emoji: string;
  label: string;
  selected: boolean;
  onPress: () => void;
}

/** Tappable card with an emoji glyph + label. Used in onboarding steps 1 + 2. */
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
