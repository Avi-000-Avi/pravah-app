/**
 * "Ate something else" sheet — 6 tiles plus an optional free-text
 * line. A tile tap alone completes the log; typing is never required.
 */
import React, { useState } from 'react';
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { GhostButton } from '@/components/GhostButton';
import { TileButton } from '@/components/TileButton';
import { colors, fonts, radii, spacing, typography } from '@/lib/theme';
import type { SwapCategory } from '@/types/domain';

const TILES: { category: SwapCategory; label: string }[] = [
  { category: 'ordered_in', label: 'ordered in' },
  { category: 'ate_out', label: 'ate out' },
  { category: 'roti_sabzi', label: 'roti-sabzi' },
  { category: 'rice_dal', label: 'rice-dal' },
  { category: 'snack', label: 'just a snack' },
  { category: 'other_home_meal', label: 'other home meal' },
];

interface SwapSheetProps {
  visible: boolean;
  onClose: () => void;
  onLog: (category: SwapCategory, customText: string | null) => void;
}

export function SwapSheet({ visible, onClose, onLog }: SwapSheetProps) {
  const [customText, setCustomText] = useState('');

  const complete = (category: SwapCategory) => {
    onLog(category, customText.trim() ? customText.trim() : null);
    setCustomText('');
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <Pressable style={styles.backdrop} onPress={onClose} accessibilityLabel="close" />
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <View style={styles.sheet}>
          <Text style={styles.title}>what did you have instead?</Text>
          <View style={styles.grid}>
            {TILES.map((tile) => (
              <TileButton
                key={tile.category}
                label={tile.label}
                onPress={() => complete(tile.category)}
                style={styles.tile}
              />
            ))}
          </View>
          <TextInput
            style={styles.input}
            value={customText}
            onChangeText={setCustomText}
            placeholder="add a note if you like — optional"
            placeholderTextColor={colors.gray[400]}
            accessibilityLabel="what you ate, optional"
          />
          <GhostButton label="never mind" onPress={onClose} style={styles.cancel} />
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(84,67,67,0.35)',
  },
  sheet: {
    backgroundColor: colors.bg,
    borderTopLeftRadius: radii.card,
    borderTopRightRadius: radii.card,
    paddingHorizontal: spacing.gutter,
    paddingTop: spacing.md,
    paddingBottom: spacing.lg,
  },
  title: {
    fontFamily: fonts.displayRegular,
    fontSize: typography.size.xl,
    color: colors.text.primary,
    marginBottom: spacing.sm,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.base,
  },
  tile: {
    width: '31%',
    flexGrow: 1,
  },
  input: {
    backgroundColor: colors.surface,
    borderRadius: radii.lg,
    borderWidth: 1.5,
    borderColor: colors.gray[200],
    paddingHorizontal: spacing.gutter,
    paddingVertical: 12,
    marginTop: spacing.sm,
    fontFamily: fonts.body,
    fontSize: typography.size.base,
    color: colors.text.primary,
    minHeight: 48,
  },
  cancel: {
    marginTop: spacing.sm,
    alignSelf: 'center',
  },
});
