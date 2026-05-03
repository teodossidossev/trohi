import { ProjectName } from '../../values/project-name';

/**
 * Inputs accepted when constructing a {@link ProjectSection}.
 */
export interface ProjectSectionCreateInput {
  readonly name: ProjectName;
  readonly description?: string;
}

/**
 * Project identity section of the configuration model.
 *
 * Wraps the validated project name plus optional human description.
 * Maps to the `project` section in `docs/CONFIG_MODEL.md`. Additional
 * fields (project type, repository name, primary language) will be
 * added in later phases as the wizard collects them; the skeleton
 * intentionally keeps only what the bootstrap preset needs.
 */
export class ProjectSection {
  private constructor(
    private readonly _name: ProjectName,
    private readonly _description: string | undefined,
  ) {}

  /**
   * Build a ProjectSection from already-validated inputs.
   *
   * @throws Error if `description` is provided but blank after trimming.
   */
  static create(input: ProjectSectionCreateInput): ProjectSection {
    const description = input.description?.trim();
    if (description !== undefined && description.length === 0) {
      throw new Error('ProjectSection description must not be blank when provided.');
    }
    return new ProjectSection(input.name, description);
  }

  /** Validated project name value object. */
  get name(): ProjectName {
    return this._name;
  }

  /** Optional, trimmed description. */
  get description(): string | undefined {
    return this._description;
  }

  /** Value-based equality: name and description must match. */
  equals(other: ProjectSection): boolean {
    return this._name.equals(other._name) && this._description === other._description;
  }
}
