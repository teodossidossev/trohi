import { describe, it, expect } from 'vitest';
import { FeatureArchitectureSection } from './feature-architecture-section';

describe('FeatureArchitectureSection', () => {
  it('exposes its three flags', () => {
    const section = FeatureArchitectureSection.create({
      viewsArePresentational: true,
      hasFeatureBusinessLayer: true,
      allowDirectHttpClientFromViews: false,
    });
    expect(section.viewsArePresentational).toBe(true);
    expect(section.hasFeatureBusinessLayer).toBe(true);
    expect(section.allowDirectHttpClientFromViews).toBe(false);
  });

  it('rejects presentational views combined with direct HttpClient calls (contradiction)', () => {
    expect(() =>
      FeatureArchitectureSection.create({
        viewsArePresentational: true,
        hasFeatureBusinessLayer: true,
        allowDirectHttpClientFromViews: true,
      }),
    ).toThrow();
  });

  it('allows non-presentational views with direct HttpClient calls', () => {
    expect(() =>
      FeatureArchitectureSection.create({
        viewsArePresentational: false,
        hasFeatureBusinessLayer: false,
        allowDirectHttpClientFromViews: true,
      }),
    ).not.toThrow();
  });

  describe('equals', () => {
    const make = (
      overrides: Partial<Parameters<typeof FeatureArchitectureSection.create>[0]> = {},
    ) =>
      FeatureArchitectureSection.create({
        viewsArePresentational: true,
        hasFeatureBusinessLayer: true,
        allowDirectHttpClientFromViews: false,
        ...overrides,
      });

    it('is true for identical sections', () => {
      expect(make().equals(make())).toBe(true);
    });

    it('is false when any single flag differs', () => {
      expect(make().equals(make({ viewsArePresentational: false }))).toBe(false);
      expect(make().equals(make({ hasFeatureBusinessLayer: false }))).toBe(false);
      // viewsArePresentational must be false for the contradiction guard.
      const differentHttp = FeatureArchitectureSection.create({
        viewsArePresentational: false,
        hasFeatureBusinessLayer: true,
        allowDirectHttpClientFromViews: true,
      });
      const baseline = FeatureArchitectureSection.create({
        viewsArePresentational: false,
        hasFeatureBusinessLayer: true,
        allowDirectHttpClientFromViews: false,
      });
      expect(differentHttp.equals(baseline)).toBe(false);
    });
  });
});
