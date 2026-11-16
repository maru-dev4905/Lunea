import { fireEvent, renderRouter, screen } from 'expo-router/testing-library';

// LUN-35 / D-35 (direction A): the receipt is a shareable look at a saved record. This is a
// prototype on synthetic data. No prices, scores or streaks (D-11, owner: decide later).
async function openReceipt() {
  await renderRouter('./app', { initialUrl: '/' });
  await fireEvent.press(await screen.findByRole('link', { name: '영수증 예시 보기' }));
  return screen.findByRole('header', { name: '오늘의 영수증' });
}

describe('Receipt sample', () => {
  it('opens from Today', async () => {
    await openReceipt();
    expect(screen).toHavePathname('/receipt/sample');
  });

  it('shows each feeling next to a quote of the user’s own words (D-33)', async () => {
    await openReceipt();
    expect(screen.getByText('안도감')).toBeOnTheScreen();
    expect(screen.getByText(/마음이 놓였어/)).toBeOnTheScreen();
    expect(screen.getByText('자부심')).toBeOnTheScreen();
  });

  it('keeps feelings that sit side by side, without ranking them', async () => {
    await openReceipt();
    expect(screen.getByText('조금 지침')).toBeOnTheScreen();
  });

  it('says it is a sample, not a real record', async () => {
    await openReceipt();
    expect(screen.getByText(/연습용 예시/)).toBeOnTheScreen();
  });

  it('has no price, score or streak wording', async () => {
    await openReceipt();
    expect(screen.queryByText(/₩|가격|점수|합계|연속|스트릭|적립/)).toBeNull();
  });

  it('closes back to Today', async () => {
    await openReceipt();
    await fireEvent.press(screen.getByRole('button', { name: '닫기' }));
    expect(await screen.findByRole('header', { name: 'Today' })).toBeOnTheScreen();
  });

  it('closes to Today even when opened directly by URL', async () => {
    await renderRouter('./app', { initialUrl: '/receipt/sample' });
    await screen.findByRole('header', { name: '오늘의 영수증' });
    await fireEvent.press(screen.getByRole('button', { name: '닫기' }));
    expect(await screen.findByRole('header', { name: 'Today' })).toBeOnTheScreen();
    expect(screen).toHavePathname('/');
  });
});
