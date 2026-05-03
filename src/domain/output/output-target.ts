/**
 * The AI agent or tooling vendor a generated file is intended for.
 *
 * Used together with {@link OutputCategory} so the UI can show, filter,
 * and selectively generate files per target. `None` covers files that
 * are not tied to any specific agent (human documentation, generic
 * repository workflow files, configuration).
 */
export enum OutputTarget {
  /** No specific agent target (human docs, generic workflow files, config). */
  None = 'none',

  /** Generic AI agent instruction file consumed by multiple agents. */
  GenericAgent = 'generic-agent',

  /** Claude Code instructions and skill files. */
  Claude = 'claude',

  /** Cursor rule files (`.cursor/rules/*`). */
  Cursor = 'cursor',

  /** GitHub Copilot instructions (`.github/copilot-instructions.md`). */
  Copilot = 'copilot',
}
