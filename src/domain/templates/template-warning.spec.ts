import { describe, it, expect } from 'vitest';
import { TemplateWarning } from './template-warning';

describe('TemplateWarning', () => {
  it('exposes its message and source', () => {
    const warning = TemplateWarning.create({
      message: 'product.problemStatement is missing; rendered placeholder.',
      source: 'docs/PRODUCT_VISION.md',
    });
    expect(warning.message).toBe('product.problemStatement is missing; rendered placeholder.');
    expect(warning.source).toBe('docs/PRODUCT_VISION.md');
  });

  it('treats source as optional', () => {
    const warning = TemplateWarning.create({ message: 'a warning' });
    expect(warning.source).toBeUndefined();
  });

  it('trims message and source', () => {
    const warning = TemplateWarning.create({
      message: '  m  ',
      source: '  s  ',
    });
    expect(warning.message).toBe('m');
    expect(warning.source).toBe('s');
  });

  it('rejects blank message', () => {
    expect(() => TemplateWarning.create({ message: '   ' })).toThrow();
  });

  it('rejects blank source when provided', () => {
    expect(() => TemplateWarning.create({ message: 'm', source: '   ' })).toThrow();
  });

  describe('equals', () => {
    it('is true when message and source match', () => {
      const a = TemplateWarning.create({ message: 'm', source: 's' });
      const b = TemplateWarning.create({ message: 'm', source: 's' });
      expect(a.equals(b)).toBe(true);
    });

    it('is false when message differs', () => {
      const a = TemplateWarning.create({ message: 'a' });
      const b = TemplateWarning.create({ message: 'b' });
      expect(a.equals(b)).toBe(false);
    });

    it('is false when source differs', () => {
      const a = TemplateWarning.create({ message: 'm', source: 's1' });
      const b = TemplateWarning.create({ message: 'm', source: 's2' });
      expect(a.equals(b)).toBe(false);
    });

    it('treats undefined source as different from a string', () => {
      const a = TemplateWarning.create({ message: 'm' });
      const b = TemplateWarning.create({ message: 'm', source: 's' });
      expect(a.equals(b)).toBe(false);
    });
  });
});
