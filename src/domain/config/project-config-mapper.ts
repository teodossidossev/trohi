import { projectConfigDtoSchema, type ProjectConfigDto } from './project-config-dto';
import { ProjectConfig } from './project-config';
import { ProjectName } from '../values/project-name';
import { ProjectSection } from './sections/project-section';
import { ValidationResult } from '../validation/validation-result';
import { ValidationIssue } from '../validation/validation-issue';

/**
 * Outcome of mapping untrusted external input into a domain model.
 *
 * Either succeeds with a constructed value, or fails with a
 * {@link ValidationResult} that aggregates every issue discovered
 * during parsing and mapping. Designed so the caller can react with
 * one branch instead of catching exceptions per field.
 */
export type MapResult<T> =
  | { readonly success: true; readonly value: T }
  | { readonly success: false; readonly validation: ValidationResult };

/**
 * Boundary mapper between the imported config DTO and the
 * {@link ProjectConfig} domain model.
 *
 * Lives at the import/export edge of the application. Domain code must
 * never accept raw DTOs directly; UI code must never accept raw DTOs at
 * all. Both should depend on `ProjectConfig` and use this mapper.
 */
export class ProjectConfigMapper {
  /**
   * Map an already-validated DTO into a {@link ProjectConfig}.
   *
   * Assumes the DTO has been parsed by {@link projectConfigDtoSchema}.
   * Value-object construction can still throw if a field violates a
   * domain invariant (for example, a project name longer than allowed);
   * callers that need aggregated errors should use
   * {@link ProjectConfigMapper.parseAndMap} instead.
   */
  static fromDto(dto: ProjectConfigDto): ProjectConfig {
    return ProjectConfig.create({
      configVersion: dto.metadata.configVersion,
      project: ProjectSection.create({ name: ProjectName.create(dto.project.name) }),
    });
  }

  /**
   * Map a {@link ProjectConfig} back to the serializable DTO shape.
   * The result is safe to JSON.stringify and write as `trohi.config.json`.
   *
   * Optional sections beyond `project` are not yet serialized into the
   * DTO; they will be added in the import/export phase.
   */
  static toDto(model: ProjectConfig): ProjectConfigDto {
    return {
      metadata: { configVersion: model.configVersion },
      project: { name: model.project.name.value },
    };
  }

  /**
   * Full import pipeline: validate raw untrusted input with Zod, then
   * map the resulting DTO into a {@link ProjectConfig}, surfacing every
   * issue (schema-level or invariant-level) through {@link MapResult}.
   *
   * Used at the file-import boundary so the UI can always handle one
   * unified failure shape instead of mixing thrown errors with parse
   * errors. Each invariant failure is attributed to the field it
   * originates from rather than to a single catch-all path.
   */
  static parseAndMap(raw: unknown): MapResult<ProjectConfig> {
    const parsed = projectConfigDtoSchema.safeParse(raw);
    if (!parsed.success) {
      const issues = parsed.error.issues.map((issue) =>
        ValidationIssue.error(issue.message, issue.path.map(String)),
      );
      return { success: false, validation: ValidationResult.fromIssues(issues) };
    }

    let validation = ValidationResult.empty();

    let projectSection: ProjectSection | undefined;
    try {
      const name = ProjectName.create(parsed.data.project.name);
      projectSection = ProjectSection.create({ name });
    } catch (error) {
      validation = validation.addError(ProjectConfigMapper.messageOf(error), ['project', 'name']);
    }

    if (projectSection === undefined) {
      return { success: false, validation };
    }

    try {
      const config = ProjectConfig.create({
        configVersion: parsed.data.metadata.configVersion,
        project: projectSection,
      });
      return { success: true, value: config };
    } catch (error) {
      return {
        success: false,
        validation: validation.addError(ProjectConfigMapper.messageOf(error), [
          'metadata',
          'configVersion',
        ]),
      };
    }
  }

  private static messageOf(error: unknown): string {
    return error instanceof Error ? error.message : String(error);
  }
}
