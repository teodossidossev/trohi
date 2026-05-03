import { describe, it, expect } from 'vitest';
import { PackageManager, TechnologySection } from './technology-section';

const base = {
  framework: 'Angular 21',
  runtime: 'Node.js 22',
  packageManager: PackageManager.Npm,
};

describe('TechnologySection', () => {
  it('exposes required fields and defaults optional ones to undefined / empty', () => {
    const section = TechnologySection.create(base);
    expect(section.framework).toBe('Angular 21');
    expect(section.runtime).toBe('Node.js 22');
    expect(section.packageManager).toBe(PackageManager.Npm);
    expect(section.schemaValidator).toBeUndefined();
    expect(section.zipLibrary).toBeUndefined();
    expect(section.rejectedFrameworks).toEqual([]);
  });

  it('accepts optional libraries and rejected list', () => {
    const section = TechnologySection.create({
      ...base,
      schemaValidator: 'Zod',
      zipLibrary: 'fflate',
      rejectedFrameworks: ['React', 'React'],
    });
    expect(section.schemaValidator).toBe('Zod');
    expect(section.zipLibrary).toBe('fflate');
    expect(section.rejectedFrameworks).toEqual(['React']);
  });

  it('rejects blank framework or runtime', () => {
    expect(() => TechnologySection.create({ ...base, framework: '   ' })).toThrow();
    expect(() => TechnologySection.create({ ...base, runtime: '' })).toThrow();
  });

  it('rejects blank entries in rejectedFrameworks', () => {
    expect(() =>
      TechnologySection.create({ ...base, rejectedFrameworks: ['React', ''] }),
    ).toThrow();
  });

  it('rejects rejecting the chosen framework', () => {
    expect(() =>
      TechnologySection.create({ ...base, rejectedFrameworks: ['Angular 21'] }),
    ).toThrow();
  });

  it('exposes a frozen rejectedFrameworks list', () => {
    const section = TechnologySection.create({
      ...base,
      rejectedFrameworks: ['React'],
    });
    expect(Object.isFrozen(section.rejectedFrameworks)).toBe(true);
  });

  describe('equals', () => {
    it('is true for identical sections', () => {
      const a = TechnologySection.create({
        ...base,
        schemaValidator: 'Zod',
        zipLibrary: 'fflate',
        rejectedFrameworks: ['React'],
      });
      const b = TechnologySection.create({
        ...base,
        schemaValidator: 'Zod',
        zipLibrary: 'fflate',
        rejectedFrameworks: ['React'],
      });
      expect(a.equals(b)).toBe(true);
    });

    it('is false when framework, runtime, or packageManager differ', () => {
      const a = TechnologySection.create(base);
      expect(a.equals(TechnologySection.create({ ...base, framework: 'Angular 22' }))).toBe(false);
      expect(a.equals(TechnologySection.create({ ...base, runtime: 'Node.js 24' }))).toBe(false);
      expect(
        a.equals(TechnologySection.create({ ...base, packageManager: PackageManager.Pnpm })),
      ).toBe(false);
    });

    it('is false when optional libraries differ', () => {
      const a = TechnologySection.create({ ...base, schemaValidator: 'Zod' });
      const b = TechnologySection.create({ ...base, schemaValidator: 'Yup' });
      expect(a.equals(b)).toBe(false);
    });

    it('is false when rejectedFrameworks differ in content or order', () => {
      const a = TechnologySection.create({ ...base, rejectedFrameworks: ['React', 'Vue'] });
      const b = TechnologySection.create({ ...base, rejectedFrameworks: ['Vue', 'React'] });
      expect(a.equals(b)).toBe(false);
    });
  });
});
