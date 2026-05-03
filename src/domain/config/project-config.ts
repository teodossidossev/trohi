import { ProjectName } from '../values/project-name';

/**
 * Inputs accepted when constructing a {@link ProjectConfig}.
 *
 * Mirrors the fields the domain currently understands. As more config
 * sections are added (architecture, testing, agents, outputs, ...) they
 * will appear here.
 */
export interface ProjectConfigCreateInput {
  readonly configVersion: string;
  readonly projectName: ProjectName;
}

/**
 * Aggregate root for the in-memory project configuration.
 *
 * Holds validated value objects only (never raw strings or DTO shapes)
 * so consumers can assume invariants are already enforced. The MVP
 * skeleton currently covers metadata and project identity; more
 * sections are added in later phases of the implementation plan.
 */
export class ProjectConfig {
  private constructor(
    private readonly _configVersion: string,
    private readonly _projectName: ProjectName,
  ) {}

  /**
   * Build a ProjectConfig from already-validated value objects.
   *
   * @throws Error if the configVersion is empty after trimming.
   */
  static create(input: ProjectConfigCreateInput): ProjectConfig {
    const trimmedVersion = input.configVersion.trim();
    if (trimmedVersion.length === 0) {
      throw new Error('ProjectConfig requires a non-empty configVersion.');
    }
    return new ProjectConfig(trimmedVersion, input.projectName);
  }

  /** Schema/config version stored in the source `trohi.config.json`. */
  get configVersion(): string {
    return this._configVersion;
  }

  /** Validated project name value object. */
  get projectName(): ProjectName {
    return this._projectName;
  }

  /** Value-based equality between two configs. */
  equals(other: ProjectConfig): boolean {
    return (
      this._configVersion === other._configVersion && this._projectName.equals(other._projectName)
    );
  }
}
