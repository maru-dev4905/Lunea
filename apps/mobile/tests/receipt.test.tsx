import { fireEvent, renderRouter, screen } from 'expo-router/testing-library';

import { SAMPLE_RECEIPT } from '@/receipt/sample';
import { formatWon, sumPrices } from '@/receipt/format';

// LUN-35 / D-35 (direction A) / D-12: the receipt is a shareable look at a saved record, laid
// out like a real receipt. The owner decided (2026-11-16) that it shows a price per feeling, a
// total, a streak and a deposit. All numbers here are synthetic; how feelings get prices is
// undecided (D-11).
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

  it('lists each feeling with its price on the same row', async () => {
    await openReceipt();
    SAMPLE_RECEIPT.items.forEach((item) => {
      expect(screen.getByText(item.label)).toBeOnTheScreen();
      expect(screen.getByText(formatWon(item.price))).toBeOnTheScreen();
    });
  });

  it('keeps a quote of the user’s own words under each feeling (D-33)', async () => {
    await openReceipt();
    expect(screen.getByText(/마음이 놓였어/)).toBeOnTheScreen();
    expect(screen.getByText(/준비한 만큼 잘 끝낸 것 같아/)).toBeOnTheScreen();
  });

  it('shows a total that is exactly the sum of the prices', async () => {
    await openReceipt();
    expect(screen.getByText('합계')).toBeOnTheScreen();
    expect(screen.getByTestId('receipt-total')).toHaveTextContent(
      formatWon(sumPrices(SAMPLE_RECEIPT.items)),
    );
  });

  it('shows what was deposited today and the running balance', async () => {
    await openReceipt();
    expect(screen.getByText(/오늘 적립/)).toBeOnTheScreen();
    expect(screen.getByTestId('receipt-deposit')).toHaveTextContent(
      formatWon(sumPrices(SAMPLE_RECEIPT.items), { signed: true }),
    );
    expect(screen.getByText(/누적/)).toBeOnTheScreen();
  });

  it('shows the streak', async () => {
    await openReceipt();
    expect(screen.getByText(/연속 기록/)).toBeOnTheScreen();
  });

  // The streak is shown warmly. Nothing on the receipt may shame a missed day (docs/03).
  it('never uses guilt or loss wording', async () => {
    await openReceipt();
    expect(screen.queryByText(/끊|잃|놓쳤|실패|미달|벌써|아쉽|빚/)).toBeNull();
  });

  it('says the numbers are made up', async () => {
    await openReceipt();
    expect(screen.getByText(/연습용 예시/)).toBeOnTheScreen();
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
