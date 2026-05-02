# Roadmap

## Purpose

This document defines the development roadmap for **trohi**.

The roadmap should keep the project focused, protect the MVP scope, and show a realistic path from documentation-first planning to a usable Angular browser application.

## Roadmap Principle

> Start narrow, validate the core workflow, then expand carefully.

## Current Strategic Direction

trohi starts as a dev-first tool for solo and indie developers who frequently work with AI coding agents.

The initial development workflow for this repository is:

```text
Claude Code implements
-> GitHub PR
-> Codex reviews
-> human approves
```

Cursor and GitHub Copilot files are not required for the initial trohi repository bootstrap.

They remain future product output targets.

## Phase 0: Project Definition

## Status

Mostly complete.

## Goal

Define the product, scope, architecture, workflows, engineering standards, tech stack, and project boundaries before implementation begins.

## Deliverables

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
```

## Exit Criteria

- the MVP use case is clearly defined;
- output files are clearly defined;
- config model is conceptually defined;
- architecture boundaries are clear;
- domain modeling rules are clear;
- feature architecture rules are clear;
- Angular 21 / Node.js 22 / npm / Vitest / Cypress stack is documented;
- initial agent instruction files can be created from these documents.

## Phase 1: Claude + Codex Agent Bootstrap

## Status

In progress.

## Goal

Create the initial AI agent instruction files for developing trohi itself with Claude Code and Codex.

## Required Deliverables

```text
CLAUDE.md
AGENTS.md
.claude/skills/implement-with-tdd/SKILL.md
.claude/skills/prepare-pr/SKILL.md
.claude/skills/respond-to-review/SKILL.md
.github/pull_request_template.md
docs/AGENT_BOOTSTRAP_SCOPE.md
```

## Deferred Bootstrap Files

```text
.cursor/rules/*.mdc
.github/copilot-instructions.md
```

## Reason for Deferral

The project will initially be developed with Claude Code and Codex.

Cursor and GitHub Copilot outputs remain future product-generated targets.

## Exit Criteria

- Claude Code has clear implementation instructions;
- Codex has clear review guidelines through `AGENTS.md`;
- Claude skills exist for implementation, PR preparation, and review response;
- PR template enforces testing, static analysis, architecture, generated output, security, and AI review checks;
- Cursor and Copilot outputs are explicitly deferred for the repository bootstrap.

## Phase 2: Technical Stack Finalization

## Status

Mostly complete, with implementation details still open.

## Accepted Stack

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

## Accepted Direction

```text
Schema validation: Zod or equivalent TypeScript-first runtime validation
Template rendering: TypeScript template functions for MVP
Markdown preview: safe plain-text preview first
ZIP export: fflate
Testing: Vitest + Cypress
Linting: Google TypeScript Style or Angular-compatible strict equivalent
Static analysis: SonarQube-style rules now, full Sonar integration later
Hosting: already available
```

## Still Open

```text
exact Angular 21 minor/patch version
exact Node.js 22 minimum version for project engines
exact Vitest configuration mode
exact linting setup details
exact static analysis command set before full Sonar integration
UI component approach
styling approach
```

## Phase 3: Initial Angular Project Setup

## Goal

Create the initial Angular 21 project structure and quality gates.

## Deliverables

```text
Angular 21 workspace
Node.js 22 engines
npm scripts
strict TypeScript configuration
Vitest setup
Cypress setup
linting setup
static analysis command set
initial GitHub CI workflow
initial folder structure
```

## Expected Initial Folder Direction

```text
src/app/
src/features/
src/domain/
src/core/
src/infrastructure/
src/shared/
cypress/
docs/
.claude/skills/
.github/
```

## Exit Criteria

- Angular app builds;
- Vitest runs;
- Cypress runs or is scaffolded;
- lint/static checks run locally;
- GitHub CI runs basic checks;
- initial folders exist;
- no business logic is placed in views.

## Phase 4: Core Domain and Modeling Foundation

## Goal

Build the core domain model and boundary patterns before building the full UI.

## Deliverables

- DTO definitions for config import/export;
- Zod validation schemas;
- mappers from DTOs to domain models;
- domain models;
- value objects;
- UI view model patterns;
- generated output models;
- mapper tests;
- model invariant tests.

## Key Rule

```text
External DTO / JSON
-> validation
-> mapper
-> domain/application model
-> UI view model
-> view
```

Do not pass raw JSON through the application.

## Phase 5: Core Generation Engine

## Goal

Build deterministic generation before building a full UI.

## Deliverables

- output file definitions;
- TypeScript template functions;
- generation engine;
- generated output package model;
- safe file path model/rules;
- snapshot tests for generated Markdown;
- representative fixtures.

## Priority Product Outputs

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

Deferred product targets:

```text
.cursor/rules/*.mdc
.github/copilot-instructions.md
```

## Phase 6: Minimal Browser UI

## Goal

Build the first Angular UI for the primary MVP workflow.

## Deliverables

- app shell;
- new project creation flow;
- guided wizard;
- feature business/application layers;
- UI view models;
- presentational components;
- validation warnings;
- output target selection;
- generated file preview;
- simple include/exclude controls.

## Architecture Principle

Views stay presentational.

Feature logic belongs in feature business/application layers.

No raw JSON, DTOs, generation logic, or direct REST/HttpClient access in views.

## Phase 7: Export and Import

## Goal

Make generated output usable outside the application.

## Deliverables

- ZIP export using fflate adapter;
- config JSON export;
- config JSON import;
- import validation;
- DTO -> mapper -> domain model flow;
- regenerate output from imported config;
- safe file path handling;
- export/import tests.

## Phase 8: MVP Hardening

## Goal

Make the MVP reliable enough for real use.

## Deliverables

- improved validation;
- stronger generated output quality;
- refined templates;
- better error handling;
- documentation review;
- Cypress coverage for critical flows;
- GitHub CI quality gates;
- pre-commit static analysis workflow;
- static hosting deployment if selected.

## Phase 9: Public MVP

## Goal

Release a small but usable public version.

## Deliverables

- public README or landing page;
- hosted browser app using existing hosting;
- example generated output;
- clear privacy statement;
- basic usage guide;
- feedback channel;
- versioned release tag.

## Phase 10: Post-MVP Output Targets

## Goal

Add more product output targets after the core workflow is validated.

## Candidate Features

- Cursor rules generation;
- GitHub Copilot instructions generation;
- additional Claude skills;
- more agent-specific output formats;
- better presets;
- output diffing;
- config migration support;
- custom template editing.

## Phase 11: Future AI Assistance

AI assistance must be optional. The deterministic generation core must continue to work without AI.

## Phase 12: Existing Project Support

Support existing projects only after the new-project workflow is validated.

## Phase 13: Repository Integrations

Add GitHub/GitLab integrations only after local generation/export is validated.

## Phase 14: Team and Organization Features

Support shared standards only after solo usage validates the core workflow.

## Phase 15: Non-Dev Domain Expansion

Explore non-dev domains only after the dev-first product is validated.

## Features Explicitly Deferred From MVP

- backend;
- accounts;
- billing;
- cloud sync;
- team workspaces;
- repository analysis;
- existing documentation import;
- required AI dependency;
- direct GitHub writes;
- direct GitLab writes;
- Cursor rules for trohi repository bootstrap;
- GitHub Copilot instructions for trohi repository bootstrap;
- template marketplace;
- non-dev presets;
- enterprise policy management.

## MVP Release Criteria

The MVP can be considered ready when:

1. primary use case works end to end;
2. config can generate useful files;
3. files can be previewed;
4. files can be exported as ZIP;
5. config can be exported and imported;
6. output generation is deterministic;
7. core logic is tested with Vitest;
8. key UI flows are covered by Cypress;
9. static analysis runs before commit and in GitHub CI;
10. generated files are useful enough for trohi itself.
