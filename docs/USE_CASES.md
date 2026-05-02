# Use Cases

## Purpose

This document defines the main product use cases for **trohi**.

The MVP must focus on one primary use case and avoid expanding into existing-project analysis, team governance, repository synchronization, or non-dev domains too early.

## Use Case Status Levels

Use cases are grouped by status:

- **MVP**: must be supported by the first version;
- **Future**: important but explicitly outside the MVP;
- **Exploratory**: possible direction, but not yet validated.

## MVP Use Case

# Use Case 1: New Software Project Without Documentation

## Status

**MVP**

## Summary

A solo or indie developer starts a new software project without existing documentation. They use trohi to answer a structured wizard, generate initial project documentation and AI agent instruction files, preview the result, and export the files for use in a repository.

## Primary Actor

A solo developer or indie developer who frequently works with AI coding agents.

## Context

The user has a project idea but does not yet have formal project documentation.

They may have rough thoughts about:

- what the product should do;
- who it is for;
- what stack they may use;
- how they want code to be written;
- how they want tests to be handled;
- how Git should be used;
- which AI coding agents they plan to use.

They do not want to manually create all project and agent instruction files from scratch.

## User Problem

The user repeatedly has to explain the same categories of information to AI agents when starting new projects:

- product context;
- project goals;
- constraints;
- architecture direction;
- coding standards;
- testing expectations;
- Git workflow;
- CI/CD expectations;
- file organization;
- agent-specific rules.

This is repetitive and inconsistent.

## User Goal

The user wants to quickly create a consistent initial project documentation package that can be used by both humans and AI agents.

## Preconditions

- The user is starting a new software project.
- The project has no existing documentation that needs to be imported.
- The user is willing to answer structured questions.
- The user wants to export files and place them in a repository manually.

## Main Flow

### 1. Create Project Profile

The user creates a new project profile in trohi.

The user provides basic information such as:

- project name;
- short project description;
- project type;
- target user;
- high-level goal.

### 2. Define Product Context

The user answers questions about:

- the problem the project solves;
- the intended users;
- the main product goal;
- important constraints;
- what is out of scope.

This information is used to generate product-level documentation.

### 3. Define MVP Scope

The user defines what should and should not be included in the first version of the project.

This includes:

- core capabilities;
- explicit non-goals;
- future candidates;
- success criteria.

### 4. Define Architecture Direction

The user answers high-level technical questions such as:

- application type;
- backend or no backend;
- persistence model;
- deployment assumptions;
- important architectural constraints.

The MVP should not require the user to finalize every technical detail at this stage.

### 5. Define Engineering Standards

The user chooses or defines standards for:

- code style;
- naming conventions;
- file organization;
- comments;
- error handling;
- dependency usage;
- refactoring expectations.

### 6. Define Testing Strategy

The user defines expectations for:

- unit tests;
- integration tests;
- end-to-end tests;
- TDD or non-TDD workflow;
- snapshot testing;
- manual testing expectations;
- test coverage expectations.

### 7. Define Git Workflow

The user defines expectations for:

- branch strategy;
- commit message style;
- pull request expectations;
- merge strategy;
- release workflow.

### 8. Define CI/CD Expectations

The user defines high-level CI/CD expectations such as:

- linting;
- type checking;
- tests;
- build checks;
- deployment expectations;
- future automation needs.

The MVP may document CI/CD expectations without generating complete production-ready CI workflows.

### 9. Select AI Agent Targets

The user selects which AI coding agents or instruction formats should be generated.

Initial targets may include:

- generic `AGENTS.md`;
- `CLAUDE.md`;
- Cursor rules;
- GitHub Copilot instructions.

The MVP should support a small number of targets well.

### 10. Generate Files

trohi generates files from the structured configuration.

Generated files include:

- human project documentation;
- agent-specific instruction files;
- reusable source configuration.

### 11. Preview Output

The user previews the generated files before export.

The preview should show:

- file paths;
- file categories;
- generated content;
- which files are selected for export.

### 12. Edit or Adjust

The user can make basic adjustments by:

- editing wizard answers;
- regenerating files;
- excluding files;
- editing generated content before export.

### 13. Export Files

The user exports:

- a ZIP archive with the generated file structure;
- individual Markdown files if needed;
- the source configuration as JSON.

### 14. Add Files to Repository

The user manually places the exported files into their project repository.

AI agents can then use the generated files as project context and operating instructions.

## Expected Output

The expected output is an initial project documentation and AI instruction package.

Example output files:

- `docs/PRODUCT_VISION.md`
- `docs/MVP_SCOPE.md`
- `docs/ARCHITECTURE.md`
- `docs/CODING_STANDARDS.md`
- `docs/TESTING_STRATEGY.md`
- `docs/GIT_WORKFLOW.md`
- `docs/CI_CD_STRATEGY.md`
- `AGENTS.md`
- `CLAUDE.md`
- `.cursor/rules/project.mdc`
- `.cursor/rules/code-style.mdc`
- `.cursor/rules/testing.mdc`
- `.github/copilot-instructions.md`

The exact output list may be configurable.

## Success Criteria

This use case is successful when the user can:

1. move from a rough project idea to a structured project definition;
2. generate useful human documentation;
3. generate useful AI agent instructions;
4. preview the generated output;
5. export files in a repository-ready structure;
6. reuse the source configuration later;
7. start AI-assisted development with less repeated explanation.

## Failure Conditions

This use case fails if:

- the wizard feels longer than writing the files manually;
- generated files are too generic to be useful;
- agent instructions contradict human documentation;
- the user cannot understand what will be exported;
- the output requires too much cleanup before use;
- the source configuration cannot be reused;
- the product feels like a prompt generator instead of a project definition tool.

## MVP Boundaries for This Use Case

The MVP does not:

- analyze an existing repository;
- parse existing documentation;
- infer architecture from code;
- sync directly with Git providers;
- require AI to generate files;
- support team-level workflows;
- support non-dev domains.

## Future Use Cases

# Use Case 2: Existing Project With Documentation

## Status

**Future**

## Summary

A user has an existing software project with some documentation and wants trohi to help normalize, restructure, and convert it into a reusable configuration plus updated output files.

## Why It Matters

Many real projects already have documentation, but it may be incomplete, outdated, or inconsistent.

trohi could eventually help turn scattered documentation into a structured project configuration.

## Not in MVP

This use case requires import, parsing, conflict detection, and review workflows. It is outside the MVP.

# Use Case 3: Existing Project Without Documentation

## Status

**Future**

## Summary

A user has an existing software project without formal documentation and wants trohi to help create documentation based on the current project structure and user-provided context.

## Why It Matters

This could be highly valuable because many projects start without documentation and later need structure.

## Not in MVP

This use case may require repository analysis, AI assistance, file tree inspection, dependency detection, and user review. It is outside the MVP.

# Use Case 4: Regenerate or Update Project Files From Existing Config

## Status

**Future Candidate / Possible MVP Extension**

## Summary

A user imports an existing trohi configuration, modifies some decisions, previews the differences, and regenerates the output files.

## Why It Matters

This supports reuse and iteration.

## MVP Note

Basic import and regeneration may be included in the MVP, but advanced diffing and sync behavior should be deferred.

# Use Case 5: Team Standard Profile

## Status

**Future**

## Summary

A small team defines shared engineering standards and reuses them across multiple projects.

## Why It Matters

This could become a strong paid or team-oriented feature.

## Not in MVP

This requires shared profiles, permissions, sync, and possibly backend support. It is outside the MVP.

# Use Case 6: Non-Dev Domain Instruction Workspace

## Status

**Exploratory**

## Summary

A non-developer uses trohi-like workflows to formalize AI instructions for a domain such as marketing, education, consulting, customer support, or small business operations.

## Why It Matters

The deeper product idea is not limited to software development. Many people need help formalizing context, roles, rules, and workflows for AI assistants.

## Not in MVP

The MVP remains dev-first. Non-dev domains should not shape the first implementation unless the product direction is intentionally revised.

## Prioritization Rule

Use Case 1 is the only required MVP use case.

All other use cases should be treated as future expansion candidates.

A future use case should not influence the MVP unless it affects a foundational decision that would be expensive to reverse later.

## Product Design Implication

The product should start narrow but avoid unnecessary lock-in.

This means:

- the first UI can be dev-specific;
- the first templates can be dev-specific;
- the first output files can be dev-specific;
- the core idea should still be modeled as context, rules, roles, workflows, standards, and outputs.

This keeps the MVP focused while preserving future optionality.

