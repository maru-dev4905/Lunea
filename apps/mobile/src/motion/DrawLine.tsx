import { useEffect, useState } from 'react';
import { Animated, Easing, StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';

import { useTheme } from '@/theme';

import { useReducedMotion } from './useReducedMotion';

// A hairline that draws itself from left to right. Purely decorative, so screen readers skip it.
// With reduced motion it is simply there.
export function DrawLine({
  delay = 0,
  style,
  testID,
}: {
  delay?: number;
  style?: StyleProp<ViewStyle>;
  testID?: string;
}) {
  const { color, motion } = useTheme();
  const reduced = useReducedMotion();
  const [width, setWidth] = useState(0);
  const [progress] = useState(() => new Animated.Value(0));
  const [x1, y1, x2, y2] = motion.easing.calm;

  useEffect(() => {
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
        <View style={[styles.line, { backgroundColor: color.textMuted }]} />
      ) : (
        <Animated.View
          style={[
            styles.line,
            {
              backgroundColor: color.textMuted,
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
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  track: { height: 1, overflow: 'hidden' },
  line: { height: 1, opacity: 0.45 },
});
