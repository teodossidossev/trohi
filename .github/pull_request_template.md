# Pull Request

## Summary

<!-- What changed? Keep it concise. -->

-

## Why

<!-- Why is this change needed? -->

-

## Scope

- [ ] This change is within MVP scope.
- [ ] This change does not introduce backend, accounts, cloud sync, repo analysis, required AI generation, team features, or non-dev presets.
- [ ] Any scope impact is explained below.

## Testing

- [ ] Formatting checked.
- [ ] Linting passed.
- [ ] Static analysis command set passed locally.
- [ ] Type checking passed.
- [ ] Vitest unit/integration tests passed.
- [ ] Snapshot changes reviewed.
- [ ] Cypress tests passed or are not affected.
- [ ] Angular build passed.

## Architecture Checklist

- [ ] Views remain presentational.
- [ ] Business logic is in the feature business/application layer or domain layer.
- [ ] No raw JSON / DTO leakage into UI components.
- [ ] UI uses UI view models.
- [ ] Mappers were added or updated where needed.
- [ ] Domain models protect relevant invariants.
- [ ] No direct `HttpClient` or REST service calls from views.
- [ ] Ports/adapters are used for infrastructure boundaries where relevant.
- [ ] No unnecessary inheritance or over-engineered abstractions were introduced.

## Generated Output Impact

- [ ] No generated Markdown changes.
- [ ] Generated Markdown changed and snapshots were reviewed.

If generated output changed, list affected files and why:

-

## Security and Privacy

- [ ] No secrets are stored in config or generated files.
- [ ] No hidden network calls were added.
- [ ] No telemetry/analytics were added.
- [ ] Import/export validation and file path safety were considered.

## AI Agent Usage

- [ ] Claude Code implemented or assisted.
- [ ] Codex review requested or planned.
- [ ] Human approval required before merge.

## Risks / Notes

-

@codex
