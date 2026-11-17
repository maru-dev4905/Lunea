import { useEffect, useState } from 'react';
import { AccessibilityInfo } from 'react-native';

// True when the system asks for reduced motion, false when it does not, and `undefined` until
// the system has answered. Every animation checks this: it waits while `undefined` (never
// starts on a guess), and falls back to an instant change, never to a different feature,
// when it is true.
export function useReducedMotion(): boolean | undefined {
  const [reduced, setReduced] = useState<boolean | undefined>(undefined);

  useEffect(() => {
    let active = true;
    AccessibilityInfo.isReduceMotionEnabled().then((enabled) => {
      if (active) setReduced(enabled);
    });
    const subscription = AccessibilityInfo.addEventListener('reduceMotionChanged', setReduced);
    return () => {
      active = false;
      subscription.remove();
    };
  }, []);

  return reduced;
}
