import { ValidationIssue } from './validation-issue';

/**
 * Immutable aggregate of validation findings for a single operation
 * (DTO parsing, domain construction, consistency check).
 *
 * Designed so feature/application code can accumulate issues and pass
 * a single result object to the UI without leaking the source of each
 * finding. Mutating methods always return a new instance; the original
 * stays untouched.
 */
export class ValidationResult {
  private constructor(private readonly _issues: readonly ValidationIssue[]) {}

  /** A valid, empty result with no issues. */
  static empty(): ValidationResult {
    return new ValidationResult(Object.freeze([]));
  }

  /** Build a result from a pre-existing list of issues. */
  static fromIssues(issues: readonly ValidationIssue[]): ValidationResult {
    return new ValidationResult(Object.freeze([...issues]));
  }

  /** All issues in the order they were added. */
  get issues(): readonly ValidationIssue[] {
    return this._issues;
  }

  /** Only the error-severity issues. */
  get errors(): readonly ValidationIssue[] {
    return this._issues.filter((i) => i.isError);
  }

  /** Only the warning-severity issues. */
  get warnings(): readonly ValidationIssue[] {
    return this._issues.filter((i) => !i.isError);
  }

  /** True when there are no error-severity issues. Warnings are allowed. */
  get isValid(): boolean {
    return !this.hasErrors;
  }

  /** True when at least one error-severity issue exists. */
  get hasErrors(): boolean {
    return this._issues.some((i) => i.isError);
  }

  /** True when at least one warning-severity issue exists. */
  get hasWarnings(): boolean {
    return this._issues.some((i) => !i.isError);
  }

  /**
   * Return a new result with an added error issue.
   * The original instance is not modified.
   */
  addError(message: string, path?: readonly string[]): ValidationResult {
    return this.withIssue(ValidationIssue.error(message, path));
  }

  /**
   * Return a new result with an added warning issue.
   * The original instance is not modified.
   */
  addWarning(message: string, path?: readonly string[]): ValidationResult {
    return this.withIssue(ValidationIssue.warning(message, path));
  }

  /**
   * Combine this result with another, preserving order: this result's
   * issues come first, then the other's.
   */
  combine(other: ValidationResult): ValidationResult {
    return new ValidationResult(Object.freeze([...this._issues, ...other._issues]));
  }

  private withIssue(issue: ValidationIssue): ValidationResult {
    return new ValidationResult(Object.freeze([...this._issues, issue]));
  }
}
