# Agent Bootstrap Scope

## Purpose

This document defines the initial AI-agent workflow used to develop **trohi** itself.

## Current Working Agents

For the initial repository workflow:

```text
Claude Code = implementation agent
Codex = review agent
Human developer = final approver
```

## Required Agent Files Now

The current repo needs:

```text
CLAUDE.md
AGENTS.md
.claude/skills/implement-with-tdd/SKILL.md
.claude/skills/prepare-pr/SKILL.md
.claude/skills/respond-to-review/SKILL.md
.github/pull_request_template.md
```

## Deferred Agent Targets

The following are product-supported future/generated targets, but they are not required for trohi's own initial development workflow:

```text
.cursor/rules/*.mdc
.github/copilot-instructions.md
```

## Reason

The project will initially be developed with Claude Code and Codex.

Adding Cursor and GitHub Copilot repository instructions now would add noise without improving the current workflow.

They remain important future output targets for the trohi product, but they are not needed as bootstrap files for this repository.
