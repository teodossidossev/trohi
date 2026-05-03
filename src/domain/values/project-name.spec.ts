import { describe, it, expect } from 'vitest';
import { ProjectName, ProjectNameError } from './project-name';

describe('ProjectName', () => {
  describe('creation', () => {
    it('accepts a normal name', () => {
      const name = ProjectName.create('trohi');
      expect(name.value).toBe('trohi');
    });

    it('trims surrounding whitespace', () => {
      const name = ProjectName.create('  my project  ');
      expect(name.value).toBe('my project');
    });

    it('rejects an empty string', () => {
      expect(() => ProjectName.create('')).toThrow(ProjectNameError);
    });

    it('rejects a whitespace-only string', () => {
      expect(() => ProjectName.create('   ')).toThrow(ProjectNameError);
    });

    it('rejects a name longer than the maximum length', () => {
      const tooLong = 'x'.repeat(ProjectName.MAX_LENGTH + 1);
      expect(() => ProjectName.create(tooLong)).toThrow(ProjectNameError);
    });

    it('accepts a name at exactly the maximum length', () => {
      const exact = 'x'.repeat(ProjectName.MAX_LENGTH);
      expect(ProjectName.create(exact).value).toBe(exact);
    });

    it('rejects names containing control characters', () => {
      expect(() => ProjectName.create('bad\x00name')).toThrow(ProjectNameError);
      expect(() => ProjectName.create('line\nbreak')).toThrow(ProjectNameError);
      expect(() => ProjectName.create('tab\there')).toThrow(ProjectNameError);
    });
  });

  describe('equality', () => {
    it('treats two instances with the same value as equal', () => {
      const a = ProjectName.create('trohi');
      const b = ProjectName.create('trohi');
      expect(a.equals(b)).toBe(true);
    });

    it('treats different values as not equal', () => {
      const a = ProjectName.create('trohi');
      const b = ProjectName.create('other');
      expect(a.equals(b)).toBe(false);
    });

    it('compares trimmed values', () => {
      const a = ProjectName.create('trohi');
      const b = ProjectName.create('  trohi  ');
      expect(a.equals(b)).toBe(true);
    });
  });

  describe('serialization', () => {
    it('returns its value via toString', () => {
      expect(ProjectName.create('trohi').toString()).toBe('trohi');
    });
  });
});
