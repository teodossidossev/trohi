# Git Workflow

## Purpose

This document defines the Git workflow for **trohi**.

The workflow should support solo developer development, TDD, AI-assisted implementation, review through pull requests, pre-commit static analysis, GitHub CI verification, and a clear handoff between implementation agents and review agents.

The workflow must stay lightweight enough for a solo/indie project while still preserving quality, traceability, and safe change management.

## Core Workflow Principle

All meaningful code changes should be made in branches and reviewed before merge.

The default workflow is:

```text
create branch
-> implement using TDD
-> run local tests and static analysis
-> commit only if local checks pass
-> open pull request
-> GitHub CI runs required checks
-> request AI/human review
-> address feedback
-> CI passes again
-> final human approval
-> merge
```

## Local Quality Gate Before Commit

Static analysis and relevant checks must run before committing.

A developer or AI agent should not create a commit with known linting, static analysis, type, or test failures.

The local pre-commit quality gate should include, where practical:

- formatting check;
- linting;
- SonarQube-style static analysis or equivalent local checks;
- type checking;
- relevant unit tests;
- relevant integration tests;
- affected snapshot tests when generated output changes;
- affected Cypress tests when UI flows change.

The exact commands will be defined after the technical stack is selected.

This rule exists even before Git hooks are implemented.

Git hooks may later automate part of this process, but the responsibility remains the same: do not commit code that is already known to fail project checks.

## GitHub CI Verification

Local checks are not enough.

Every pull request should be verified again by GitHub CI.

GitHub CI is the independent merge gate and should eventually run:

- formatting check;
- linting;
- static analysis;
- type checking;
- unit tests;
- integration tests;
- snapshot tests;
- build;
- Cypress tests when configured.

A pull request should not be merged while required GitHub CI checks are failing.

## Agent Roles in Git Workflow

The project may use multiple AI coding agents with distinct responsibilities.

### Claude Code

Claude Code may be used as the primary implementation agent.

Claude Code can:

- plan implementation steps;
- write failing tests first where practical;
- implement changes;
- update documentation when needed;
- run local checks before commit;
- create commits after checks pass;
- open pull requests.

Claude Code must not:

- commit code with known failing local checks;
- merge its own pull request;
- bypass tests;
- weaken static analysis, linting, or CI rules to make code pass;
- silently expand scope;
- ignore project documentation;
- override review feedback without explanation.

### Codex

Codex may be used as the review agent.

Codex can:

- review pull requests;
- identify correctness issues;
- identify missing tests;
- check TDD and testing expectations;
- flag violations of architecture boundaries;
- flag SOLID, DRY, KISS, YAGNI, CoC, Composition over Inheritance, and Law of Demeter concerns;
- flag SonarQube-style quality issues;
- suggest improvements.

Codex must not:

- merge pull requests;
- expand implementation scope during review;
- request unrelated refactors unless they directly affect the change;
- replace human judgment as final approval.

### Human Developer

The human developer remains the final decision maker.

The human developer is responsible for:

- approving the intended scope;
- deciding whether review feedback is valid;
- approving final merge;
- resolving tradeoffs;
- changing product or architecture direction when needed.

## Recommended AI Handoff Workflow

The preferred agent workflow is:

```text
Claude Code implements using TDD
-> Claude Code runs local static analysis and tests
-> Claude Code commits only after checks pass
-> Claude Code opens PR
-> GitHub CI runs required checks
-> Codex reviews PR
-> Claude Code addresses valid Codex feedback
-> local checks and GitHub CI pass again
-> human reviews
-> human merges
```

GitHub pull requests should be used as the handoff boundary between agents.

This keeps implementation, review, discussion, CI status, and final approval visible in one place.

## Local Review Alternative

For solo development, a local review loop may be used before opening a pull request.

Example:

```text
Claude Code implements locally
-> local static analysis and tests pass
-> developer reviews git diff
-> Codex reviews local diff or branch diff
-> Claude Code addresses feedback
-> checks pass again
-> developer opens PR or merges after required validation
```

The PR-based workflow is preferred for larger or riskier changes.

## Branch Strategy

The default branch should be:

```text
main
```

Feature and fix work should happen in short-lived branches.

Recommended branch prefixes:

```text
feature/
fix/
chore/
docs/
test/
refactor/
```

Examples:

```text
feature/project-wizard
fix/config-import-validation
docs/update-testing-strategy
test/generation-snapshots
refactor/template-renderer
```

## Branch Rules

Branches should:

- have a clear purpose;
- stay focused;
- avoid unrelated changes;
- be deleted after merge;
- be rebased or updated from `main` when needed.

Large changes should be split into smaller branches when practical.

## Commit Style

The project should use Conventional Commits.

Recommended format:

```text
<type>(optional-scope): <summary>
```

Examples:

```text
feat(wizard): add project profile step
fix(validation): reject unsupported agent targets
test(generator): add snapshot for AGENTS output
docs(scope): clarify MVP exclusions
refactor(templates): extract shared section renderer
```

## Commit Types

Recommended commit types:

- `feat` for new user-facing functionality;
- `fix` for bug fixes;
- `docs` for documentation changes;
- `test` for test-only changes;
- `refactor` for behavior-preserving code changes;
- `chore` for maintenance tasks;
- `ci` for CI/CD changes;
- `build` for build system changes.

## Commit Rules

Commits should:

- be focused;
- describe the actual change;
- avoid mixing unrelated work;
- include tests when behavior changes;
- be created only after relevant local checks pass;
- not include generated noise unless intentional.

AI-generated commits must follow the same rules.

## Pull Request Workflow

Pull requests should be used for meaningful changes.

A pull request should include:

- clear summary;
- reason for the change;
- testing performed;
- static analysis performed;
- generated output impact if any;
- screenshots or notes for UI changes if helpful;
- known risks;
- agent involvement if AI agents were used.

## Pull Request Checklist

Every PR should verify:

- the change stays within intended scope;
- local static analysis and relevant tests were run before commit;
- GitHub CI checks pass;
- tests were added or updated when needed;
- generated Markdown changes were reviewed;
- snapshots were updated only intentionally;
- linting passes;
- type checking passes;
- relevant unit/integration tests pass;
- relevant Cypress tests pass or are intentionally deferred;
- documentation was updated if behavior changed;
- AI review was requested when appropriate.

## Agent Review Checklist

When Codex reviews a PR, it should focus on:

- correctness;
- missing tests;
- broken TDD expectations;
- architecture boundary violations;
- deterministic generation issues;
- inconsistent generated output;
- invalid assumptions in templates;
- weak validation;
- error handling problems;
- excessive complexity;
- duplicated logic;
- violations of SOLID, DRY, KISS, YAGNI, CoC, Composition over Inheritance, or Law of Demeter;
- SonarQube-style maintainability concerns;
- whether local checks and GitHub CI results support the change.

## Scope Control Rules

Pull requests should not expand scope without explicit approval.

A PR should not introduce:

- backend services;
- user accounts;
- cloud sync;
- repository analysis;
- AI dependency in MVP generation;
- team workspaces;
- non-dev domain support;
- template marketplace behavior;

unless the scope has been intentionally revised.

## Generated Output Rules

Generated files are product behavior.

If a PR changes generated Markdown, the PR must explain:

- which generated files changed;
- why they changed;
- whether snapshots were updated;
- whether human docs and agent files remain consistent.

Generated output should not change accidentally.

## Merge Strategy

The preferred merge strategy is squash merge for small and medium pull requests.

Squash merge keeps the main branch history readable while allowing detailed work-in-progress commits on feature branches.

Merge commits may be considered later if the project needs to preserve branch history.

Rebase merge may be used if it keeps history clean and does not hide important review context.

## Main Branch Expectations

The `main` branch should remain stable.

Before merge:

- required GitHub CI checks should pass;
- generated output changes should be reviewed;
- human approval should be given;
- unresolved review comments should be addressed or explicitly accepted as non-blocking.

## Release Workflow

The MVP does not need a complex release process.

Early releases may be tagged manually.

Recommended tag format:

```text
v0.1.0
v0.2.0
v0.3.0
```

The project should follow SemVer once public releases become meaningful.

## Versioning Expectations

Before the product is stable, `0.x` versions are acceptable.

Breaking changes to config format should be tracked carefully even before `1.0.0`.

Config schema and template versions should be recorded in `trohi.config.json`.

## Changelog Expectations

A changelog is not required for the earliest internal MVP.

Once the project has public users, changes should be tracked in:

```text
CHANGELOG.md
```

The changelog should focus on user-visible changes, output changes, and migration notes.

## Documentation Changes

Documentation changes should be made in the same PR as related behavior changes when practical.

Important documentation files include:

- product vision;
- MVP scope;
- architecture;
- config model;
- output files;
- testing strategy;
- coding standards;
- Git workflow;
- CI/CD strategy;
- agent instructions.

## Handling AI Agent Output

AI-generated code should be reviewed like human-written code.

The use of AI does not reduce requirements for:

- local static analysis before commit;
- GitHub CI verification;
- tests;
- readability;
- architecture boundaries;
- error handling;
- documentation;
- security and privacy expectations.

Agents must follow project documentation.

When an agent is uncertain, it should ask or leave a clear note instead of inventing project rules.

## Review Feedback Handling

When Codex or a human reviewer leaves feedback:

- valid issues should be fixed in the same PR when in scope;
- invalid suggestions should be explained briefly;
- out-of-scope suggestions should be deferred;
- large unrelated improvements should become separate issues or future tasks.

Claude Code may address valid review feedback, but the human developer decides final acceptance.

## Hotfixes

For early MVP development, hotfixes may be made directly if the project is not public and no release users are affected.

Once the project is public, hotfixes should still use branches and pull requests unless there is a strong reason not to.

Even for hotfixes, local checks and post-change verification should be performed.

## CI Relationship

Git workflow and CI/CD must support each other.

The Git workflow requires local checks before commit and GitHub CI checks before merge.

The exact CI setup is defined in `CI_CD_STRATEGY.md`.

## Non-Goals

This workflow does not require:

- Git Flow;
- long-lived release branches in the MVP;
- complex approval chains;
- enterprise branch protections at the start;
- fully automated AI-to-AI orchestration;
- automatic merge by AI agents;
- full SonarQube server setup before MVP validation.

These may be reconsidered if the project grows.

## Success Criteria

The Git workflow is successful if:

1. changes are easy to understand and review;
2. static analysis runs before commit;
3. GitHub CI repeats required checks before merge;
4. Claude Code can implement safely without committing failing changes or merging itself;
5. Codex can review changes through PRs or diffs;
6. human approval remains the final merge gate;
7. generated output changes are visible and intentional;
8. the main branch stays stable;
9. the workflow remains lightweight enough for solo development.

