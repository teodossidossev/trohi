# Product Vision

## Product Name

**trohi**

## Product Summary

trohi is a dev-first tool for creating structured project documentation and AI agent instruction files for new software projects.

The first version helps solo and indie developers define the initial context, goals, constraints, engineering standards, workflows, and agent-specific instructions for a new project before implementation begins.

The product starts with software development as the first vertical, but the underlying model should remain broad enough to support other domains in the future.

## Core Problem

Developers who work frequently with AI coding agents repeatedly need to explain the same project context and engineering expectations:

- what the project is;
- what the goals and constraints are;
- what architecture should be followed;
- what coding style is expected;
- how tests should be written;
- how Git should be used;
- what CI/CD expectations exist;
- which files and folder conventions should be followed;
- what each AI agent is allowed and not allowed to do.

This context is often recreated manually for every new project. It is inconsistent, incomplete, and easy to forget.

As a result, AI agents may produce code that does not follow the intended architecture, style, testing approach, or workflow.

## Target User for the MVP

The first target user is:

> A solo developer or indie developer who frequently works with AI coding agents and wants a repeatable way to define project context, standards, and agent instructions for new software projects.

The MVP is not designed first for companies, large teams, non-technical users, or non-dev domains. Those may become future expansion directions.

## First Use Case

The first supported use case is:

> A user starts a new software project without existing documentation, answers a structured wizard, previews the generated files, and exports initial project documentation plus AI agent instruction files for use in a repository.

The MVP focuses only on new projects without existing documentation.

Existing projects with documentation, existing projects without documentation, repository analysis, and AI-assisted import are future use cases.

## Product Goal

The goal of trohi is to help users move from an unclear project idea to a structured initial project definition that can be used by both humans and AI agents.

The generated output should reduce repeated explanation, improve consistency, and provide a stronger starting point for AI-assisted software development.

## Core Principle

The product should be built around this principle:

> Structured configuration is the source of truth. Markdown files are generated output.

The user should not be forced to manually maintain many separate instruction files as the primary source of truth.

Instead, the product should collect structured decisions and generate the appropriate human-readable and agent-specific files from those decisions.

## MVP Positioning

The MVP is not a general AI prompt generator.

The MVP is not a documentation editor.

The MVP is not a repository analyzer.

The MVP is not a SaaS team management platform.

The MVP is a browser-based tool that helps a solo developer create the initial documentation and AI agent instruction package for a new software project.

## MVP Constraints

For the first version:

- the application runs in the browser;
- there is no backend;
- there are no user accounts;
- there is no cloud storage;
- there is no required AI integration;
- persistence is handled through local import/export files;
- generated output can be exported as Markdown, JSON config, and ZIP files.

These constraints are MVP implementation decisions, not permanent product limitations.

The architecture should not prevent future backend services, cloud sync, AI assistance, team workspaces, or repository integrations.

## AI Strategy

The MVP must not depend on AI to function.

The initial generation flow should be deterministic:

> structured config + templates = generated files

AI assistance may be added later as an optional feature for:

- suggesting answers based on a short project description;
- reviewing generated documentation;
- detecting conflicts between rules;
- importing existing documentation;
- analyzing repositories;
- adapting outputs for specific agents.

AI should enhance the workflow later, not define the core MVP behavior.

## Initial Output Categories

The first version should generate two categories of files.

### Human Project Documentation

Examples:

- `docs/PRODUCT_VISION.md`
- `docs/MVP_SCOPE.md`
- `docs/ARCHITECTURE.md`
- `docs/CODING_STANDARDS.md`
- `docs/TESTING_STRATEGY.md`
- `docs/GIT_WORKFLOW.md`
- `docs/CI_CD_STRATEGY.md`

These files explain the project and engineering expectations to humans.

### AI Agent Instruction Files

Examples:

- `AGENTS.md`
- `CLAUDE.md`
- `.cursor/rules/*.mdc`
- `.github/copilot-instructions.md`

These files translate the same project decisions into agent-specific instructions.

Agent files should be derived from the same source configuration as the human documentation.

## Future Expansion Direction

Although the MVP is dev-first, the deeper product idea is broader:

> Help people formalize context, goals, constraints, roles, standards, and workflows so AI assistants can work more consistently in a specific domain.

Future domains may include marketing, education, consulting, customer support, small business operations, or other knowledge-work contexts.

The product should start narrow but avoid a core model that is permanently limited to software development.

## Product Principles

- Start with one clear use case.
- Prefer structured decisions over free-form prompts.
- Keep the MVP deterministic and testable.
- Keep user data local in the MVP.
- Generate files that are useful in real repositories.
- Separate source configuration from generated output.
- Make the first version useful without backend, accounts, or AI.
- Do not overbuild team, sync, or analysis features before validating the core workflow.

## Success Criteria for the MVP

The MVP is successful if a solo developer can:

1. create a new project profile;
2. answer a guided set of questions;
3. preview generated project and agent files;
4. export the generated files;
5. place them in a repository;
6. use them as the initial context for AI-assisted development;
7. reuse or modify the source configuration later.

The user should feel that the tool saved repetitive explanation and produced a more consistent project starting point than writing the documents manually from scratch.

