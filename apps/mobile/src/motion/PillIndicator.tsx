import { useEffect, useRef, useState } from 'react';
import { Animated, StyleSheet, View } from 'react-native';

import { useTheme } from '@/theme';

import { pillFrame } from './pillFrame';
import { useReducedMotion } from './useReducedMotion';

const PILL_LENGTH = 28;
const PILL_HEIGHT = 4;
// Soft echoes that lag behind the pill while it moves. Each is a little slower and fainter.
const TRAILS = [
  { opacity: 0.12, slowdown: 0.55 },
  { opacity: 0.06, slowdown: 0.3 },
] as const;

type Edges = { left: Animated.Value; right: Animated.Value };
type SpringConfig = { stiffness: number; damping: number; mass: number };

// The indicator under the active tab. Its leading edge springs ahead and the trailing edge
// follows, so it stretches while it travels. With reduced motion it jumps and shows no echoes.
export function PillIndicator({
  index,
  count,
  barWidth,
}: {
  index: number;
  count: number;
  barWidth: number;
}) {
  const { color, motion } = useTheme();
  const reduced = useReducedMotion();
  const [main] = useState<Edges>(() => ({
    left: new Animated.Value(0),
    right: new Animated.Value(0),
  }));
  const [trails] = useState<Edges[]>(() =>
    TRAILS.map(() => ({ left: new Animated.Value(0), right: new Animated.Value(0) })),
  );
  const placed = useRef(false);
  const previousLeft = useRef(0);

  useEffect(() => {
    const { left, width } = pillFrame({ index, count, barWidth, pillLength: PILL_LENGTH });
    if (width === 0) return;
    const right = left + width;
    const all: Edges[] = [main, ...trails];

    // Until the setting is known the pill is simply placed, never animated.
    if (reduced !== false || !placed.current) {
      all.forEach((edges) => {
        edges.left.setValue(left);
        edges.right.setValue(right);
      });
      placed.current = true;
      previousLeft.current = left;
      return;
    }

    const movingRight = left > previousLeft.current;
    previousLeft.current = left;
    const { leading, trailing } = motion.spring;
    const spring = (value: Animated.Value, toValue: number, config: SpringConfig, slowdown = 1) =>
      Animated.spring(value, {
        toValue,
        stiffness: config.stiffness * slowdown,
        damping: config.damping,
        mass: config.mass,
        useNativeDriver: false,
      });

    const animations = all.flatMap((edges, k) => {
      const slowdown = k === 0 ? 1 : TRAILS[k - 1].slowdown;
      return [
        spring(edges.left, left, movingRight ? trailing : leading, slowdown),
        spring(edges.right, right, movingRight ? leading : trailing, slowdown),
      ];
    });
    const running = Animated.parallel(animations);
    running.start();
    return () => running.stop();
  }, [index, count, barWidth, reduced, motion.spring, main, trails]);

  const layers =
    reduced !== false
      ? [{ edges: main, opacity: 1 }]
      : [
          ...trails.map((edges, k) => ({ edges, opacity: TRAILS[k].opacity })).reverse(),
          { edges: main, opacity: 1 },
        ];

  return (
    <View pointerEvents="none" style={StyleSheet.absoluteFill}>
      {layers.map(({ edges, opacity }, k) => (
        <Animated.View
          key={k}
          style={[
            styles.pill,
            {
              backgroundColor: color.accent,
              opacity,
              left: edges.left,
              width: Animated.subtract(edges.right, edges.left),
            },
          ]}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  pill: {
    position: 'absolute',
    top: -PILL_HEIGHT / 2,
    height: PILL_HEIGHT,
    borderRadius: PILL_HEIGHT / 2,
  },
});
