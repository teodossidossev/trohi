import { OutputCategory } from './output-category';
import { OutputTarget } from './output-target';
import { OutputFilePath } from '../values/output-file-path';

/**
 * Error thrown when an OutputDefinition is constructed with an
 * inconsistent (path, category, target) triple.
 *
 * Carries a message that names the offending combination so caller
 * code (catalogs, future user-defined outputs) can surface it without
 * inspecting the rule set.
 */
export class OutputDefinitionError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'OutputDefinitionError';
  }
}

/**
 * Inputs accepted when constructing an {@link OutputDefinition}.
 */
export interface OutputDefinitionCreateInput {
  readonly path: OutputFilePath;
  readonly category: OutputCategory;
  readonly target: OutputTarget;
  readonly description?: string;
}

/**
 * Describes a file the trohi product can generate.
 *
 * An OutputDefinition is *not* a generated file - it carries no body.
 * It declares which path, category, and agent target a future
 * generation step would produce. The product catalogs in
 * `output-definitions.ts` are built from these definitions and consumed
 * by the UI for include/exclude selection.
 *
 * Equality is based on path: a given path can have only one definition
 * within a registry, and two registries that contain the same path
 * conceptually point at the same file.
 *
 * Construction enforces consistency between path, category, and target
 * for paths declared as well-known in `docs/OUTPUT_FILES.md`. This
 * prevents malformed definitions like `.cursor/rules/x.mdc` with target
 * Claude or `AGENTS.md` classified as plain documentation. Unknown
 * paths are not over-blocked so future legitimate outputs remain
 * creatable; vendor-specific *targets* are still verified to live in
 * their expected vendor-specific *paths*.
 */
export class OutputDefinition {
  private constructor(
    private readonly _path: OutputFilePath,
    private readonly _category: OutputCategory,
    private readonly _target: OutputTarget,
    private readonly _description: string | undefined,
  ) {}

  /**
   * Build an OutputDefinition, enforcing path/category/target
   * consistency rules from `docs/OUTPUT_FILES.md`.
   *
   * @throws OutputDefinitionError when the triple is inconsistent.
   */
  static create(input: OutputDefinitionCreateInput): OutputDefinition {
    OutputDefinition.validateConsistency(input.path, input.category, input.target);
    return new OutputDefinition(input.path, input.category, input.target, input.description);
  }

  /** Validated relative path where this file would be written. */
  get path(): OutputFilePath {
    return this._path;
  }

  /** High-level classification (human docs, generic agent, etc.). */
  get category(): OutputCategory {
    return this._category;
  }

  /** Agent / tool the file is intended for, or `None` for generic files. */
  get target(): OutputTarget {
    return this._target;
  }

  /** Optional human-readable description used by the UI. */
  get description(): string | undefined {
    return this._description;
  }

  /** Path-based equality. */
  equals(other: OutputDefinition): boolean {
    return this._path.equals(other._path);
  }

  // -- consistency rules ------------------------------------------------

  /**
   * Apply the rules expressed in `docs/OUTPUT_FILES.md` > "File Path
   * Rules" and the surrounding sections. Two-way: known paths must
   * have the expected category/target, and known targets must live in
   * the expected paths.
   */
  private static validateConsistency(
    path: OutputFilePath,
    category: OutputCategory,
    target: OutputTarget,
  ): void {
    const value = path.value;

    // 1. Path -> required (category, target). Lookups by exact match
    //    first, then by prefix. Unknown paths fall through to step 2.
    const wellKnown = OutputDefinition.lookupWellKnown(value);
    if (wellKnown !== undefined) {
      if (wellKnown.category !== category || wellKnown.target !== target) {
        throw new OutputDefinitionError(
          `Output path "${value}" must be declared as ${OutputDefinition.formatPair(
            wellKnown.category,
            wellKnown.target,
          )}, but got ${OutputDefinition.formatPair(category, target)}.`,
        );
      }
      return;
    }

    // 2. Vendor target -> required path location. Catches unknown paths
    //    that misuse a vendor-specific target.
    if (target === OutputTarget.Cursor && !value.startsWith('.cursor/')) {
      throw new OutputDefinitionError(
        `Output target "Cursor" requires a path under ".cursor/", got "${value}".`,
      );
    }
    if (target === OutputTarget.Copilot && value !== '.github/copilot-instructions.md') {
      throw new OutputDefinitionError(
        `Output target "Copilot" requires path ".github/copilot-instructions.md", got "${value}".`,
      );
    }
    if (target === OutputTarget.Claude && value !== 'CLAUDE.md' && !value.startsWith('.claude/')) {
      throw new OutputDefinitionError(
        `Output target "Claude" requires "CLAUDE.md" or a path under ".claude/", got "${value}".`,
      );
    }
    if (target === OutputTarget.GenericAgent && value !== 'AGENTS.md') {
      throw new OutputDefinitionError(
        `Output target "GenericAgent" requires path "AGENTS.md", got "${value}".`,
      );
    }

    // 3. Category invariants for unknown paths.
    if (category === OutputCategory.AgentSpecificInstructions && target === OutputTarget.None) {
      throw new OutputDefinitionError(
        `Category "AgentSpecificInstructions" requires a non-None target (got path "${value}").`,
      );
    }
  }

  private static lookupWellKnown(
    value: string,
  ): { category: OutputCategory; target: OutputTarget } | undefined {
    // Exact-match table for files whose path uniquely identifies them.
    const exact: Record<string, { category: OutputCategory; target: OutputTarget }> = {
      'CLAUDE.md': {
        category: OutputCategory.AgentSpecificInstructions,
        target: OutputTarget.Claude,
      },
      'AGENTS.md': {
        category: OutputCategory.GenericAgentInstructions,
        target: OutputTarget.GenericAgent,
      },
      'trohi.config.json': {
        category: OutputCategory.RepositoryWorkflow,
        target: OutputTarget.None,
      },
      '.github/pull_request_template.md': {
        category: OutputCategory.RepositoryWorkflow,
        target: OutputTarget.None,
      },
      '.github/copilot-instructions.md': {
        category: OutputCategory.AgentSpecificInstructions,
        target: OutputTarget.Copilot,
      },
    };
    if (Object.prototype.hasOwnProperty.call(exact, value)) {
      return exact[value];
    }

    // Prefix-match rules for path families.
    if (value.startsWith('.cursor/')) {
      return {
        category: OutputCategory.AgentSpecificInstructions,
        target: OutputTarget.Cursor,
      };
    }
    if (value.startsWith('.claude/')) {
      return {
        category: OutputCategory.AgentSpecificInstructions,
        target: OutputTarget.Claude,
      };
    }
    if (value.startsWith('docs/')) {
      return {
        category: OutputCategory.HumanDocumentation,
        target: OutputTarget.None,
      };
    }

    return undefined;
  }

  private static formatPair(category: OutputCategory, target: OutputTarget): string {
    return `(category=${category}, target=${target})`;
  }
}
