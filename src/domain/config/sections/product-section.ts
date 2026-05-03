/**
 * Inputs accepted when constructing a {@link ProductSection}.
 */
export interface ProductSectionCreateInput {
  readonly problemStatement?: string;
  readonly valueProposition?: string;
}

/**
 * Product context section of the configuration model.
 *
 * Captures why the project exists. Maps to the `product` section in
 * `docs/CONFIG_MODEL.md`. The skeleton holds only the two most useful
 * free-text fields; richer fields (target users, pain points,
 * principles, success criteria) are added when the wizard collects
 * them.
 */
export class ProductSection {
  private constructor(
    private readonly _problemStatement: string | undefined,
    private readonly _valueProposition: string | undefined,
  ) {}

  /**
   * Build a ProductSection. Empty/blank values are normalized to
   * `undefined` so consumers do not need to distinguish between
   * "missing" and "present but empty".
   *
   * @throws Error if any field is provided but blank after trimming.
   */
  static create(input: ProductSectionCreateInput): ProductSection {
    return new ProductSection(
      ProductSection.requireNonBlank(input.problemStatement, 'problemStatement'),
      ProductSection.requireNonBlank(input.valueProposition, 'valueProposition'),
    );
  }

  /** Optional, trimmed statement of the problem the product addresses. */
  get problemStatement(): string | undefined {
    return this._problemStatement;
  }

  /** Optional, trimmed statement of the product's value proposition. */
  get valueProposition(): string | undefined {
    return this._valueProposition;
  }

  /** Value-based equality: both fields must match. */
  equals(other: ProductSection): boolean {
    return (
      this._problemStatement === other._problemStatement &&
      this._valueProposition === other._valueProposition
    );
  }

  private static requireNonBlank(value: string | undefined, field: string): string | undefined {
    if (value === undefined) {
      return undefined;
    }
    const trimmed = value.trim();
    if (trimmed.length === 0) {
      throw new Error(`ProductSection ${field} must not be blank when provided.`);
    }
    return trimmed;
  }
}
