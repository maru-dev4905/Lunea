import { useEffect, useState, type ReactNode } from 'react';
import { Animated, Easing, type StyleProp, type ViewStyle } from 'react-native';

import { useTheme } from '@/theme';

import { useReducedMotion } from './useReducedMotion';

// Content settles in with a short fade and a small rise. With reduced motion it is simply there.
export function FadeIn({
  children,
  delay = 0,
  style,
  testID,
}: {
  children: ReactNode;
  delay?: number;
  style?: StyleProp<ViewStyle>;
  testID?: string;
}) {
  const { motion } = useTheme();
  const reduced = useReducedMotion();
  const [progress] = useState(() => new Animated.Value(0));
  const [x1, y1, x2, y2] = motion.easing.fade;

  useEffect(() => {
    // Wait for the system's answer: until then nothing moves and the content stays hidden.
    if (reduced === undefined) return;
    if (reduced) {
      progress.setValue(1);
      return;
    }
    progress.setValue(0);
    const animation = Animated.timing(progress, {
      toValue: 1,
      duration: motion.duration.base,
      delay,
      easing: Easing.bezier(x1, y1, x2, y2),
      useNativeDriver: true,
    });
    animation.start();
    return () => animation.stop();
  }, [reduced, delay, motion.duration.base, x1, y1, x2, y2, progress]);

  // One wrapper type for every state, so changing the setting never remounts the children
  // (a focused text input inside would lose its focus and selection).
  return (
    <Animated.View
      testID={testID}
      style={[
        style,
        {
          opacity: progress,
          transform: [
            { translateY: progress.interpolate({ inputRange: [0, 1], outputRange: [8, 0] }) },
          ],
        },
      ]}
    >
      {children}
    </Animated.View>
  );
}
