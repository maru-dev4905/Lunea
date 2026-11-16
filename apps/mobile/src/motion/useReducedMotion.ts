import { useEffect, useState } from 'react';
import { AccessibilityInfo } from 'react-native';

// True when the system asks for reduced motion. Every animation in the app checks this
// and falls back to an instant change, never to a different feature.
export function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);

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
