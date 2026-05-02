# AGENTS.md

## Project

This repository contains **trohi**.

trohi is a dev-first tool for creating structured project documentation and AI agent instruction files for new software projects.

The MVP helps solo and indie developers define project context, goals, constraints, engineering standards, workflows, and agent-specific instructions before implementation begins.

## Primary User

The MVP target user is a solo or indie developer who frequently works with AI coding agents.

## Primary MVP Use Case

The first supported use case is:

> A user starts a new software project without documentation, answers a structured wizard, previews generated files, and exports project documentation plus AI agent instruction files.

Do not implement existing-project analysis, repository scanning, team workspaces, cloud sync, backend services, or required AI generation unless explicitly instructed.

## Tech Stack

Use the selected MVP stack:

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

React is explicitly rejected for this project.

StencilJS is not the MVP app shell. It may be considered later only for framework-agnostic components, a design system, or embeddable widgets.

## Current MVP Constraints

For the MVP:

- the app is browser-only;
- there is no backend;
- there are no user accounts;
- there is no cloud storage;
- there is no required AI dependency for now;
- persistence is handled through local import/export;
- generation is deterministic;
- project data should remain local.

These are MVP constraints, not permanent product limitations.

## Core Product Rule

The core product rule is:

```text
structured config + templates = generated files
```

The structured config is the source of truth.

Generated Markdown files are output artifacts.

Do not design the app as a free-form prompt generator.

Do not make generated Markdown the primary internal data model.

## Architecture Rules

Keep the generation core independent from Angular UI.

Respect these conceptual layers:

- UI layer;
- feature application/business layer;
- domain layer;
- infrastructure/adapters layer.

Core generation, validation, output definitions, domain models, mappers, template functions, and consistency rules must be testable without rendering Angular UI.

The browser is the first delivery environment, not the identity of the product.

## Feature Architecture Rules

Angular views must stay presentational.

A view may:

- render state;
- bind forms;
- display validation messages;
- emit user intentions;
- call feature facade/application methods.

A view must not:

- contain business rules;
- generate Markdown;
- validate imported JSON directly;
- perform DTO mapping;
- call backend APIs directly;
- inject or call `HttpClient`;
- call REST services directly;
- contain complex state machines;
- know persistence details;
- know raw config JSON shapes.

Each non-trivial feature should have its own business/application layer.

Expected direction:

```text
view
-> feature facade / business layer
-> feature service / application service
-> mapper
-> domain / infrastructure
```

Future backend direction:

```text
view
-> feature business/application layer
-> service
-> mapper
-> REST/API service or infrastructure adapter
-> backend
```

Response direction:

```text
backend
-> REST/API service or infrastructure adapter
-> mapper
-> domain/application model
-> UI view model
-> view
```

Never bypass this direction.

## Domain Modeling Rules

Use object-oriented design where it improves clarity, encapsulation, validation, and maintainability.

Do not pass raw JSON objects through the application.

Plain JSON may exist only at external boundaries such as:

- imported `trohi.config.json`;
- exported `trohi.config.json`;
- future backend DTOs;
- browser storage serialization;
- test fixtures where appropriate.

Inside the application, use explicit models:

- domain models;
- value objects;
- application models;
- UI view models;
- DTOs only at boundaries;
- generated output models.

Avoid anemic models when behavior belongs with the concept.

Avoid Java-style overengineering, deep inheritance trees, and abstract frameworks before they are needed.

Prefer composition over inheritance.

## DTO, Mapper, Domain Model, View Model Flow

External data must be mapped into internal models before use.

Required flow:

```text
External DTO / JSON
-> validation
-> mapper
-> domain/application model
-> UI view model
-> view
```

And for export or backend communication:

```text
domain/application model
-> mapper
-> DTO
-> external boundary
```

UI components must not consume:

- raw imported JSON;
- backend DTOs;
- persistence shapes;
- API response formats.

Use explicit mappers between:

- DTOs and domain models;
- domain models and DTOs;
- domain models and UI view models;
- UI input models and domain updates;
- generated output models and export DTOs/files.

Mapper behavior must be tested.

## Ports and Adapters Rules

Use a lightweight ports-and-adapters approach at infrastructure boundaries.

A port is a contract for an external capability.

An adapter is a concrete implementation of that contract.

Examples of ports:

```text
ZipArchivePort
GeneratedFileExportPort
ProjectConfigStoragePort
FutureProjectRepositoryPort
```

Examples of adapters:

```text
FflateZipArchiveAdapter
BrowserFileDownloadAdapter
BrowserLocalStorageAdapter
FutureRestProjectRepositoryAdapter
```

Ports and adapters are not only for backend communication.

They may also represent browser APIs, file export, ZIP creation, local storage, future GitHub integration, future AI provider integration, or future backend APIs.

Core domain and feature business logic should depend on ports/contracts, not concrete infrastructure details.

## Angular Signals and RxJS

Prefer Angular Signals for local reactive UI and feature state when they make state easier to understand.

Use RxJS where it is more appropriate, especially for:

- asynchronous streams;
- event streams;
- external integrations;
- future HTTP flows in infrastructure adapters;
- cancellation;
- debounce/throttle;
- composition of async workflows.

Do not force all state into RxJS.

Do not force all async workflows into Signals when RxJS is clearer.

Do not introduce global state management by default.

Use feature-local store or component store only when it improves encapsulation, testability, state transitions, or UI simplicity.

## Coding Standards

Follow these principles:

- SOLID;
- DRY;
- KISS;
- YAGNI;
- Convention over Configuration;
- Composition over Inheritance;
- Law of Demeter.

Prefer simple, explicit, testable code.

Do not introduce abstractions only for hypothetical future needs.

Do not add dependencies without a clear reason.

## Comments

All code comments must be written in English.

Every class must have a useful comment explaining its responsibility.

Every public method must have a useful comment explaining its purpose, parameters, return value, side effects, and error behavior when relevant.

Do not add comments that only repeat obvious implementation details.

## Testing Rules

Use TDD as the preferred workflow.

For core behavior, follow this cycle:

```text
write failing test
-> implement the smallest useful change
-> make the test pass
-> refactor safely
```

Use Vitest for:

- unit tests;
- integration tests;
- mapper tests;
- domain model tests;
- validation tests;
- generation engine tests;
- snapshot tests for generated Markdown.

Use Cypress for critical browser end-to-end flows.

Add or update tests when changing:

- domain models;
- mappers;
- UI view model mapping;
- config model behavior;
- validation rules;
- generation logic;
- templates;
- output file definitions;
- import/export behavior;
- consistency checks;
- important UI flows.

Do not update snapshots without reviewing generated output changes.

## Static Analysis and Local Checks

Run relevant local checks before committing.

Static analysis must happen before commit and again in GitHub CI.

Do not commit code with known failures in:

- formatting;
- linting;
- static analysis;
- type checking;
- Vitest tests;
- snapshot tests;
- affected Cypress tests.

The project prefers Google TypeScript Style or an Angular-compatible strict TypeScript style setup, plus SonarQube-style quality rules.

Full Sonar integration comes later.

## Git Workflow

Use branches for meaningful changes.

Use Conventional Commits.

Preferred flow:

```text
create branch
-> implement using TDD
-> run local checks and static analysis
-> commit only if checks pass
-> open pull request
-> GitHub CI runs checks
-> Codex reviews
-> address valid feedback
-> human approves
-> merge
```

Do not merge your own pull request.

Do not bypass failing checks.

Do not weaken tests, lint rules, static analysis rules, or CI rules to make a change pass.

## AI Agent Handoff

Claude Code is the implementation agent.

Codex is the review agent.

The human developer is the final approver.

When implementing:

- keep the scope minimal;
- follow existing documentation;
- write or update tests first where practical;
- run relevant checks;
- prepare changes for review.

When responding to review feedback:

- address valid in-scope feedback;
- explain invalid suggestions briefly;
- defer out-of-scope suggestions;
- do not expand the PR unnecessarily.

## Review Guidelines

When reviewing changes, focus on:

- correctness;
- missing tests;
- broken TDD expectations;
- architecture boundary violations;
- view components containing business logic;
- direct `HttpClient` or REST calls from views;
- DTOs or raw JSON leaking into UI components;
- missing or weak mappers;
- domain models that should protect invariants but do not;
- anemic models where behavior clearly belongs with the model;
- over-engineered inheritance or abstract frameworks;
- deterministic generation issues;
- inconsistent generated output;
- invalid assumptions in templates;
- weak validation;
- unsafe import/export behavior;
- unsafe generated file paths;
- error handling problems;
- excessive complexity;
- duplicated logic;
- violations of SOLID, DRY, KISS, YAGNI, CoC, Composition over Inheritance, or Law of Demeter;
- SonarQube-style maintainability concerns;
- generated Markdown changes without reviewed snapshots;
- scope creep beyond the MVP.

Codex review should complement tests and CI, not replace them.

## Security and Privacy Rules

The MVP is local-first.

Do not add hidden network calls.

Do not add telemetry or analytics without explicit approval.

Do not send project config or generated files to a backend or AI provider by default.

Do not store secrets in `trohi.config.json`.

Imported config files must be validated before use.

Generated paths must be safe and repository-friendly.

## Scope Control

Do not add these features unless explicitly instructed:

- backend;
- accounts;
- billing;
- cloud sync;
- team workspaces;
- repository analysis;
- existing documentation import;
- required AI generation;
- direct GitHub writes;
- template marketplace;
- non-dev presets.

If a requested change seems to require one of these, explain the scope impact first.

## Generated Output Rules

Generated files are product behavior.

If generated output behavior changes:

- update generation tests;
- update snapshots only after review;
- explain which files changed and why;
- verify human docs and agent instructions remain consistent.

## Important Project Documents

Use these documents as source guidance:

- `docs/PRODUCT_VISION.md`
- `docs/MVP_SCOPE.md`
- `docs/USE_CASES.md`
- `docs/OUTPUT_FILES.md`
- `docs/CONFIG_MODEL.md`
- `docs/ARCHITECTURE.md`
- `docs/DOMAIN_MODELING.md`
- `docs/FEATURE_ARCHITECTURE.md`
- `docs/TESTING_STRATEGY.md`
- `docs/CODING_STANDARDS.md`
- `docs/GIT_WORKFLOW.md`
- `docs/CI_CD_STRATEGY.md`
- `docs/SECURITY_AND_PRIVACY.md`
- `docs/ROADMAP.md`
- `docs/DECISIONS.md`
- `docs/TECH_STACK.md`
- `docs/PROJECT_STRUCTURE.md`

When a task conflicts with these documents, stop and explain the conflict before implementing.

## Decision Rules

Important product, architecture, workflow, or security decisions must be recorded in `docs/DECISIONS.md`.

Do not leave major decisions only in chat history or commit messages.

## Working Style

Be careful and deliberate.

Prefer small, reviewable changes.

Do not rush into implementation before the relevant document, test, or decision exists.

When uncertain, ask or leave a clear note instead of inventing project rules.

