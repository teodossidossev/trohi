# Architecture

## Purpose

This document defines the initial architecture direction for **trohi**.

The MVP is an Angular browser application without a backend, but the architecture should not be permanently limited to the browser.

The system should be designed around a reusable core that can later support backend services, CLI usage, cloud sync, team workspaces, repository integrations, and AI assistance.

## Architecture Summary

```text
Angular Browser UI
  -> Feature presentation layer
  -> Feature business/application layer
  -> Domain models and services
  -> Validation and mappers
  -> Generation engine
  -> Preview
  -> Export adapters
```

Core product behavior:

```text
structured config + templates = generated files
```

## Core Architectural Principles

## 1. Keep the generation core independent from Angular UI

Core generation, validation, output definitions, domain models, mappers, template functions, and consistency rules must not be tightly coupled to Angular components.

## 2. Keep views presentational

Angular views render state, bind forms, display messages, and emit user intentions.

Views must not own business logic, DTO mapping, config validation, Markdown generation, import/export logic, or backend communication.

## 3. Use explicit models and mappers

Do not pass raw JSON through the application.

External data must be validated and mapped into internal models before use.

## 4. Use ports/adapters at infrastructure boundaries

Business logic should depend on contracts, not concrete browser APIs, ZIP libraries, local storage, REST clients, Git providers, or AI providers.

## MVP Architecture Goals

The MVP architecture should support:

- guided project setup;
- structured configuration;
- OOP/domain models;
- DTO validation and mapping;
- UI view models;
- deterministic generation;
- preview before export;
- local import/export;
- JSON config persistence;
- ZIP export;
- clear separation between human documentation and agent instruction files;
- future extension without rewriting the core.

## High-Level Layers

```text
UI / Presentation Layer
Feature Application / Business Layer
Domain Layer
Infrastructure / Adapters Layer
```

## UI / Presentation Layer

May handle layouts, forms, display state, validation messages, buttons, navigation, and safe Markdown text preview.

Must avoid business rules, DTO mapping, raw JSON handling, Markdown generation, backend communication, direct `HttpClient`, direct REST service calls, import/export logic, and file path safety logic.

## Feature Application / Business Layer

Coordinates feature workflows.

May handle wizard orchestration, preview orchestration, import/export use cases, calling domain services, calling infrastructure ports/adapters, mapping domain results to UI view models, and feature state management.

Must avoid leaking DTOs to views, bypassing domain invariants, or becoming a dumping ground.

## Domain Layer

Owns core product concepts and rules.

May contain domain models, value objects, validation rules, config model, output definitions, generation engine, template functions, consistency rules, and generated output models.

Must avoid Angular component dependencies, DOM dependencies, browser download APIs, direct REST/HTTP calls, local storage calls, and AI provider calls.

## Infrastructure / Adapters Layer

Implements environment-specific operations behind ports.

May contain browser file download adapter, local storage adapter, file import adapter, fflate ZIP adapter, future REST API adapter, future GitHub adapter, and future AI provider adapter.

Must avoid owning product decisions, bypassing validation, leaking DTOs to UI, or mutating domain models unexpectedly.

## Data Flow

## Config Import Flow

```text
trohi.config.json
-> parse JSON
-> validate DTO with Zod or equivalent
-> map DTO to domain model
-> map domain model to UI view model
-> render UI
```

## Config Export Flow

```text
domain config model
-> map to config DTO
-> validate serializable shape
-> export trohi.config.json
```

## Generation Flow

```text
domain config model
-> validation
-> generation engine
-> TypeScript template functions
-> generated output models
-> preview view models
-> export adapters
```

## Future Backend Flow

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

The view must not know backend routes, DTO shapes, or HTTP implementation details.

## Main Conceptual Modules

```text
App Shell
Features
Domain Models
Config DTOs
Mappers
Validation
Template Functions
Generation Engine
Preview
Export
Import
Preset System
Infrastructure Adapters
```

## Template System

Use TypeScript template functions for MVP.

Do not introduce a template engine or custom template marketplace in the MVP.

## Preview

Use safe plain-text Markdown preview for MVP.

Rich Markdown rendering may be added later only with proper sanitization.

## Export

Use fflate behind an adapter for ZIP creation.

Use browser-native Blob and URL APIs where practical.

## Persistence Model

The MVP persistence model is local and file-based.

The durable source should be exportable as a JSON configuration file.

## Browser-Only MVP Constraint

The MVP runs in the browser and has no backend.

This is a deliberate constraint to reduce implementation complexity, avoid accounts, keep project data local, and validate the core workflow before building platform features.

## Future Architecture Evolution

Future additions should be possible without rewriting the generation core or views:

- backend API;
- user accounts;
- cloud-synced profiles;
- team workspaces;
- GitHub/GitLab integrations;
- AI-assisted project setup;
- repository analysis;
- import from existing documentation;
- CLI usage;
- template marketplace.

## Determinism Requirement

Given the same domain config model, template set, template version, and generator version, generated output should be the same.

This supports Vitest snapshot tests, predictable regeneration, future diff views, user trust, and easier debugging.

## Architecture Risks

## Risk: UI owns too much logic

Mitigation: keep views presentational and use feature business/application layers.

## Risk: Raw JSON leaks into UI

Mitigation: validate DTOs and map to domain models and UI view models.

## Risk: Generated Markdown becomes source of truth

Mitigation: keep `trohi.config.json` and the internal domain config model as reusable source.

## Risk: Overbuilding future SaaS needs

Mitigation: keep the MVP browser-only, but isolate the core so future adapters are possible.

## MVP Architecture Success Criteria

The architecture is successful if:

1. the Angular browser MVP can be built without backend infrastructure;
2. views remain presentational;
3. feature logic lives outside components;
4. domain models and mappers protect boundaries;
5. generation logic is independent from Angular UI;
6. project config can be exported and imported;
7. generated files are deterministic;
8. validation, mapping, and generation are testable with Vitest;
9. future backend, CLI, AI, or Git integrations remain possible;
10. the architecture stays simple enough for a solo developer to implement.
