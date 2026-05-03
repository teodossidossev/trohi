/**
 * Inputs accepted when constructing an {@link MvpSection}.
 */
export interface MvpSectionCreateInput {
  readonly primaryUseCase?: string;
  readonly includedFeatures?: readonly string[];
  readonly excludedFeatures?: readonly string[];
}

/**
 * MVP scope section of the configuration model.
 *
 * Captures which features the first version of the project covers and
 * which are explicitly out of scope. Maps to the `mvp` section in
 * `docs/CONFIG_MODEL.md`. Richer fields (non-goals, future candidates,
 * success criteria, explicit constraints) will be added later.
 */
export class MvpSection {
  private constructor(
    private readonly _primaryUseCase: string | undefined,
    private readonly _includedFeatures: readonly string[],
    private readonly _excludedFeatures: readonly string[],
  ) {}

  /**
   * Build an MvpSection.
   *
   * Feature lists are deduplicated by exact value, trimmed, and frozen
   * so callers cannot mutate them after construction. Empty lists are
   * permitted; omitted lists are treated as empty.
   *
   * @throws Error if `primaryUseCase` is provided but blank, or if any
   * feature entry is blank, or if a feature appears in both included
   * and excluded lists.
   */
  static create(input: MvpSectionCreateInput): MvpSection {
    const primary = MvpSection.normalizeOptional(input.primaryUseCase, 'primaryUseCase');
    const included = MvpSection.normalizeFeatureList(input.includedFeatures, 'includedFeatures');
    const excluded = MvpSection.normalizeFeatureList(input.excludedFeatures, 'excludedFeatures');

    const overlap = included.filter((f) => excluded.includes(f));
    if (overlap.length > 0) {
      throw new Error(
        `MvpSection feature(s) cannot be both included and excluded: ${overlap.join(', ')}.`,
      );
    }

    return new MvpSection(primary, Object.freeze([...included]), Object.freeze([...excluded]));
  }

  /** Optional, trimmed statement of the primary MVP use case. */
  get primaryUseCase(): string | undefined {
    return this._primaryUseCase;
  }

  /** Frozen, deduplicated list of features included in the MVP. */
  get includedFeatures(): readonly string[] {
    return this._includedFeatures;
  }

  /** Frozen, deduplicated list of features explicitly out of MVP scope. */
  get excludedFeatures(): readonly string[] {
    return this._excludedFeatures;
  }

  /**
   * Value-based equality: primary use case must match, and feature
   * lists must be element-equal in order. The lists are already
   * deduplicated and trimmed at construction so direct comparison is
   * sufficient.
   */
  equals(other: MvpSection): boolean {
    return (
      this._primaryUseCase === other._primaryUseCase &&
      MvpSection.arrayEquals(this._includedFeatures, other._includedFeatures) &&
      MvpSection.arrayEquals(this._excludedFeatures, other._excludedFeatures)
    );
  }

  private static arrayEquals(a: readonly string[], b: readonly string[]): boolean {
    if (a.length !== b.length) {
      return false;
    }
    for (let i = 0; i < a.length; i++) {
      if (a[i] !== b[i]) {
        return false;
      }
    }
    return true;
  }

  private static normalizeOptional(value: string | undefined, field: string): string | undefined {
    if (value === undefined) {
      return undefined;
    }
    const trimmed = value.trim();
    if (trimmed.length === 0) {
      throw new Error(`MvpSection ${field} must not be blank when provided.`);
    }
    return trimmed;
  }

  private static normalizeFeatureList(
    list: readonly string[] | undefined,
    field: string,
  ): string[] {
    if (list === undefined) {
      return [];
    }
    const result: string[] = [];
    const seen = new Set<string>();
    for (const entry of list) {
      const trimmed = entry.trim();
      if (trimmed.length === 0) {
        throw new Error(`MvpSection ${field} entries must not be blank.`);
      }
      if (!seen.has(trimmed)) {
        seen.add(trimmed);
        result.push(trimmed);
      }
    }
    return result;
  }
}
