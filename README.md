# trohi

trohi is a dev-first tool for creating structured project documentation and AI agent instruction files for new software projects.

The MVP helps solo and indie developers define project context, goals, constraints, engineering standards, workflows, and agent-specific instructions before implementation begins.

## Current Status

trohi is in the project definition and bootstrap phase.

The repository currently focuses on:

- product documentation;
- architecture decisions;
- domain modeling rules;
- feature architecture rules;
- Claude Code implementation instructions;
- Codex review instructions;
- preparation for Angular 21 project setup.

## MVP Use Case

The first supported use case is:

> A user starts a new software project without documentation, answers a structured wizard, previews generated files, and exports project documentation plus AI agent instruction files.

## MVP Constraints

For the MVP:

- browser-only application;
- no backend;
- no user accounts;
- no cloud storage;
- no required AI dependency for now;
- local import/export;
- deterministic generation;
- project data remains local.

## Tech Stack

Selected MVP stack:

```text
Angular 21
Node.js 22
TypeScript
npm
Vitest
Cypress
Zod
fflate
```

React is explicitly rejected.

StencilJS may be considered later only for framework-agnostic components, a design system, or embeddable widgets.

## Core Product Rule

```text
structured config + templates = generated files
```

The structured config is the source of truth.

Generated Markdown files are output artifacts.

## Development Workflow

Initial repository workflow:

```text
Claude Code implements
-> GitHub PR
-> Codex reviews
-> human approves
```

Current required agent/bootstrap files:

```text
CLAUDE.md
AGENTS.md
.claude/skills/implement-with-tdd/SKILL.md
.claude/skills/prepare-pr/SKILL.md
.claude/skills/respond-to-review/SKILL.md
.github/pull_request_template.md
docs/AGENT_BOOTSTRAP_SCOPE.md
```

Cursor and GitHub Copilot files are deferred for **this repository's own bootstrap**, per `docs/AGENT_BOOTSTRAP_SCOPE.md`.

They remain in scope as **trohi product output targets** that the MVP can generate for users (see `docs/MVP_SCOPE.md` § AI Agent Instruction Generation).

## Architecture Direction

The application should keep views presentational and business logic outside Angular components.

Expected flow:

```text
view
-> feature business/application layer
-> service
-> mapper
-> domain / infrastructure
```

Future backend flow:

```text
view
-> feature business/application layer
-> service
-> mapper
-> REST/API service or infrastructure adapter
-> backend
```

Response flow:

```text
backend
-> REST/API service or infrastructure adapter
-> mapper
-> domain/application model
-> UI view model
-> view
```

Views must not call REST, `HttpClient`, or backend services directly.

## Domain Modeling Direction

Do not pass raw JSON through the application.

Expected import flow:

```text
External DTO / JSON
-> validation
-> mapper
-> domain/application model
-> UI view model
-> view
```

Expected export flow:

```text
domain/application model
-> mapper
-> DTO
-> external boundary
```

Use explicit domain models, value objects, application models, UI view models, DTOs at boundaries, and mappers.

## Testing

Use TDD as the preferred workflow.

Use:

- Vitest for unit, integration, mapper, domain model, validation, generation, and snapshot tests;
- Cypress for critical end-to-end browser flows.

Static analysis must run before commit and again in GitHub CI.

## Documentation

Main project documents live in `docs/`.

Important starting points:

```text
docs/PRODUCT_VISION.md
docs/MVP_SCOPE.md
docs/USE_CASES.md
docs/OUTPUT_FILES.md
docs/CONFIG_MODEL.md
docs/ARCHITECTURE.md
docs/DOMAIN_MODELING.md
docs/FEATURE_ARCHITECTURE.md
docs/TESTING_STRATEGY.md
docs/CODING_STANDARDS.md
docs/GIT_WORKFLOW.md
docs/CI_CD_STRATEGY.md
docs/SECURITY_AND_PRIVACY.md
docs/ROADMAP.md
docs/DECISIONS.md
docs/TECH_STACK.md
docs/PROJECT_STRUCTURE.md
docs/IMPLEMENTATION_PLAN.md
```

## Next Steps

1. Finish document synchronization.
2. Bootstrap Angular 21 project.
3. Configure Node.js 22 and npm scripts.
4. Configure Vitest.
5. Configure Cypress.
6. Configure linting/static analysis.
7. Add GitHub CI.
8. Build first domain models and tests.
