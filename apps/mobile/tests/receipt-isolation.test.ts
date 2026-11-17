// D-12 / CLAUDE.md: the receipt metaphor lives in src/receipt and app/receipt. The Today screen
// only uses a component from there, so replacing the metaphor does not touch Today.
declare const require: (id: string) => any;
declare const __dirname: string;
const { readFileSync } = require('node:fs') as {
  readFileSync: (path: string, encoding: string) => string;
};
const { join } = require('node:path') as { join: (...parts: string[]) => string };

describe('receipt isolation', () => {
  const today = readFileSync(join(__dirname, '..', 'app/(tabs)/index.tsx'), 'utf8');

  it('keeps receipt wording and routes out of the Today screen', () => {
    expect(today).not.toMatch(/영수증/);
    expect(today).not.toContain('/receipt/sample');
  });
});
