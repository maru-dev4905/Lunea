import { act, renderHook, waitFor } from '@testing-library/react-native';
import { AccessibilityInfo } from 'react-native';

import { useReducedMotion } from '@/motion/useReducedMotion';

describe('useReducedMotion', () => {
  afterEach(() => jest.restoreAllMocks());

  it('is true when the system asks for reduced motion', async () => {
    jest.spyOn(AccessibilityInfo, 'isReduceMotionEnabled').mockResolvedValue(true);
    const { result } = await renderHook(() => useReducedMotion());
    await waitFor(() => expect(result.current).toBe(true));
  });

  it('is false when it does not', async () => {
    jest.spyOn(AccessibilityInfo, 'isReduceMotionEnabled').mockResolvedValue(false);
    const { result } = await renderHook(() => useReducedMotion());
    await act(async () => {});
    expect(result.current).toBe(false);
  });

  it('follows later changes of the setting', async () => {
    jest.spyOn(AccessibilityInfo, 'isReduceMotionEnabled').mockResolvedValue(false);
    let notify: (enabled: boolean) => void = () => {};
    jest.spyOn(AccessibilityInfo, 'addEventListener').mockImplementation(((
      _name: string,
      handler: (v: boolean) => void,
    ) => {
      notify = handler;
      return { remove: () => {} };
    }) as never);
    const { result } = await renderHook(() => useReducedMotion());
    await act(async () => {});
    await act(async () => notify(true));
    expect(result.current).toBe(true);
  });
});
