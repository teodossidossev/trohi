---
name: respond-to-review
description: Use this skill when responding to Codex or human review comments on a trohi pull request. Address valid feedback, reject invalid feedback clearly, avoid scope creep, and rerun relevant checks.
---

# Respond To Review

## Goal

Respond to Codex or human review feedback without expanding scope or weakening quality gates.

## Review Triage

For each review comment, classify it as:

- valid and in scope;
- valid but out of scope;
- incorrect or not applicable;
- unclear and needs clarification.

Do not implement unrelated refactors just because they were suggested.

## Valid In-Scope Feedback

For valid in-scope feedback:

1. Add or update tests first where practical.
2. Make the smallest code change that addresses the issue.
3. Preserve architecture boundaries.
4. Update snapshots only after reviewing generated output.
5. Run relevant checks again.
6. Reply with what changed.

## Valid Out-of-Scope Feedback

For valid but out-of-scope feedback:

- acknowledge the point;
- explain why it is out of scope for the PR;
- suggest a follow-up issue or future task if useful;
- do not expand the PR without human approval.

## Incorrect Feedback

For incorrect or not applicable feedback:

- explain briefly and respectfully;
- reference the relevant project document or code path;
- do not change code just to satisfy an incorrect comment.

## Architecture-Specific Review Checks

When responding, protect these rules:

- views stay presentational;
- feature logic stays in feature business/application layer;
- external data flows through validation and mappers;
- UI consumes UI view models, not DTOs or raw JSON;
- components do not call `HttpClient` or REST services directly;
- infrastructure is accessed through services/adapters;
- domain models protect invariants;
- OOP is used pragmatically, not with deep inheritance;
- generation remains deterministic.

## Generated Output Feedback

If the review concerns generated Markdown:

- verify whether the output changed intentionally;
- update generation tests;
- update snapshots only after review;
- check consistency between human docs and agent files;
- explain changed files in the PR.

## Test and Check Requirements

After addressing feedback, run relevant checks:

- formatting;
- linting;
- static analysis command set;
- type checking;
- Vitest tests;
- snapshot tests;
- affected Cypress tests;
- build.

Do not claim feedback is resolved while known required checks are failing.

## Response Style

Use concise review responses:

```text
Addressed in <commit/changes>: <summary>. Added/updated tests: <tests>. Checks run: <commands>.
```

For rejected feedback:

```text
Not changed: <reason>. This is out of scope / not applicable because <brief explanation>.
```

## Done Criteria

Review response is complete when:

- all comments are classified;
- valid in-scope issues are addressed;
- invalid or out-of-scope comments are explained;
- tests and snapshots are updated where needed;
- relevant checks pass;
- the PR remains focused.
