import { describe, it, expect } from 'vitest';
import { projectConfigDtoSchema } from './project-config-dto';

describe('projectConfigDtoSchema', () => {
  describe('valid input', () => {
    it('accepts a minimal well-formed config', () => {
      const input = {
        metadata: { configVersion: '1' },
        project: { name: 'trohi' },
      };
      const result = projectConfigDtoSchema.safeParse(input);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.project.name).toBe('trohi');
        expect(result.data.metadata.configVersion).toBe('1');
      }
    });
  });

  describe('rejected input', () => {
    it('rejects null', () => {
      const result = projectConfigDtoSchema.safeParse(null);
      expect(result.success).toBe(false);
    });

    it('rejects an empty object', () => {
      const result = projectConfigDtoSchema.safeParse({});
      expect(result.success).toBe(false);
    });

    it('rejects missing project section', () => {
      const result = projectConfigDtoSchema.safeParse({
        metadata: { configVersion: '1' },
      });
      expect(result.success).toBe(false);
    });

    it('rejects missing metadata.configVersion', () => {
      const result = projectConfigDtoSchema.safeParse({
        metadata: {},
        project: { name: 'x' },
      });
      expect(result.success).toBe(false);
    });

    it('rejects empty project.name', () => {
      const result = projectConfigDtoSchema.safeParse({
        metadata: { configVersion: '1' },
        project: { name: '' },
      });
      expect(result.success).toBe(false);
    });

    it('rejects whitespace-only project.name (boundary normalizes via trim)', () => {
      const result = projectConfigDtoSchema.safeParse({
        metadata: { configVersion: '1' },
        project: { name: '   ' },
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].path).toEqual(['project', 'name']);
      }
    });

    it('rejects whitespace-only metadata.configVersion (boundary normalizes via trim)', () => {
      const result = projectConfigDtoSchema.safeParse({
        metadata: { configVersion: '   ' },
        project: { name: 'trohi' },
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].path).toEqual(['metadata', 'configVersion']);
      }
    });

    it('parses with surrounding whitespace trimmed off valid strings', () => {
      const result = projectConfigDtoSchema.safeParse({
        metadata: { configVersion: '  1  ' },
        project: { name: '  trohi  ' },
      });
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.metadata.configVersion).toBe('1');
        expect(result.data.project.name).toBe('trohi');
      }
    });

    it('rejects non-string project.name', () => {
      const result = projectConfigDtoSchema.safeParse({
        metadata: { configVersion: '1' },
        project: { name: 42 },
      });
      expect(result.success).toBe(false);
    });

    it('rejects unknown top-level keys (strict mode)', () => {
      const result = projectConfigDtoSchema.safeParse({
        metadata: { configVersion: '1' },
        project: { name: 'x' },
        rogue: true,
      });
      expect(result.success).toBe(false);
    });

    it('rejects unknown nested keys (strict mode)', () => {
      const result = projectConfigDtoSchema.safeParse({
        metadata: { configVersion: '1', extra: true },
        project: { name: 'x' },
      });
      expect(result.success).toBe(false);
    });
  });
});
