import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react';
import {
  Animated,
  Easing,
  Pressable,
  StyleSheet,
  View,
  type GestureResponderEvent,
  type StyleProp,
  type ViewStyle,
} from 'react-native';

import { useTheme } from '@/theme';

import { addRipple, MAX_RIPPLES, RINGS_PER_RIPPLE, ringDelays, type Ripple } from './ripples';
import { useReducedMotion } from './useReducedMotion';

const RING_SIZE = 260;

// One thin ring that spreads from the touch point and fades, like a ripple on still water.
function Ring({
  x,
  y,
  delay,
  last,
  onDone,
}: {
  x: number;
  y: number;
  delay: number;
  last: boolean;
  onDone: () => void;
}) {
  const { color, motion } = useTheme();
  const [progress] = useState(() => new Animated.Value(0));
  const [x1, y1, x2, y2] = motion.easing.calm;

  useEffect(() => {
    const animation = Animated.timing(progress, {
      toValue: 1,
      duration: motion.duration.ripple,
      delay,
      easing: Easing.bezier(x1, y1, x2, y2),
      useNativeDriver: true,
    });
    animation.start(({ finished }) => {
      if (finished && last) onDone();
    });
    return () => animation.stop();
  }, [delay, last, onDone, motion.duration.ripple, x1, y1, x2, y2, progress]);

  return (
    <Animated.View
      testID="ripple-ring"
      aria-hidden
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
      style={[
        styles.ring,
        {
          left: x - RING_SIZE / 2,
          top: y - RING_SIZE / 2,
          borderColor: color.textMuted,
          // Appears gently, then fades out slowly as it widens.
          opacity: progress.interpolate({ inputRange: [0, 0.12, 1], outputRange: [0, 0.4, 0] }),
          transform: [
            { scale: progress.interpolate({ inputRange: [0, 1], outputRange: [0.08, 1] }) },
          ],
        },
      ]}
    />
  );
}

// Touching the surface sends soft rings out from the finger. One touch, one ripple: nothing
// loops. Content stays individually readable by screen readers; with reduced motion there are no rings.
export function RippleSurface({
  children,
  style,
  testID,
}: {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
  testID?: string;
}) {
  const { motion } = useTheme();
  const reduced = useReducedMotion();
  const [ripples, setRipples] = useState<Ripple[]>([]);
  const [size, setSize] = useState({ width: 0, height: 0 });
  const nextId = useRef(0);

  const onPressIn = (event: GestureResponderEvent) => {
    if (reduced) return;
    const { locationX, locationY } = event.nativeEvent;
    // Some platforms do not report where the finger is; fall back to the middle.
    const x = Number.isFinite(locationX) ? locationX : size.width / 2;
    const y = Number.isFinite(locationY) ? locationY : size.height / 2;
    nextId.current += 1;
    const ripple = { id: nextId.current, x, y };
    setRipples((list) => addRipple(list, ripple, MAX_RIPPLES));
  };

  const remove = useCallback(
    (id: number) => setRipples((list) => list.filter((r) => r.id !== id)),
    [],
  );
  const delays = ringDelays(RINGS_PER_RIPPLE, motion.stagger);

  return (
    <Pressable
      accessible={false}
      testID={testID}
      onPressIn={onPressIn}
      onLayout={(e) => setSize(e.nativeEvent.layout)}
      style={[style, styles.clip]}
    >
      {children}
      <View
        pointerEvents="none"
        aria-hidden
        accessibilityElementsHidden
        importantForAccessibility="no-hide-descendants"
        style={StyleSheet.absoluteFill}
      >
        {ripples.map((ripple) =>
          delays.map((delay, i) => (
            <Ring
              key={`${ripple.id}-${i}`}
              x={ripple.x}
              y={ripple.y}
              delay={delay}
              last={i === delays.length - 1}
              onDone={() => remove(ripple.id)}
            />
          )),
        )}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  clip: { overflow: 'hidden' },
  ring: {
    position: 'absolute',
    width: RING_SIZE,
    height: RING_SIZE,
    borderRadius: RING_SIZE / 2,
    borderWidth: 1,
  },
});
