import { describe, it, expect } from 'vitest';
import {
  bold,
  bulletList,
  codeBlock,
  escapeInline,
  heading,
  horizontalRule,
  inlineCode,
  italic,
  numberedList,
} from './markdown-helpers';

describe('heading', () => {
  it('renders levels 1-6 with the correct hash count', () => {
    expect(heading(1, 'A')).toBe('# A');
    expect(heading(2, 'B')).toBe('## B');
    expect(heading(3, 'C')).toBe('### C');
    expect(heading(6, 'F')).toBe('###### F');
  });

  it('rejects level 0 and level 7', () => {
    expect(() => heading(0, 'x')).toThrow();
    expect(() => heading(7, 'x')).toThrow();
  });

  it('rejects non-integer levels', () => {
    expect(() => heading(1.5, 'x')).toThrow();
    expect(() => heading(NaN, 'x')).toThrow();
  });
});

describe('inline emphasis', () => {
  it('bolds text', () => {
    expect(bold('x')).toBe('**x**');
  });

  it('italicises text', () => {
    expect(italic('x')).toBe('*x*');
  });

  it('inline-codes text', () => {
    expect(inlineCode('x')).toBe('`x`');
  });
});

describe('codeBlock', () => {
  it('emits a fenced block without a language tag', () => {
    expect(codeBlock({ code: 'hello' })).toBe('```\nhello\n```');
  });

  it('emits a fenced block with a language tag', () => {
    expect(codeBlock({ language: 'ts', code: 'const x = 1;' })).toBe('```ts\nconst x = 1;\n```');
  });

  it('preserves the body verbatim (no escaping)', () => {
    expect(codeBlock({ code: 'a\n  b' })).toBe('```\na\n  b\n```');
  });
});

describe('bulletList', () => {
  it('returns empty string for empty input', () => {
    expect(bulletList([])).toBe('');
  });

  it('joins items with single newlines, prefixing each with "- "', () => {
    expect(bulletList(['a', 'b', 'c'])).toBe('- a\n- b\n- c');
  });

  it('does not add a trailing newline', () => {
    expect(bulletList(['a']).endsWith('\n')).toBe(false);
  });
});

describe('numberedList', () => {
  it('returns empty string for empty input', () => {
    expect(numberedList([])).toBe('');
  });

  it('numbers items from 1', () => {
    expect(numberedList(['a', 'b', 'c'])).toBe('1. a\n2. b\n3. c');
  });
});

describe('horizontalRule', () => {
  it('is exactly "---"', () => {
    expect(horizontalRule()).toBe('---');
  });
});

describe('escapeInline', () => {
  it('escapes Markdown special characters', () => {
    expect(escapeInline('a*b')).toBe('a\\*b');
    expect(escapeInline('a_b')).toBe('a\\_b');
    expect(escapeInline('[x](y)')).toBe('\\[x\\]\\(y\\)');
    expect(escapeInline('a`b')).toBe('a\\`b');
  });

  it('escapes backslashes', () => {
    expect(escapeInline('a\\b')).toBe('a\\\\b');
  });

  it('returns text without specials unchanged', () => {
    expect(escapeInline('hello world')).toBe('hello world');
  });
});

describe('determinism', () => {
  it('returns identical strings for repeated calls with identical input', () => {
    const a = bulletList(['x', 'y']);
    const b = bulletList(['x', 'y']);
    expect(a).toBe(b);
  });

  it('does not depend on time or environment', () => {
    // Sanity: evaluate the same expression in two ticks; it must match.
    const first = heading(2, 'Title');
    const second = heading(2, 'Title');
    expect(first).toBe(second);
  });
});
