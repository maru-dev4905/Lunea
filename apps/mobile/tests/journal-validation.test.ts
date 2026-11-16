import { isSubmittable } from '@/journal/validation';

// LUN-20: blank or whitespace-only text can never be submitted.
describe('isSubmittable', () => {
  it.each([
    ['empty', ''],
    ['spaces', '   '],
    ['tabs and newlines', '\t\n \r\n'],
    ['full-width spaces', '　　'],
  ])('rejects %s', (_name, text) => {
    expect(isSubmittable(text)).toBe(false);
  });

  it('accepts Korean text', () => {
    expect(isSubmittable('오늘은 발표가 끝나서 마음이 놓였다.')).toBe(true);
  });

  it('accepts text with surrounding whitespace', () => {
    expect(isSubmittable('  오늘  ')).toBe(true);
  });

  it('accepts a long entry', () => {
    expect(isSubmittable('가'.repeat(20000))).toBe(true);
  });
});
