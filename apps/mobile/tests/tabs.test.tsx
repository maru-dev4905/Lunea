import { fireEvent, renderRouter, screen } from 'expo-router/testing-library';

describe('tab skeleton', () => {
  it('renders the Today screen first', async () => {
    await renderRouter('./app');
    expect(screen).toHavePathname('/');
    expect(await screen.findByRole('header', { name: 'Today' })).toBeOnTheScreen();
  });

  it('shows Today, Collection and Settings tabs', async () => {
    await renderRouter('./app');
    expect(await screen.findByLabelText('Today, tab, 1 of 3')).toBeOnTheScreen();
    expect(screen.getByLabelText('Collection, tab, 2 of 3')).toBeOnTheScreen();
    expect(screen.getByLabelText('Settings, tab, 3 of 3')).toBeOnTheScreen();
  });
});

// LUN-15: the custom sliding-pill tab bar keeps the same accessible tabs.
describe('tab bar (LUN-15)', () => {
  it('marks only the active tab as selected', async () => {
    await renderRouter('./app', { initialUrl: '/' });
    expect(await screen.findByLabelText('Today, tab, 1 of 3')).toBeSelected();
    expect(screen.getByLabelText('Collection, tab, 2 of 3')).not.toBeSelected();
  });

  it('switches screens when a tab is pressed', async () => {
    await renderRouter('./app', { initialUrl: '/' });
    await fireEvent.press(await screen.findByLabelText('Collection, tab, 2 of 3'));
    expect(await screen.findByRole('header', { name: 'Collection' })).toBeOnTheScreen();
    expect(screen.getByLabelText('Collection, tab, 2 of 3')).toBeSelected();
    expect(screen.getByLabelText('Today, tab, 1 of 3')).not.toBeSelected();
  });

  // Gives the bar a width, as a real device does, so the sliding indicator animates.
  it('keeps working while the indicator slides between tabs', async () => {
    await renderRouter('./app', { initialUrl: '/' });
    await fireEvent(await screen.findByTestId('tab-bar'), 'layout', {
      nativeEvent: { layout: { x: 0, y: 0, width: 300, height: 56 } },
    });
    await fireEvent.press(screen.getByLabelText('Settings, tab, 3 of 3'));
    expect(await screen.findByRole('header', { name: 'Settings' })).toBeOnTheScreen();
    await fireEvent.press(screen.getByLabelText('Today, tab, 1 of 3'));
    expect(await screen.findByRole('header', { name: 'Today' })).toBeOnTheScreen();
    expect(screen.getByLabelText('Today, tab, 1 of 3')).toBeSelected();
  });
});
