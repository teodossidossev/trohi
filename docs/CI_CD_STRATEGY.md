# CI/CD Strategy

## Purpose

This document defines the CI/CD strategy for **trohi**.

The goal is to keep the main branch stable, make quality problems visible early, and ensure that AI-assisted changes follow the same quality gates as human-written code.

The MVP does not require complex deployment automation, but it does require a reliable quality pipeline.

## Core Principle

Quality checks should run in two places:

```text
before commit
and
inside GitHub CI
```

Local checks catch problems early.

GitHub CI provides an independent verification gate before merge.

A change should not rely only on local validation.

## Static Analysis Rule

Static analysis must be performed before commit and again in GitHub CI.

This includes linting and SonarQube-style static quality checks where practical.

The expected flow is:

```text
write code
-> run tests and static analysis locally
-> commit only if checks pass
-> open PR
-> GitHub CI runs the same quality gates
-> review
-> merge only after required checks pass
```

## MVP CI Goals

The MVP CI pipeline should verify:

- formatting;
- linting;
- static analysis rules;
- type checking;
- unit tests;
- integration tests;
- snapshot tests;
- build;
- selected Cypress tests when practical.

The first CI setup should focus on correctness and maintainability before deployment automation.

## Local Pre-Commit Quality Gate

Before committing code, the developer or AI agent should run the relevant local checks.

The project should support a local pre-commit workflow that checks:

- formatting;
- linting;
- static analysis rules where available;
- type checking when practical;
- related unit/integration tests;
- affected snapshot tests when generated output changes.

The exact tooling may include Git hooks later, but the rule exists even before automation is added.

## Recommended Local Commands

The exact commands will be finalized after the stack is selected.

Expected command categories:

```text
format
lint
static-analysis
typecheck
test
snapshot-test
build
cypress
```

A future package script structure may look like:

```text
check
check:static
check:types
check:tests
check:generated
check:e2e
```

The final names should be chosen after the package manager and tooling are selected.

## Git Hooks

The project should consider Git hooks for local enforcement.

Possible tools may include:

- Husky or equivalent;
- lint-staged or equivalent;
- package-manager-native scripts if sufficient.

Git hooks should help developers catch issues early, but they should not be the only enforcement mechanism.

GitHub CI remains the authoritative merge gate.

## GitHub CI Quality Gate

Every pull request to `main` should eventually run GitHub CI.

The CI pipeline should include:

1. install dependencies;
2. verify formatting;
3. run linting;
4. run static analysis;
5. run type checking;
6. run unit tests;
7. run integration tests;
8. run snapshot tests;
9. build the application;
10. run Cypress tests when practical.

For the early MVP, Cypress may be introduced into CI after the UI stabilizes, but the goal is to include it as part of the pull request quality gate.

## Static Analysis Expectations

The project should follow SonarQube-style maintainability and reliability rules.

Static analysis should look for:

- duplicated logic;
- unused code;
- unreachable branches;
- excessive complexity;
- unsafe patterns;
- weak error handling;
- unclear control flow;
- overly complex functions;
- maintainability issues;
- possible bugs.

The MVP does not require a full SonarQube server from day one.

However, the local tooling and GitHub CI should be compatible with adding SonarQube, SonarCloud, or an equivalent tool later.

## Linting Expectations

The project should use an opinionated linting setup.

Preferred direction:

- Google TypeScript Style (`gts`) or a similar strict TypeScript preset;
- no ignored lint rules without documented reason;
- linting runs locally before commit;
- linting runs in GitHub CI;
- AI agents must not bypass lint failures.

The final linter setup should be selected after the technical stack is chosen.

## Type Checking

If TypeScript is selected, strict type checking should be required.

Type checking should run:

- locally before commit where practical;
- in GitHub CI for every pull request;
- before release.

Type errors should block merge.

## Test Execution

The CI pipeline should run the test suite required for the changed area.

For MVP development, the expected test groups are:

- unit tests;
- integration tests;
- snapshot tests for generated output;
- Cypress tests for critical browser flows.

Generated output changes must be covered by snapshot or generation tests.

## Cypress in CI

Cypress should be used for end-to-end testing of critical user flows.

The MVP should aim to run Cypress in GitHub CI once the UI is stable enough.

Initial Cypress CI coverage should include:

- creating a project profile;
- completing the primary wizard path;
- selecting agent targets;
- previewing generated files;
- exporting output;
- importing config if the UI supports it.

Cypress tests should be stable and focused.

## Build Check

The application must build successfully before merge.

The build check should verify that:

- production build succeeds;
- type errors do not pass silently;
- generated assets are valid;
- no missing environment assumptions are introduced.

## Deployment Strategy

Deployment is not the focus of the MVP.

The MVP may initially be deployed as a static browser application.

The CI/CD strategy should not introduce backend deployment assumptions while the MVP has no backend.

Future deployment options may include:

- static hosting;
- preview deployments;
- production deployment workflow;
- backend deployment if backend services are added later.

## Preview Deployments

Preview deployments are useful but not required for the first internal MVP.

They may be added later to support UI review and external testing.

## Required Checks Before Merge

Before merging a pull request, the following should pass:

- formatting check;
- linting;
- static analysis;
- type checking;
- unit tests;
- integration tests;
- snapshot tests;
- build;
- Cypress tests when configured;
- human review.

AI review may be requested as an additional quality gate.

## AI Agent Rules for CI/CD

AI agents working on this project must:

- run relevant checks before committing when possible;
- not commit code with known lint, static analysis, type, or test failures;
- not weaken CI checks to make a PR pass;
- explain any skipped check clearly;
- update tests when behavior changes;
- update snapshots only after reviewing generated output;
- treat GitHub CI failures as blocking unless the human developer explicitly decides otherwise.

## Codex Review Relationship

Codex may be used as a pull request review agent.

Codex review should complement CI, not replace it.

CI checks objective quality gates.

Codex review checks implementation quality, missing tests, architectural issues, maintainability risks, and scope control.

The preferred flow is:

```text
Claude Code implements
-> local checks pass
-> PR opens
-> GitHub CI runs
-> Codex reviews
-> Claude Code addresses valid feedback
-> CI passes again
-> human approves
-> merge
```

## Failure Handling

If local checks fail before commit:

- fix the issue before committing;
- do not bypass the failure unless there is a documented reason.

If GitHub CI fails:

- investigate the failing job;
- fix the issue in the same branch;
- rerun CI;
- do not merge until required checks pass.

If a check is flaky:

- identify the cause;
- stabilize the test or workflow;
- do not simply disable it without documenting the reason.

## Scope Control

CI/CD work should stay focused on MVP quality gates.

The MVP should not introduce:

- complex deployment pipelines;
- multi-environment release automation;
- enterprise approval workflows;
- production monitoring;
- backend deployment;
- secret-heavy infrastructure;

unless the product scope changes.

## Security Notes

The CI pipeline should avoid storing secrets unless required.

The MVP should not require secrets for basic quality checks.

Future integrations should use least-privilege credentials and clear separation between local-only project data and hosted services.

## Future Enhancements

Future CI/CD improvements may include:

- SonarCloud or SonarQube integration;
- preview deployments;
- dependency vulnerability scanning;
- automated release notes;
- semantic versioning automation;
- package provenance checks;
- browser matrix testing;
- performance budgets;
- accessibility checks;
- GitHub branch protection rules;
- required Codex review before merge.

## Non-Goals

The MVP CI/CD strategy does not require:

- full enterprise CI/CD;
- production deployment automation;
- multi-cloud support;
- Kubernetes;
- backend deployment;
- advanced release trains;
- complex secret management;
- full SonarQube server setup from day one.

## Success Criteria

The CI/CD strategy is successful if:

1. static analysis runs before commit and in GitHub CI;
2. local checks catch common issues early;
3. GitHub CI independently verifies pull requests;
4. generated output regressions are detected;
5. type errors and lint failures block merge;
6. tests protect the core generation workflow;
7. Cypress protects the primary user flow;
8. AI agents cannot bypass quality expectations without explicit human approval.

