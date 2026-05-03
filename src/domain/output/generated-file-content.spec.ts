import { describe, it, expect } from 'vitest';
import { GeneratedFileContent, GeneratedFileContentError } from './generated-file-content';

describe('GeneratedFileContent', () => {
  describe('creation', () => {
    it('accepts a normal text body', () => {
      const content = GeneratedFileContent.create('# Hello\n\nworld\n');
      expect(content.value).toBe('# Hello\n\nworld\n');
    });

    it('accepts an empty body', () => {
      // Empty content is allowed: a placeholder file may legitimately
      // be generated with no body in early phases.
      const content = GeneratedFileContent.create('');
      expect(content.value).toBe('');
      expect(content.isEmpty).toBe(true);
    });

    it('accepts whitespace-only content (does not normalize)', () => {
      // Generated content is preserved verbatim; whitespace may be
      // significant (Markdown trailing newlines, code blocks).
      const content = GeneratedFileContent.create('   \n\n');
      expect(content.value).toBe('   \n\n');
    });

    it('preserves CRLF line endings', () => {
      const content = GeneratedFileContent.create('line1\r\nline2\r\n');
      expect(content.value).toBe('line1\r\nline2\r\n');
    });

    it('rejects content containing NUL bytes', () => {
      expect(() => GeneratedFileContent.create('hello\x00world')).toThrow(
        GeneratedFileContentError,
      );
    });
  });

  describe('measurements', () => {
    it('exposes byte length of the UTF-8 encoding', () => {
      // 'café' = 4 visible chars but 5 UTF-8 bytes (é -> 0xC3 0xA9).
      expect(GeneratedFileContent.create('café').byteLength).toBe(5);
    });

    it('reports zero byteLength for empty content', () => {
      expect(GeneratedFileContent.create('').byteLength).toBe(0);
    });

    it('isEmpty reflects emptiness only, not whitespace', () => {
      expect(GeneratedFileContent.create('').isEmpty).toBe(true);
      expect(GeneratedFileContent.create(' ').isEmpty).toBe(false);
    });
  });

  describe('equality', () => {
    it('treats two contents with the same string as equal', () => {
      const a = GeneratedFileContent.create('x');
      const b = GeneratedFileContent.create('x');
      expect(a.equals(b)).toBe(true);
    });

    it('treats different strings as not equal', () => {
      const a = GeneratedFileContent.create('x');
      const b = GeneratedFileContent.create('y');
      expect(a.equals(b)).toBe(false);
    });
  });
});
