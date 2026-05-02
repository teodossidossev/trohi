# Tech Stack

## Purpose

This document defines the initial technology stack direction for **trohi**.

The stack should support a browser-based MVP, long-term maintainability, strict TypeScript, TDD, Cypress end-to-end tests, local import/export, deterministic generation, and future expansion without requiring a backend in the MVP.

## Current Stack Decision

The initial MVP stack is:

```text
Angular 21
Node.js 22
TypeScript
npm
Vitest
Cypress
```

React is explicitly not selected for this project.

StencilJS is not selected as the main application framework for the MVP, but it remains a possible future option for a framework-agnostic component library, design system, or embeddable widgets.

Jest is not selected because Angular 21 uses Vitest as the default testing setup for new Angular projects.

SonarQube or SonarCloud is not required in the first implementation, but the codebase should follow SonarQube-style quality rules and remain compatible with future Sonar integration.

The project owner already has hosting, so hosting provider selection is not part of the open technical decisions.

## Why Angular

Angular is better suited for the main trohi application because the product is expected to grow into a structured, workflow-heavy app.

The MVP needs:

- guided wizard flows;
- forms;
- validation;
- routing;
- preview screens;
- import/export workflows;
- stateful project configuration;
- testable application architecture;
- long-term maintainability;
- clear conventions.

Angular provides a full application framework and encourages convention, structure, dependency injection, and separation of responsibilities.

This aligns well with the project principles:

- Convention over Configuration;
- SOLID;
- DRY;
- KISS;
- TDD;
- long-term maintainability.

## Why Not React

React is not selected.

This project should not use React for the main app, examples, generated UI, or internal implementation unless this decision is explicitly revisited and superseded.

Reasons:

- the project owner does not want React;
- the app is expected to evolve over time and benefits from stronger framework conventions;
- the project values structured architecture over loosely assembled UI patterns;
- Angular better matches the desired convention-heavy application model.

## Angular vs StencilJS

## Angular as Main App Framework

Angular should be used for the main application shell, wizard, preview, configuration editing, import/export flows, and routing.

Angular is the default choice for:

- app shell;
- page-level flows;
- forms;
- validation UI;
- state orchestration;
- routing;
- dependency injection;
- testable services;
- browser application structure.

## StencilJS as Future Component Option

StencilJS should not be used as the main app framework for the MVP.

StencilJS may be considered later for:

- reusable framework-agnostic components;
- embeddable widgets;
- a standalone design system;
- components that should be consumed outside Angular;
- public UI components if trohi later exposes them for third-party use.

## Decision

Use Angular for the MVP application.

Do not start with StencilJS as the app framework.

Revisit StencilJS only if the product develops a real need for framework-agnostic Web Components.

## Language and Runtime

Use TypeScript.

Use Node.js 22 for local development and CI.

Angular 21 requires a compatible Node.js 22 version. Use a Node.js 22 version that satisfies Angular 21 requirements.

TypeScript should be configured strictly.

Expected direction:

- strict type checking;
- explicit domain types;
- no unnecessary `any`;
- validation for imported JSON;
- typed config model;
- typed output file definitions;
- typed generator contracts.

Unknown or undecided project decisions should be modeled intentionally, not hidden behind loose types.

## Package Manager

Use npm.

npm should be the default package manager for:

- installing dependencies;
- running scripts;
- CI commands;
- local development commands.

Do not introduce pnpm or Yarn unless this decision is explicitly revisited.

## Application Type

The MVP is a browser application.

The application has no backend in the MVP.

The application should support:

- local project configuration;
- generated preview;
- local file export;
- config import/export;
- ZIP export;
- no required network calls.

## Build Tooling

Use Angular CLI as the default project tooling unless a strong reason appears to do otherwise.

Angular CLI should own:

- workspace creation;
- development server;
- production build;
- application configuration;
- standard Angular project commands.

## UI Structure

The app should be organized around Angular application concepts.

Expected UI areas:

- app shell;
- project creation flow;
- wizard pages;
- config editing views;
- output target selection;
- generated file preview;
- export/import screens;
- validation and warning views.

The exact component structure will be defined in `PROJECT_STRUCTURE.md`.

## State Management

Start simple.

Do not introduce heavy state management in the MVP unless the app complexity requires it.

Preferred initial approach:

- Angular services for application state;
- typed domain models;
- explicit update methods;
- computed view models where useful.

Avoid global state complexity before it is needed.

State management should support:

- current project config;
- wizard progress;
- validation results;
- generated preview;
- output selection;
- import/export state.

## Forms

Angular forms should be used for wizard input.

The final choice between reactive forms and other Angular form patterns should be made during implementation planning.

Given the need for structured validation and dynamic wizard sections, reactive forms are likely the better default.

## Validation

Validation exists at two levels:

1. UI input validation;
2. domain/config validation.

UI validation should help users complete the wizard.

Domain/config validation should protect generation and import/export behavior.

The domain validation layer must not live only inside Angular form components.

Imported JSON must be validated before use.

## Schema Validation Library

A schema validation library defines and validates the shape of runtime data.

In trohi, this is needed because `trohi.config.json` is imported from a file and must not be trusted blindly.

TypeScript types only help at compile time. They do not validate unknown JSON at runtime.

The preferred schema validation library is:

```text
Zod
```

Use Zod or an equivalent TypeScript-first validation library to validate:

- imported config files;
- config version metadata;
- output target selections;
- file path definitions;
- template inputs where useful.

Validation should return clear, actionable errors.

Do not silently coerce invalid imported data into a valid config.

## Template Rendering

Template rendering is the mechanism that turns structured config into generated text files.

For trohi, template rendering means:

```text
project config + template logic = Markdown file content
```

The generation engine needs a deterministic template rendering approach.

The template system should support:

- conditional sections;
- repeated sections;
- shared helpers;
- stable output;
- snapshot testing.

The preferred MVP approach is:

```text
TypeScript template functions
```

This means generated files are produced by typed TypeScript functions instead of introducing a separate template language too early.

Reasons:

- stronger type safety;
- easier TDD;
- easier snapshot testing;
- no extra template dependency in the MVP;
- simpler refactoring;
- easier consistency checks.

A dedicated template engine may be considered later if trohi needs user-authored templates, a template marketplace, or complex custom template editing.

Do not introduce a complex custom template system in the MVP.

## Markdown Preview

Markdown preview is how the user sees generated `.md` files before export.

For the MVP, the preferred approach is:

```text
safe plain-text Markdown preview first
```

This means the user sees the generated Markdown source clearly, without rich rendering or unsafe HTML handling.

Reasons:

- safer by default;
- simpler to implement;
- easier to test;
- enough for developers who understand Markdown;
- avoids sanitization complexity in the MVP.

If rich Markdown preview becomes necessary later, consider:

```text
markdown-it
```

Rich preview must sanitize or avoid unsafe HTML execution.

Do not render untrusted Markdown as executable HTML.

## ZIP Export Library

The MVP needs export support for:

- ZIP archive generation;
- individual file download or copy;
- `trohi.config.json` download;
- config import.

The selected ZIP library should have a permissive license such as MIT, Apache-2.0, BSD, or a similar license.

Preferred ZIP library:

```text
fflate
```

Reasons:

- MIT license;
- browser and Node.js support;
- ZIP creation support;
- small and focused;
- avoids ambiguity from dual MIT/GPL package metadata.

Browser-native Blob and URL APIs should be used for downloads where practical.

JSZip is a possible alternative, but fflate is preferred because its package license is MIT-only.

## Testing Stack

The project uses TDD as the preferred workflow.

Testing should include:

- unit tests;
- integration tests;
- snapshot tests for generated files;
- Cypress end-to-end tests.

Use Vitest for unit, integration, and snapshot tests.

This follows Angular 21's default testing direction and avoids maintaining a non-default Jest setup without a strong reason.

## Unit and Integration Testing

Use Vitest for unit and integration tests.

Angular 21 uses Vitest as the default unit test runner for new Angular CLI projects.

Requirements:

- works with Angular 21 and TypeScript;
- supports fast TDD feedback;
- supports core logic tests without browser rendering;
- supports snapshot testing for generated files;
- works in GitHub CI;
- does not force core domain logic to depend on Angular components.

The project should keep core generation, validation, and template logic easy to test with Vitest without rendering Angular UI.

Vitest should cover:

- config model tests;
- validation rule tests;
- template function tests;
- generation engine tests;
- import/export logic tests;
- snapshot tests for generated Markdown.

## Cypress

Use Cypress for end-to-end tests.

Cypress should cover critical browser workflows:

- create project profile;
- complete primary wizard path;
- select agent targets;
- preview generated files;
- export files;
- import config if supported in UI;
- regenerate output from imported config.

Cypress should not replace unit and integration tests.

## Linting and Formatting

Use strict linting and formatting.

Preferred direction:

- Google TypeScript Style (`gts`) or an equivalent strict TypeScript style setup;
- Angular-compatible linting;
- automated formatting;
- no ignored lint rules without documented reason.

The exact configuration must work cleanly with Angular.

If `gts` conflicts with Angular conventions or tooling, choose an Angular-compatible strict alternative and document the decision.

## Static Analysis

Follow SonarQube-style quality rules from the beginning.

Static analysis must run:

- locally before commit;
- in GitHub CI before merge.

Full SonarQube or SonarCloud integration is deferred.

The first implementation should use linting, TypeScript strict checks, complexity rules where practical, and CI quality gates.

SonarQube or SonarCloud may be added later after the MVP foundation is stable.

## CI/CD

Use GitHub Actions for CI.

The initial CI should run:

- install dependencies with npm;
- formatting check;
- linting;
- static analysis where configured;
- type checking;
- unit tests;
- integration tests;
- snapshot tests;
- build;
- Cypress tests when configured.

Deployment automation is not the first priority.

## Deployment Target

The MVP can be deployed as a static browser application.

The project owner already has hosting, so hosting provider selection is not an open technology decision.

No backend deployment is required for the MVP.

## Dependency Rules

Before adding a dependency, verify:

- it is necessary;
- it is maintained;
- it works with Angular and TypeScript;
- it does not introduce hidden network behavior;
- it does not weaken local-first privacy;
- it can be tested;
- it does not overcomplicate the MVP.

## Initial Technical Decisions

Accepted initial decisions:

```text
Main framework: Angular 21
Runtime: Node.js 22
Language: TypeScript
Package manager: npm
Unit/integration testing: Vitest
Snapshot testing: Vitest snapshots
E2E testing: Cypress
Schema validation: Zod or equivalent TypeScript-first runtime validation
Template rendering: TypeScript template functions for MVP
Markdown preview: safe plain-text Markdown preview for MVP
Future rich Markdown preview candidate: markdown-it
ZIP export: fflate
Linting: Google TypeScript Style or Angular-compatible strict equivalent
Static analysis: SonarQube-style rules now, full Sonar integration later
Architecture: browser MVP with UI-independent generation core
Backend: none for MVP
AI dependency: none required for now
Hosting: already available
```

Decisions still open:

```text
exact Angular 21 minor/patch version
exact Node.js 22 minimum version for project engines
exact Vitest configuration mode
exact linting setup details
exact static analysis command set before full Sonar integration
UI component approach
styling approach
```

## Revisit Conditions

Revisit this stack decision only if:

- Angular blocks the core product workflow;
- StencilJS becomes necessary for framework-agnostic component distribution;
- the product requires embeddable widgets;
- Angular-compatible strict linting becomes impractical;
- implementation proves that the chosen stack adds unacceptable complexity.

Do not revisit the React decision casually.

## Success Criteria

The tech stack is successful if:

1. it supports the browser MVP without backend infrastructure;
2. it supports strict TypeScript;
3. it supports TDD and fast core logic tests;
4. it supports Cypress for critical UI flows;
5. it keeps the generation core testable outside Angular components;
6. it supports static analysis before commit and in GitHub CI;
7. it remains maintainable as the app grows;
8. it does not block future backend, CLI, AI, repository integration, or component-library directions.

