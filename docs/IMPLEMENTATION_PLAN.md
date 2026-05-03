# Implementation Plan

## Purpose

This document defines the implementation plan for **trohi**.

It is intended to be used by:

- Claude Code as the implementation agent;
- Codex as the review agent;
- the human developer as final approver.

The plan should live as `docs/IMPLEMENTATION_PLAN.md` and should be referenced from `README.md`, `CLAUDE.md`, and `AGENTS.md`.

## Core Execution Rule

Development must proceed in small, reviewable pull requests.

Each PR should have:

- one clear purpose;
- tests for changed behavior;
- no unrelated refactors;
- no MVP scope expansion;
- Codex review;
- human approval before merge.

## Current Project Direction

Selected stack:

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

Core product rule:

```text
structured config + templates = generated files
```

Core architecture rule:

```text
External DTO / JSON
-> validation
-> mapper
-> domain/application model
-> UI view model
-> view
```

Views must remain presentational.

Views must not call REST, `HttpClient`, backend services, import/export infrastructure, or generation logic directly.

## Agent Roles

### Claude Code

Claude Code is the implementation agent.

Claude should:

- use `CLAUDE.md`;
- use `.claude/skills/implement-with-tdd/SKILL.md`;
- implement one focused PR at a time;
- write or update tests first where practical;
- run relevant local checks before commit;
- prepare PRs with `.claude/skills/prepare-pr/SKILL.md`;
- respond to Codex review with `.claude/skills/respond-to-review/SKILL.md`.

Claude must not:

- merge PRs;
- bypass tests;
- weaken lint/static analysis rules;
- expand MVP scope without approval;
- put business logic in Angular views;
- pass raw JSON into UI components;
- call REST/HttpClient directly from views.

### Codex

Codex is the review agent.

Codex should review every meaningful PR for:

- correctness;
- missing tests;
- architecture boundary violations;
- TDD violations;
- raw JSON or DTO leakage into UI;
- missing mappers;
- weak domain models;
- direct REST/HttpClient calls from views;
- deterministic generation issues;
- generated output regressions;
- unsafe import/export behavior;
- unsafe file paths;
- SOLID/DRY/KISS/YAGNI issues;
- SonarQube-style maintainability risks;
- scope creep.

Codex does not replace CI or human approval.

## Global PR Rules

Before opening a PR:

- run relevant local checks;
- update tests;
- update documentation if behavior or architecture changes;
- document generated output changes if any.

Before merge:

- GitHub CI must pass;
- Codex review must be addressed or explicitly accepted as non-blocking;
- human approval is required.

## MVP Non-Goals

Do not implement these during the MVP unless explicitly approved:

- backend;
- accounts;
- billing;
- cloud sync;
- team workspaces;
- repository analysis;
- existing documentation import;
- required AI generation;
- direct GitHub writes;
- direct GitLab writes;
- Cursor rules for trohi repository bootstrap;
- GitHub Copilot instructions for trohi repository bootstrap;
- template marketplace;
- non-dev presets;
- enterprise policy management.

---

# Phase 0: Verify Angular Workspace Bootstrap

## Goal

Make sure the initialized Angular workspace is clean, minimal, and aligned with project decisions.

## Branch

```text
chore/init-angular-workspace
```

## Expected Deliverables

- Angular 21 workspace;
- Node.js 22 engine requirement;
- npm package setup;
- strict TypeScript;
- Vitest setup;
- Cypress setup;
- initial folder structure;
- basic npm scripts;
- basic GitHub CI if included;
- no product features yet.

## Claude Task

```text
Use the implement-with-tdd skill.

Verify and complete the Angular 21 workspace setup for trohi.

Do not implement product features.

Ensure the project uses Node.js 22, npm, TypeScript strict mode, Vitest, Cypress, and the initial folder structure from docs/PROJECT_STRUCTURE.md.

Run relevant checks before committing.
```

## Codex Review Focus

- Angular 21 setup;
- Node.js 22 compatibility;
- npm scripts;
- Vitest integration;
- Cypress integration;
- strict TypeScript;
- no product features introduced;
- folder structure does not violate architecture boundaries;
- no unnecessary dependencies.

## Definition of Done

- `npm install` works;
- Angular app builds;
- Vitest runs;
- Cypress is scaffolded or runs;
- npm scripts are documented;
- no business logic exists in views;
- CI passes if configured.

---

# Phase 1: Core Domain Modeling Foundation

## Goal

Create the first internal domain/modeling foundation before UI development.

This phase prevents the app from becoming form-bound raw JSON.

## Branch

```text
feature/core-domain-modeling-foundation
```

## Deliverables

- config DTO boundary concept;
- initial config DTO types;
- Zod schema for imported config DTO;
- domain config model skeleton;
- value object for project name;
- value object for output file path;
- validation result model;
- mapper pattern between DTO and domain model;
- Vitest tests for validation, mapping, and value object invariants.

## Claude Task

```text
Use the implement-with-tdd skill.

Create the initial core domain modeling foundation for trohi.

Do not implement UI features yet.

Implement:
- config DTO boundary concept
- domain config model skeleton
- ProjectName value object
- OutputFilePath value object
- ValidationResult model
- mapper pattern between DTO and domain model
- basic Zod schema for imported config DTO
- Vitest tests for validation, mapping, and value object invariants

Follow docs/DOMAIN_MODELING.md, docs/FEATURE_ARCHITECTURE.md, docs/ARCHITECTURE.md, docs/TESTING_STRATEGY.md, and docs/PROJECT_STRUCTURE.md.

Do not implement wizard, preview, export UI, backend, AI integration, repository analysis, Cursor/Copilot outputs, or generated Markdown templates yet.

Run relevant checks before committing.
```

## Codex Review Focus

- raw JSON does not leak past boundary;
- Zod validates imported DTOs;
- mappers are explicit;
- domain models are not anemic where behavior is needed;
- no UI coupling;
- value objects protect invariants;
- tests exist for valid and invalid cases.

## Definition of Done

- DTO validation exists;
- DTO-to-domain mapping exists;
- value object invariants are tested;
- no Angular components are involved;
- no generated Markdown is implemented yet;
- Vitest tests pass.

---

# Phase 2: Output File Model and Selection Rules

## Goal

Define explicit generated output concepts and output file selection rules.

## Branch

```text
feature/output-file-model
```

## Deliverables

- `GeneratedFile` model;
- `GeneratedFileContent` value object or equivalent;
- `GeneratedOutputPackage` model;
- `OutputCategory` model/enum;
- `OutputTarget` model/enum;
- output definition model;
- required product MVP outputs;
- required trohi bootstrap outputs;
- deferred Cursor/Copilot outputs;
- safe output path rules;
- Vitest tests for output selection and path safety.

## Claude Task

```text
Use the implement-with-tdd skill.

Implement the generated output model foundation.

Do not render Markdown templates yet.

Implement explicit models for generated files, output packages, output categories, output targets, and output definitions.

Represent required product outputs, required trohi repository bootstrap outputs, and deferred Cursor/Copilot outputs according to docs/OUTPUT_FILES.md.

Add safe output path validation and tests.

Do not implement UI, ZIP export, file download, or template rendering yet.
```

## Codex Review Focus

- no arbitrary user-controlled file paths;
- required/deferred outputs match `docs/OUTPUT_FILES.md`;
- Cursor/Copilot are not required for repo bootstrap;
- output models are explicit;
- tests cover safe and unsafe paths;
- no ZIP or browser dependency leaks into domain layer.

## Definition of Done

- output definitions exist;
- path safety rules exist;
- output selection is deterministic;
- deferred outputs are represented correctly;
- Vitest tests pass.

---

# Phase 3: Config Sections and Preset Foundation

## Goal

Create the first internal model structure for project configuration sections and presets.

## Branch

```text
feature/config-section-models
```

## Deliverables

- project section model;
- product section model;
- MVP section model;
- architecture section model;
- domain modeling section model;
- feature architecture section model;
- tech stack section model;
- testing section model;
- agents section model;
- outputs section model;
- initial preset concept;
- default trohi/bootstrap preset;
- tests for default config creation.

## Claude Task

```text
Use the implement-with-tdd skill.

Create initial config section domain models and a default preset foundation.

Do not implement UI, Markdown rendering, ZIP export, or backend.

The models should represent the main config areas from docs/CONFIG_MODEL.md.

Add a default preset for the current trohi repository bootstrap:
- Angular 21
- Node.js 22
- npm
- Vitest
- Cypress
- Zod
- fflate
- Claude + Codex workflow
- Cursor/Copilot deferred for repository bootstrap

Add Vitest tests for default config creation and config invariants.
```

## Codex Review Focus

- config model is not plain JSON;
- defaults are explicit and visible;
- no hidden decisions;
- no UI model mixed into domain model;
- preset does not overbuild future features;
- tests cover defaults and invariants.

## Definition of Done

- config sections exist as internal models;
- preset can create a valid base config;
- no UI coupling;
- tests pass.

---

# Phase 4: Template Function Foundation

## Goal

Create deterministic TypeScript template function infrastructure without rendering all files yet.

## Branch

```text
feature/template-function-foundation
```

## Deliverables

- template function contract;
- template rendering context model;
- shared Markdown formatting helpers;
- deterministic section rendering helpers;
- template warning model if needed;
- first minimal template function test;
- no full product templates yet.

## Claude Task

```text
Use the implement-with-tdd skill.

Create the TypeScript template function foundation.

Do not implement all generated documents yet.

Implement:
- template function contract
- template rendering context model
- shared Markdown formatting helpers
- deterministic section rendering helpers
- basic tests for deterministic output

Keep templates independent from Angular UI.
Do not introduce Handlebars, Mustache, Nunjucks, or a custom template marketplace.
```

## Codex Review Focus

- deterministic output;
- no external template engine introduced;
- helpers are not over-engineered;
- no Angular dependency;
- tests cover stable formatting.

## Definition of Done

- template function pattern exists;
- Markdown helper tests exist;
- deterministic output is tested.

---

# Phase 5: First Generated Documents

## Goal

Generate the first core human documentation files from domain config.

## Branch

```text
feature/generate-core-docs
```

## Deliverables

Generate:

```text
docs/PRODUCT_VISION.md
docs/MVP_SCOPE.md
docs/ARCHITECTURE.md
```

Add:

- template functions;
- generation tests;
- Vitest snapshots;
- consistency tests where useful.

## Claude Task

```text
Use the implement-with-tdd skill.

Implement generation for the first core documentation files:
- docs/PRODUCT_VISION.md
- docs/MVP_SCOPE.md
- docs/ARCHITECTURE.md

Use TypeScript template functions.
Use the domain config model, not raw JSON.
Add Vitest generation tests and snapshots.

Do not implement UI, ZIP export, import/export screens, backend, or AI features.
```

## Codex Review Focus

- generated docs are driven by domain config;
- no hardcoded stale decisions;
- snapshots reviewed;
- deterministic output;
- no raw JSON usage;
- generated files do not contradict docs.

## Definition of Done

- three docs generate from config;
- snapshots exist;
- tests pass;
- output is deterministic.

---

# Phase 6: Domain and Feature Architecture Document Generation

## Goal

Generate architecture-specific documentation files.

## Branch

```text
feature/generate-architecture-docs
```

## Deliverables

Generate:

```text
docs/DOMAIN_MODELING.md
docs/FEATURE_ARCHITECTURE.md
docs/CODING_STANDARDS.md
docs/TESTING_STRATEGY.md
```

Add tests and snapshots.

## Claude Task

```text
Use the implement-with-tdd skill.

Implement generation for:
- docs/DOMAIN_MODELING.md
- docs/FEATURE_ARCHITECTURE.md
- docs/CODING_STANDARDS.md
- docs/TESTING_STRATEGY.md

Ensure generated content preserves:
- OOP/domain model rules
- DTO validation and mappers
- UI view models
- presentational views
- no direct HttpClient/REST from views
- ports/adapters
- Vitest and Cypress testing strategy

Add Vitest tests and snapshots.
```

## Codex Review Focus

- no architecture rule drift;
- no Jest references;
- no React references;
- presentational view rule is preserved;
- no direct REST from views rule is preserved;
- snapshots reviewed.

## Definition of Done

- four docs generate;
- snapshots exist;
- generated content is consistent.

---

# Phase 7: Agent and Workflow File Generation

## Goal

Generate agent and workflow bootstrap files.

## Branch

```text
feature/generate-agent-workflow-files
```

## Deliverables

Generate:

```text
AGENTS.md
CLAUDE.md
.claude/skills/implement-with-tdd/SKILL.md
.claude/skills/prepare-pr/SKILL.md
.claude/skills/respond-to-review/SKILL.md
.github/pull_request_template.md
```

Add tests and snapshots.

## Claude Task

```text
Use the implement-with-tdd skill.

Implement generation for the initial Claude + Codex agent workflow files:
- AGENTS.md
- CLAUDE.md
- .claude/skills/implement-with-tdd/SKILL.md
- .claude/skills/prepare-pr/SKILL.md
- .claude/skills/respond-to-review/SKILL.md
- .github/pull_request_template.md

Do not generate Cursor or GitHub Copilot files for the trohi repository bootstrap.

Represent Cursor and Copilot as deferred product targets.

Add Vitest tests and snapshots.
```

## Codex Review Focus

- `AGENTS.md` contains review guidance;
- `CLAUDE.md` contains implementation guidance;
- skills have proper `SKILL.md` structure;
- Cursor/Copilot are deferred;
- tests and snapshots exist;
- instructions do not contradict project docs.

## Definition of Done

- agent files generate;
- snapshots exist;
- skills are valid Markdown with frontmatter;
- PR template reflects architecture/testing/security checks.

---

# Phase 8: Import/Export Config DTO

## Goal

Implement config import/export without UI.

## Branch

```text
feature/config-import-export
```

## Deliverables

- config DTO export;
- config DTO import;
- Zod validation;
- DTO-to-domain mapper;
- domain-to-DTO mapper;
- version metadata;
- round-trip tests;
- invalid import tests.

## Claude Task

```text
Use the implement-with-tdd skill.

Implement config import/export logic without UI.

Add:
- config DTO export
- config DTO import
- Zod validation
- DTO-to-domain mapper
- domain-to-DTO mapper
- version metadata
- round-trip tests
- invalid import tests

Do not build import/export UI yet.
Do not parse existing project documentation.
```

## Codex Review Focus

- imported JSON is validated;
- invalid JSON fails clearly;
- DTOs do not leak into UI/domain usage;
- mapper tests cover edge cases;
- no raw JSON passed through app;
- versioning exists.

## Definition of Done

- config can round-trip through DTO;
- invalid imports fail clearly;
- tests pass.

---

# Phase 9: ZIP and File Export Infrastructure

## Goal

Implement browser/local export infrastructure behind ports/adapters.

## Branch

```text
feature/export-infrastructure
```

## Deliverables

- `ZipArchivePort`;
- `FflateZipArchiveAdapter`;
- `GeneratedFileExportPort` or equivalent;
- browser download adapter;
- tests for adapter contracts where practical;
- no UI yet.

## Claude Task

```text
Use the implement-with-tdd skill.

Implement export infrastructure behind ports/adapters.

Use fflate for ZIP creation behind an adapter.

Do not let domain/generation logic depend directly on fflate or browser download APIs.

Add tests for adapter contracts where practical.

Do not implement export UI yet.
```

## Codex Review Focus

- ports/adapters are clear;
- fflate does not leak into domain;
- browser APIs are isolated;
- safe paths are preserved;
- no hidden network behavior;
- tests exist where practical.

## Definition of Done

- ZIP adapter exists;
- export contract exists;
- generated file models can be passed to export layer;
- domain remains infrastructure-independent.

---

# Phase 10: Application State and Feature Facades

## Goal

Create the first application/feature layer foundation before building views.

## Branch

```text
feature/application-state-foundation
```

## Deliverables

- project creation facade/application service;
- wizard facade/application service skeleton;
- preview facade/application service skeleton;
- import/export facade/application service skeleton;
- UI view model mapping pattern;
- Signals-based local state where appropriate;
- RxJS only where useful;
- tests for facade behavior.

## Claude Task

```text
Use the implement-with-tdd skill.

Create the application state and feature facade foundation.

Do not build full UI yet.

Implement feature application/facade skeletons for:
- project creation
- wizard
- preview
- import/export

Use UI view models.
Keep views independent from domain/DTO details.
Prefer Angular Signals for local state where appropriate.
Use RxJS only where it is clearer.

Add Vitest tests for facade behavior and view model mapping.
```

## Codex Review Focus

- views are not created with logic yet;
- facades do not expose DTOs;
- Signals/RxJS use is pragmatic;
- no backend assumptions;
- tests cover feature behavior.

## Definition of Done

- feature facade pattern exists;
- UI view model mapping exists;
- no raw JSON in facade outputs;
- tests pass.

---

# Phase 11: Minimal App Shell and Routing

## Goal

Create the Angular app shell without implementing full product flows.

## Branch

```text
feature/app-shell-routing
```

## Deliverables

- app shell;
- basic routing;
- navigation placeholder;
- route structure for project create, wizard, preview, import/export;
- presentational components only;
- no business logic in views;
- basic component tests if appropriate.

## Claude Task

```text
Use the implement-with-tdd skill.

Create the minimal Angular app shell and routing.

Do not implement full wizard or generation UI yet.

Add route placeholders for:
- project create
- wizard
- preview
- import/export

Views must stay presentational and call facades only.
Do not add business logic to components.
```

## Codex Review Focus

- components are thin;
- routing is simple;
- no domain logic in views;
- no premature UI complexity;
- no direct storage/export/generation calls from components.

## Definition of Done

- app shell works;
- routes exist;
- components are presentational;
- build passes.

---

# Phase 12: Project Creation Feature UI

## Goal

Implement the first real UI feature with correct architecture.

## Branch

```text
feature/project-create-flow
```

## Deliverables

- project creation form;
- UI view model;
- facade actions;
- project name validation via domain/value object;
- basic user flow;
- Vitest tests for business behavior;
- Cypress smoke test.

## Claude Task

```text
Use the implement-with-tdd skill.

Implement the project creation feature.

Views must stay presentational.
The form must not bind directly to raw config JSON.
Use UI view models and facade/application methods.
Use the ProjectName value object and domain validation.

Add Vitest tests for feature behavior.
Add a focused Cypress smoke test.
```

## Codex Review Focus

- form does not use raw config DTO;
- business logic not in component;
- domain validation used;
- UI view model exists;
- tests exist;
- no generated output logic in view.

## Definition of Done

- user can create a project profile;
- validation works;
- architecture boundaries are preserved;
- tests pass.

---

# Phase 13: Wizard Feature Skeleton

## Goal

Implement the wizard structure and section navigation without all fields.

## Branch

```text
feature/wizard-skeleton
```

## Deliverables

- wizard route;
- wizard section navigation;
- initial section view models;
- facade actions;
- basic state transitions;
- tests for navigation/state;
- Cypress flow skeleton.

## Claude Task

```text
Use the implement-with-tdd skill.

Implement the wizard skeleton.

Do not implement every field yet.

Add:
- section navigation
- basic view models
- facade state transitions
- tests for navigation and state
- Cypress flow skeleton

Views must stay presentational.
Do not generate Markdown from wizard components.
```

## Codex Review Focus

- wizard state not hidden in components;
- no raw JSON;
- no generated Markdown in UI;
- view models are used;
- tests cover state transitions.

## Definition of Done

- wizard skeleton works;
- state transitions tested;
- UI is presentational.

---

# Phase 14: Wizard Sections Incrementally

## Goal

Implement wizard sections in small PRs.

## Branch Pattern

```text
feature/wizard-section-<section-name>
```

## Recommended Order

1. project basics;
2. product context;
3. MVP scope;
4. architecture;
5. domain modeling;
6. feature architecture;
7. tech stack;
8. testing;
9. Git/CI;
10. agents/output targets.

## Per-Section Deliverables

- UI view model;
- form model;
- facade action;
- mapper/update logic;
- domain validation;
- tests;
- Cypress coverage where important.

## Claude Task Template

```text
Use the implement-with-tdd skill.

Implement the <section-name> wizard section.

Views must stay presentational.
Do not bind to raw config JSON.
Use UI view models and facade methods.
Add Vitest tests for feature behavior and mapping.
Add or update Cypress coverage only if the user flow changes meaningfully.

Do not implement unrelated wizard sections.
```

## Codex Review Focus

- one section only;
- no scope creep;
- mapping is explicit;
- domain model updated correctly;
- tests exist;
- UI remains clean.

## Definition of Done

- section works;
- model updates correctly;
- tests pass.

---

# Phase 15: Preview Feature

## Goal

Allow users to preview generated files safely.

## Branch

```text
feature/generated-file-preview
```

## Deliverables

- file tree/list preview;
- generated file content preview;
- safe plain-text Markdown preview;
- validation warnings;
- include/exclude optional files;
- preview facade;
- tests;
- Cypress coverage.

## Claude Task

```text
Use the implement-with-tdd skill.

Implement generated file preview.

Use safe plain-text Markdown preview.
Do not render untrusted Markdown as executable HTML.
Views must consume preview view models.
Generation must happen through the feature facade/application layer.

Add tests for preview behavior and output selection.
Add Cypress coverage for previewing generated files.
```

## Codex Review Focus

- no unsafe Markdown rendering;
- view does not call generation engine directly;
- preview view models used;
- output selection handled outside component;
- tests and Cypress coverage exist.

## Definition of Done

- user can preview generated files;
- file paths are visible;
- content is safe plain text;
- optional outputs can be included/excluded.

---

# Phase 16: Export Feature

## Goal

Allow users to export generated files and config.

## Branch

```text
feature/export-generated-files
```

## Deliverables

- ZIP export via fflate adapter;
- config JSON export;
- copy/download individual file if practical;
- export readiness validation;
- user-facing error handling;
- tests;
- Cypress export flow.

## Claude Task

```text
Use the implement-with-tdd skill.

Implement export for generated files and config JSON.

Use the export ports/adapters.
Do not call fflate or browser download APIs directly from Angular components.
Do not upload anything.
Use safe file paths.
Add tests for export behavior.
Add Cypress coverage for export flow where practical.
```

## Codex Review Focus

- export infrastructure stays behind adapters;
- no browser API leakage into domain;
- no hidden network calls;
- safe paths enforced;
- config export uses DTO mapping;
- tests exist.

## Definition of Done

- ZIP export works;
- config export works;
- unsafe paths blocked;
- tests pass.

---

# Phase 17: Import Feature

## Goal

Allow users to import a previous `trohi.config.json`.

## Branch

```text
feature/import-config
```

## Deliverables

- file import UI;
- JSON parsing;
- Zod validation;
- DTO-to-domain mapping;
- error reporting;
- regenerate preview after import;
- tests;
- Cypress import flow.

## Claude Task

```text
Use the implement-with-tdd skill.

Implement config import.

Imported JSON must be validated before use.
Map DTO to domain model before exposing anything to UI.
Views must not consume raw JSON.
Do not parse arbitrary project documentation.
Do not execute imported content.

Add tests for valid and invalid imports.
Add Cypress coverage for import flow.
```

## Codex Review Focus

- imported JSON validated;
- no raw JSON leakage;
- errors clear;
- version handling;
- no arbitrary doc parsing;
- no execution of imported content;
- tests exist.

## Definition of Done

- valid config imports;
- invalid config fails clearly;
- preview can regenerate after import;
- tests pass.

---

# Phase 18: End-to-End MVP Flow

## Goal

Connect the primary MVP user flow end to end.

## Branch

```text
feature/mvp-end-to-end-flow
```

## Deliverables

Complete flow:

```text
create project
-> complete wizard
-> generate files
-> preview
-> export ZIP
-> export config
```

Cypress E2E test for happy path.

## Claude Task

```text
Use the implement-with-tdd skill.

Connect the primary MVP flow end to end.

Do not add backend, AI integration, repo analysis, or team features.

Ensure the flow supports:
- project creation
- wizard completion
- generated preview
- ZIP export
- config export

Add Cypress happy path coverage.
Run relevant checks before committing.
```

## Codex Review Focus

- flow works end to end;
- architecture boundaries intact;
- no raw JSON in UI;
- no business logic in components;
- no hidden network calls;
- Cypress coverage exists;
- scope is still MVP.

## Definition of Done

- primary flow works;
- Cypress happy path passes;
- local checks pass;
- CI passes.

---

# Phase 19: CI, Static Analysis, and Quality Gate Hardening

## Goal

Make quality gates reliable before public MVP.

## Branch

```text
chore/harden-quality-gates
```

## Deliverables

- npm script normalization;
- lint command;
- typecheck command;
- Vitest command;
- Cypress command;
- build command;
- static analysis command set;
- GitHub CI workflow;
- pre-commit guidance or hooks if selected.

## Claude Task

```text
Use the implement-with-tdd skill where applicable.

Harden local and GitHub CI quality gates.

Ensure scripts exist for:
- formatting/check formatting
- lint
- static analysis command set
- typecheck
- Vitest tests
- build
- Cypress tests

Do not weaken rules to make checks pass.
Do not add full Sonar integration yet unless explicitly instructed.
```

## Codex Review Focus

- scripts are consistent;
- CI mirrors local checks;
- no disabled rules without reason;
- no overcomplicated CI;
- no full Sonar premature setup;
- checks are practical.

## Definition of Done

- local quality commands work;
- GitHub CI runs required checks;
- PRs cannot pass with obvious failures.

---

# Phase 20: MVP Hardening and Documentation Sync

## Goal

Prepare MVP for first real use.

## Branch

```text
chore/mvp-hardening-doc-sync
```

## Deliverables

- README update;
- docs sync;
- generated output review;
- manual testing checklist;
- privacy statement refinement;
- known limitations;
- example output package if useful.

## Claude Task

```text
Use the implement-with-tdd skill where behavior changes.

Harden the MVP and synchronize documentation.

Review docs for drift against implementation.
Update README with actual setup, scripts, and usage.
Document known limitations.
Do not add new features unless explicitly instructed.
```

## Codex Review Focus

- docs match implementation;
- no stale Jest/React/Cursor bootstrap references;
- known limitations clear;
- no new scope creep;
- generated output still consistent.

## Definition of Done

- docs match implementation;
- README is usable;
- limitations are clear;
- MVP can be tried by early users.

---

# Phase 21: Public MVP Release Preparation

## Goal

Prepare the first public MVP.

## Branch

```text
chore/public-mvp-release-prep
```

## Deliverables

- release checklist;
- version tag plan;
- hosted deployment using existing hosting;
- final privacy note;
- basic usage guide;
- feedback channel;
- example generated files.

## Claude Task

```text
Prepare the public MVP release checklist and documentation.

Do not add new product features.
Focus on release readiness, documentation, privacy clarity, and example output.
```

## Codex Review Focus

- release docs accurate;
- no hidden privacy issues;
- no backend/AI claims that are not true;
- example output matches actual generator behavior.

## Definition of Done

- MVP can be published;
- usage is documented;
- privacy expectations are clear;
- version can be tagged.

---

# Cross-Cutting Rules for Every Phase

## Architecture

Every phase must preserve:

```text
view
-> feature business/application layer
-> service
-> mapper
-> domain / infrastructure
```

No direct `HttpClient`, REST, raw JSON, DTOs, or generation logic in views.

## Data Boundaries

Every external input must follow:

```text
external data
-> validation
-> mapper
-> internal model
```

## Testing

Every behavior change needs tests.

Preferred order:

```text
Vitest model/mapper/validation/generation tests
-> feature/application tests
-> Cypress only for important user flows
```

## Generated Output

Any generated Markdown change must include:

- generation tests;
- snapshot update only after review;
- explanation in PR.

## Security

Do not add:

- hidden network calls;
- telemetry;
- secrets in config;
- backend communication;
- AI provider calls;

unless explicitly approved.

## Scope

Keep PRs small.

When a change wants to add future features, stop and ask.

---

# Recommended PR Sequence Summary

```text
0. chore/init-angular-workspace
1. feature/core-domain-modeling-foundation
2. feature/output-file-model
3. feature/config-section-models
4. feature/template-function-foundation
5. feature/generate-core-docs
6. feature/generate-architecture-docs
7. feature/generate-agent-workflow-files
8. feature/config-import-export
9. feature/export-infrastructure
10. feature/application-state-foundation
11. feature/app-shell-routing
12. feature/project-create-flow
13. feature/wizard-skeleton
14. feature/wizard-section-project-basics
15. feature/wizard-section-product-context
16. feature/wizard-section-mvp-scope
17. feature/wizard-section-architecture
18. feature/wizard-section-domain-modeling
19. feature/wizard-section-feature-architecture
20. feature/wizard-section-tech-stack
21. feature/wizard-section-testing
22. feature/wizard-section-git-ci
23. feature/wizard-section-agents-output
24. feature/generated-file-preview
25. feature/export-generated-files
26. feature/import-config
27. feature/mvp-end-to-end-flow
28. chore/harden-quality-gates
29. chore/mvp-hardening-doc-sync
30. chore/public-mvp-release-prep
```

This sequence may be adjusted, but changes should preserve the same dependency logic:

```text
models and boundaries first
-> generation core
-> application layer
-> UI
-> import/export
-> hardening
```

## Final Success Criteria

The implementation plan is successful when:

1. Claude can implement one PR at a time without inventing architecture;
2. Codex can review PRs against explicit rules;
3. the UI remains presentational;
4. raw JSON and DTOs do not leak into the UI;
5. generation is deterministic and tested;
6. import/export is safe and validated;
7. the MVP flow works end to end;
8. future backend, AI, repo integration, and team features remain possible without rewriting the core.
