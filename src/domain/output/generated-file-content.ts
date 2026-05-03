/**
 * Error thrown when a GeneratedFileContent is constructed from an
 * unsafe value (currently: any string containing a NUL byte).
 */
export class GeneratedFileContentError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'GeneratedFileContentError';
  }
}

/**
 * Immutable value object wrapping the body of a generated file.
 *
 * Generated content is intentionally preserved verbatim - whitespace
 * and line endings are significant to Markdown and code rendering.
 * The only invariant enforced at this layer is that the body must not
 * contain a NUL byte, which would corrupt downstream archiving and
 * file-write code paths.
 *
 * Empty content is allowed because a placeholder file may legitimately
 * be generated with no body before templates are populated.
 */
export class GeneratedFileContent {
  // UTF-8 encoder reused across calls; TextEncoder is spec-required to
  // be UTF-8 only.
  private static readonly UTF8_ENCODER = new TextEncoder();

  private constructor(private readonly _value: string) {}

  /**
   * Build a GeneratedFileContent from a raw string.
   *
   * @throws GeneratedFileContentError if the string contains a NUL byte.
   */
  static create(raw: string): GeneratedFileContent {
    if (GeneratedFileContent.containsNul(raw)) {
      throw new GeneratedFileContentError('Generated file content must not contain NUL bytes.');
    }
    return new GeneratedFileContent(raw);
  }

  /** The raw content string, byte-for-byte. */
  get value(): string {
    return this._value;
  }

  /** True when the underlying string has zero length. Whitespace counts as content. */
  get isEmpty(): boolean {
    return this._value.length === 0;
  }

  /** Length of the content when encoded as UTF-8 bytes. */
  get byteLength(): number {
    return GeneratedFileContent.UTF8_ENCODER.encode(this._value).byteLength;
  }

  /** Value-based equality (string comparison). */
  equals(other: GeneratedFileContent): boolean {
    return this._value === other._value;
  }

  private static containsNul(value: string): boolean {
    for (let i = 0; i < value.length; i++) {
      if (value.charCodeAt(i) === 0) {
        return true;
      }
    }
    return false;
  }
}
