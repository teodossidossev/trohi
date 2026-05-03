import { describe, it, expect } from 'vitest';
import { ProjectConfigMapper } from './project-config-mapper';
import { ProjectConfig } from './project-config';
import { ProjectName } from '../values/project-name';

describe('ProjectConfigMapper', () => {
  describe('fromDto', () => {
    it('maps a valid DTO into a ProjectConfig domain model', () => {
      const config = ProjectConfigMapper.fromDto({
        metadata: { configVersion: '1' },
        project: { name: 'trohi' },
      });
      expect(config.configVersion).toBe('1');
      expect(config.projectName.value).toBe('trohi');
    });

    it('trims project.name through the value object', () => {
      const config = ProjectConfigMapper.fromDto({
        metadata: { configVersion: '1' },
        project: { name: '  spaced  ' },
      });
      expect(config.projectName.value).toBe('spaced');
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
        projectName: ProjectName.create('  trohi  '),
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
        expect(result.value.projectName.value).toBe('trohi');
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
  });
});
