# MVP Scope

## Purpose

This document defines the scope of the first version of **trohi**.

The MVP must validate one focused workflow:

> A solo or indie developer starts a new software project without existing documentation, answers a structured wizard, previews generated files, and exports initial project documentation plus AI agent instruction files.

The MVP should prove that structured configuration can produce useful human documentation and AI agent instructions without requiring a backend, user accounts, cloud storage, or AI integration.

## MVP Goal

The MVP goal is to help a user create a usable initial project documentation package for a new software project.

The package should include:

- human-readable project documentation;
- AI agent instruction files;
- a reusable source configuration file;
- exportable files that can be placed directly in a repository.

The MVP is successful only if the generated output is useful enough to be used in a real project, including the development of trohi itself.

## Target User

The MVP is built for:

> A solo developer or indie developer who frequently works with AI coding agents and wants a repeatable way to define project context, standards, and instructions for new software projects.

The MVP is not primarily designed for:

- large software teams;
- enterprise governance;
- non-technical users;
- non-dev domains;
- project managers without software development context.

These users may be considered in future versions.

## Primary Use Case

The MVP supports one primary use case:

> New software project without existing documentation.

The user starts with an idea and uses trohi to create the initial project documentation and AI agent instruction files.

## Included in MVP

### Project Creation

The user can create a new project profile with basic information:

- project name;
- project description;
- project type;
- target user;
- project goals;
- project constraints.

### Guided Wizard

The application provides a structured wizard that collects decisions about:

- product vision;
- MVP scope;
- architecture direction;
- technology preferences at a high level;
- coding standards;
- testing strategy;
- Git workflow;
- CI/CD expectations;
- target AI agents;
- output files to generate.

The wizard should avoid overwhelming the user with too many questions at once.

### Structured Source Configuration

The MVP stores project decisions in a structured configuration object.

This configuration is the source of truth for generated files.

The generated Markdown files are output artifacts, not the primary source of truth.

### Human Documentation Generation

The MVP can generate initial human project documentation such as:

- `docs/PRODUCT_VISION.md`
- `docs/MVP_SCOPE.md`
- `docs/ARCHITECTURE.md`
- `docs/CODING_STANDARDS.md`
- `docs/TESTING_STRATEGY.md`
- `docs/GIT_WORKFLOW.md`
- `docs/CI_CD_STRATEGY.md`

The exact list may be adjusted during implementation, but the MVP must include enough documentation to define the project clearly.

### AI Agent Instruction Generation

This section describes files the trohi product generates **for its users' projects**. It does not describe agent files used to develop trohi itself — those are scoped in `docs/AGENT_BOOTSTRAP_SCOPE.md`.

The MVP can generate initial AI agent instruction files such as:

- `AGENTS.md`
- `CLAUDE.md`
- `.cursor/rules/project.mdc`
- `.cursor/rules/code-style.mdc`
- `.cursor/rules/testing.mdc`
- `.github/copilot-instructions.md`

The MVP should support a small number of agent targets well instead of many targets poorly.

### Preview Before Export

The user can preview generated files before exporting them.

The preview should make it clear:

- which files will be generated;
- what each file contains;
- which files are human documentation;
- which files are agent-specific instructions.

### Basic Editing Before Export

The user can make simple edits before export.

At minimum, the user should be able to:

- include or exclude generated files;
- edit generated file content in preview;
- adjust wizard answers and regenerate output.

### Export

The MVP supports export as:

- individual Markdown files;
- a ZIP archive containing the generated file structure;
- a JSON configuration file that can be imported later.

The exported files should be usable directly inside a Git repository.

### Import Existing Configuration

The MVP should support importing a previously exported trohi configuration file.

This allows the user to continue editing or regenerate files later.

## Explicitly Excluded from MVP

The MVP must not include the following features.

### No Backend

The MVP does not include a backend service.

There are no server-side APIs, hosted projects, databases, user accounts, or cloud storage.

This is an MVP constraint, not a permanent product limitation.

### No User Accounts

The MVP does not include login, registration, user profiles, billing accounts, teams, permissions, or organization management.

### No Cloud Sync

The MVP does not sync projects across devices.

Persistence is handled through local browser state and import/export files.

### No Required AI Integration

The MVP does not require AI to generate the output.

Generation must be deterministic:

> structured config + templates = generated files

AI assistance may be added in future versions, but the MVP must work without it.

### No Repository Analysis

The MVP does not analyze existing source code repositories.

It does not inspect file trees, infer frameworks, detect architecture, or read package files.

### No Import from Existing Documentation

The MVP does not parse existing documentation such as `README.md`, `ARCHITECTURE.md`, `CONTRIBUTING.md`, or agent instruction files.

Existing-project workflows are future use cases.

### No Direct Git Integration

The MVP does not push files to GitHub, GitLab, Bitbucket, or any remote repository.

The user manually places exported files into the repository.

### No CI/CD File Execution or Validation

The MVP may generate CI/CD strategy documentation and possibly simple starter workflow files later, but it does not execute, validate, or connect to real CI/CD systems.

### No Team Workspaces

The MVP does not support shared workspaces, organization standards, approval flows, audit logs, or team-level governance.

### No Template Marketplace

The MVP does not include a public template marketplace, paid presets, community sharing, or hosted template distribution.

### No Non-Dev Domain Presets

The MVP does not support marketing, education, consulting, customer support, legal, or other non-dev workflows.

The core model should avoid blocking future expansion, but the first version remains dev-first.

## MVP Output Boundaries

The MVP should generate helpful initial files, not perfect final documentation.

Generated files should be:

- clear;
- structured;
- practical;
- easy to edit;
- suitable for use by humans and AI agents.

Generated files should not pretend to know details the user has not provided.

When information is missing, the output should either:

- omit that section;
- use a clear placeholder;
- or include a reasonable default selected by the user.

## Quality Bar

The MVP must be good enough that the project can use trohi-generated documentation for trohi itself.

This means the output must be:

- consistent across files;
- free of contradictory instructions;
- grounded in the source configuration;
- specific enough to guide AI agents;
- readable enough for humans;
- stable enough to snapshot test.

## Non-Goals

The MVP is not trying to solve all documentation problems.

The MVP is not trying to replace human architectural thinking.

The MVP is not trying to be a complete project management tool.

The MVP is not trying to be a complete AI orchestration platform.

The MVP is not trying to become a SaaS product before the core workflow is validated.

## Future Candidates

The following features are candidates for future versions:

- AI-assisted project setup;
- AI review of generated documentation;
- conflict detection between rules;
- import from existing documentation;
- repository analysis;
- direct GitHub or GitLab integration;
- File System Access API support for local folder writing;
- team profiles;
- shared organization standards;
- cloud sync;
- hosted template libraries;
- custom template authoring;
- non-dev domain presets;
- CLI support;
- backend API;
- paid plans or sponsorship model.

These features must not be included in the first implementation unless the MVP scope is intentionally revised.

## MVP Success Criteria

The MVP is successful if a user can:

1. create a new project profile;
2. answer a guided set of questions;
3. generate human project documentation;
4. generate AI agent instruction files;
5. preview the generated output;
6. export the generated files as a ZIP;
7. export the source configuration as JSON;
8. import the configuration later;
9. regenerate the files from the same configuration;
10. place the files in a repository and use them as project context for AI-assisted development.

## Scope Control Rule

When a new feature idea appears, it should be evaluated against the primary MVP use case.

If the feature does not directly help a solo developer create initial documentation and agent instructions for a new software project, it should be deferred.

The MVP should stay narrow, useful, and shippable.