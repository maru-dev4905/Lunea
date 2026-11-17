import { fireEvent, renderRouter, screen } from 'expo-router/testing-library';
import { Platform } from 'react-native';

// On the web, react-native-web only activates `tab` elements with Enter. A tab list also needs
// Space to select and the arrow keys to move between tabs, with only the selected tab in the
// tab order (roving tabindex).
const key = (name: string) => ({ nativeEvent: { key: name }, preventDefault: jest.fn() });

describe('tab bar keyboard on the web', () => {
  beforeEach(() => {
    jest.replaceProperty(Platform, 'OS', 'web');
  });
  afterEach(() => jest.restoreAllMocks());

  it('selects a tab with Space', async () => {
    await renderRouter('./app');
    const collection = await screen.findByRole('tab', { name: 'Collection' });
    await fireEvent(collection, 'keyDown', key(' '));
    expect(
      await screen.findByRole('tab', { name: 'Collection', selected: true }),
    ).toBeOnTheScreen();
  });

  it('moves to the next and previous tab with the arrow keys, wrapping at the ends', async () => {
    await renderRouter('./app');
    const today = await screen.findByRole('tab', { name: 'Today' });
    await fireEvent(today, 'keyDown', key('ArrowRight'));
    expect(
      await screen.findByRole('tab', { name: 'Collection', selected: true }),
    ).toBeOnTheScreen();
    await fireEvent(screen.getByRole('tab', { name: 'Collection' }), 'keyDown', key('ArrowLeft'));
    expect(await screen.findByRole('tab', { name: 'Today', selected: true })).toBeOnTheScreen();
    await fireEvent(screen.getByRole('tab', { name: 'Today' }), 'keyDown', key('ArrowLeft'));
    expect(await screen.findByRole('tab', { name: 'Settings', selected: true })).toBeOnTheScreen();
  });

  it('does not scroll the page when it handles a key', async () => {
    await renderRouter('./app');
    const event = key(' ');
    await fireEvent(await screen.findByRole('tab', { name: 'Collection' }), 'keyDown', event);
    expect(event.preventDefault).toHaveBeenCalled();
  });

  it('leaves other keys alone', async () => {
    await renderRouter('./app');
    const event = key('a');
    await fireEvent(await screen.findByRole('tab', { name: 'Today' }), 'keyDown', event);
    expect(event.preventDefault).not.toHaveBeenCalled();
    expect(await screen.findByRole('tab', { name: 'Today', selected: true })).toBeOnTheScreen();
  });

  it('puts only the selected tab in the tab order', async () => {
    await renderRouter('./app');
    expect((await screen.findByRole('tab', { name: 'Today' })).props.tabIndex).toBe(0);
    expect(screen.getByRole('tab', { name: 'Collection' }).props.tabIndex).toBe(-1);
  });
});
