import { describe, it, expect } from 'vitest';
import {
  bold,
  bulletList,
  codeBlock,
  escapeBody,
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

  it('does not insert a blank line when the body already ends with a single newline', () => {
    // Regression: previously codeBlock unconditionally appended `\n`
    // before the closing fence, producing `'```\nx\n\n```'` for input
    // `'x\n'`. The closing fence must always be on its own line, but
    // there must not be a blank line in front of it just because the
    // user pre-terminated their body.
    expect(codeBlock({ code: 'x\n' })).toBe('```\nx\n```');
  });

  it('preserves explicit trailing blank lines in the body', () => {
    // A body ending in two newlines should render with a real blank
    // line before the closing fence (the user wrote it intentionally).
    expect(codeBlock({ code: 'x\n\n' })).toBe('```\nx\n\n```');
  });

  it('renders an empty body as opening fence, blank line, closing fence', () => {
    // Consistent with the non-empty form: structure is always
    // `${opener}\n${body}\n${closer}`, just with an empty body.
    expect(codeBlock({ code: '' })).toBe('```\n\n```');
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
  it('escapes inline-special characters', () => {
    expect(escapeInline('a*b')).toBe('a\\*b');
    expect(escapeInline('a_b')).toBe('a\\_b');
    expect(escapeInline('a`b')).toBe('a\\`b');
    expect(escapeInline('a<b>c')).toBe('a\\<b\\>c');
  });

  it('escapes brackets so link syntax cannot be reformed', () => {
    // Escaping just the brackets is sufficient: `\[x\](y)` is rendered
    // as the literal string `[x](y)`, never as a link.
    expect(escapeInline('[x](y)')).toBe('\\[x\\](y)');
  });

  it('escapes backslashes', () => {
    expect(escapeInline('a\\b')).toBe('a\\\\b');
  });

  it('does not escape line-only markers (handled by escapeBody)', () => {
    // Mid-word dashes (e.g. "Dev-first") and inline `#hashtag` should
    // not get backslashes - they are only special at line start.
    expect(escapeInline('Dev-first')).toBe('Dev-first');
    expect(escapeInline('a#b')).toBe('a#b');
    expect(escapeInline('a+b')).toBe('a+b');
    expect(escapeInline('a(b)c')).toBe('a(b)c');
  });

  it('returns text without specials unchanged', () => {
    expect(escapeInline('hello world')).toBe('hello world');
  });
});

describe('escapeBody', () => {
  it('also escapes inline specials inside body text', () => {
    expect(escapeBody('a*b')).toBe('a\\*b');
    expect(escapeBody('[x](y)')).toBe('\\[x\\](y)');
  });

  it('escapes leading "#" so a line is not parsed as a heading', () => {
    expect(escapeBody('# Heading')).toBe('\\# Heading');
  });

  it('escapes leading "-" and "+" so a line is not parsed as a list item', () => {
    expect(escapeBody('- item')).toBe('\\- item');
    expect(escapeBody('+ item')).toBe('\\+ item');
  });

  it('escapes leading ">" so a line is not parsed as a blockquote', () => {
    expect(escapeBody('> quote')).toBe('\\> quote');
  });

  it('escapes leading markers per line in multi-line text', () => {
    expect(escapeBody('para 1\n# heading\n- item')).toBe('para 1\n\\# heading\n\\- item');
  });

  it('preserves leading whitespace before escaping the marker', () => {
    expect(escapeBody('  - indented')).toBe('  \\- indented');
  });

  it('does not over-escape mid-line markers', () => {
    // The dash inside "Dev-first" must remain literal so generated
    // docs stay readable.
    expect(escapeBody('Dev-first tool')).toBe('Dev-first tool');
  });

  it('returns clean text unchanged', () => {
    expect(escapeBody('hello world')).toBe('hello world');
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
