# Testing Strategy

## Purpose

This document defines the testing strategy for **trohi**.

trohi must be tested as both:

1. an Angular browser application;
2. a deterministic generation system.

Generated output quality is core product behavior.

## Core Testing Principle

Use **TDD** as the preferred development workflow.

Expected cycle:

```text
write failing test
-> implement the smallest useful change
-> make the test pass
-> refactor safely
```

TDD should guide core logic, validation, generation, mappers, models, import/export behavior, and important feature workflows.

## Testing Stack

The testing stack is:

```text
Vitest
Cypress
Angular 21 testing utilities where appropriate
```

Use Vitest for:

- unit tests;
- integration tests;
- domain model tests;
- mapper tests;
- validation tests;
- generation engine tests;
- snapshot tests for generated Markdown.

Use Cypress for critical browser end-to-end flows.

## Testing Goals

The test suite should ensure that:

- domain models protect invariants;
- DTOs and imported JSON are validated before use;
- mappers behave correctly;
- UI view models are mapped correctly;
- validation catches missing or conflicting decisions;
- generated files are deterministic;
- templates render correct content;
- output files do not contradict each other;
- export produces the expected file structure;
- import restores a usable project configuration;
- the wizard flow works for the primary MVP use case;
- regressions in generated Markdown are visible during development.

## Testing Pyramid

Recommended balance:

```text
Many Vitest unit tests
Some Vitest integration tests
Vitest snapshot tests for generated Markdown
Focused Cypress end-to-end tests
Manual exploratory checks before releases
```

## Vitest Unit Tests

### Purpose

Unit tests verify small pieces of logic in isolation.

### Should Cover

- domain models;
- value objects;
- UI view models;
- DTO validation;
- mapper behavior;
- config transformations;
- validation rules;
- consistency checks;
- output file selection;
- template functions;
- generation helpers;
- preset application;
- missing information handling;
- deterministic generation helpers.

### Expectations

Core logic should be designed so it can be tested without rendering Angular components.

Unit tests should be fast, focused, and easy to understand.

## Vitest Integration Tests

### Purpose

Integration tests verify that several modules work together correctly.

### Should Cover

- imported config DTO -> validation -> mapper -> domain model;
- domain model -> generation engine -> generated files;
- preset -> config model -> generated output;
- agent target selection -> output file list;
- import config -> validate -> generate;
- domain model -> UI view model mapping;
- feature business layer behavior without rendering views.

### Expectations

Integration tests should focus on product behavior rather than implementation details.

## Snapshot Tests

### Purpose

Snapshot tests make generated file changes visible.

Generated Markdown is product behavior, so accidental changes must be easy to detect.

### Should Cover

- required human documentation files;
- required `AGENTS.md` output;
- optional agent files when selected;
- representative full project output packages;
- missing or undecided values;
- generated output ordering;
- generated file paths.

### Rules

Snapshots should not be updated automatically without review.

When a snapshot changes, verify:

- which file changed;
- why it changed;
- whether the change is intentional;
- whether human docs and agent files remain consistent.

## Cypress End-to-End Tests

### Purpose

Cypress tests verify the product from the user's point of view.

### MVP Cypress Coverage

The MVP should include Cypress tests for:

1. creating a new project profile;
2. completing the primary wizard path;
3. selecting agent targets;
4. previewing generated files;
5. excluding optional files from export;
6. exporting generated output;
7. importing a previously exported configuration if supported in the UI;
8. regenerating output from imported config.

### Cypress Style

Cypress tests should be:

- focused on critical user flows;
- stable;
- readable;
- not overly dependent on visual layout;
- not used for every small UI state.

## Angular Component Testing

Angular components should be thin and presentational.

Component tests should verify rendering and interaction, not business rules.

Business logic should be tested in feature application/business layer tests.

Components should not need complex tests if logic is properly moved out of the view layer.

## Feature Business Layer Tests

Each non-trivial feature should have tests for its business/application layer.

Should cover:

- user action handling;
- state transitions;
- view model generation;
- validation result handling;
- mapper usage;
- orchestration of domain and infrastructure services;
- error states.

## Mapper Tests

Mappers are critical boundaries and must be tested.

Mapper tests should cover:

- valid DTO -> domain model;
- domain model -> DTO;
- domain model -> UI view model;
- UI form/input model -> domain update;
- missing optional values;
- invalid values rejected before mapping;
- unknown or undecided values;
- round-trip behavior where applicable.

## Domain Model Tests

Domain models and value objects should be tested for invariants and behavior.

Should cover:

- invalid states rejected;
- meaningful methods;
- equality/value behavior where relevant;
- safe file paths;
- config version handling;
- output target rules;
- validation result aggregation.

## Import and Export Tests

Import/export behavior must be test-driven.

Should verify:

- imported JSON is parsed and validated;
- invalid JSON fails clearly;
- unsupported config versions fail clearly;
- DTOs are mapped into domain models;
- config export uses the expected DTO shape;
- generated files are exported with safe paths;
- ZIP export receives generated file models, not UI state.

## TDD Expectations by Area

### Config and Domain Models

Use TDD for config defaults, model behavior, invariants, and transformations.

### Validation

Every important validation rule should have tests for:

- valid config;
- invalid config;
- missing data;
- conflicting data;
- undecided data when allowed.

### Generation Engine

Before changing generated behavior, add or update tests describing the expected output.

### Templates

Template functions should be covered with snapshot or integration tests.

Conditional sections must be tested explicitly.

### Feature Architecture

When adding feature behavior:

1. write tests for feature business behavior;
2. implement the feature layer logic;
3. map to UI view models;
4. connect the view;
5. add Cypress coverage for important user flows.

Do not start by putting business behavior directly into Angular components.

## Static Analysis and Quality Gates

Before commit, run relevant local checks.

Static analysis must run before commit and again in GitHub CI.

Before a change is considered ready, the following should pass:

- formatting;
- linting;
- static analysis command set where configured;
- type checking;
- Vitest unit tests;
- Vitest integration tests;
- Vitest snapshot tests;
- Angular build;
- Cypress tests for affected flows when configured.

## Test Data Strategy

Maintain representative test fixtures for common configurations:

- minimal valid project;
- browser-only project;
- strict TDD project;
- Angular 21 project;
- project with Cursor selected;
- project with Claude selected;
- project with GitHub Copilot selected;
- project with missing optional technology choices;
- project with conflicting decisions;
- invalid imported config DTO;
- valid config DTO round-trip case.

Fixtures should not become a substitute for explicit model tests.

## Generated Output Regression Strategy

Any change to generated output should be treated as a product change.

When generated output changes, review:

- whether the change is intentional;
- which templates changed;
- whether agent files still match human docs;
- whether snapshots should be updated;
- whether documentation needs to mention the change.

## CI Expectations

GitHub CI should eventually run:

- npm install;
- formatting check;
- linting;
- static analysis command set where configured;
- type checking;
- Vitest unit/integration/snapshot tests;
- Angular build;
- Cypress tests when practical.

For early MVP development, Cypress may be added to CI once the UI stabilizes.

## AI Agent Testing Rules

AI coding agents must:

- prefer TDD for core logic and important behavior;
- add or update tests when changing behavior;
- test mappers, models, validation, and generation logic;
- update snapshots only after reviewing generated output;
- avoid weakening tests to make implementation easier;
- explain testing impact when making changes;
- not skip tests without a clear reason.

## Non-Goals

The testing strategy does not require:

- 100% code coverage;
- Cypress tests for every UI component;
- strict TDD for throwaway experiments;
- visual regression testing in the MVP;
- full browser matrix testing in the first version;
- production-grade CI parallelization in the MVP.

## Success Criteria

The testing strategy is successful if:

1. core generation behavior can be changed safely;
2. generated Markdown regressions are visible;
3. validation rules are covered;
4. domain models and mappers are tested;
5. Cypress protects the primary user flow;
6. import/export behavior is reliable;
7. tests support implementation instead of slowing it unnecessarily;
8. AI agents consistently preserve or improve test coverage.
