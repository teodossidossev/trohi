# Feature Architecture

## Purpose

This document defines how features should be structured in **trohi**.

The goal is to keep the view layer clean and presentational, isolate business logic inside feature-level business layers, and make the application easy to extend, test, and encapsulate over time.

## Core Principle

The view layer must be independent from business logic.

A view should render state, bind user input, and emit user intentions.

A view should not own business rules, mapping logic, backend communication, generation logic, validation rules, or cross-feature coordination.

## Feature Boundary Principle

Each non-trivial feature should own its own business/application layer.

A feature may contain:

- presentational view components;
- feature facade or controller service;
- feature-specific business logic;
- feature state/store when needed;
- feature-specific mappers;
- feature-specific services;
- feature-specific tests.

Feature internals should be encapsulated.

Other features should not reach into private implementation details.

## Recommended Feature Structure

```text
src/features/<feature-name>/
  presentation/
  application/
  domain/
  infrastructure/
  state/
  mappers/
  tests/
```

This structure is conceptual. It should be applied where useful, not mechanically for every small feature.

## Presentation Layer

### May Do

- render data;
- bind forms;
- display validation messages;
- emit user actions;
- call feature facade methods;
- display loading, error, and success states.

### Must Not Do

- contain business rules;
- generate Markdown;
- validate imported JSON directly;
- call backend APIs directly;
- know backend DTOs;
- know raw config JSON shapes;
- map external data into domain models;
- coordinate unrelated features.

## Application / Business Layer

### Purpose

Contains feature-level orchestration and use-case logic.

### May Do

- expose a feature facade to the view;
- coordinate user actions;
- call domain services;
- call infrastructure services;
- map domain results to UI view models;
- manage feature workflow state;
- handle feature-level errors.

### Must Not Do

- become a dumping ground for unrelated logic;
- bypass domain invariants;
- expose raw DTOs to the view;
- mix unrelated feature responsibilities.

## Feature Domain Layer

May contain feature-specific models, value objects, rules, validations, and policies.

Must not depend on Angular components, browser APIs, backend APIs, UI form structures, or external DTO formats.

Shared domain concepts should live in `src/domain/`.

## Feature Infrastructure Layer

May contain feature-specific adapters for browser APIs, future backend communication, file import/export, local storage, or external systems.

Must not expose raw DTOs to views, contain UI behavior, own business rules, or bypass validation/mapping.

## Backend Communication Rule

When a backend is added later, communication must be isolated behind services, ports, adapters, mappers, and REST/API services.

The view must never call backend communication directly.

Required direction:

```text
view
-> feature business/application layer
-> feature service / application service
-> mapper
-> REST/API service or infrastructure adapter
```

Response direction:

```text
REST/API response DTO
-> REST/API service or infrastructure adapter
-> mapper
-> domain/application model
-> UI view model
-> view
```

The view must not know backend routes, DTO shapes, API response formats, persistence details, authentication details, or HTTP implementation details.

## HTTP / REST Access Rule

Direct HTTP or REST access from views is forbidden.

Angular components must not inject or call `HttpClient` directly.

Feature presentation components must not call REST services directly.

Expected future flow:

```text
Angular component
-> feature facade / business layer
-> application service
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
-> Angular component
```

## Ports and Adapters Rule

A port is an interface/contract that describes what the application needs from the outside world.

An adapter is an implementation of that contract for a concrete technology.

Examples of possible ports:

```text
ProjectConfigStoragePort
GeneratedFileExportPort
ZipArchivePort
FutureProjectRepositoryPort
```

Examples of possible adapters:

```text
BrowserLocalStorageAdapter
BrowserFileDownloadAdapter
FflateZipArchiveAdapter
FutureRestProjectRepositoryAdapter
```

Ports are not only for backend communication.

They may represent browser file download, ZIP creation, local storage, future backend APIs, future GitHub integration, or future AI provider integration.

## State Rule

Feature-local state may be used when needed.

A store is optional, not mandatory.

Use a component store or feature-local store when it improves:

- encapsulation;
- testability;
- state transitions;
- UI simplicity;
- separation between view and business logic.

Do not introduce a store for trivial state that Angular forms or local component state can handle cleanly.

## Angular Signals and RxJS Rule

Prefer Angular Signals for local reactive UI and feature state when they make state easier to understand.

Use RxJS where it is more convenient or better suited, especially for:

- asynchronous streams;
- event streams;
- external integrations;
- HTTP flows in future infrastructure adapters;
- cancellation, debouncing, throttling, or composition of async workflows.

Do not force all state into RxJS.

Do not force all async workflows into Signals when RxJS is clearer.

## Mappers

Typical mappings:

```text
DTO -> domain model
domain model -> DTO
domain model -> UI view model
UI form model -> command/input model
command/input model -> domain update
```

Rules:

- Mapping must not be hidden inside view components.
- Mapping must be explicit and testable.
- Mapping must protect the UI from external data shapes.
- Mapping must protect domain logic from UI-specific structures.

## View Model Rule

Views should consume UI view models.

A UI view model is shaped for rendering and interaction, not persistence or backend transport.

It may include display text, selected values, form-friendly values, validation messages, disabled states, loading states, and available actions.

It must not expose raw backend DTOs or unvalidated config JSON.

## Dependency Direction

Preferred dependency direction:

```text
presentation -> application
application -> domain
application -> infrastructure
application -> mappers
state -> application/domain models
infrastructure -> DTOs/adapters/mappers/domain contracts
shared -> reusable UI only, no feature business rules
```

Avoid:

- presentation -> infrastructure direct calls;
- presentation -> backend DTOs;
- presentation -> raw JSON config;
- domain -> presentation;
- domain -> infrastructure;
- infrastructure -> presentation;
- feature A -> feature B private internals.

## AI Agent Rules

AI agents working on this project must:

- keep views presentational;
- put feature logic in the feature business/application layer;
- use services/adapters for backend or external communication;
- use component store or feature store only when needed;
- prefer Angular Signals for local reactive state where appropriate;
- use RxJS where streams or async workflows make it clearer;
- keep UI independent from external models and raw JSON;
- use explicit mappers between DTOs, domain models, and view models;
- never call `HttpClient` or REST services directly from Angular components;
- keep REST/API access inside infrastructure adapters or dedicated REST services;
- avoid direct cross-feature coupling;
- test feature logic outside the view where practical;
- not hide business logic in Angular templates or components.

## Success Criteria

The feature architecture is successful if:

1. views stay clean and presentational;
2. feature business logic is encapsulated in feature layers;
3. backend or external communication can be added without rewriting views;
4. component stores are used only where they add value;
5. UI models are independent from external DTOs and raw JSON;
6. features are easy to extend and test;
7. feature boundaries prevent accidental coupling;
8. the app remains maintainable as it grows.
