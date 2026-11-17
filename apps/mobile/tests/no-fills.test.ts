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

// D-36 (owner, 2026-11-16): UI has no background colors. Shapes are told apart by lines, shadows
// and motion only. The one fill is the screen canvas itself (`color.background`). A few thin bars
// are lines in all but implementation (hairlines, dashes, the tab indicator and dots, barcode
// bars). They are allowed by exact line and exact count, not by file, so adding a fill to a
// container in one of those files, or copying an allowed line onto a second element, fails.
const root = join(__dirname, '..');
const STROKES: { file: string; text: string; count: number }[] = [
  {
    file: 'src/motion/DrawLine.tsx',
    text: 'style={[styles.dash, { backgroundColor: color.textMuted }]}',
    count: 1,
  },
  {
    file: 'src/motion/DrawLine.tsx',
    text: '<View style={[styles.line, { backgroundColor: color.textMuted }]} />',
    count: 1,
  },
  { file: 'src/motion/PillIndicator.tsx', text: 'backgroundColor: color.accent,', count: 1 },
  {
    file: 'src/navigation/SlidingTabBar.tsx',
    text: 'style={[styles.track, { backgroundColor: theme.color.borderSubtle }]}',
    count: 1,
  },
  {
    file: 'src/navigation/SlidingTabBar.tsx',
    text: 'backgroundColor: theme.color.textMuted,',
    count: 1,
  },
  { file: 'src/receipt/Barcode.tsx', text: 'backgroundColor: color.textPrimary,', count: 1 },
];

type Fill = { file: string; line: number; text: string };

// Every fill that is neither the screen canvas nor an allowed stroke.
function unexpectedFills(fills: Fill[]): string[] {
  const used = new Map<string, number>();
  return fills
    .filter((f) => !f.text.includes('color.background'))
    .filter((f) => {
      const allowed = STROKES.find((s) => s.file === f.file && s.text === f.text);
      if (!allowed) return true;
      const key = `${f.file}\n${f.text}`;
      used.set(key, (used.get(key) ?? 0) + 1);
      return (used.get(key) ?? 0) > allowed.count;
    })
    .map((f) => `${f.file}:${f.line} ${f.text}`);
}

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
  const fills: Fill[] = files.flatMap((file) =>
    readFileSync(join(root, file), 'utf8')
      .split('\n')
      .map((text: string, i: number) => ({ file, line: i + 1, text: text.trim() }))
      .filter((l: Fill) => l.text.includes('backgroundColor')),
  );

  it('finds the files it is supposed to check', () => {
    expect(files).toEqual(
      expect.arrayContaining(['app/(tabs)/index.tsx', 'src/receipt/Receipt.tsx']),
    );
    expect(fills.length).toBeGreaterThan(0);
  });

  it('fills nothing except the screen canvas and the listed strokes', () => {
    expect(unexpectedFills(fills)).toEqual([]);
  });

  it('keeps the listed strokes up to date (each allowed line exists exactly as listed)', () => {
    STROKES.forEach((s) => {
      const found = fills.filter((f) => f.file === s.file && f.text === s.text).length;
      expect({ ...s, found }).toEqual({ ...s, found: s.count });
    });
  });

  it('never uses a surface-like token as a fill', () => {
    expect(fills.filter((f) => /surface|accentSoft/.test(f.text))).toEqual([]);
  });

  it('keeps the receipt paper free of any fill', () => {
    const receipt = readFileSync(join(root, 'src/receipt/Receipt.tsx'), 'utf8');
    expect(receipt).not.toContain('backgroundColor');
  });

  // The checker itself, against a fill that a file-wide exemption used to let through.
  describe('the checker', () => {
    const bar: Fill = {
      file: 'src/receipt/Barcode.tsx',
      line: 1,
      text: 'backgroundColor: color.textPrimary,',
    };
    it('accepts an allowed stroke once', () => {
      expect(unexpectedFills([bar])).toEqual([]);
    });
    it('rejects the same line on a second element in the same file', () => {
      expect(unexpectedFills([bar, { ...bar, line: 9 }])).toHaveLength(1);
    });
    it('rejects a different fill in a file that has strokes', () => {
      expect(unexpectedFills([{ ...bar, text: 'backgroundColor: color.surface,' }])).toHaveLength(
        1,
      );
    });
    it('rejects an allowed line text in another file', () => {
      expect(unexpectedFills([{ ...bar, file: 'src/receipt/Receipt.tsx' }])).toHaveLength(1);
    });
    it('accepts the screen canvas anywhere', () => {
      const canvas = {
        file: 'app/x.tsx',
        line: 1,
        text: 'backgroundColor: theme.color.background',
      };
      expect(unexpectedFills([canvas])).toEqual([]);
    });
  });
});
