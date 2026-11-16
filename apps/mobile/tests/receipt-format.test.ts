import { formatWon, sumPrices } from '@/receipt/format';

describe('formatWon', () => {
  it.each([
    [0, '0원'],
    [800, '800원'],
    [1200, '1,200원'],
    [9500, '9,500원'],
    [128400, '128,400원'],
    [1234567, '1,234,567원'],
  ])('writes %i as %s', (amount, text) => {
    expect(formatWon(amount)).toBe(text);
  });

  it('can show a sign for a deposit', () => {
    expect(formatWon(9500, { signed: true })).toBe('+9,500원');
  });
});

// The receipt only adds up the prices it is given. How an emotion gets a price is undecided
// (D-11), so there is deliberately no function that turns an emotion into an amount.
describe('sumPrices', () => {
  it('adds up the prices of the items', () => {
    expect(sumPrices([{ price: 3200 }, { price: 4500 }, { price: 1800 }])).toBe(9500);
  });

  it('is zero for no items', () => {
    expect(sumPrices([])).toBe(0);
  });
});
