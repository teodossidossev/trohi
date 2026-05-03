/**
 * High-level classification of a generated file.
 *
 * Mirrors the four output categories declared in `docs/OUTPUT_FILES.md`.
 * Used by selection rules and UI grouping so users can include/exclude
 * whole categories at once (for example, hide all repository workflow
 * files in the preview).
 */
export enum OutputCategory {
  /** Human-readable project documentation (e.g. `docs/PRODUCT_VISION.md`). */
  HumanDocumentation = 'human-documentation',

  /**
   * Generic AI agent instruction files that any agent may consume
   * (e.g. `AGENTS.md`).
   */
  GenericAgentInstructions = 'generic-agent-instructions',

  /**
   * Agent- or tool-specific instruction files (e.g. `CLAUDE.md`,
   * `.claude/skills/*`, `.cursor/rules/*`, `.github/copilot-instructions.md`).
   */
  AgentSpecificInstructions = 'agent-specific-instructions',

  /**
   * Repository workflow support files (e.g. `.github/pull_request_template.md`,
   * `trohi.config.json`).
   */
  RepositoryWorkflow = 'repository-workflow',
}
