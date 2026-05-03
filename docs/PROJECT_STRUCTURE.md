# Project Structure

## Purpose

This document defines the initial folder and module structure for **trohi**.

The structure must support the layered architecture defined in `docs/ARCHITECTURE.md` and the feature boundaries defined in `docs/FEATURE_ARCHITECTURE.md`.

The goal is to keep the generation core independent from Angular UI, keep views presentational, and make feature business logic easy to encapsulate and test.

## Workspace Shape

The MVP uses a single-app Angular 21 workspace at the repository root.

```text
trohi/                   # repo root, also Angular workspace root
├── angular.json
├── package.json
├── tsconfig.json
├── tsconfig.app.json
├── tsconfig.spec.json
├── eslint.config.js
├── .prettierrc
├── docs/
├── cypress/             # Cypress e2e specs and support
├── public/              # Angular public assets
└── src/
    ├── main.ts
    ├── index.html
    ├── styles.scss
    ├── app/             # Angular app shell only
    ├── features/        # Feature slices (presentation + application)
    ├── domain/          # Framework-independent domain core
    └── infrastructure/  # Adapters for browser APIs, ZIP, storage
```

A separate Angular library project (for example `projects/core/`) is **not** introduced in the MVP.

The same separation is enforced through folder boundaries, lint rules, and review discipline.

This decision is recorded in `docs/DECISIONS.md` and may be revisited if the core needs to be reused outside the Angular app (CLI, backend, etc.).

## Layer Responsibilities

### `src/app/`

Angular application shell only.

May contain:

- root standalone component;
- root routing configuration;
- application-level providers;
- top-level layout components.

Must not contain:

- business rules;
- generation logic;
- mappers;
- DTO validation;
- direct REST/HTTP calls.

### `src/features/<feature-name>/`

Each non-trivial feature owns its own slice.

Recommended sub-structure (apply where useful, not mechanically):

```text
src/features/<feature-name>/
├── presentation/   # Angular components, templates, styles
├── application/    # Feature facade, use-case services
├── mappers/        # Feature-specific mappers
├── state/          # Optional feature-local store/signals
└── tests/          # Co-located unit/integration tests
```

Presentation must remain presentational per `docs/FEATURE_ARCHITECTURE.md`.

### `src/domain/`

Framework-independent domain core.

May contain:

- domain models;
- value objects;
- validation rules;
- config model;
- output file definitions;
- generation engine;
- TypeScript template functions;
- consistency rules;
- generated output models;
- shared mappers between DTOs and domain models.

Must not import from `@angular/*`, `src/app/`, `src/features/`, or `src/infrastructure/`.

Must be testable with Vitest without rendering Angular components.

### `src/infrastructure/`

Adapters for environment-specific capabilities.

May contain:

- ports (TypeScript interfaces);
- browser file download adapter;
- local storage adapter;
- file import adapter;
- fflate ZIP adapter.

Must not own product decisions or expose DTOs to the UI.

## Test Co-Location

Vitest unit and integration tests live next to the code they cover, using `*.spec.ts` filenames.

Snapshot tests for generated Markdown live next to the generation engine and template functions in `src/domain/`.

Cypress e2e specs live in `cypress/e2e/`.

## Naming

- Files use `kebab-case.ts`.
- Classes use `PascalCase`.
- Interfaces/types use `PascalCase`.
- Folder names use `kebab-case`.
- DTOs are suffixed with `Dto`.
- Mappers are suffixed with `Mapper`.
- Ports are suffixed with `Port`.
- Adapters are suffixed with `Adapter`.

Final naming follows the project lint configuration where it conflicts.

## Dependency Direction

Allowed direction:

```text
app          -> features, infrastructure, domain
features     -> domain, infrastructure
infrastructure -> domain
domain       -> (nothing inside src/)
```

Forbidden direction:

- `domain` importing from `app`, `features`, or `infrastructure`;
- `infrastructure` importing from `app` or `features`;
- `features` reaching into another feature's private internals.

The MVP enforces this by review and folder discipline. Lint-based boundary enforcement (for example `eslint-plugin-boundaries` or path-based ESLint rules) may be added later.

## What This Document Does Not Decide

- Exact feature names — added when features are implemented.
- Exact port names — finalized when adapters are introduced.
- Lint-based boundary enforcement tool — deferred until a real boundary violation appears.

## Revisit Conditions

Revisit this structure when:

- the generation core needs to be reused outside the Angular app;
- a feature grows large enough to justify its own Angular library;
- boundary violations become recurrent and need lint enforcement;
- the MVP scope changes meaningfully.
