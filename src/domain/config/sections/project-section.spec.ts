import { describe, it, expect } from 'vitest';
import { ProjectSection } from './project-section';
import { ProjectName } from '../../values/project-name';

describe('ProjectSection', () => {
  it('exposes its name', () => {
    const section = ProjectSection.create({ name: ProjectName.create('trohi') });
    expect(section.name.value).toBe('trohi');
    expect(section.description).toBeUndefined();
  });

  it('keeps an optional description, trimmed', () => {
    const section = ProjectSection.create({
      name: ProjectName.create('trohi'),
      description: '  a dev-first tool  ',
    });
    expect(section.description).toBe('a dev-first tool');
  });

  it('rejects a blank description', () => {
    expect(() =>
      ProjectSection.create({
        name: ProjectName.create('trohi'),
        description: '   ',
      }),
    ).toThrow();
  });

  describe('equals', () => {
    it('is true when name and description match', () => {
      const a = ProjectSection.create({ name: ProjectName.create('trohi'), description: 'x' });
      const b = ProjectSection.create({ name: ProjectName.create('trohi'), description: 'x' });
      expect(a.equals(b)).toBe(true);
    });

    it('is false when names differ', () => {
      const a = ProjectSection.create({ name: ProjectName.create('trohi') });
      const b = ProjectSection.create({ name: ProjectName.create('other') });
      expect(a.equals(b)).toBe(false);
    });

    it('is false when descriptions differ', () => {
      const a = ProjectSection.create({ name: ProjectName.create('trohi'), description: 'a' });
      const b = ProjectSection.create({ name: ProjectName.create('trohi'), description: 'b' });
      expect(a.equals(b)).toBe(false);
    });

    it('treats undefined and present description as different', () => {
      const a = ProjectSection.create({ name: ProjectName.create('trohi') });
      const b = ProjectSection.create({ name: ProjectName.create('trohi'), description: 'x' });
      expect(a.equals(b)).toBe(false);
    });
  });
});
