# Domain Modeling

## Purpose

This document defines the domain modeling approach for **trohi**.

The project should use an object-oriented style wherever it improves clarity, encapsulation, validation, and long-term maintainability.

The UI must remain clean and must not depend directly on external data shapes, backend DTOs, imported JSON shapes, or persistence formats.

## Core Decision

The project should avoid working directly with plain JSON objects throughout the application.

Plain JSON may exist only at system boundaries such as:

- imported `trohi.config.json` files;
- exported `trohi.config.json` files;
- future backend API DTOs;
- browser storage serialization;
- test fixtures where appropriate.

Inside the application, data should be represented through explicit models, domain classes, value objects, and view models.

## Key Principle

The key modeling principle is:

> External data is mapped into internal models before use.

The application should not allow external data shapes to leak into UI components or domain logic.

## Model Layers

The project should distinguish between the following model types:

```text
External DTO / JSON shape
-> Mapper
-> Domain model
-> Application model
-> UI view model
```

Each layer has a different responsibility.

## External DTO / JSON Shape

### Purpose

Represents data as it comes from or goes to external boundaries.

Examples:

- imported `trohi.config.json`;
- exported config JSON;
- future backend API request/response DTOs;
- future repository integration payloads;
- future AI provider request/response payloads.

### Rules

- DTOs should be simple data structures.
- DTOs must be validated before mapping.
- DTOs must not be used directly by UI components.
- DTOs must not contain behavior.
- DTOs must not become the domain model.

## Mappers

### Purpose

Mappers convert external data shapes into internal models and convert internal models back to external data shapes when needed.

### Required Mapper Directions

The MVP needs mappers for:

```text
Config JSON -> Domain Config Model
Domain Config Model -> Config JSON
Domain Config Model -> UI View Models
UI View Models -> Domain Config Model updates
Domain Config Model -> Generated Output Models
Generated Output Models -> Export DTOs/files
```

Future backend support will require:

```text
Backend DTO -> Domain Model
Domain Model -> Backend DTO
```

### Rules

- Mappers live at boundaries.
- Mappers should be explicit and tested.
- Mappers should not contain unrelated business logic.
- Mappers should not be hidden inside UI components.
- Mappers should not silently ignore invalid data.

## Domain Models

### Purpose

Domain models represent the core business concepts of trohi.

Examples:

- project configuration;
- product context;
- MVP scope;
- architecture decision;
- coding standard;
- testing strategy;
- Git workflow;
- CI/CD strategy;
- agent target;
- output file definition;
- generated file;
- validation result.

### Rules

Domain models should:

- protect invariants;
- expose meaningful methods;
- avoid anemic data-only structures where behavior belongs with the data;
- remain independent from Angular UI components;
- remain independent from backend DTOs;
- be testable with Vitest;
- be serializable through mappers, not by leaking internals.

## Value Objects

### Purpose

Value objects should represent meaningful small domain concepts.

Examples:

- project name;
- output file path;
- template version;
- config version;
- agent target ID;
- decision status;
- validation message;
- generated file content.

### Rules

Value objects should:

- validate their own invariants where practical;
- be immutable where practical;
- expose clear behavior;
- avoid primitive obsession;
- make invalid states harder to represent.

## UI View Models

### Purpose

UI view models represent exactly what the UI needs to display and edit.

They are not backend DTOs.

They are not raw config JSON.

They are not necessarily the same as domain models.

### Rules

UI components should depend on UI view models, not external JSON structures.

UI view models should:

- be shaped for screens and forms;
- hide external data complexity;
- expose display-friendly values;
- carry validation messages in UI-friendly form;
- avoid leaking backend/API/persistence concerns.

## Application Models

### Purpose

Application models represent use-case-level state.

Examples:

- current wizard state;
- selected output files;
- preview state;
- import result;
- export result;
- generation result.

### Rules

Application models may coordinate domain models and UI view models, but they should not replace domain logic.

## No Plain JSON in UI Rule

UI components must not directly consume imported config JSON, future backend DTOs, or raw persistence objects.

Instead:

```text
raw JSON / DTO
-> validate
-> map to domain model
-> map to UI view model
-> render UI
```

This keeps the UI clean and protects it from changes in external data formats.

## Backend Future Rule

When a backend is added later, the UI must not be changed to depend directly on backend response shapes.

Backend integration must use adapter and mapper layers.

Expected future flow:

```text
Backend API DTO
-> API adapter
-> DTO validation
-> mapper
-> domain model
-> UI view model
```

The backend can evolve without forcing UI components to understand backend-specific models.

## Config JSON Rule

`trohi.config.json` is the persisted source format, but it is not the in-memory domain model.

The app should treat config JSON as an external serialized representation.

Expected MVP flow:

```text
import trohi.config.json
-> parse JSON
-> validate DTO shape
-> map DTO to domain config model
-> use domain model internally
```

For export:

```text
domain config model
-> map to config DTO
-> validate serializable shape
-> export trohi.config.json
```

## Generated Output Rule

Generated output should also use explicit models.

Avoid passing loose objects such as arbitrary `{ path, content }` structures across the app.

Prefer explicit generated output concepts such as:

- `GeneratedFile`;
- `GeneratedFilePath`;
- `GeneratedFileContent`;
- `GeneratedOutputPackage`;
- `OutputCategory`;
- `OutputTarget`.

These names are conceptual and may be finalized during implementation.

## Angular Integration

Angular components should be thin.

They should:

- render UI;
- bind forms;
- emit user intentions;
- display validation results;
- call application services.

Angular components should not:

- validate imported config JSON directly;
- generate Markdown directly;
- contain mapper logic;
- contain core domain rules;
- know backend DTO shapes;
- know raw persistence formats.

## Services and Facades

Angular services or facades may coordinate application workflows.

Examples:

- project creation facade;
- wizard facade;
- preview facade;
- import/export facade.

These services should call domain/application logic instead of implementing domain behavior inside UI code.

## Object-Oriented Design Expectations

Use object-oriented design where it improves the model.

Expected use cases for OOP:

- domain models with invariants;
- value objects;
- generated output models;
- validation result objects;
- mapper classes;
- application services;
- export/import adapters;
- generator classes or services;
- template rendering classes or modules when useful.

Avoid excessive static procedural code when behavior belongs to a model.

## Avoid Anemic Models

Do not make the entire application a set of passive data objects plus large procedural service functions.

If a concept has behavior, place that behavior close to the concept.

Examples:

- file path validation belongs near output file path modeling;
- config version checks belong near config metadata modeling;
- output selection behavior belongs near output package modeling;
- validation result aggregation belongs near validation result modeling.

## Avoid Over-Engineering

Object-oriented design should not become unnecessary complexity.

Use classes and methods where they clarify responsibility and protect invariants.

Do not create deep inheritance trees.

Prefer composition over inheritance.

Avoid abstract factories, base classes, or generic frameworks before real needs exist.

## DTO Naming

External data shapes should be named clearly as DTOs or serialized models.

Examples:

```text
ProjectConfigDto
OutputFileDto
AgentTargetDto
GeneratedFileDto
```

Internal domain concepts should not be named as DTOs.

## Mapper Naming

Mappers should have clear names.

Examples:

```text
ProjectConfigMapper
OutputFileMapper
AgentTargetMapper
GeneratedOutputMapper
```

Mapper names should make direction clear through method names.

Examples:

```text
fromDto(dto)
toDto(model)
toViewModel(model)
fromViewModel(viewModel)
```

Final method names should follow the selected TypeScript style and project conventions.

## Testing Requirements

Model and mapper behavior must be tested.

Use Vitest for:

- DTO validation tests;
- mapper tests;
- domain model invariant tests;
- value object tests;
- view model mapping tests;
- import/export mapping tests;
- generated output model tests.

Mapper tests should cover:

- valid input;
- missing optional values;
- invalid input rejected by validation;
- default values;
- unknown/undecided values;
- round-trip behavior where applicable.

## Static Analysis Implications

The modeling approach should support static analysis.

Avoid:

- large procedural mapper functions;
- excessive cognitive complexity;
- duplicated mapping logic;
- unsafe casts;
- unvalidated external data;
- leaking DTOs into UI components.

## Agent Instructions

AI agents working on this project must:

- avoid passing raw JSON objects through the application;
- create explicit models for important concepts;
- keep DTOs at system boundaries;
- use mappers between external data and internal models;
- keep UI components clean from external logic and data shapes;
- avoid putting domain logic in Angular components;
- test models, mappers, and invariants;
- prefer composition over inheritance;
- avoid over-engineered class hierarchies.

## Success Criteria

The domain modeling approach is successful if:

1. imported JSON is validated and mapped before use;
2. UI components do not depend on raw JSON or future backend DTOs;
3. domain concepts have explicit models and meaningful behavior;
4. backend integration can be added later without rewriting UI components;
5. mapper behavior is tested;
6. generated output is represented through explicit models;
7. the code remains object-oriented without becoming over-engineered.

