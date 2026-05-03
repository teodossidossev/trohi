/**
 * Inputs accepted when constructing a {@link TemplateWarning}.
 */
export interface TemplateWarningCreateInput {
  readonly message: string;
  readonly source?: string;
}

/**
 * Non-blocking issue produced by a template during rendering.
 *
 * Templates use warnings to surface things like "this section was
 * rendered with a placeholder because the user has not provided X
 * yet". Warnings do not block generation - the file still renders -
 * but they let preview/export UIs show the user what is missing.
 *
 * Errors that should block generation belong in `ValidationResult`
 * before rendering starts; warnings are strictly informational.
 */
export class TemplateWarning {
  private constructor(
    private readonly _message: string,
    private readonly _source: string | undefined,
  ) {}

  /**
   * Build a TemplateWarning.
   *
   * @throws Error if `message` is blank after trimming, or if `source`
   * is provided but blank after trimming.
   */
  static create(input: TemplateWarningCreateInput): TemplateWarning {
    const message = input.message.trim();
    if (message.length === 0) {
      throw new Error('TemplateWarning message must not be blank.');
    }
    let source: string | undefined;
    if (input.source !== undefined) {
      source = input.source.trim();
      if (source.length === 0) {
        throw new Error('TemplateWarning source must not be blank when provided.');
      }
    }
    return new TemplateWarning(message, source);
  }

  /** Human-readable description of the warning. */
  get message(): string {
    return this._message;
  }

  /**
   * Optional identifier of where the warning came from, e.g. a template
   * name or the path it would write to. Useful for grouping warnings
   * in the preview UI.
   */
  get source(): string | undefined {
    return this._source;
  }

  /** Value-based equality. */
  equals(other: TemplateWarning): boolean {
    return this._message === other._message && this._source === other._source;
  }
}
