import React, { useRef } from 'react';
import {
  Animated,
  PanResponder,
  StyleSheet,
  View,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import { radii } from '@/lib/theme';

interface SwipeRevealRowProps {
  children: React.ReactNode;
  /** Rendered behind the row, revealed by swiping left. */
  action: React.ReactNode;
  /** Width the row slides open to. */
  actionWidth?: number;
  style?: StyleProp<ViewStyle>;
}

const OPEN_TRIGGER_RATIO = 0.5;

/**
 * Swipe-left-to-reveal — exactly one action, no menus.
 *
 * Used by plan meal rows (reveal the one pre-computed swap), the
 * leftover result (reveal the one alternative) and kitchen rows
 * ("finished it"). PanResponder-based so it works in Expo Go without
 * extra native dependencies; taps inside the action close the row.
 */
export function SwipeRevealRow({
  children,
  action,
  actionWidth = 112,
  style,
}: SwipeRevealRowProps) {
  const translateX = useRef(new Animated.Value(0)).current;
  const offset = useRef(0);

  const settle = (to: number) => {
    offset.current = to;
    Animated.spring(translateX, {
      toValue: to,
      useNativeDriver: true,
      bounciness: 4,
      speed: 18,
    }).start();
  };

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_event, gesture) =>
        Math.abs(gesture.dx) > 12 && Math.abs(gesture.dx) > Math.abs(gesture.dy) * 1.5,
      onPanResponderMove: (_event, gesture) => {
        const next = Math.min(0, Math.max(-actionWidth, offset.current + gesture.dx));
        translateX.setValue(next);
      },
      onPanResponderRelease: (_event, gesture) => {
        const next = offset.current + gesture.dx;
        settle(next < -actionWidth * OPEN_TRIGGER_RATIO ? -actionWidth : 0);
      },
      onPanResponderTerminate: () => settle(offset.current),
    }),
  ).current;

  return (
    <View style={[styles.container, style]}>
      <View style={[styles.action, { width: actionWidth }]}>{action}</View>
      <Animated.View style={{ transform: [{ translateX }] }} {...panResponder.panHandlers}>
        {children}
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    overflow: 'hidden',
    borderRadius: radii.lg,
  },
  action: {
    position: 'absolute',
    right: 0,
    top: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
