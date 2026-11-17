import { useEffect, useMemo, useState } from 'react';
import { Animated, Easing, StyleSheet, View } from 'react-native';

import { useReducedMotion } from '@/motion/useReducedMotion';
import { useTheme } from '@/theme';

import { barcodeBars } from './barcodeBars';

const BARS = 46;
const HEIGHT = 40;

// A decorative barcode whose bars draw themselves from the left, each one a little after the
// last, as thin lines. It encodes nothing and is hidden from screen readers. With reduced
// motion it is simply there.
export function Barcode({ delay = 0, seed = 7 }: { delay?: number; seed?: number }) {
  const { color, motion } = useTheme();
  const reduced = useReducedMotion();
  const bars = useMemo(() => barcodeBars(BARS, seed), [seed]);
  const [progress] = useState(() => new Animated.Value(0));
  const [x1, y1, x2, y2] = motion.easing.calm;

  useEffect(() => {
    // Wait for the system's answer; never start on a guess.
    if (reduced === undefined) return;
    if (reduced) {
      progress.setValue(1);
      return;
    }
    progress.setValue(0);
    const animation = Animated.timing(progress, {
      toValue: 1,
      duration: motion.duration.draw,
      delay,
      easing: Easing.bezier(x1, y1, x2, y2),
      useNativeDriver: true,
    });
    animation.start();
    return () => animation.stop();
  }, [reduced, delay, motion.duration.draw, x1, y1, x2, y2, progress]);

  return (
    <View
      testID="barcode"
      aria-hidden
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
      style={styles.row}
    >
      {bars.map((bar, i) => {
        // Each bar grows downward inside its own slice of the animation, left to right.
        const start = (i / bars.length) * 0.7;
        return (
          <Animated.View
            key={i}
            style={{
              width: bar.width,
              height: HEIGHT,
              marginRight: bar.gap,
              backgroundColor: color.textPrimary,
              transformOrigin: 'top',
              transform: [
                {
                  scaleY: progress.interpolate({
                    inputRange: [start, start + 0.3],
                    outputRange: [0, 1],
                    extrapolate: 'clamp',
                  }),
                },
              ],
            }}
          />
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', justifyContent: 'center', height: HEIGHT, overflow: 'hidden' },
});
