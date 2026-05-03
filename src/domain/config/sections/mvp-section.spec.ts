import { describe, it, expect } from 'vitest';
import { MvpSection } from './mvp-section';

describe('MvpSection', () => {
  it('treats all fields as optional and defaults lists to empty', () => {
    const section = MvpSection.create({});
    expect(section.primaryUseCase).toBeUndefined();
    expect(section.includedFeatures).toEqual([]);
    expect(section.excludedFeatures).toEqual([]);
  });

  it('trims primaryUseCase', () => {
    const section = MvpSection.create({ primaryUseCase: '  the case  ' });
    expect(section.primaryUseCase).toBe('the case');
  });

  it('rejects blank primaryUseCase', () => {
    expect(() => MvpSection.create({ primaryUseCase: '   ' })).toThrow();
  });

  it('trims and deduplicates included features', () => {
    const section = MvpSection.create({
      includedFeatures: ['  wizard  ', 'wizard', 'preview'],
    });
    expect(section.includedFeatures).toEqual(['wizard', 'preview']);
  });

  it('rejects blank feature entries', () => {
    expect(() => MvpSection.create({ includedFeatures: ['ok', '   '] })).toThrow();
    expect(() => MvpSection.create({ excludedFeatures: ['ok', ''] })).toThrow();
  });

  it('rejects features that appear in both included and excluded', () => {
    expect(() =>
      MvpSection.create({
        includedFeatures: ['wizard', 'preview'],
        excludedFeatures: ['preview'],
      }),
    ).toThrow();
  });

  it('exposes frozen lists', () => {
    const section = MvpSection.create({ includedFeatures: ['a'] });
    expect(Object.isFrozen(section.includedFeatures)).toBe(true);
  });

  describe('equals', () => {
    it('is true when primary use case and feature lists match', () => {
      const a = MvpSection.create({
        primaryUseCase: 'x',
        includedFeatures: ['p', 'q'],
        excludedFeatures: ['r'],
      });
      const b = MvpSection.create({
        primaryUseCase: 'x',
        includedFeatures: ['p', 'q'],
        excludedFeatures: ['r'],
      });
      expect(a.equals(b)).toBe(true);
    });

    it('is false when included features differ in content', () => {
      const a = MvpSection.create({ includedFeatures: ['p', 'q'] });
      const b = MvpSection.create({ includedFeatures: ['p', 'r'] });
      expect(a.equals(b)).toBe(false);
    });

    it('is false when included features differ in order', () => {
      const a = MvpSection.create({ includedFeatures: ['p', 'q'] });
      const b = MvpSection.create({ includedFeatures: ['q', 'p'] });
      expect(a.equals(b)).toBe(false);
    });

    it('is false when excluded features differ', () => {
      const a = MvpSection.create({ excludedFeatures: ['p'] });
      const b = MvpSection.create({ excludedFeatures: ['p', 'q'] });
      expect(a.equals(b)).toBe(false);
    });
  });
});
