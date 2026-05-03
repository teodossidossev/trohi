import { describe, it, expect } from 'vitest';
import { TestingSection } from './testing-section';

describe('TestingSection', () => {
  it('exposes its fields', () => {
    const section = TestingSection.create({
      useTdd: true,
      unitTestRunner: 'Vitest',
      e2eTestRunner: 'Cypress',
    });
    expect(section.useTdd).toBe(true);
    expect(section.unitTestRunner).toBe('Vitest');
    expect(section.e2eTestRunner).toBe('Cypress');
  });

  it('treats e2eTestRunner as optional', () => {
    const section = TestingSection.create({ useTdd: false, unitTestRunner: 'Vitest' });
    expect(section.e2eTestRunner).toBeUndefined();
  });

  it('trims runner names', () => {
    const section = TestingSection.create({
      useTdd: true,
      unitTestRunner: '  Vitest  ',
      e2eTestRunner: '  Cypress  ',
    });
    expect(section.unitTestRunner).toBe('Vitest');
    expect(section.e2eTestRunner).toBe('Cypress');
  });

  it('rejects blank unitTestRunner', () => {
    expect(() => TestingSection.create({ useTdd: true, unitTestRunner: '   ' })).toThrow();
  });

  it('rejects blank e2eTestRunner when provided', () => {
    expect(() =>
      TestingSection.create({ useTdd: true, unitTestRunner: 'Vitest', e2eTestRunner: '   ' }),
    ).toThrow();
  });

  describe('equals', () => {
    it('is true for identical sections', () => {
      const a = TestingSection.create({
        useTdd: true,
        unitTestRunner: 'Vitest',
        e2eTestRunner: 'Cypress',
      });
      const b = TestingSection.create({
        useTdd: true,
        unitTestRunner: 'Vitest',
        e2eTestRunner: 'Cypress',
      });
      expect(a.equals(b)).toBe(true);
    });

    it('is false when any field differs', () => {
      const base = { useTdd: true, unitTestRunner: 'Vitest', e2eTestRunner: 'Cypress' };
      expect(
        TestingSection.create(base).equals(TestingSection.create({ ...base, useTdd: false })),
      ).toBe(false);
      expect(
        TestingSection.create(base).equals(
          TestingSection.create({ ...base, unitTestRunner: 'Jest' }),
        ),
      ).toBe(false);
      expect(
        TestingSection.create(base).equals(
          TestingSection.create({ ...base, e2eTestRunner: 'Playwright' }),
        ),
      ).toBe(false);
    });

    it('treats undefined e2eTestRunner as different from a string', () => {
      const a = TestingSection.create({ useTdd: true, unitTestRunner: 'Vitest' });
      const b = TestingSection.create({
        useTdd: true,
        unitTestRunner: 'Vitest',
        e2eTestRunner: 'Cypress',
      });
      expect(a.equals(b)).toBe(false);
    });
  });
});
