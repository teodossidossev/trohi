/**
 * Severity classification for a single validation finding.
 *
 * Error = the value cannot be used as-is.
 * Warning = the value is usable but the user should be informed.
 */
export enum ValidationSeverity {
  Error = 'error',
  Warning = 'warning',
}

/**
 * Immutable description of one validation finding produced when
 * validating DTOs, domain models, or generation inputs.
 *
 * Issues carry a severity, a human-readable message, and an optional
 * structured path (for example `['project', 'name']`) so the UI can
 * surface them next to the relevant field without parsing the message.
 */
export class ValidationIssue {
  private constructor(
    private readonly _severity: ValidationSeverity,
    private readonly _message: string,
    private readonly _path: readonly string[] | undefined,
  ) {}

  /** Build an error-severity issue. */
  static error(message: string, path?: readonly string[]): ValidationIssue {
    return new ValidationIssue(
      ValidationSeverity.Error,
      message,
      path === undefined ? undefined : Object.freeze([...path]),
    );
  }

  /** Build a warning-severity issue. */
  static warning(message: string, path?: readonly string[]): ValidationIssue {
    return new ValidationIssue(
      ValidationSeverity.Warning,
      message,
      path === undefined ? undefined : Object.freeze([...path]),
    );
  }

  /** Severity classification. */
  get severity(): ValidationSeverity {
    return this._severity;
  }

  /** Human-readable description of the problem. */
  get message(): string {
    return this._message;
  }

  /** Structured path to the offending value, or undefined if not known. */
  get path(): readonly string[] | undefined {
    return this._path;
  }

  /** Dot-joined display form of the path, or empty string when no path. */
  get pathString(): string {
    return this._path === undefined ? '' : this._path.join('.');
  }

  /** True for error severity (i.e. blocking) issues. */
  get isError(): boolean {
    return this._severity === ValidationSeverity.Error;
  }
}
