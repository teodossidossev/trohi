import { AgentsSection } from './sections/agents-section';
import { ArchitectureSection } from './sections/architecture-section';
import { DomainModelingSection } from './sections/domain-modeling-section';
import { FeatureArchitectureSection } from './sections/feature-architecture-section';
import { MvpSection } from './sections/mvp-section';
import { OutputScope, OutputsSection } from './sections/outputs-section';
import { ProductSection } from './sections/product-section';
import { ProjectSection } from './sections/project-section';
import { TechnologySection } from './sections/technology-section';
import { TestingSection } from './sections/testing-section';
import { OutputTarget } from '../output/output-target';

/**
 * Inputs accepted when constructing a {@link ProjectConfig}.
 *
 * `configVersion` and the `project` section are required - a config
 * without an identity is not useful. Every other section is optional
 * at the domain level so that minimal imports (e.g. a freshly created
 * config or a partial wizard) can still produce a valid model. Presets
 * populate every section.
 */
export interface ProjectConfigCreateInput {
  readonly configVersion: string;
  readonly project: ProjectSection;
  readonly product?: ProductSection;
  readonly mvp?: MvpSection;
  readonly architecture?: ArchitectureSection;
  readonly domainModeling?: DomainModelingSection;
  readonly featureArchitecture?: FeatureArchitectureSection;
  readonly technology?: TechnologySection;
  readonly testing?: TestingSection;
  readonly agents?: AgentsSection;
  readonly outputs?: OutputsSection;
}

/**
 * Aggregate root for the in-memory project configuration.
 *
 * Composes the validated section value objects defined in
 * `src/domain/config/sections/`. Holds value objects only - never raw
 * strings or DTO shapes - so consumers can assume invariants are
 * already enforced.
 *
 * The `project` section is required because every config must have an
 * identity. Other sections are optional so partial configs (just-
 * created profile, in-progress wizard, minimal import) remain valid;
 * presets populate them all.
 */
export class ProjectConfig {
  private constructor(
    private readonly _configVersion: string,
    private readonly _project: ProjectSection,
    private readonly _product: ProductSection | undefined,
    private readonly _mvp: MvpSection | undefined,
    private readonly _architecture: ArchitectureSection | undefined,
    private readonly _domainModeling: DomainModelingSection | undefined,
    private readonly _featureArchitecture: FeatureArchitectureSection | undefined,
    private readonly _technology: TechnologySection | undefined,
    private readonly _testing: TestingSection | undefined,
    private readonly _agents: AgentsSection | undefined,
    private readonly _outputs: OutputsSection | undefined,
  ) {}

  /**
   * Build a ProjectConfig from already-validated sections.
   *
   * Enforces section-local invariants by virtue of the section value
   * objects having already validated themselves, plus cross-section
   * invariants that no individual section can know about (see
   * {@link ProjectConfig.validateCrossSectionInvariants}).
   *
   * @throws Error if `configVersion` is empty after trimming, or if a
   * cross-section invariant is violated.
   */
  static create(input: ProjectConfigCreateInput): ProjectConfig {
    const trimmedVersion = input.configVersion.trim();
    if (trimmedVersion.length === 0) {
      throw new Error('ProjectConfig requires a non-empty configVersion.');
    }
    ProjectConfig.validateCrossSectionInvariants(input.agents, input.outputs);
    return new ProjectConfig(
      trimmedVersion,
      input.project,
      input.product,
      input.mvp,
      input.architecture,
      input.domainModeling,
      input.featureArchitecture,
      input.technology,
      input.testing,
      input.agents,
      input.outputs,
    );
  }

  /**
   * Validate rules that span more than one section.
   *
   * Currently enforces the trohi-bootstrap policy from
   * `docs/AGENT_BOOTSTRAP_SCOPE.md`: when the outputs scope is
   * TrohiBootstrap, the deferred targets (Cursor, Copilot) must not
   * appear in the active agent targets. The selection class
   * (OutputSelection.forTrohiBootstrap) already filters them out, but
   * the aggregate root is the place that prevents an internally
   * contradictory config from being constructed in the first place.
   */
  private static validateCrossSectionInvariants(
    agents: AgentsSection | undefined,
    outputs: OutputsSection | undefined,
  ): void {
    if (agents === undefined || outputs === undefined) {
      return;
    }
    if (outputs.scope !== OutputScope.TrohiBootstrap) {
      return;
    }
    const violations: OutputTarget[] = [];
    if (agents.activeTargets.has(OutputTarget.Cursor)) {
      violations.push(OutputTarget.Cursor);
    }
    if (agents.activeTargets.has(OutputTarget.Copilot)) {
      violations.push(OutputTarget.Copilot);
    }
    if (violations.length > 0) {
      throw new Error(
        `ProjectConfig: outputs.scope=TrohiBootstrap conflicts with agents.activeTargets ` +
          `containing deferred target(s): ${violations.join(', ')}. ` +
          `Move them to deferredTargets, or use OutputScope.ProductMvp.`,
      );
    }
  }

  /** Schema/config version stored in the source `trohi.config.json`. */
  get configVersion(): string {
    return this._configVersion;
  }

  /** Required project identity section. */
  get project(): ProjectSection {
    return this._project;
  }

  /** Optional product section (problem statement, value proposition). */
  get product(): ProductSection | undefined {
    return this._product;
  }

  /** Optional MVP scope section (primary use case, included/excluded features). */
  get mvp(): MvpSection | undefined {
    return this._mvp;
  }

  /** Optional architecture section (application type, backend, persistence). */
  get architecture(): ArchitectureSection | undefined {
    return this._architecture;
  }

  /** Optional domain-modeling section (no-raw-JSON rule, view models). */
  get domainModeling(): DomainModelingSection | undefined {
    return this._domainModeling;
  }

  /** Optional feature-architecture section (presentational views, business layer). */
  get featureArchitecture(): FeatureArchitectureSection | undefined {
    return this._featureArchitecture;
  }

  /** Optional technology section (framework, runtime, package manager, libraries). */
  get technology(): TechnologySection | undefined {
    return this._technology;
  }

  /** Optional testing section (TDD, runner choices). */
  get testing(): TestingSection | undefined {
    return this._testing;
  }

  /** Optional agents section (active and deferred agent targets). */
  get agents(): AgentsSection | undefined {
    return this._agents;
  }

  /** Optional outputs section (selection scope). */
  get outputs(): OutputsSection | undefined {
    return this._outputs;
  }

  /**
   * Value-based equality between two configs.
   *
   * Compares configVersion and every section. Optional sections that
   * are present on one side and absent on the other count as not
   * equal; when both are present the section's own `equals` is
   * delegated to. Suitable for dirty-state detection, regeneration
   * gating, and preset comparison.
   */
  equals(other: ProjectConfig): boolean {
    return (
      this._configVersion === other._configVersion &&
      this._project.equals(other._project) &&
      ProjectConfig.optionalEquals(this._product, other._product, (a, b) => a.equals(b)) &&
      ProjectConfig.optionalEquals(this._mvp, other._mvp, (a, b) => a.equals(b)) &&
      ProjectConfig.optionalEquals(this._architecture, other._architecture, (a, b) =>
        a.equals(b),
      ) &&
      ProjectConfig.optionalEquals(this._domainModeling, other._domainModeling, (a, b) =>
        a.equals(b),
      ) &&
      ProjectConfig.optionalEquals(this._featureArchitecture, other._featureArchitecture, (a, b) =>
        a.equals(b),
      ) &&
      ProjectConfig.optionalEquals(this._technology, other._technology, (a, b) => a.equals(b)) &&
      ProjectConfig.optionalEquals(this._testing, other._testing, (a, b) => a.equals(b)) &&
      ProjectConfig.optionalEquals(this._agents, other._agents, (a, b) => a.equals(b)) &&
      ProjectConfig.optionalEquals(this._outputs, other._outputs, (a, b) => a.equals(b))
    );
  }

  private static optionalEquals<T>(
    a: T | undefined,
    b: T | undefined,
    eq: (a: T, b: T) => boolean,
  ): boolean {
    if (a === undefined && b === undefined) {
      return true;
    }
    if (a === undefined || b === undefined) {
      return false;
    }
    return eq(a, b);
  }
}
