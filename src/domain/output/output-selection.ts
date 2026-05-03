import {
  DEFERRED_BOOTSTRAP_OUTPUTS,
  PRODUCT_MVP_OUTPUTS,
  TROHI_BOOTSTRAP_OUTPUTS,
} from './output-definitions';
import { OutputDefinition } from './output-definition';
import { OutputTarget } from './output-target';

/**
 * Inputs accepted by {@link OutputSelection.forProductMvp}.
 */
export interface ProductMvpSelectionInput {
  /**
   * The agent/tool targets the user has opted into for this generation
   * run. Adding a target enables the optional outputs associated with
   * it (currently Cursor and GitHub Copilot).
   */
  readonly selectedTargets: ReadonlySet<OutputTarget>;
}

/**
 * Deterministic, intent-named selection of {@link OutputDefinition}s.
 *
 * Centralizes the rule that Cursor and GitHub Copilot files are
 * deferred for trohi's own bootstrap and only generated for user
 * projects when the corresponding target is selected. Callers must not
 * concatenate the raw catalogs themselves; they should ask
 * OutputSelection so the policy stays in one place and a future
 * refactor of the catalogs cannot leak deferred files into bootstrap.
 */
export class OutputSelection {
  /**
   * Outputs trohi generates while developing trohi itself.
   *
   * Always returns the bootstrap catalog and never the deferred
   * Cursor/Copilot outputs. Takes no input by design: the bootstrap
   * workflow (Claude Code + Codex + human approver) is fixed at this
   * stage of the project.
   */
  static forTrohiBootstrap(): readonly OutputDefinition[] {
    return TROHI_BOOTSTRAP_OUTPUTS;
  }

  /**
   * Outputs trohi generates for a user's project.
   *
   * Always includes the required product MVP outputs (the docs set,
   * `AGENTS.md`, and `trohi.config.json`). Adds optional vendor-
   * specific outputs (currently `.cursor/*` and
   * `.github/copilot-instructions.md`) only for vendor targets that
   * appear in `selectedTargets`. Targets that have no associated
   * optional output (e.g. `GenericAgent`, `None`) are ignored.
   *
   * Output order is stable: required outputs first, then any optional
   * outputs in the catalog's declaration order.
   */
  static forProductMvp(input: ProductMvpSelectionInput): readonly OutputDefinition[] {
    const optional = DEFERRED_BOOTSTRAP_OUTPUTS.filter((def) =>
      input.selectedTargets.has(def.target),
    );
    return [...PRODUCT_MVP_OUTPUTS, ...optional];
  }
}
