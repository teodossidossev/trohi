/**
 * Package manager used by the project.
 */
export enum PackageManager {
  Npm = 'npm',
  Pnpm = 'pnpm',
  Yarn = 'yarn',
}

/**
 * Inputs accepted when constructing a {@link TechnologySection}.
 */
export interface TechnologySectionCreateInput {
  readonly framework: string;
  readonly runtime: string;
  readonly packageManager: PackageManager;
  readonly schemaValidator?: string;
  readonly zipLibrary?: string;
  readonly rejectedFrameworks?: readonly string[];
}

/**
 * Technology stack section of the configuration model.
 *
 * Captures the project's chosen frameworks, runtime, package manager,
 * and notable libraries, plus any frameworks the project explicitly
 * rejects (so generated agent files can warn against re-introducing
 * them). Maps to the `technology` section in `docs/CONFIG_MODEL.md`.
 */
export class TechnologySection {
  private constructor(
    private readonly _framework: string,
    private readonly _runtime: string,
    private readonly _packageManager: PackageManager,
    private readonly _schemaValidator: string | undefined,
    private readonly _zipLibrary: string | undefined,
    private readonly _rejectedFrameworks: readonly string[],
  ) {}

  /**
   * Build a TechnologySection.
   *
   * @throws Error if `framework` or `runtime` is blank, or if any
   * rejected-framework entry is blank, or if a rejected framework is
   * the same as the chosen framework.
   */
  static create(input: TechnologySectionCreateInput): TechnologySection {
    const framework = TechnologySection.requireNonBlank(input.framework, 'framework');
    const runtime = TechnologySection.requireNonBlank(input.runtime, 'runtime');
    const schemaValidator = TechnologySection.normalizeOptional(
      input.schemaValidator,
      'schemaValidator',
    );
    const zipLibrary = TechnologySection.normalizeOptional(input.zipLibrary, 'zipLibrary');
    const rejected = TechnologySection.normalizeRejectedList(input.rejectedFrameworks, framework);
    return new TechnologySection(
      framework,
      runtime,
      input.packageManager,
      schemaValidator,
      zipLibrary,
      Object.freeze([...rejected]),
    );
  }

  /** Main framework, e.g. "Angular 21". */
  get framework(): string {
    return this._framework;
  }

  /** Runtime, e.g. "Node.js 22". */
  get runtime(): string {
    return this._runtime;
  }

  /** Package manager. */
  get packageManager(): PackageManager {
    return this._packageManager;
  }

  /** Optional schema validator library, e.g. "Zod". */
  get schemaValidator(): string | undefined {
    return this._schemaValidator;
  }

  /** Optional ZIP library, e.g. "fflate". */
  get zipLibrary(): string | undefined {
    return this._zipLibrary;
  }

  /** Frozen, deduplicated list of frameworks the project explicitly rejects. */
  get rejectedFrameworks(): readonly string[] {
    return this._rejectedFrameworks;
  }

  /**
   * Value-based equality across every field. The rejected-frameworks
   * list is compared element-by-element in order; lists are already
   * deduplicated and trimmed at construction.
   */
  equals(other: TechnologySection): boolean {
    return (
      this._framework === other._framework &&
      this._runtime === other._runtime &&
      this._packageManager === other._packageManager &&
      this._schemaValidator === other._schemaValidator &&
      this._zipLibrary === other._zipLibrary &&
      TechnologySection.arrayEquals(this._rejectedFrameworks, other._rejectedFrameworks)
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

  private static requireNonBlank(value: string, field: string): string {
    const trimmed = value.trim();
    if (trimmed.length === 0) {
      throw new Error(`TechnologySection ${field} must not be blank.`);
    }
    return trimmed;
  }

  private static normalizeOptional(value: string | undefined, field: string): string | undefined {
    if (value === undefined) {
      return undefined;
    }
    const trimmed = value.trim();
    if (trimmed.length === 0) {
      throw new Error(`TechnologySection ${field} must not be blank when provided.`);
    }
    return trimmed;
  }

  private static normalizeRejectedList(
    list: readonly string[] | undefined,
    framework: string,
  ): string[] {
    if (list === undefined) {
      return [];
    }
    const result: string[] = [];
    const seen = new Set<string>();
    for (const entry of list) {
      const trimmed = entry.trim();
      if (trimmed.length === 0) {
        throw new Error('TechnologySection rejectedFrameworks entries must not be blank.');
      }
      if (trimmed === framework) {
        throw new Error(`TechnologySection cannot reject the chosen framework "${framework}".`);
      }
      if (!seen.has(trimmed)) {
        seen.add(trimmed);
        result.push(trimmed);
      }
    }
    return result;
  }
}
