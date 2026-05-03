/**
 * Error thrown when an OutputFilePath is constructed from an unsafe or
 * malformed value. Used at boundaries to translate raw input into clear
 * validation feedback before generation or export.
 */
export class OutputFilePathError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'OutputFilePathError';
  }
}

/**
 * Immutable value object representing a path to a generated file inside
 * a target repository.
 *
 * Paths are always relative, POSIX-style, and free of parent-directory
 * traversal so that generation and export cannot escape the project
 * root or write to arbitrary locations on the user's machine.
 */
export class OutputFilePath {
  private static readonly DISALLOWED_SEGMENTS = new Set(['', '.', '..']);

  private constructor(
    private readonly _value: string,
    private readonly _segments: readonly string[],
  ) {}

  /**
   * Build an OutputFilePath from a raw string.
   *
   * Trims surrounding whitespace, then enforces safety rules: must be
   * non-empty; must use forward slashes; must not be absolute, contain
   * backslashes, control characters, parent-directory traversal,
   * leading/trailing slashes, or empty segments.
   *
   * @throws OutputFilePathError on any rule violation, with a message
   * describing the specific reason.
   */
  static create(raw: string): OutputFilePath {
    const trimmed = raw.trim();
    if (trimmed.length === 0) {
      throw new OutputFilePathError('Output file path must not be empty.');
    }
    if (trimmed.includes('\\')) {
      throw new OutputFilePathError('Output file path must use forward slashes, not backslashes.');
    }
    if (OutputFilePath.containsControlChar(trimmed)) {
      throw new OutputFilePathError('Output file path must not contain control characters.');
    }
    if (trimmed.startsWith('/')) {
      throw new OutputFilePathError('Output file path must be relative, not absolute.');
    }
    if (trimmed.endsWith('/')) {
      throw new OutputFilePathError('Output file path must not end with a slash.');
    }

    const segments = trimmed.split('/');
    for (const segment of segments) {
      if (OutputFilePath.DISALLOWED_SEGMENTS.has(segment)) {
        throw new OutputFilePathError(
          `Output file path must not contain empty, "." or ".." segments (got "${trimmed}").`,
        );
      }
    }

    return new OutputFilePath(trimmed, Object.freeze([...segments]));
  }

  /** The validated, normalized path string (POSIX-style, relative). */
  get value(): string {
    return this._value;
  }

  /** The path split into its forward-slash separated segments. */
  get segments(): readonly string[] {
    return this._segments;
  }

  /** Value-based equality between two paths. */
  equals(other: OutputFilePath): boolean {
    return this._value === other._value;
  }

  /** String representation (returns the underlying path). */
  toString(): string {
    return this._value;
  }

  /**
   * True if the string contains any ASCII control character
   * (U+0000-U+001F or U+007F), including NUL. Avoids regex literals so
   * the source stays free of literal control bytes.
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
