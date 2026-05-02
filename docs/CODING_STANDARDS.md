# Coding Standards

## Purpose

This document defines the coding standards for **trohi**.

The goal is to keep the codebase readable, maintainable, testable, and safe to evolve with both human and AI-assisted development.

## Tech Context

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

StencilJS is a future component-library option only, not the MVP application framework.

## Core Engineering Principles

- SOLID;
- DRY;
- KISS;
- YAGNI;
- Convention over Configuration;
- Composition over Inheritance;
- Law of Demeter.

## Object-Oriented Design

Use object-oriented design where it improves clarity, encapsulation, validation, and maintainability.

Good candidates for explicit models/classes:

- domain models;
- value objects;
- generated output models;
- validation results;
- mappers;
- application services;
- infrastructure adapters;
- generator services.

Avoid using classes as ceremony.

Do not create deep inheritance trees or abstract frameworks without real need.

Prefer composition over inheritance.

## Avoid Raw JSON Inside the App

Plain JSON may exist only at external boundaries:

- imported `trohi.config.json`;
- exported `trohi.config.json`;
- future backend DTOs;
- browser storage serialization;
- test fixtures where appropriate.

External data flow:

```text
External DTO / JSON
-> validation
-> mapper
-> domain/application model
-> UI view model
-> view
```

Export/backend flow:

```text
domain/application model
-> mapper
-> DTO
-> external boundary
```

## UI and Feature Rules

Angular views must remain presentational.

Views may render state, bind forms, display validation messages, emit user intentions, and call facade/application methods.

Views must not contain business logic, generate Markdown, validate imported JSON, perform DTO mapping, call backend APIs, inject/call `HttpClient`, call REST services directly, know persistence details, or know raw config JSON shapes.

Each non-trivial feature should have a business/application layer.

## Mappers

Mappers must be explicit and tested.

Use mappers between DTOs/domain models, domain models/DTOs, domain models/UI view models, UI input models/domain updates, and generated output models/export DTOs.

Do not hide mapping logic inside Angular components.

Do not silently ignore invalid data.

## Ports and Adapters

Use a lightweight ports-and-adapters approach at infrastructure boundaries.

A port is a contract for an external capability.

An adapter is a concrete implementation of that contract.

Business logic should depend on contracts, not concrete infrastructure details.

## Angular Signals and RxJS

Prefer Angular Signals for local reactive UI and feature state when they make state easier to understand.

Use RxJS where it is more appropriate, especially for async streams, event streams, future HTTP flows in infrastructure adapters, cancellation, debounce/throttle, and composition of async workflows.

Do not introduce global state management by default.

Use feature-local/component store only when it improves encapsulation, testability, state transitions, or UI simplicity.

## Comments Policy

Code comments are required for every class and every public method.

Comments must be written in English.

Every class should have a comment explaining what the class represents, its responsibility, and important usage notes.

Every public method should have a comment explaining what it does, important parameters, return value, side effects, and error behavior when relevant.

Avoid comments that repeat obvious implementation details.

## Naming Conventions

Names should be clear, specific, and consistent.

Use domain language consistently.

Avoid vague names such as `data`, `item`, `thing`, `manager`, `helper`, `utils`, or `misc` unless the context makes them precise.

## Error Handling

Errors should be explicit and actionable.

Validation, import, generation, and export errors should explain the problem and where possible how to fix it.

Avoid silent fallbacks, swallowed errors, and generic messages.

## Dependency Rules

Prefer small, stable, maintained dependencies with permissive licenses such as MIT, Apache-2.0, BSD, or similar.

Current preferred dependencies:

- Zod for runtime validation;
- fflate for ZIP export;
- Vitest for unit/integration/snapshot tests;
- Cypress for E2E tests.

## Linting and Formatting

Use strict linting and formatting.

Preferred direction:

- Google TypeScript Style or Angular-compatible strict equivalent;
- formatting enforced automatically;
- linting enforced locally and in CI;
- no ignored lint rules without documented reason.

If Google TypeScript Style conflicts with Angular conventions, choose a strict Angular-compatible equivalent and document the decision.

## Static Analysis

Follow SonarQube-style quality rules.

Static analysis must run locally before commit and in GitHub CI before merge.

Full SonarQube or SonarCloud integration is deferred until later.

Avoid duplicated logic, overly complex functions, dead code, unreachable branches, unused variables, unsafe patterns, unclear control flow, and excessive cognitive complexity.

## Type Safety

Use strict TypeScript.

Avoid unnecessary `any`, loose type assertions, and accepting external data without validation.

Model unknown or undecided values intentionally.

## Testing Expectations

Use TDD for core logic and important behavior.

Use Vitest for domain model tests, mapper tests, validation tests, generation tests, and snapshot tests.

Use Cypress for critical user flows.

Update snapshots only after reviewing generated output.

## AI Agent Coding Rules

AI agents working on this project must:

- follow architecture boundaries;
- keep views presentational;
- avoid raw JSON leakage into UI;
- use explicit domain models and UI view models;
- use mappers between DTOs, domain models, and view models;
- never call REST/HttpClient directly from views;
- preserve deterministic generation;
- write or update tests before changing core behavior when practical;
- avoid adding future features outside MVP scope;
- add required English comments for every class and public method;
- follow linting and static analysis rules;
- not introduce dependencies without justification.

## Review Checklist

Before code is considered ready, verify:

- SOLID, DRY, KISS, YAGNI, CoC, Composition over Inheritance, and LoD are respected;
- public classes and public methods have useful English comments;
- views remain presentational;
- raw JSON and DTOs do not leak into UI;
- mappers are explicit and tested;
- no direct REST/HttpClient calls from views exist;
- tests were added or updated where behavior changed;
- generated output changes were reviewed;
- linting passes;
- type checking passes;
- static analysis concerns were considered;
- MVP scope was not expanded unintentionally.

## Success Criteria

These coding standards are successful if:

1. code remains readable and maintainable;
2. domain models protect important invariants;
3. UI remains independent from external models and business logic;
4. mappers and adapters protect boundaries;
5. generated output behavior remains safe to change;
6. static analysis issues are minimized;
7. the MVP stays simple without blocking future expansion;
8. comments improve understanding of public APIs instead of adding noise.
