import { describe, it, expect } from 'vitest';
import { ProjectConfigMapper } from './project-config-mapper';
import { ProjectConfig } from './project-config';
import { ProjectName } from '../values/project-name';
import { ProjectSection } from './sections/project-section';

describe('ProjectConfigMapper', () => {
  describe('fromDto', () => {
    it('maps a valid DTO into a ProjectConfig domain model', () => {
      const config = ProjectConfigMapper.fromDto({
        metadata: { configVersion: '1' },
        project: { name: 'trohi' },
      });
      expect(config.configVersion).toBe('1');
      expect(config.project.name.value).toBe('trohi');
    });

    it('trims project.name through the value object', () => {
      const config = ProjectConfigMapper.fromDto({
        metadata: { configVersion: '1' },
        project: { name: '  spaced  ' },
      });
      expect(config.project.name.value).toBe('spaced');
    });
  });

  describe('toDto', () => {
    it('round-trips a domain config back into the same DTO shape', () => {
      const dto = {
        metadata: { configVersion: '1' },
        project: { name: 'trohi' },
      };
      const back = ProjectConfigMapper.toDto(ProjectConfigMapper.fromDto(dto));
      expect(back).toEqual(dto);
    });

    it('emits the trimmed/normalized name from the domain model', () => {
      const config = ProjectConfig.create({
        configVersion: '1',
        project: ProjectSection.create({ name: ProjectName.create('  trohi  ') }),
      });
      expect(ProjectConfigMapper.toDto(config)).toEqual({
        metadata: { configVersion: '1' },
        project: { name: 'trohi' },
      });
    });
  });

  describe('parseAndMap', () => {
    it('returns success for a fully valid raw input', () => {
      const result = ProjectConfigMapper.parseAndMap({
        metadata: { configVersion: '1' },
        project: { name: 'trohi' },
      });
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.value.project.name.value).toBe('trohi');
        // The skeleton mapper does not yet construct optional sections.
        expect(result.value.product).toBeUndefined();
        expect(result.value.architecture).toBeUndefined();
      }
    });

    it('returns failure with structured validation issues when Zod rejects the shape', () => {
      const result = ProjectConfigMapper.parseAndMap({
        metadata: { configVersion: '1' },
        project: { name: '' },
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.validation.hasErrors).toBe(true);
        expect(result.validation.errors[0].path).toEqual(['project', 'name']);
      }
    });

    it('returns failure when the DTO is shaped correctly but a value object invariant fails', () => {
      const tooLong = 'x'.repeat(ProjectName.MAX_LENGTH + 1);
      const result = ProjectConfigMapper.parseAndMap({
        metadata: { configVersion: '1' },
        project: { name: tooLong },
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.validation.hasErrors).toBe(true);
        expect(result.validation.errors[0].path).toEqual(['project', 'name']);
      }
    });

    it('returns failure for non-object input', () => {
      const result = ProjectConfigMapper.parseAndMap('not a config');
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.validation.hasErrors).toBe(true);
      }
    });

    it('aggregates multiple Zod issues into the validation result', () => {
      const result = ProjectConfigMapper.parseAndMap({
        metadata: { configVersion: '' },
        project: { name: '' },
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.validation.errors.length).toBeGreaterThanOrEqual(2);
      }
    });

    it('attributes a whitespace-only configVersion to metadata.configVersion (not to project.name)', () => {
      const result = ProjectConfigMapper.parseAndMap({
        metadata: { configVersion: '   ' },
        project: { name: 'trohi' },
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.validation.errors).toHaveLength(1);
        expect(result.validation.errors[0].path).toEqual(['metadata', 'configVersion']);
      }
    });

    it('aggregates whitespace-only failures across both metadata.configVersion and project.name', () => {
      const result = ProjectConfigMapper.parseAndMap({
        metadata: { configVersion: '   ' },
        project: { name: '   ' },
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        const paths = result.validation.errors.map((e) => e.path);
        expect(paths).toEqual(
          expect.arrayContaining([
            ['metadata', 'configVersion'],
            ['project', 'name'],
          ]),
        );
      }
    });

    it('attributes a too-long project.name invariant failure to project.name only', () => {
      const tooLong = 'x'.repeat(ProjectName.MAX_LENGTH + 1);
      const result = ProjectConfigMapper.parseAndMap({
        metadata: { configVersion: '1' },
        project: { name: tooLong },
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        // Critical: must not be attributed to metadata.configVersion.
        expect(result.validation.errors).toHaveLength(1);
        expect(result.validation.errors[0].path).toEqual(['project', 'name']);
      }
    });

    it('does not run domain construction when Zod already failed', () => {
      // configVersion fails Zod; project.name passes Zod but would fail
      // the ProjectName invariant if construction ran. Result must
      // surface only the Zod error and not silently mask anything.
      const tooLong = 'x'.repeat(ProjectName.MAX_LENGTH + 1);
      const result = ProjectConfigMapper.parseAndMap({
        metadata: { configVersion: '   ' },
        project: { name: tooLong },
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.validation.errors[0].path).toEqual(['metadata', 'configVersion']);
      }
    });
  });
});
