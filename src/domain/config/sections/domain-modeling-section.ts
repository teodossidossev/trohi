/**
 * Inputs accepted when constructing a {@link DomainModelingSection}.
 */
export interface DomainModelingSectionCreateInput {
  readonly useExplicitDomainModels: boolean;
  readonly requireDtoValidation: boolean;
  readonly useUiViewModels: boolean;
}

/**
 * Domain-modeling decisions section of the configuration model.
 *
 * Captures the project's stance on the no-raw-JSON rule. Maps to the
 * `domainModeling` section in `docs/CONFIG_MODEL.md`.
 *
 * The skeleton models the three flags that drive whether generated
 * docs/agent files instruct AI agents to use explicit domain models,
 * validate DTOs at boundaries, and consume UI view models.
 */
export class DomainModelingSection {
  private constructor(
    private readonly _useExplicitDomainModels: boolean,
    private readonly _requireDtoValidation: boolean,
    private readonly _useUiViewModels: boolean,
  ) {}

  /** Build a DomainModelingSection. No cross-field invariants for now. */
  static create(input: DomainModelingSectionCreateInput): DomainModelingSection {
    return new DomainModelingSection(
      input.useExplicitDomainModels,
      input.requireDtoValidation,
      input.useUiViewModels,
    );
  }

  /** True when the project uses explicit domain models, not raw JSON. */
  get useExplicitDomainModels(): boolean {
    return this._useExplicitDomainModels;
  }

  /** True when imported DTOs must be validated before mapping. */
  get requireDtoValidation(): boolean {
    return this._requireDtoValidation;
  }

  /** True when UI components consume view models, not domain models or DTOs. */
  get useUiViewModels(): boolean {
    return this._useUiViewModels;
  }

  /** Value-based equality across all three flags. */
  equals(other: DomainModelingSection): boolean {
    return (
      this._useExplicitDomainModels === other._useExplicitDomainModels &&
      this._requireDtoValidation === other._requireDtoValidation &&
      this._useUiViewModels === other._useUiViewModels
    );
  }
}
