import { useEffect, useState } from 'react';
import { Animated, Easing, StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';

import { useTheme } from '@/theme';

import { dashCount } from './dashes';
import { useReducedMotion } from './useReducedMotion';

const DASH = 4;
const GAP = 4;

// A hairline that draws itself from left to right, solid or dashed (a dashed line is made of
// small bars, because dashed borders are unreliable on Android). Purely decorative, so screen
// readers skip it. With reduced motion it is simply there.
export function DrawLine({
  delay = 0,
  variant = 'solid',
  style,
  testID,
}: {
  delay?: number;
  variant?: 'solid' | 'dashed';
  style?: StyleProp<ViewStyle>;
  testID?: string;
}) {
  const { color, motion } = useTheme();
  const reduced = useReducedMotion();
  const [width, setWidth] = useState(0);
  const [progress] = useState(() => new Animated.Value(0));
  const [x1, y1, x2, y2] = motion.easing.calm;

  useEffect(() => {
    // Wait for the system's answer; never start on a guess.
    if (reduced === undefined) return;
    if (reduced) {
      progress.setValue(1);
      return;
    }
    if (width === 0) return;
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
  }, [reduced, width, delay, motion.duration.draw, x1, y1, x2, y2, progress]);

  const stroke = (
    <>
      {variant === 'dashed' ? (
        <View style={styles.dashes}>
          {Array.from({ length: dashCount(width, DASH, GAP) }, (_, i) => (
            <View
              key={i}
              testID="dash"
              style={[styles.dash, { backgroundColor: color.textMuted }]}
            />
          ))}
        </View>
      ) : (
        <View style={[styles.line, { backgroundColor: color.textMuted }]} />
      )}
    </>
  );

  return (
    <View
      testID={testID}
      aria-hidden
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
      onLayout={(e) => setWidth(e.nativeEvent.layout.width)}
      style={[styles.track, style]}
    >
      {reduced ? (
        <View style={styles.stroke}>{stroke}</View>
      ) : (
        <Animated.View
          style={[
            styles.stroke,
            {
              width: width || '100%',
              opacity: width === 0 ? 0 : 1,
              transform: [
                {
                  translateX: progress.interpolate({
                    inputRange: [0, 1],
                    outputRange: [-width, 0],
                  }),
                },
              ],
            },
          ]}
        >
          {stroke}
        </Animated.View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  track: { height: 1, overflow: 'hidden' },
  stroke: { height: 1, opacity: 0.45 },
  line: { height: 1 },
  dashes: { flexDirection: 'row', height: 1 },
  dash: { width: DASH, height: 1, marginRight: GAP },
});
