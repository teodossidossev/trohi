/**
 * Which output catalog the project draws from.
 *
 * `TrohiBootstrap` selects the files needed to develop trohi itself
 * (Claude + Codex workflow, no Cursor/Copilot). `ProductMvp` selects
 * the output set generated for a user's project, with optional vendor
 * outputs gated on the active agent targets.
 */
export enum OutputScope {
  TrohiBootstrap = 'trohi-bootstrap',
  ProductMvp = 'product-mvp',
}

/**
 * Inputs accepted when constructing an {@link OutputsSection}.
 */
export interface OutputsSectionCreateInput {
  readonly scope: OutputScope;
}

/**
 * Outputs section of the configuration model.
 *
 * Captures which selection scope the project uses. The concrete file
 * list is computed at use time by `OutputSelection`, not stored here,
 * so the catalog and selection rules remain the single source of truth.
 * Maps to the `outputs` section in `docs/CONFIG_MODEL.md`. File-level
 * include/exclude overrides will be added when the wizard supports them.
 */
export class OutputsSection {
  private constructor(private readonly _scope: OutputScope) {}

  /** Build an OutputsSection. The scope is enforced by the enum at compile time. */
  static create(input: OutputsSectionCreateInput): OutputsSection {
    return new OutputsSection(input.scope);
  }

  /** Selection scope (TrohiBootstrap or ProductMvp). */
  get scope(): OutputScope {
    return this._scope;
  }

  /** Value-based equality (scope must match). */
  equals(other: OutputsSection): boolean {
    return this._scope === other._scope;
  }
}
