---
name: prepare-pr
description: Use this skill when preparing a trohi branch for a pull request. It creates a reviewable PR summary, verifies tests/static analysis, documents generated output impact, and prepares the handoff to Codex review.
---

# Prepare Pull Request

## Goal

Prepare a focused, reviewable pull request for **trohi**.

The PR should be ready for GitHub CI, Codex review, and final human approval.

## Before Preparing the PR

Review the changed files and identify:

- feature or domain area changed;
- user-visible behavior changed;
- generated Markdown changed;
- config/schema/model changed;
- architecture boundary impact;
- tests added or updated;
- documentation updated.

## Required Local Checks

Before opening the PR, run relevant local checks when available:

- formatting;
- linting;
- static analysis command set;
- type checking;
- Vitest unit/integration tests;
- Vitest snapshot tests;
- affected Cypress tests;
- Angular build.

Do not open the PR with known failing checks unless the failure is clearly explained and explicitly accepted by the human developer.

## Architecture Review Before PR

Check that the change respects:

- presentational views;
- feature business/application layer ownership;
- DTO -> mapper -> domain/application model -> UI view model flow;
- no direct `HttpClient` or REST service calls from views;
- no raw JSON leaking into UI components;
- ports/adapters at infrastructure boundaries;
- OOP/domain model rules;
- Composition over Inheritance;
- no unnecessary future infrastructure.

## Generated Output Review

If generated Markdown changed, document:

- which generated files changed;
- why they changed;
- whether snapshots changed;
- whether human docs and agent files remain consistent.

Generated output changes must be intentional.

## PR Description Template

Use this structure:

```markdown
## Summary

- 

## Why

- 

## Changes

- 

## Testing

- [ ] Formatting checked
- [ ] Linting passed
- [ ] Static analysis command set passed
- [ ] Type checking passed
- [ ] Vitest tests passed
- [ ] Snapshot changes reviewed
- [ ] Cypress tests passed or not affected
- [ ] Build passed

## Generated Output Impact

- [ ] No generated Markdown changes
- [ ] Generated Markdown changed and snapshots were reviewed

Details:


## Architecture Impact

- [ ] Views remain presentational
- [ ] No raw JSON / DTO leakage into UI
- [ ] Mappers updated where needed
- [ ] Domain models protect relevant invariants
- [ ] No direct REST/HttpClient calls from views
- [ ] Ports/adapters used for infrastructure boundaries where relevant

## AI Agent Usage

- [ ] Claude Code implemented or assisted
- [ ] Codex review requested or planned

## Risks / Notes

- 
```

## Codex Review Request

After opening the PR, request Codex review with a focused prompt such as:

```text
@codex review this PR for correctness, missing tests, architecture boundary violations, TDD issues, generated output regressions, raw JSON/DTO leakage into UI, direct REST/HttpClient usage from views, mapper/model issues, SOLID/DRY/KISS/YAGNI concerns, and SonarQube-style maintainability risks.
```

## Done Criteria

The PR is ready when:

- scope is clear;
- tests are updated;
- local checks pass;
- generated output impact is documented;
- architecture impact is documented;
- Codex review is requested or planned;
- the human developer can understand and review the change.
