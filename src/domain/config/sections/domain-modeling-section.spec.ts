import { describe, it, expect } from 'vitest';
import { DomainModelingSection } from './domain-modeling-section';

describe('DomainModelingSection', () => {
  it('exposes its three flags', () => {
    const section = DomainModelingSection.create({
      useExplicitDomainModels: true,
      requireDtoValidation: true,
      useUiViewModels: true,
    });
    expect(section.useExplicitDomainModels).toBe(true);
    expect(section.requireDtoValidation).toBe(true);
    expect(section.useUiViewModels).toBe(true);
  });

  it('preserves false values without normalization', () => {
    const section = DomainModelingSection.create({
      useExplicitDomainModels: false,
      requireDtoValidation: false,
      useUiViewModels: false,
    });
    expect(section.useExplicitDomainModels).toBe(false);
    expect(section.requireDtoValidation).toBe(false);
    expect(section.useUiViewModels).toBe(false);
  });

  describe('equals', () => {
    const make = (overrides: Partial<Parameters<typeof DomainModelingSection.create>[0]> = {}) =>
      DomainModelingSection.create({
        useExplicitDomainModels: true,
        requireDtoValidation: true,
        useUiViewModels: true,
        ...overrides,
      });

    it('is true for identical sections', () => {
      expect(make().equals(make())).toBe(true);
    });

    it('is false when any single flag differs', () => {
      expect(make().equals(make({ useExplicitDomainModels: false }))).toBe(false);
      expect(make().equals(make({ requireDtoValidation: false }))).toBe(false);
      expect(make().equals(make({ useUiViewModels: false }))).toBe(false);
    });
  });
});
