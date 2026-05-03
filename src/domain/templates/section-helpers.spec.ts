import { describe, it, expect } from 'vitest';
import { finalizeDocument, joinBlocks, optionalSection, section } from './section-helpers';

describe('section', () => {
  it('renders a heading + body separated by a blank line', () => {
    expect(section({ title: 'Title', body: 'body' })).toBe('## Title\n\nbody');
  });

  it('uses level 2 by default', () => {
    expect(section({ title: 'T', body: 'b' }).startsWith('## ')).toBe(true);
  });

  it('honors a custom heading level', () => {
    expect(section({ title: 'T', body: 'b', level: 3 })).toBe('### T\n\nb');
  });

  it('emits only the heading when the body is empty', () => {
    expect(section({ title: 'T', body: '' })).toBe('## T');
  });
});

describe('optionalSection', () => {
  it('renders when the body has content', () => {
    expect(optionalSection({ title: 'T', body: 'something' })).toBe('## T\n\nsomething');
  });

  it('returns empty string when the body is empty', () => {
    expect(optionalSection({ title: 'T', body: '' })).toBe('');
  });

  it('returns empty string when the body is whitespace-only', () => {
    expect(optionalSection({ title: 'T', body: '   \n\t' })).toBe('');
  });
});

describe('joinBlocks', () => {
  it('joins non-empty blocks with one blank line between them', () => {
    expect(joinBlocks('a', 'b', 'c')).toBe('a\n\nb\n\nc');
  });

  it('drops empty blocks', () => {
    expect(joinBlocks('a', '', 'b')).toBe('a\n\nb');
  });

  it('returns empty string when every block is empty', () => {
    expect(joinBlocks('', '', '')).toBe('');
  });

  it('returns the single block unchanged when only one is non-empty', () => {
    expect(joinBlocks('', 'only', '')).toBe('only');
  });
});

describe('finalizeDocument', () => {
  it('appends a single trailing newline when missing', () => {
    expect(finalizeDocument('# Title')).toBe('# Title\n');
  });

  it('collapses multiple trailing newlines to one', () => {
    expect(finalizeDocument('# Title\n\n\n')).toBe('# Title\n');
  });

  it('strips trailing whitespace as well', () => {
    expect(finalizeDocument('text   \n  \n')).toBe('text\n');
  });

  it('is idempotent', () => {
    const body = '# T\n\nbody\n';
    expect(finalizeDocument(finalizeDocument(body))).toBe(finalizeDocument(body));
  });
});
