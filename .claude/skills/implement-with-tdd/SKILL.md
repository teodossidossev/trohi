---
name: implement-with-tdd
description: Use this skill when implementing a trohi feature, fixing a bug, changing generation behavior, adding validation, updating mappers, or modifying core domain logic. Follow TDD, keep views presentational, and preserve architecture boundaries.
---

# Implement With TDD

## Goal

Implement a focused change in **trohi** using TDD while respecting the project's architecture, domain modeling, and feature boundaries.

## Before You Start

Read the relevant project documents before implementation:

- `docs/MVP_SCOPE.md`
- `docs/ARCHITECTURE.md`
- `docs/DOMAIN_MODELING.md`
- `docs/FEATURE_ARCHITECTURE.md`
- `docs/TESTING_STRATEGY.md`
- `docs/CODING_STANDARDS.md`
- `docs/TECH_STACK.md`
- `docs/PROJECT_STRUCTURE.md`
- `docs/DECISIONS.md`
- `CLAUDE.md`
- `AGENTS.md`

If the requested change conflicts with the docs, stop and explain the conflict.

## Scope Check

Before writing code, identify:

- the exact behavior to change;
- whether the change is inside MVP scope;
- which feature or domain area owns the behavior;
- whether generated output changes;
- which tests should be added or updated.

Do not add backend, accounts, cloud sync, repo analysis, required AI generation, direct GitHub writes, team features, or non-dev presets unless explicitly instructed.

## Architecture Rules

Keep this dependency direction:

```text
view
-> feature facade / business layer
-> feature service / application service
-> mapper
-> domain / infrastructure
```

For future backend communication:

```text
view
-> feature business/application layer
-> service
-> mapper
-> REST/API service or infrastructure adapter
-> backend
```

Never put business logic in Angular views.

Never call `HttpClient` or REST services directly from components.

Never expose DTOs, raw JSON, or persistence shapes to the UI.

## Modeling Rules

Do not pass raw JSON through the app.

Use explicit models:

- DTOs at boundaries;
- domain models;
- value objects;
- application models;
- UI view models;
- generated output models.

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

Prefer OOP where it protects invariants, clarity, and encapsulation.

Avoid anemic models when behavior belongs with the model.

Avoid deep inheritance and unnecessary abstractions.

## TDD Workflow

Use this cycle:

```text
write failing test
-> implement the smallest useful change
-> make the test pass
-> refactor safely
```

Use Vitest for:

- domain model tests;
- mapper tests;
- validation tests;
- generation engine tests;
- template function tests;
- snapshot tests for generated Markdown.

Use Cypress only for critical browser flows.

## Implementation Steps

1. Identify the owning layer and feature.
2. Add or update the smallest meaningful failing test.
3. Implement the minimal code to pass the test.
4. Refactor without changing behavior.
5. Add mapper/model tests if data crosses boundaries.
6. Add snapshot tests if generated output changes.
7. Add Cypress coverage only when the user-facing flow changes.
8. Run relevant local checks before commit.

## Generated Output Changes

If generated Markdown changes:

- update generation tests;
- update snapshots only after reviewing the output;
- explain which files changed and why;
- verify human docs and agent instructions remain consistent.

Generated output is product behavior.

## Local Checks Before Commit

Before committing, run relevant checks when available:

- formatting;
- linting;
- static analysis command set;
- type checking;
- Vitest tests;
- snapshot tests;
- affected Cypress tests.

Do not commit known failing checks.

## Done Criteria

The change is done when:

- tests describe the behavior;
- implementation is minimal and in the correct layer;
- views remain presentational;
- mappers protect boundaries;
- no raw JSON leaks into UI;
- generated output changes are reviewed;
- local checks pass or any skipped check is clearly explained.
