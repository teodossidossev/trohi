/**
 * Error thrown when a ProjectName is constructed from an invalid value.
 *
 * Carries a human-readable message intended to surface as a validation
 * issue at boundaries (DTO mapping, UI form validation).
 */
export class ProjectNameError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ProjectNameError';
  }
}

/**
 * Immutable value object representing a project name.
 *
 * Enforces basic invariants so the domain never holds an unusable name:
 * non-empty after trimming, within a maximum length, and free of
 * control characters that would corrupt generated file content.
 */
export class ProjectName {
  /**
   * Maximum length in characters. Chosen to fit comfortably in headings,
   * file names, and CLI output without truncation concerns.
   */
  static readonly MAX_LENGTH = 100;

  private constructor(private readonly _value: string) {}

  /**
   * Build a ProjectName from a raw input string.
   *
   * Trims surrounding whitespace and validates the result.
   *
   * @throws ProjectNameError if the trimmed value is empty, longer than
   * MAX_LENGTH, or contains control characters.
   */
  static create(raw: string): ProjectName {
    const trimmed = raw.trim();
    if (trimmed.length === 0) {
      throw new ProjectNameError('Project name must not be empty.');
    }
    if (trimmed.length > ProjectName.MAX_LENGTH) {
      throw new ProjectNameError(
        `Project name must not exceed ${ProjectName.MAX_LENGTH} characters.`,
      );
    }
    if (ProjectName.containsControlChar(trimmed)) {
      throw new ProjectNameError('Project name must not contain control characters.');
    }
    return new ProjectName(trimmed);
  }

  /** The validated, trimmed name. */
  get value(): string {
    return this._value;
  }

  /** Value-based equality between two ProjectName instances. */
  equals(other: ProjectName): boolean {
    return this._value === other._value;
  }

  /** String representation (returns the underlying value). */
  toString(): string {
    return this._value;
  }

  /**
   * True if the string contains any ASCII control character
   * (U+0000-U+001F or U+007F). Implemented with charCodeAt to avoid
   * embedding literal control bytes in the source.
   */
  private static containsControlChar(value: string): boolean {
    for (let i = 0; i < value.length; i++) {
      const code = value.charCodeAt(i);
      if (code < 32 || code === 127) {
        return true;
      }
    }
    return false;
  }
}
