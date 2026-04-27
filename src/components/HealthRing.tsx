import React from 'react';
import { StyleSheet, View } from 'react-native';
import { SvgXml } from 'react-native-svg';
import { healthRingSvg } from './healthRingSvg';

interface HealthRingProps {
  /** Diameter in pixels. Default 280 — matches the design Home screen. */
  size?: number;
}

/**
 * Hero health-score ring. Renders the Figma-exported SVG directly
 * (three soft gradient arcs + glass icon badges + pre-baked "77 / Health
 * Score" centre label). The score is part of the asset and is not
 * dynamic in this version — see TODO in `healthRingSvg.ts`.
 *
 * Vibe: soft, atmospheric, hand-painted. Do NOT try to redraw with
 * stroked Circles — the watercolor falloff is in the SVG.
 */
export function HealthRing({ size = 280 }: HealthRingProps) {
  return (
    <View style={[styles.wrap, { width: size, height: size }]}>
      <SvgXml xml={healthRingSvg} width={size} height={size} />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    alignSelf: 'center',
  },
});
