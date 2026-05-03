import { OutputTarget } from '../../output/output-target';

/**
 * Inputs accepted when constructing an {@link AgentsSection}.
 */
export interface AgentsSectionCreateInput {
  readonly activeTargets: ReadonlySet<OutputTarget>;
  readonly deferredTargets: ReadonlySet<OutputTarget>;
}

/**
 * AI agents section of the configuration model.
 *
 * Captures which agent targets the project actively generates files
 * for and which it has explicitly deferred. Maps to the `agents`
 * section in `docs/CONFIG_MODEL.md`.
 *
 * Enforces that a target cannot be simultaneously active and deferred.
 * Selection of concrete output files is performed by
 * {@link OutputSelection} based on these target sets.
 *
 * Internal sets are kept private; getters return a fresh defensive
 * copy on every access so consumers cannot corrupt section state via
 * `Set.prototype.add/delete/clear`. (Object.freeze on a Set does not
 * block these methods because they operate on internal slots, not own
 * properties.)
 */
export class AgentsSection {
  private constructor(
    private readonly _activeTargets: ReadonlySet<OutputTarget>,
    private readonly _deferredTargets: ReadonlySet<OutputTarget>,
  ) {}

  /**
   * Build an AgentsSection.
   *
   * @throws Error if any target appears in both `activeTargets` and
   * `deferredTargets`.
   */
  static create(input: AgentsSectionCreateInput): AgentsSection {
    const overlap: OutputTarget[] = [];
    for (const target of input.activeTargets) {
      if (input.deferredTargets.has(target)) {
        overlap.push(target);
      }
    }
    if (overlap.length > 0) {
      throw new Error(
        `AgentsSection: target(s) cannot be both active and deferred: ${overlap.join(', ')}.`,
      );
    }
    // Defensive copy on input so subsequent caller mutations of their
    // input set cannot leak into us.
    return new AgentsSection(new Set(input.activeTargets), new Set(input.deferredTargets));
  }

  /**
   * Returns a fresh Set of the active agent targets.
   *
   * Mutating the returned Set has no effect on the section.
   */
  get activeTargets(): ReadonlySet<OutputTarget> {
    return new Set(this._activeTargets);
  }

  /**
   * Returns a fresh Set of the deferred agent targets.
   *
   * Mutating the returned Set has no effect on the section.
   */
  get deferredTargets(): ReadonlySet<OutputTarget> {
    return new Set(this._deferredTargets);
  }

  /**
   * Value-based equality: both target sets must contain the same
   * elements. Compared against the private internal sets so the cost
   * of building defensive copies is avoided.
   */
  equals(other: AgentsSection): boolean {
    return (
      AgentsSection.setEquals(this._activeTargets, other._activeTargets) &&
      AgentsSection.setEquals(this._deferredTargets, other._deferredTargets)
    );
  }

  private static setEquals(a: ReadonlySet<OutputTarget>, b: ReadonlySet<OutputTarget>): boolean {
    if (a.size !== b.size) {
      return false;
    }
    for (const value of a) {
      if (!b.has(value)) {
        return false;
      }
    }
    return true;
  }
}
