/**
 * Inputs accepted when constructing a {@link FeatureArchitectureSection}.
 */
export interface FeatureArchitectureSectionCreateInput {
  readonly viewsArePresentational: boolean;
  readonly hasFeatureBusinessLayer: boolean;
  readonly allowDirectHttpClientFromViews: boolean;
}

/**
 * Feature architecture decisions section of the configuration model.
 *
 * Captures the rules generated agent files will enforce around feature
 * structure (presentational views, feature business layer, no direct
 * HttpClient from views). Maps to the `featureArchitecture` section in
 * `docs/CONFIG_MODEL.md`.
 *
 * Enforces one cross-field invariant: if views are presentational, they
 * cannot also be allowed to call HttpClient directly. Generated docs
 * must not contradict themselves.
 */
export class FeatureArchitectureSection {
  private constructor(
    private readonly _viewsArePresentational: boolean,
    private readonly _hasFeatureBusinessLayer: boolean,
    private readonly _allowDirectHttpClientFromViews: boolean,
  ) {}

  /**
   * Build a FeatureArchitectureSection.
   *
   * @throws Error if `viewsArePresentational` is true while
   * `allowDirectHttpClientFromViews` is also true (contradictory).
   */
  static create(input: FeatureArchitectureSectionCreateInput): FeatureArchitectureSection {
    if (input.viewsArePresentational && input.allowDirectHttpClientFromViews) {
      throw new Error(
        'FeatureArchitectureSection: presentational views cannot also be allowed to call HttpClient directly.',
      );
    }
    return new FeatureArchitectureSection(
      input.viewsArePresentational,
      input.hasFeatureBusinessLayer,
      input.allowDirectHttpClientFromViews,
    );
  }

  /** True when Angular views are presentational (no business logic). */
  get viewsArePresentational(): boolean {
    return this._viewsArePresentational;
  }

  /** True when each non-trivial feature has its own business/application layer. */
  get hasFeatureBusinessLayer(): boolean {
    return this._hasFeatureBusinessLayer;
  }

  /** True when views may call HttpClient or REST services directly. */
  get allowDirectHttpClientFromViews(): boolean {
    return this._allowDirectHttpClientFromViews;
  }

  /** Value-based equality across all three flags. */
  equals(other: FeatureArchitectureSection): boolean {
    return (
      this._viewsArePresentational === other._viewsArePresentational &&
      this._hasFeatureBusinessLayer === other._hasFeatureBusinessLayer &&
      this._allowDirectHttpClientFromViews === other._allowDirectHttpClientFromViews
    );
  }
}
