import { describe, it, expect } from 'vitest';
import { ValidationResult } from './validation-result';
import { ValidationIssue } from './validation-issue';

describe('ValidationResult', () => {
  describe('empty / valid', () => {
    it('is valid when there are no issues', () => {
      const result = ValidationResult.empty();
      expect(result.isValid).toBe(true);
      expect(result.hasErrors).toBe(false);
      expect(result.hasWarnings).toBe(false);
      expect(result.issues).toEqual([]);
    });

    it('is valid when it only contains warnings', () => {
      const result = ValidationResult.empty().addWarning('soft note');
      expect(result.isValid).toBe(true);
      expect(result.hasErrors).toBe(false);
      expect(result.hasWarnings).toBe(true);
    });
  });

  describe('errors', () => {
    it('is invalid when it contains at least one error', () => {
      const result = ValidationResult.empty().addError('boom');
      expect(result.isValid).toBe(false);
      expect(result.hasErrors).toBe(true);
      expect(result.errors).toHaveLength(1);
      expect(result.errors[0].message).toBe('boom');
    });

    it('attaches a path to errors', () => {
      const result = ValidationResult.empty().addError('missing', ['project', 'name']);
      expect(result.errors[0].path).toEqual(['project', 'name']);
    });
  });

  describe('immutability', () => {
    it('returns a new instance from addError without mutating the source', () => {
      const original = ValidationResult.empty();
      const next = original.addError('x');
      expect(original.isValid).toBe(true);
      expect(next.isValid).toBe(false);
    });

    it('exposes a frozen issues array', () => {
      const result = ValidationResult.empty().addError('x');
      expect(Object.isFrozen(result.issues)).toBe(true);
    });
  });

  describe('combine', () => {
    it('merges issues from two results', () => {
      const a = ValidationResult.empty().addError('a');
      const b = ValidationResult.empty().addWarning('b');
      const combined = a.combine(b);
      expect(combined.issues).toHaveLength(2);
      expect(combined.hasErrors).toBe(true);
      expect(combined.hasWarnings).toBe(true);
    });

    it('preserves order: left issues first, then right', () => {
      const a = ValidationResult.empty().addError('first');
      const b = ValidationResult.empty().addError('second');
      const combined = a.combine(b);
      expect(combined.issues.map((i) => i.message)).toEqual(['first', 'second']);
    });
  });

  describe('factories', () => {
    it('builds from a list of issues', () => {
      const issues = [ValidationIssue.error('e'), ValidationIssue.warning('w')];
      const result = ValidationResult.fromIssues(issues);
      expect(result.issues).toHaveLength(2);
      expect(result.hasErrors).toBe(true);
    });
  });
});
