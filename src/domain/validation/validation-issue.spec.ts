import { describe, it, expect } from 'vitest';
import { ValidationIssue, ValidationSeverity } from './validation-issue';

describe('ValidationIssue', () => {
  it('creates an error issue', () => {
    const issue = ValidationIssue.error('bad value');
    expect(issue.severity).toBe(ValidationSeverity.Error);
    expect(issue.message).toBe('bad value');
    expect(issue.path).toBeUndefined();
  });

  it('creates a warning issue', () => {
    const issue = ValidationIssue.warning('looks suspicious');
    expect(issue.severity).toBe(ValidationSeverity.Warning);
    expect(issue.message).toBe('looks suspicious');
  });

  it('attaches a structured path', () => {
    const issue = ValidationIssue.error('missing field', ['project', 'name']);
    expect(issue.path).toEqual(['project', 'name']);
  });

  it('exposes a dotted path string for display', () => {
    const issue = ValidationIssue.error('missing field', ['project', 'name']);
    expect(issue.pathString).toBe('project.name');
  });

  it('returns an empty path string when no path is attached', () => {
    expect(ValidationIssue.error('x').pathString).toBe('');
  });

  it('isError reflects the severity', () => {
    expect(ValidationIssue.error('x').isError).toBe(true);
    expect(ValidationIssue.warning('x').isError).toBe(false);
  });
});
