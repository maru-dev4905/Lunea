import { fireEvent, render, screen } from '@testing-library/react-native';
import { Platform } from 'react-native';

import { SlidingTabBar } from '@/navigation/SlidingTabBar';

// Pointer, Space and the arrow keys must all go through the same selection step: emit
// `tabPress`, and only navigate if no listener cancelled it.
function setup(defaultPrevented: boolean) {
  const routes = [
    { key: 'a', name: 'a' },
    { key: 'b', name: 'b' },
    { key: 'c', name: 'c' },
  ];
  const emit = jest.fn(() => ({ defaultPrevented }));
  const navigateToTab = jest.fn();
  const props = {
    state: { index: 0, routes },
    descriptors: Object.fromEntries(routes.map((r) => [r.key, { options: { title: r.name } }])),
    emitter: { emit },
    navigateToTab,
    insets: { top: 0, bottom: 0, left: 0, right: 0 },
  };
  return { props, emit, navigateToTab };
}
const key = (name: string) => ({ nativeEvent: { key: name }, preventDefault: jest.fn() });

describe('tab selection goes through tabPress', () => {
  beforeEach(() => {
    jest.replaceProperty(Platform, 'OS', 'web');
  });
  afterEach(() => jest.restoreAllMocks());

  it.each([
    ['ArrowRight', 'a', 'b'],
    ['ArrowLeft', 'a', 'c'],
    [' ', 'b', 'b'],
  ])('%s emits tabPress and navigates when it is not cancelled', async (k, from, to) => {
    const { props, emit, navigateToTab } = setup(false);
    await render(<SlidingTabBar {...(props as any)} />);
    await fireEvent(screen.getByRole('tab', { name: from }), 'keyDown', key(k));
    expect(emit).toHaveBeenCalledWith(expect.objectContaining({ type: 'tabPress', target: to }));
    // A tab that is already selected is not navigated to again.
    if (to !== 'a') expect(navigateToTab).toHaveBeenCalledWith(to);
  });

  it.each([['ArrowRight'], ['ArrowLeft']])(
    '%s does not navigate when tabPress is cancelled',
    async (k) => {
      const { props, navigateToTab } = setup(true);
      await render(<SlidingTabBar {...(props as any)} />);
      await fireEvent(screen.getByRole('tab', { name: 'a' }), 'keyDown', key(k));
      expect(navigateToTab).not.toHaveBeenCalled();
    },
  );
});
