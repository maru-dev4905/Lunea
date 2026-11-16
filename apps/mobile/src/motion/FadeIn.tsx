import { useEffect, useState, type ReactNode } from 'react';
import { Animated, View, type StyleProp, type ViewStyle } from 'react-native';

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

  useEffect(() => {
    if (reduced) {
      progress.setValue(1);
      return;
    }
    progress.setValue(0);
    const animation = Animated.timing(progress, {
      toValue: 1,
      duration: motion.duration.base,
      delay,
      useNativeDriver: true,
    });
    animation.start();
    return () => animation.stop();
  }, [reduced, delay, motion.duration.base, progress]);

  if (reduced) {
    return (
      <View testID={testID} style={[style, { opacity: 1 }]}>
        {children}
      </View>
    );
  }

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
