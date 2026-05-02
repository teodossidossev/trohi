# Config Model

## Purpose

This document defines the conceptual configuration model for **trohi**.

The config model is the structured source of truth used to generate human project documentation and AI agent instruction files.

This document is intentionally conceptual. It does not define the final TypeScript classes, Zod schemas, JSON DTO shape, or storage format yet.

## Core Principle

> Structured configuration is the source of truth. Generated files are output artifacts.

The user should be able to create or import a project configuration, validate and map it into internal models, generate documentation and agent files from it, change it, regenerate output, and reuse it over time.

## Important Modeling Rule

`trohi.config.json` is an external serialized representation.

It is not the in-memory domain model.

Expected MVP import flow:

```text
trohi.config.json
-> parse JSON
-> validate DTO with Zod or equivalent
-> map DTO to domain config model
-> use domain model internally
```

Expected export flow:

```text
domain config model
-> map to config DTO
-> validate serializable shape
-> export trohi.config.json
```

Do not pass raw JSON objects through the application.

Do not bind UI directly to config DTOs.

## Model Goals

The config model should support:

- new software project without existing documentation;
- guided wizard experience;
- deterministic file generation;
- preview before export;
- selective output generation;
- import/export as JSON;
- domain models with meaningful behavior;
- UI view models;
- explicit mappers;
- future extension without major restructuring.

## Model Non-Goals for MVP

The MVP config model should not support:

- parsing existing documentation;
- repository analysis;
- team permissions;
- cloud synchronization;
- user accounts;
- billing;
- organization-level policy enforcement;
- non-dev domain presets;
- AI-generated inference as a required workflow;
- Cursor/Copilot bootstrap requirements for this repository.

## Top-Level Conceptual Sections

```text
metadata
project
product
mvp
architecture
domainModeling
featureArchitecture
technology
codingStandards
testing
gitWorkflow
ciCd
agents
outputs
templates
```

Each section should represent user decisions, not generated prose.

## Model Types

The config system should distinguish between:

```text
Config DTO
Domain config model
Application model
UI view model
Generated output model
```

### Config DTO

Represents serialized JSON import/export.

It should be simple, validated, and mapped before use.

### Domain Config Model

Represents validated internal project configuration.

It may contain behavior, methods, and value objects that protect invariants.

### UI View Model

Represents what the UI needs to display or edit.

The UI view model should not expose raw JSON or future backend DTOs.

### Generated Output Model

Represents generated files and output packages before export.

It should use explicit concepts such as generated file path, content, category, and target.

## Important Sections

## `metadata`

Stores config version, schema/DTO version, template version, created/updated dates, and generator version.

The config should be versioned from the beginning.

## `project`

Stores project identity and classification: name, description, type, status, repository name if known, primary language if known, and license preference if selected.

## `product`

Stores problem statement, target users, pain points, product goal, value proposition, principles, success criteria, and future direction.

## `mvp`

Stores primary use case, included features, excluded features, non-goals, future candidates, success criteria, and explicit constraints.

## `architecture`

Stores application type, architectural style, major modules, source-of-truth model, data flow, persistence model, integration boundaries, offline requirements, and future architecture considerations.

## `domainModeling`

Stores decisions about internal models, DTOs, mappers, and view models.

Example decisions:

- use explicit domain models;
- raw JSON only at boundaries;
- DTO validation before mapping;
- use UI view models;
- use value objects where useful;
- use mappers between boundaries;
- no backend DTO leakage into UI.

## `featureArchitecture`

Stores decisions about feature-level structure.

Example decisions:

- views are presentational;
- feature business/application layer owns logic;
- mappers are explicit;
- services/adapters handle external communication;
- no direct `HttpClient` from views;
- Signals preferred for local state;
- RxJS allowed where appropriate;
- component store only when needed.

## `technology`

Current trohi decisions:

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

Explicit decisions:

```text
React = rejected
StencilJS = future component-library option, not MVP app shell
Jest = not selected; Vitest is selected
```

## `testing`

Current trohi decisions:

- TDD preferred workflow;
- Vitest for unit/integration/snapshot tests;
- Cypress for E2E;
- model tests;
- mapper tests;
- generated Markdown snapshot tests;
- import/export tests.

## `agents`

### Initial Bootstrap Targets for This Repository

```text
CLAUDE.md
AGENTS.md
.claude/skills/*
.github/pull_request_template.md
```

### Deferred Product Targets

```text
.cursor/rules/*.mdc
.github/copilot-instructions.md
```

Agent files must be projections of the same configuration used for human documentation.

Cursor and GitHub Copilot remain future product output targets, but they are not required for trohi's own initial development workflow.

## `outputs`

Stores required files, optional files, output paths, include/exclude decisions, export options, and file category metadata.

## `templates`

Stores template set name, template version, selected preset, strictness level, output style preference, and future custom template references.

MVP rule: use TypeScript template functions.

Do not introduce a custom template marketplace or external template engine before there is a real need.

## Presets

The config model should support presets conceptually.

Examples:

- strict TypeScript project;
- Angular browser app;
- browser-only MVP;
- TDD + Vitest;
- Claude + Codex workflow;
- solo developer Git workflow.

## Unknown and Undecided Values

The model should allow values to be explicitly unknown or undecided.

The generated output should not convert undecided values into false certainty.

## Consistency Requirements

Examples:

- if the project has no backend in the MVP, generated files should not instruct agents to create backend services;
- if Vitest is selected, generated testing docs should not require Jest;
- if Cursor is not selected for repo bootstrap, Cursor files should not be required;
- if UI must be presentational, generated agent files must not place business logic in Angular components;
- if no direct REST from views is allowed, generated docs must preserve that boundary.

## Deterministic Generation

The same config and template version should produce the same output.

This supports Vitest snapshot tests, predictable regeneration, easier debugging, user trust, and future diffing.

## Data That Must Not Be Stored

The MVP config should not store API keys, access tokens, credentials, private secrets, billing data, user account data, unnecessary browser UI state, or generated Markdown as primary source of truth.

## MVP Success Criteria

The config model is successful if:

1. it can represent the first use case clearly;
2. it can generate the required MVP output files;
3. it avoids false certainty for undecided decisions;
4. imported JSON is validated before use;
5. DTOs are mapped into domain models;
6. UI consumes view models, not raw config JSON;
7. generation is deterministic;
8. human docs and agent files remain consistent;
9. it can evolve later without being rewritten from scratch.
