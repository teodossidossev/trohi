import { describe, it, expect } from 'vitest';
import { OutputFilePath, OutputFilePathError } from './output-file-path';

describe('OutputFilePath', () => {
  describe('valid paths', () => {
    it('accepts a simple relative file name', () => {
      expect(OutputFilePath.create('AGENTS.md').value).toBe('AGENTS.md');
    });

    it('accepts a nested relative path', () => {
      expect(OutputFilePath.create('docs/PRODUCT_VISION.md').value).toBe('docs/PRODUCT_VISION.md');
    });

    it('accepts deeply nested paths', () => {
      expect(OutputFilePath.create('.claude/skills/foo/SKILL.md').value).toBe(
        '.claude/skills/foo/SKILL.md',
      );
    });

    it('trims surrounding whitespace', () => {
      expect(OutputFilePath.create('  docs/x.md  ').value).toBe('docs/x.md');
    });
  });

  describe('rejected paths', () => {
    it('rejects an empty string', () => {
      expect(() => OutputFilePath.create('')).toThrow(OutputFilePathError);
    });

    it('rejects whitespace only', () => {
      expect(() => OutputFilePath.create('   ')).toThrow(OutputFilePathError);
    });

    it('rejects absolute POSIX paths', () => {
      expect(() => OutputFilePath.create('/etc/passwd')).toThrow(OutputFilePathError);
    });

    it('rejects Windows-style absolute paths', () => {
      expect(() => OutputFilePath.create('C:\\Windows\\System32')).toThrow(OutputFilePathError);
    });

    it('rejects backslash separators', () => {
      expect(() => OutputFilePath.create('docs\\file.md')).toThrow(OutputFilePathError);
    });

    it('rejects parent-directory traversal', () => {
      expect(() => OutputFilePath.create('../secret.md')).toThrow(OutputFilePathError);
      expect(() => OutputFilePath.create('docs/../etc/passwd')).toThrow(OutputFilePathError);
      expect(() => OutputFilePath.create('docs/..')).toThrow(OutputFilePathError);
    });

    it('rejects a leading slash', () => {
      expect(() => OutputFilePath.create('/docs/x.md')).toThrow(OutputFilePathError);
    });

    it('rejects a trailing slash', () => {
      expect(() => OutputFilePath.create('docs/')).toThrow(OutputFilePathError);
    });

    it('rejects double slashes', () => {
      expect(() => OutputFilePath.create('docs//x.md')).toThrow(OutputFilePathError);
    });

    it('rejects paths containing control characters', () => {
      expect(() => OutputFilePath.create('docs/x\x00.md')).toThrow(OutputFilePathError);
      expect(() => OutputFilePath.create('docs/x\nfile.md')).toThrow(OutputFilePathError);
    });

    it('rejects empty path segments from leading dot-slash', () => {
      expect(() => OutputFilePath.create('./docs/x.md')).toThrow(OutputFilePathError);
    });
  });

  describe('equality', () => {
    it('treats two instances with the same path as equal', () => {
      const a = OutputFilePath.create('docs/x.md');
      const b = OutputFilePath.create('docs/x.md');
      expect(a.equals(b)).toBe(true);
    });

    it('treats different paths as not equal', () => {
      const a = OutputFilePath.create('docs/x.md');
      const b = OutputFilePath.create('docs/y.md');
      expect(a.equals(b)).toBe(false);
    });
  });

  describe('segments', () => {
    it('splits the path on forward slashes', () => {
      expect(OutputFilePath.create('docs/sub/x.md').segments).toEqual(['docs', 'sub', 'x.md']);
    });

    it('returns a single segment for a file in the root', () => {
      expect(OutputFilePath.create('AGENTS.md').segments).toEqual(['AGENTS.md']);
    });
  });
});
