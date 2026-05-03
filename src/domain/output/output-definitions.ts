import { OutputCategory } from './output-category';
import { OutputDefinition } from './output-definition';
import { OutputTarget } from './output-target';
import { OutputFilePath } from '../values/output-file-path';

/**
 * Tiny helper to keep the catalog declarations readable.
 * Equivalent to OutputDefinition.create with positional args.
 */
function define(
  path: string,
  category: OutputCategory,
  target: OutputTarget,
  description?: string,
): OutputDefinition {
  return OutputDefinition.create({
    path: OutputFilePath.create(path),
    category,
    target,
    description,
  });
}

/**
 * Files required to develop trohi itself with the
 * Claude Code + Codex + human approver workflow.
 *
 * Source of truth: `docs/OUTPUT_FILES.md` -
 * "Required trohi Repository Bootstrap Outputs".
 *
 * Cursor and GitHub Copilot files are intentionally excluded; see
 * {@link DEFERRED_BOOTSTRAP_OUTPUTS}.
 */
export const TROHI_BOOTSTRAP_OUTPUTS: readonly OutputDefinition[] = Object.freeze([
  define(
    'CLAUDE.md',
    OutputCategory.AgentSpecificInstructions,
    OutputTarget.Claude,
    'Project-level instructions for Claude Code.',
  ),
  define(
    'AGENTS.md',
    OutputCategory.GenericAgentInstructions,
    OutputTarget.GenericAgent,
    'Generic AI agent instructions and Codex review guidance.',
  ),
  define(
    '.claude/skills/implement-with-tdd/SKILL.md',
    OutputCategory.AgentSpecificInstructions,
    OutputTarget.Claude,
    'Claude Code TDD implementation skill.',
  ),
  define(
    '.claude/skills/prepare-pr/SKILL.md',
    OutputCategory.AgentSpecificInstructions,
    OutputTarget.Claude,
    'Claude Code PR preparation skill.',
  ),
  define(
    '.claude/skills/respond-to-review/SKILL.md',
    OutputCategory.AgentSpecificInstructions,
    OutputTarget.Claude,
    'Claude Code skill for responding to review feedback.',
  ),
  define(
    '.github/pull_request_template.md',
    OutputCategory.RepositoryWorkflow,
    OutputTarget.None,
    'PR checklist aligned with testing, architecture, and review expectations.',
  ),
  define(
    'docs/AGENT_BOOTSTRAP_SCOPE.md',
    OutputCategory.HumanDocumentation,
    OutputTarget.None,
    'Documents which agent files are required for the trohi repo bootstrap.',
  ),
]);

/**
 * Minimum useful product output set produced for a new software project
 * that imports its config into trohi.
 *
 * Source of truth: `docs/OUTPUT_FILES.md` - "Required Product MVP Outputs".
 */
export const PRODUCT_MVP_OUTPUTS: readonly OutputDefinition[] = Object.freeze([
  define(
    'docs/PRODUCT_VISION.md',
    OutputCategory.HumanDocumentation,
    OutputTarget.None,
    'What the project is, why it exists, and the problem it solves.',
  ),
  define(
    'docs/MVP_SCOPE.md',
    OutputCategory.HumanDocumentation,
    OutputTarget.None,
    'What is included and excluded from the first version.',
  ),
  define(
    'docs/ARCHITECTURE.md',
    OutputCategory.HumanDocumentation,
    OutputTarget.None,
    'High-level technical direction and system boundaries.',
  ),
  define(
    'docs/DOMAIN_MODELING.md',
    OutputCategory.HumanDocumentation,
    OutputTarget.None,
    'DTO/domain/view-model rules and the no-raw-JSON rule.',
  ),
  define(
    'docs/FEATURE_ARCHITECTURE.md',
    OutputCategory.HumanDocumentation,
    OutputTarget.None,
    'Presentational views, feature business layer, ports/adapters.',
  ),
  define(
    'docs/CODING_STANDARDS.md',
    OutputCategory.HumanDocumentation,
    OutputTarget.None,
    'Code style, engineering principles, comments, linting.',
  ),
  define(
    'docs/TESTING_STRATEGY.md',
    OutputCategory.HumanDocumentation,
    OutputTarget.None,
    'TDD, Vitest, Cypress, mapper tests, generation tests.',
  ),
  define(
    'docs/GIT_WORKFLOW.md',
    OutputCategory.HumanDocumentation,
    OutputTarget.None,
    'Branch strategy, conventional commits, PR review flow.',
  ),
  define(
    'docs/CI_CD_STRATEGY.md',
    OutputCategory.HumanDocumentation,
    OutputTarget.None,
    'Static analysis, type-check, tests in local and CI gates.',
  ),
  define(
    'AGENTS.md',
    OutputCategory.GenericAgentInstructions,
    OutputTarget.GenericAgent,
    'Generic AI agent instructions for the generated project.',
  ),
  define(
    'trohi.config.json',
    OutputCategory.RepositoryWorkflow,
    OutputTarget.None,
    'Structured source configuration; importable for regeneration.',
  ),
]);

/**
 * Files trohi knows how to describe but does not generate during this
 * repo's own bootstrap (Cursor and GitHub Copilot specific instructions).
 *
 * Source of truth: `docs/OUTPUT_FILES.md` - "Deferred Repository
 * Bootstrap Outputs". They remain valid product output targets that
 * users can opt into when generating for their own projects.
 */
export const DEFERRED_BOOTSTRAP_OUTPUTS: readonly OutputDefinition[] = Object.freeze([
  define(
    '.cursor/rules/project.mdc',
    OutputCategory.AgentSpecificInstructions,
    OutputTarget.Cursor,
    'Cursor project rule (deferred for trohi repo bootstrap).',
  ),
  define(
    '.cursor/rules/code-style.mdc',
    OutputCategory.AgentSpecificInstructions,
    OutputTarget.Cursor,
    'Cursor code-style rule (deferred for trohi repo bootstrap).',
  ),
  define(
    '.cursor/rules/testing.mdc',
    OutputCategory.AgentSpecificInstructions,
    OutputTarget.Cursor,
    'Cursor testing rule (deferred for trohi repo bootstrap).',
  ),
  define(
    '.github/copilot-instructions.md',
    OutputCategory.AgentSpecificInstructions,
    OutputTarget.Copilot,
    'GitHub Copilot instructions (deferred for trohi repo bootstrap).',
  ),
]);
