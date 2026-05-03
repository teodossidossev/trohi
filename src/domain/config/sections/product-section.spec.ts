import { describe, it, expect } from 'vitest';
import { ProductSection } from './product-section';

describe('ProductSection', () => {
  it('accepts both fields as optional', () => {
    const section = ProductSection.create({});
    expect(section.problemStatement).toBeUndefined();
    expect(section.valueProposition).toBeUndefined();
  });

  it('keeps trimmed problemStatement and valueProposition', () => {
    const section = ProductSection.create({
      problemStatement: '  the problem  ',
      valueProposition: '  the value  ',
    });
    expect(section.problemStatement).toBe('the problem');
    expect(section.valueProposition).toBe('the value');
  });

  it('rejects blank-only problemStatement', () => {
    expect(() => ProductSection.create({ problemStatement: '   ' })).toThrow();
  });

  it('rejects blank-only valueProposition', () => {
    expect(() => ProductSection.create({ valueProposition: '   ' })).toThrow();
  });

  describe('equals', () => {
    it('is true when both fields match (including both undefined)', () => {
      expect(ProductSection.create({}).equals(ProductSection.create({}))).toBe(true);
      expect(
        ProductSection.create({ problemStatement: 'p', valueProposition: 'v' }).equals(
          ProductSection.create({ problemStatement: 'p', valueProposition: 'v' }),
        ),
      ).toBe(true);
    });

    it('is false when problemStatement differs', () => {
      const a = ProductSection.create({ problemStatement: 'a' });
      const b = ProductSection.create({ problemStatement: 'b' });
      expect(a.equals(b)).toBe(false);
    });

    it('is false when valueProposition differs', () => {
      const a = ProductSection.create({ valueProposition: 'a' });
      const b = ProductSection.create({ valueProposition: 'b' });
      expect(a.equals(b)).toBe(false);
    });
  });
});
