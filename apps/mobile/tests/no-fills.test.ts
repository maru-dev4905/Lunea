// This project has no Node typings, so the few Node functions this test needs are declared here.
declare const require: (id: string) => any;
declare const __dirname: string;
const { readdirSync, readFileSync, statSync } = require('node:fs') as {
  readdirSync: (dir: string) => string[];
  readFileSync: (path: string, encoding: string) => string;
  statSync: (path: string) => { isDirectory: () => boolean };
};
const { join, relative } = require('node:path') as {
  join: (...parts: string[]) => string;
  relative: (from: string, to: string) => string;
};

// D-36 (owner, 2026-11-16): UI has no background colors. Shapes are told apart by lines,
// shadows and motion only. The one fill is the screen canvas itself (`color.background`).
// Strokes and marks that are drawn as thin filled bars (hairlines, dashes, dots, the tab
// indicator, barcode bars) are lines in all but implementation, so those files may fill them.
const root = join(__dirname, '..');
const STROKE_FILES = new Set([
  'src/motion/DrawLine.tsx',
  'src/motion/PillIndicator.tsx',
  'src/navigation/SlidingTabBar.tsx',
  'src/receipt/Barcode.tsx',
]);

function sources(dir: string): string[] {
  return readdirSync(dir).flatMap((name: string) => {
    const path = join(dir, name);
    if (statSync(path).isDirectory()) return sources(path);
    return /\.tsx?$/.test(name) ? [path] : [];
  });
}

const files = [...sources(join(root, 'app')), ...sources(join(root, 'src'))]
  .map((path) => relative(root, path))
  .filter((path) => path !== 'src/theme/tokens.ts');

describe('no filled backgrounds (D-36)', () => {
  const fills = files.flatMap((file) =>
    readFileSync(join(root, file), 'utf8')
      .split('\n')
      .map((text: string, i: number) => ({ file, line: i + 1, text: text.trim() }))
      .filter((l) => l.text.includes('backgroundColor')),
  );

  it('finds the files it is supposed to check', () => {
    expect(files).toEqual(
      expect.arrayContaining(['app/(tabs)/index.tsx', 'src/receipt/Receipt.tsx']),
    );
    expect(fills.length).toBeGreaterThan(0);
  });

  it('fills nothing except the screen canvas, outside of stroke drawing files', () => {
    const offenders = fills
      .filter((l) => !STROKE_FILES.has(l.file))
      .filter((l) => !l.text.includes('color.background'));
    expect(offenders.map((l) => `${l.file}:${l.line} ${l.text}`)).toEqual([]);
  });

  it('never uses a surface-like token as a fill, even in stroke files', () => {
    const offenders = fills.filter((l) => /surface|accentSoft/.test(l.text));
    expect(offenders.map((l) => `${l.file}:${l.line} ${l.text}`)).toEqual([]);
  });

  it('keeps the receipt paper free of any fill', () => {
    const receipt = readFileSync(join(root, 'src/receipt/Receipt.tsx'), 'utf8');
    expect(receipt).not.toContain('backgroundColor');
  });
});
