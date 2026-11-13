import { renderRouter, screen } from 'expo-router/testing-library';

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
