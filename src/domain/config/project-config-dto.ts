import { z } from 'zod';

/**
 * Zod schema for the imported `trohi.config.json` shape.
 *
 * This describes the *external* serialized representation of a project
 * configuration. It is intentionally minimal at this stage of the MVP
 * (Phase 1 skeleton): only metadata and the project section are
 * required. Additional sections are defined in later phases.
 *
 * Used at the import boundary to validate untrusted JSON before any
 * mapper turns it into the in-memory domain model.
 */
export const projectConfigDtoSchema = z
  .object({
    metadata: z
      .object({
        configVersion: z.string().min(1, 'metadata.configVersion must be a non-empty string'),
      })
      .strict(),
    project: z
      .object({
        name: z.string().min(1, 'project.name must be a non-empty string'),
      })
      .strict(),
  })
  .strict();

/**
 * Plain serializable shape of an imported/exported project config.
 *
 * This type lives at the system boundary. It must not be consumed by
 * UI components or domain logic directly; map it into a `ProjectConfig`
 * domain model first.
 */
export type ProjectConfigDto = z.infer<typeof projectConfigDtoSchema>;
