import { describe, it, expect } from 'vitest';
import { OutputScope, OutputsSection } from './outputs-section';

describe('OutputsSection', () => {
  it('exposes its scope', () => {
    const section = OutputsSection.create({ scope: OutputScope.TrohiBootstrap });
    expect(section.scope).toBe(OutputScope.TrohiBootstrap);
  });

  it('preserves the ProductMvp scope', () => {
    const section = OutputsSection.create({ scope: OutputScope.ProductMvp });
    expect(section.scope).toBe(OutputScope.ProductMvp);
  });

  describe('equals', () => {
    it('is true when scopes match', () => {
      const a = OutputsSection.create({ scope: OutputScope.TrohiBootstrap });
      const b = OutputsSection.create({ scope: OutputScope.TrohiBootstrap });
      expect(a.equals(b)).toBe(true);
    });

    it('is false when scopes differ', () => {
      const a = OutputsSection.create({ scope: OutputScope.TrohiBootstrap });
      const b = OutputsSection.create({ scope: OutputScope.ProductMvp });
      expect(a.equals(b)).toBe(false);
    });
  });
});
