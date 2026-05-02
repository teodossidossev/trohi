# Output Files

## Purpose

This document defines the files that **trohi** should generate and clarifies which files are needed for trohi's own initial repository bootstrap.

The product can eventually support multiple AI agent targets, but the initial development workflow for this repository uses:

```text
Claude Code = implementation agent
Codex = review agent
Human developer = final approver
```

Therefore, Cursor and GitHub Copilot files are **deferred for this repository bootstrap**.

They remain valid future output targets for the trohi product.

## Core Rule

Generated files are output artifacts.

The source of truth is the structured trohi configuration.

```text
structured config + templates = generated files
```

## Output Categories

The product has four output categories:

1. human project documentation;
2. generic AI agent instruction files;
3. agent/tool-specific instruction files;
4. repository workflow support files.

The MVP should prioritize output quality over output quantity.

## Required Product MVP Outputs

The minimum useful product output set for a new software project is:

```text
/docs/PRODUCT_VISION.md
/docs/MVP_SCOPE.md
/docs/ARCHITECTURE.md
/docs/DOMAIN_MODELING.md
/docs/FEATURE_ARCHITECTURE.md
/docs/CODING_STANDARDS.md
/docs/TESTING_STRATEGY.md
/docs/GIT_WORKFLOW.md
/docs/CI_CD_STRATEGY.md
/AGENTS.md
/trohi.config.json
```

## Required trohi Repository Bootstrap Outputs

For developing trohi itself with Claude Code and Codex, the required bootstrap files are:

```text
/CLAUDE.md
/AGENTS.md
/.claude/skills/implement-with-tdd/SKILL.md
/.claude/skills/prepare-pr/SKILL.md
/.claude/skills/respond-to-review/SKILL.md
/.github/pull_request_template.md
/docs/AGENT_BOOTSTRAP_SCOPE.md
```

These files support the actual initial working workflow:

```text
Claude Code implements
-> GitHub PR
-> Codex reviews
-> human approves
```

## Deferred Repository Bootstrap Outputs

The following files are not needed for trohi's own initial development workflow:

```text
/.cursor/rules/project.mdc
/.cursor/rules/code-style.mdc
/.cursor/rules/testing.mdc
/.github/copilot-instructions.md
```

They are deferred because the project is initially developed with Claude Code and Codex.

They may still be supported later as product-generated targets.

## Optional Product Output Targets

The product may later generate these files when the user selects the corresponding agent/tool target:

```text
/CLAUDE.md
/.claude/skills/*/SKILL.md
/.cursor/rules/*.mdc
/.github/copilot-instructions.md
/.github/pull_request_template.md
```

Optional files should only be generated when the user selects the related target or workflow option.

## Core Human Documentation Files

### `docs/PRODUCT_VISION.md`

Defines what the project is, why it exists, who it serves, and what problem it solves.

### `docs/MVP_SCOPE.md`

Defines what is included and excluded from the first version of the project.

### `docs/ARCHITECTURE.md`

Defines high-level technical direction, system boundaries, domain modeling boundaries, feature boundaries, ports/adapters, and future backend boundaries.

### `docs/DOMAIN_MODELING.md`

Defines DTOs, domain models, value objects, mappers, application models, UI view models, and the no-raw-JSON rule.

### `docs/FEATURE_ARCHITECTURE.md`

Defines presentational views, feature business/application layer, no direct REST/HttpClient from views, feature facades, mappers, ports/adapters, Signals/RxJS, and optional feature-local store.

### `docs/CODING_STANDARDS.md`

Defines code style, engineering principles, OOP/domain model expectations, comments, linting, and static analysis expectations.

### `docs/TESTING_STRATEGY.md`

Defines TDD, Vitest, Cypress, model tests, mapper tests, generation tests, import/export tests, and generated output regression strategy.

## AI Agent Instruction Files

### `AGENTS.md`

Provides generic AI agent instructions and Codex review guidance.

It must include architecture, domain modeling, feature architecture, testing, static analysis, Git workflow, review guidelines, scope control, and security/privacy rules.

### `CLAUDE.md`

Provides project-level instructions for Claude Code.

It must include project context, MVP constraints, tech stack, architecture, domain modeling, feature architecture, TDD, local checks, Git workflow, and scope control.

### `.claude/skills/*/SKILL.md`

Provides repeatable Claude Code procedures.

For trohi's own bootstrap, the required skills are:

```text
.claude/skills/implement-with-tdd/SKILL.md
.claude/skills/prepare-pr/SKILL.md
.claude/skills/respond-to-review/SKILL.md
```

### `.github/pull_request_template.md`

Provides the PR checklist aligned with testing, architecture, generated output, security, and AI review expectations.

## Deferred Agent-Specific Product Outputs

### `.cursor/rules/*.mdc`

Deferred for trohi repository bootstrap.

Future product output target.

### `.github/copilot-instructions.md`

Deferred for trohi repository bootstrap.

Future product output target.

## `trohi.config.json`

Stores the structured source configuration used to generate all output files.

It should include:

- config metadata;
- project metadata;
- product context;
- MVP scope decisions;
- architecture decisions;
- domain modeling decisions;
- feature architecture decisions;
- coding standards;
- testing strategy;
- Git workflow;
- CI/CD expectations;
- selected agent targets;
- selected output files;
- template version metadata.

It must not store secrets, tokens, private credentials, generated Markdown as primary source, or unnecessary local UI state.

## File Path Rules

- documentation files go under `docs/`;
- generic agent instructions go at repository root;
- Claude skills go under `.claude/skills/<skill-name>/SKILL.md`;
- workflow support files go under `.github/`;
- vendor-specific rules go in expected vendor-specific locations only when selected;
- configuration goes at repository root;
- generated paths should use forward slashes;
- file paths should be visible before export.

## Consistency Rules

The same project decision must not be expressed differently across files.

Examples:

- if the testing strategy says Vitest, generated files must not require Jest;
- if the repo workflow uses Claude+Codex, Cursor/Copilot files must not be required for bootstrap;
- if the MVP has no backend, generated files must not instruct agents to create backend services;
- if UI must be presentational, generated agent files must not suggest putting business logic in Angular components.

## Initial Implementation Priority

For trohi's own development, prioritize:

```text
1. CLAUDE.md
2. AGENTS.md
3. .claude/skills/implement-with-tdd/SKILL.md
4. .claude/skills/prepare-pr/SKILL.md
5. .claude/skills/respond-to-review/SKILL.md
6. .github/pull_request_template.md
7. docs/AGENT_BOOTSTRAP_SCOPE.md
```

For product generation MVP, prioritize:

```text
1. trohi.config.json
2. docs/PRODUCT_VISION.md
3. docs/MVP_SCOPE.md
4. docs/ARCHITECTURE.md
5. docs/DOMAIN_MODELING.md
6. docs/FEATURE_ARCHITECTURE.md
7. docs/CODING_STANDARDS.md
8. docs/TESTING_STRATEGY.md
9. docs/GIT_WORKFLOW.md
10. docs/CI_CD_STRATEGY.md
11. AGENTS.md
12. CLAUDE.md
13. .claude/skills/*/SKILL.md
14. .github/pull_request_template.md
```

Cursor and GitHub Copilot outputs are deferred until those targets are intentionally selected.
