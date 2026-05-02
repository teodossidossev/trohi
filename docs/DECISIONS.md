# Decisions

## Purpose

This document records important product, architecture, workflow, and engineering decisions for **trohi**.

The goal is to preserve not only what was decided, but also why it was decided.

## Status Values

- **Accepted**: active decision.
- **Temporary MVP Constraint**: active for the MVP, expected to be revisited later.
- **Revisit Later**: intentionally postponed.
- **Superseded**: replaced by a newer decision.

---

## 001. trohi is dev-first for the MVP

**Status:** Accepted

### Context

The broader product idea may eventually apply outside software development, but the first clear user problem exists in AI-assisted software development.

### Decision

The MVP will focus on software development projects.

### Alternatives Considered

- Start as a generic AI instruction builder for any domain.
- Start with multiple domain presets.
- Start only as a prompt generator.

### Reason

A dev-first MVP is easier to validate because the output files, workflows, and AI coding agent expectations are concrete.

### Consequences

The first UI, templates, terminology, and output files can be dev-specific. The core model should avoid unnecessary lock-in so future non-dev expansion remains possible.

---

## 002. The MVP targets solo and indie developers

**Status:** Accepted

### Context

Team features require backend, accounts, permissions, and sync.

### Decision

The MVP target user is a solo developer or indie developer who frequently works with AI coding agents.

### Alternatives Considered

- Target small teams from day one.
- Target enterprise development organizations.
- Target non-technical users.

### Reason

Solo and indie developers can use a local-first, file-based MVP without accounts, backend, or shared workspaces.

### Consequences

The MVP workflow stays lightweight. Team features are deferred.

---

## 003. The first use case is a new software project without documentation

**Status:** Accepted

### Context

The product could support new projects, existing projects with docs, existing projects without docs, and non-dev domains.

### Decision

The first use case is:

> A user starts a new software project without documentation, answers a structured wizard, previews generated files, and exports project documentation plus AI agent instruction files.

### Alternatives Considered

- Start by importing existing documentation.
- Start by analyzing existing repositories.
- Start with team standards.
- Start with non-dev workflows.

### Reason

The new-project workflow validates the core idea without requiring parsing, inference, AI, or repository integrations.

### Consequences

Existing-project workflows are deferred.

---

## 004. The MVP is browser-only

**Status:** Temporary MVP Constraint

### Context

The MVP should validate the core workflow with minimal infrastructure.

### Decision

The MVP will be a browser-only application.

### Alternatives Considered

- Backend app from day one.
- CLI-first tool.
- Desktop app.
- IDE extension first.

### Reason

Browser-only reduces infrastructure complexity, avoids accounts, and keeps project data local.

### Consequences

The MVP should not require server-side processing. The generation core must remain independent from Angular UI code.

### Review

Review after MVP validation or when cloud sync, teams, repository integration, or hosted AI assistance becomes active work.

---

## 005. The MVP has no backend

**Status:** Temporary MVP Constraint

### Context

A backend would enable accounts, sync, teams, hosted templates, and repository integrations, but would add complexity and security responsibilities.

### Decision

The MVP will not include a backend.

### Alternatives Considered

- Backend API from day one.
- Hosted database.
- User accounts and cloud sync in the MVP.

### Reason

The first version should validate the core workflow before adding infrastructure.

### Consequences

Persistence is handled through local working state and import/export files.

### Review

Review after the core MVP workflow is validated and there is a clear need for sync, team features, or hosted integrations.

---

## 006. The MVP has no required AI dependency for now

**Status:** Temporary MVP Constraint

### Context

AI assistance could help suggest answers, review generated documentation, detect conflicts, import existing docs, or analyze repositories.

### Decision

The MVP will not require AI to function for now.

The core generation flow must be deterministic:

```text
structured config + templates = generated files
```

AI assistance may be added later as an optional feature.

### Alternatives Considered

- Use AI as the main generator.
- Require AI for wizard completion.
- Use AI for repository analysis in the MVP.

### Reason

A deterministic core is easier to test, debug, trust, and version.

### Consequences

The MVP must work without AI provider calls. Future AI features must be explicit, optional, and privacy-aware.

### Review

Review after deterministic generation is useful and users need assisted setup, generated output review, conflict detection, or existing-project import.

---

## 007. Structured config is the source of truth

**Status:** Accepted

### Context

The product generates many files from the same project decisions.

### Decision

The structured trohi configuration is the source of truth.

Generated Markdown files are output artifacts.

### Alternatives Considered

- Treat generated Markdown files as the primary source.
- Use free-form prompts as the primary source.
- Store only final generated files.

### Reason

A structured config enables deterministic generation, preview, validation, import/export, and future regeneration.

### Consequences

`trohi.config.json` must be exportable and importable.

---

## 008. Markdown files are generated output

**Status:** Accepted

### Context

Generated files should be useful in a real repository, but they should not be the internal source model of the app.

### Decision

Markdown files generated by trohi are output artifacts created from config and templates.

### Alternatives Considered

- Make Markdown editing the primary workflow.
- Parse generated Markdown back into config in the MVP.
- Use Markdown files as the only saved state.

### Reason

Keeping Markdown as output preserves consistency and makes regeneration possible.

### Consequences

The MVP does not need Markdown-to-config parsing.

---

## 009. The generation core must be independent from the UI

**Status:** Accepted

### Context

The MVP is browser-based, but future versions may need CLI, backend, repository integrations, or hosted generation.

### Decision

Core generation, validation, output definitions, consistency rules, models, and mappers must not be tightly coupled to Angular UI components.

### Alternatives Considered

- Build generation directly inside UI components.
- Treat the app as a form-to-Markdown renderer.
- Defer architecture boundaries until later.

### Reason

Separating the core makes it easier to test, reuse, and extend.

### Consequences

The generation engine must be testable without browser rendering.

---

## 010. TDD is the preferred development workflow

**Status:** Accepted

### Context

The project contains deterministic generation logic, validation, templates, import/export, and output consistency rules.

### Decision

TDD is the preferred development workflow.

The expected cycle is:

```text
write failing test
-> implement smallest useful change
-> make the test pass
-> refactor safely
```

### Alternatives Considered

- Write tests after implementation.
- Use manual testing only during MVP.
- Use TDD only for bug fixes.

### Reason

TDD supports safe evolution of generation logic and gives AI agents clearer boundaries.

### Consequences

Core logic, validation, generation, templates, import/export, and important workflows should be test-driven where practical.

---

## 011. Vitest is the unit, integration, and snapshot test runner

**Status:** Accepted

### Context

Angular 21 uses Vitest as the default/stable testing direction for new Angular projects.

### Decision

Use Vitest for unit tests, integration tests, and snapshot tests.

### Alternatives Considered

- Jest.
- Angular default test tooling without explicit decision.
- Manual testing only for generated output.

### Reason

Using Vitest aligns with Angular 21's current tooling direction and avoids maintaining a custom Jest setup without a strong reason.

### Consequences

Generated Markdown snapshots should use Vitest snapshots. Core domain tests should run without Angular component rendering where practical.

---

## 012. Cypress is the E2E tool

**Status:** Accepted

### Context

The MVP includes a browser workflow with project creation, wizard steps, preview, export, and import.

### Decision

Use Cypress for end-to-end browser testing.

### Alternatives Considered

- Playwright.
- No E2E testing in the MVP.
- Manual browser testing only.

### Reason

Cypress is suitable for focused browser workflow testing.

### Consequences

Cypress should cover the primary user flow once the UI exists.

---

## 013. Static analysis runs before commit and in GitHub CI

**Status:** Accepted

### Context

The project should maintain high code quality and avoid preventable problems before changes reach `main`.

### Decision

Static analysis must run before commit and again in GitHub CI.

This includes linting and SonarQube-style quality checks where practical.

### Alternatives Considered

- Run static analysis only in CI.
- Run static analysis only locally.
- Defer static analysis until after the MVP.

### Reason

Running checks in both places prevents known-bad commits and protects the main branch.

### Consequences

Claude Code and human developers should not commit code with known linting, type, static analysis, or test failures.

---

## 014. Angular 21 is the main application framework

**Status:** Accepted

### Context

The app is expected to grow into a structured, workflow-heavy product with forms, routing, validation, preview, import/export, and feature business layers.

### Decision

Use Angular 21 as the main application framework.

### Alternatives Considered

- React.
- StencilJS as the main app framework.
- Framework-agnostic Web Components first.

### Reason

Angular provides a full application framework with conventions, dependency injection, routing, forms, and long-term structure.

### Consequences

The initial app architecture should follow Angular conventions while keeping domain and generation logic framework-independent.

---

## 015. React is explicitly rejected

**Status:** Accepted

### Context

React was considered but does not match the desired application style.

### Decision

Do not use React for the main app.

### Alternatives Considered

- React app shell.
- React with custom architecture rules.

### Reason

The project owner explicitly does not want React, and the product benefits from stronger framework conventions.

### Consequences

React should not be introduced unless this decision is explicitly superseded.

---

## 016. StencilJS is a future component-library option, not the MVP app shell

**Status:** Accepted

### Context

StencilJS is useful for Web Components and component libraries, but the MVP needs a full application framework.

### Decision

Do not use StencilJS as the MVP app shell.

StencilJS may be revisited later for framework-agnostic components, a design system, or embeddable widgets.

### Alternatives Considered

- StencilJS as the main app framework.
- StencilJS + custom routing/application architecture.

### Reason

Angular is better suited for the main workflow-heavy app.

### Consequences

StencilJS remains a future option, not an MVP dependency.

---

## 017. Node.js 22 and npm are selected

**Status:** Accepted

### Context

The project needs a stable local and CI runtime.

### Decision

Use Node.js 22 and npm.

Angular 21 must use a Node.js 22 version compatible with Angular 21 requirements.

### Alternatives Considered

- pnpm.
- Yarn.
- Other Node.js major versions.

### Reason

npm is explicit project preference and works with Angular CLI.

### Consequences

CI and local setup should use npm scripts and a compatible Node.js 22 version.

---

## 018. Zod is the preferred schema validation library

**Status:** Accepted

### Context

Imported `trohi.config.json` is external JSON and cannot be trusted as TypeScript types at runtime.

### Decision

Use Zod or an equivalent TypeScript-first runtime validation library.

### Alternatives Considered

- Manual validation.
- JSON Schema first.
- Trust imported JSON after parsing.

### Reason

Zod provides runtime validation while staying close to TypeScript models.

### Consequences

Imported config DTOs must be validated before mapping into domain models.

---

## 019. TypeScript template functions are the MVP template rendering approach

**Status:** Accepted

### Context

Generated Markdown needs deterministic rendering and strong tests.

### Decision

Use TypeScript template functions for MVP rendering.

### Alternatives Considered

- Handlebars.
- Mustache.
- Nunjucks.
- Custom template marketplace from day one.

### Reason

TypeScript template functions provide type safety, simple TDD, and deterministic snapshot testing without extra template engine complexity.

### Consequences

A dedicated template engine may be considered later if user-authored templates become important.

---

## 020. Plain-text Markdown preview is the MVP preview approach

**Status:** Accepted

### Context

Users need to preview generated Markdown before export.

### Decision

Start with safe plain-text Markdown preview.

### Alternatives Considered

- Rich Markdown preview from day one.
- HTML rendering.
- No preview.

### Reason

Plain-text preview is safer, simpler, and sufficient for a developer-focused MVP.

### Consequences

Rich preview can be added later with sanitization.

---

## 021. fflate is the preferred ZIP export library

**Status:** Accepted

### Context

The MVP needs browser-side ZIP generation with a permissive license.

### Decision

Use `fflate` for ZIP export unless a better permissive-license option is selected later.

### Alternatives Considered

- JSZip.
- Custom ZIP generation.
- Server-side ZIP generation.

### Reason

`fflate` is small, focused, browser-compatible, and MIT licensed.

### Consequences

ZIP creation should be isolated behind an adapter.

---

## 022. Use explicit OOP/domain models instead of raw JSON throughout the app

**Status:** Accepted

### Context

The app must remain maintainable as it grows, and UI code must not depend on raw external data shapes.

### Decision

Do not pass raw JSON objects through the application.

Use explicit domain models, value objects, application models, UI view models, and mappers.

Plain JSON may exist only at external boundaries such as config import/export, future backend DTOs, storage serialization, and fixtures.

### Alternatives Considered

- Use plain JSON objects everywhere.
- Use only TypeScript interfaces without behavior.
- Map directly from imported config into UI.

### Reason

Explicit models protect invariants, improve encapsulation, and prevent external formats from leaking into UI/business logic.

### Consequences

Model and mapper behavior must be tested. DTOs must be validated and mapped before use.

---

## 023. UI uses view models, not DTOs or raw config JSON

**Status:** Accepted

### Context

The UI must remain clean and independent from external logic and persistence/API formats.

### Decision

Angular views and components should consume UI view models.

They must not consume raw config JSON, future backend DTOs, or persistence shapes directly.

### Alternatives Considered

- Bind Angular forms directly to imported JSON.
- Bind UI directly to backend response shapes later.
- Use one model for everything.

### Reason

View models keep presentation concerns separate and protect the UI from future backend or config format changes.

### Consequences

Mappers are required between DTOs, domain/application models, and UI view models.

---

## 024. Views are presentational only

**Status:** Accepted

### Context

Feature logic, backend communication, mapping, validation, and generation should not be hidden in Angular components.

### Decision

Angular view components should be presentational.

A view may render state, bind forms, display messages, and emit user intentions.

A view must not own business rules, mapping logic, backend communication, generation logic, or imported JSON validation.

### Alternatives Considered

- Smart components containing feature logic.
- Direct service calls from components.
- Business rules in templates.

### Reason

Presentational views improve testability, encapsulation, and long-term maintainability.

### Consequences

Non-trivial features should have a facade/application/business layer.

---

## 025. Each non-trivial feature has a business/application layer

**Status:** Accepted

### Context

trohi will have workflows such as wizard, preview, import, export, and future integrations.

### Decision

Each non-trivial feature should own its own application/business layer.

This layer coordinates view models, domain models, services, mappers, state, and infrastructure adapters.

### Alternatives Considered

- Put logic directly in components.
- Use one global application service for all behavior.
- Let domain models coordinate UI workflows directly.

### Reason

Feature business layers keep features encapsulated and easier to extend.

### Consequences

Feature internals should not be accessed directly by other features.

---

## 026. Ports and adapters are used at infrastructure boundaries

**Status:** Accepted

### Context

The MVP is browser/local, but future versions may add backend, GitHub, AI, cloud sync, or other integrations.

### Decision

Use a lightweight ports-and-adapters approach at infrastructure boundaries.

A port is a contract for an external capability.

An adapter is a concrete implementation of that contract.

### Alternatives Considered

- Call browser/REST/ZIP libraries directly from business logic.
- Add backend-specific abstractions only when backend exists.
- Put all infrastructure access into Angular components.

### Reason

Ports and adapters keep business logic independent from concrete infrastructure.

### Consequences

Examples include `ZipArchivePort`, `GeneratedFileExportPort`, `ProjectConfigStoragePort`, `FflateZipArchiveAdapter`, and future REST adapters.

---

## 027. Views must not call REST, HttpClient, or backend services directly

**Status:** Accepted

### Context

A future backend should not leak into the UI layer.

### Decision

Direct REST/HTTP access from views is forbidden.

Expected future flow:

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

### Alternatives Considered

- Inject `HttpClient` directly into Angular components.
- Let facades expose backend DTOs to views.
- Use backend response shapes as UI models.

### Reason

This keeps UI independent from backend models and makes future backend evolution safer.

### Consequences

REST/API access must live inside infrastructure adapters or dedicated REST services.

---

## 028. Prefer Angular Signals for local state and RxJS where it is more appropriate

**Status:** Accepted

### Context

Angular 21 supports modern reactive state patterns.

### Decision

Prefer Angular Signals for local reactive UI and feature state where appropriate.

Use RxJS where it is better suited, especially for streams, async workflows, HTTP flows, cancellation, debounce, throttle, and composition.

### Alternatives Considered

- Use RxJS for all state.
- Use Signals for all async workflows.
- Introduce global state management by default.

### Reason

Signals and RxJS should be used pragmatically instead of dogmatically.

### Consequences

No global state management by default. Feature-local store/component store may be introduced only when it simplifies the feature.

---

## 029. Claude Code is the implementation agent

**Status:** Accepted

### Context

The project may use multiple AI agents with distinct responsibilities.

### Decision

Claude Code may be used as the primary implementation agent.

### Consequences

Claude Code may implement, test, commit, and open PRs, but must not merge its own work or bypass checks.

---

## 030. Codex is the review agent

**Status:** Accepted

### Context

AI-assisted development benefits from independent review.

### Decision

Codex may be used as the review agent.

### Consequences

Codex review complements tests and CI. Codex must not merge PRs or replace human judgment.

---

## 031. Human approval is required before merge

**Status:** Accepted

### Context

AI agents can implement and review, but should not own final product, architecture, or merge decisions.

### Decision

A human developer must provide final approval before merging meaningful changes.

### Consequences

The main branch remains under human control.

---

## Decision Review Process

Decisions should be reviewed when:

- the MVP scope changes;
- a temporary MVP constraint becomes limiting;
- a future feature enters active implementation;
- a technical stack decision is made;
- real user feedback contradicts an assumption;
- an AI agent proposes a change that conflicts with this document.

New major decisions should be added here instead of being left only in chat history or commit messages.
