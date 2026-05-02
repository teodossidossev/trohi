# Security and Privacy

## Purpose

This document defines the security and privacy principles for **trohi**.

The MVP works with project context, engineering decisions, generated documentation, and AI agent instructions. This information may include sensitive product ideas, architecture decisions, internal workflows, or business context.

The MVP must therefore be designed to keep user data local, avoid unnecessary collection, and prevent accidental exposure.

## Core Privacy Principle

The MVP should be local-first.

User project data should remain in the browser and in user-controlled files.

The MVP must not send project configuration, generated documentation, or agent instruction files to a backend service because the MVP has no backend.

## MVP Security Model

The MVP security model is intentionally simple:

```text
User browser
-> local working state
-> generated preview
-> local export
-> user-controlled repository
```

There are no user accounts, hosted projects, server-side databases, cloud sync, or remote processing in the MVP.

## Data Handled by the MVP

The MVP may handle the following user-provided data:

- project name;
- project description;
- product vision;
- target users;
- project goals;
- project constraints;
- architecture decisions;
- technology preferences;
- coding standards;
- testing strategy;
- Git workflow;
- CI/CD expectations;
- selected AI agent targets;
- generated documentation;
- exported configuration files.

This data should be treated as potentially sensitive, even if it does not contain credentials.

## Data Not Required by the MVP

The MVP must not require:

- user accounts;
- passwords;
- API keys;
- access tokens;
- payment details;
- private repository credentials;
- cloud storage credentials;
- personal identity information beyond what the user chooses to type into project fields.

## Data That Must Not Be Stored in Config

`trohi.config.json` must not store:

- API keys;
- OAuth tokens;
- passwords;
- private keys;
- deployment secrets;
- database credentials;
- billing data;
- authentication cookies;
- private access tokens;
- unnecessary browser UI state.

If a user needs to document required environment variables, the config should store only names and descriptions, not real secret values.

Example allowed:

```text
DATABASE_URL: required connection string for the application database
```

Example not allowed:

```text
DATABASE_URL=postgres://real-user:real-password@real-host/real-db
```

## Local Storage Rules

The MVP may use browser storage for convenience, such as restoring an in-progress project session.

If browser storage is used:

- it should be limited to project configuration and UI state needed for the local session;
- it should not store secrets;
- users should be able to export their config;
- users should be able to clear local data;
- the product should not imply that browser storage is a secure vault.

The durable source of truth should be the exported `trohi.config.json` file controlled by the user.

## Export Security

The MVP exports files locally.

Exported files may include sensitive project information.

The UI should make it clear what will be exported before export happens.

Export should support:

- previewing generated files;
- excluding optional files;
- downloading a ZIP archive;
- downloading the source config;
- copying individual file content.

The product should not upload exported files anywhere in the MVP.

## Import Security

The MVP may import `trohi.config.json` files.

Imported files must be validated before use.

Import should check:

- valid JSON;
- supported config version;
- expected config shape;
- required metadata;
- allowed output targets;
- invalid or suspicious values where practical.

The app should not execute code from imported files.

Templates, config values, and generated content should be treated as data, not executable code.

## Generated Content Safety

Generated Markdown files should not include unsafe or misleading content.

The generator should avoid:

- embedding secrets;
- inventing credentials;
- generating commands that expose sensitive data;
- adding deployment instructions that assume secrets are available;
- creating agent instructions that encourage unsafe behavior;
- adding rules not present in the source config.

## AI Agent Safety Rules

AI agents working on trohi must:

- not add backend data collection to the MVP without explicit approval;
- not add analytics, telemetry, or tracking without explicit approval;
- not store secrets in config files;
- not generate real credentials;
- not weaken validation around imported files;
- not bypass local or CI security checks;
- not introduce external network calls from the MVP without explicit approval;
- explain security implications when adding dependencies or integrations.

## No Hidden Network Calls

The MVP should not make hidden network requests containing user project data.

Any future network behavior must be:

- explicit;
- documented;
- user-visible;
- optional where practical;
- covered by privacy documentation.

This is especially important for future AI integrations.

## Future AI Integration Privacy

AI assistance is a future feature, not part of the MVP dependency.

If AI assistance is added later, the product must clearly define:

- what data is sent to the AI provider;
- why the data is sent;
- whether sending is optional;
- how the user approves the action;
- what is retained locally;
- what is never sent;
- how secrets are detected or excluded where practical.

AI features should use explicit user actions such as:

- review this generated document;
- suggest missing config fields;
- analyze this uploaded project file;
- improve this section.

The product should avoid background AI processing of user project data without clear consent.

## Future Backend Privacy

A backend may be added in a future version for features such as accounts, sync, team profiles, or hosted templates.

If a backend is added later, the product must revisit:

- authentication;
- authorization;
- data storage;
- encryption in transit;
- encryption at rest where appropriate;
- user data deletion;
- organization data boundaries;
- audit logs;
- backup policy;
- incident response;
- privacy policy;
- terms of service.

The MVP architecture should not assume a backend exists.

## Future Team Workspace Security

Team features are outside the MVP.

If team workspaces are added later, the product must define:

- organization ownership;
- project access control;
- role-based permissions;
- shared template permissions;
- audit trail;
- config change history;
- export permissions;
- integration permissions.

Team features should not be retrofitted casually because they change the security model significantly.

## Repository Integration Security

Direct GitHub, GitLab, or other repository integrations are outside the MVP.

If repository integration is added later, the product must use least-privilege access.

Repository integrations should clearly define:

- requested scopes;
- what files can be read;
- what files can be written;
- whether pull requests are created;
- whether branches are created;
- whether repository metadata is stored;
- how tokens are handled.

The MVP should avoid requiring repository credentials.

## Dependency Security

Dependencies should be selected carefully.

Before adding a dependency, consider:

- whether it is necessary;
- whether it is actively maintained;
- whether it has a reasonable security history;
- whether it increases bundle risk;
- whether it introduces network behavior;
- whether it touches import/export paths;
- whether it handles archives, parsing, or user files safely.

Dependencies used for ZIP export, parsing, validation, or file handling deserve extra scrutiny.

## Static Analysis and Security

Static analysis should help catch security and maintainability issues.

The project should use linting, type checking, and SonarQube-style rules to detect:

- unsafe patterns;
- dead code;
- unused values;
- overly complex control flow;
- weak error handling;
- suspicious string handling;
- risky dependency usage;
- maintainability problems.

Static analysis must run before commit and again in GitHub CI.

## Validation Security

Validation is a security boundary for imported config files.

The application should not trust imported JSON blindly.

Validation should reject or warn on:

- unsupported schema versions;
- unknown critical output targets;
- invalid file paths;
- malformed sections;
- impossible option combinations;
- values that would generate unsafe output.

## File Path Safety

Generated file paths should be controlled by the application.

The generator should prevent unsafe paths such as:

- absolute paths;
- parent directory traversal;
- paths outside the intended export root;
- hidden unexpected files unless intentionally supported;
- executable script paths unless explicitly selected.

The MVP output paths should come from known output definitions, not arbitrary user input.

## Markdown Safety

Generated Markdown should be treated as content.

The application should avoid rendering untrusted Markdown in a way that executes scripts.

If Markdown preview supports rich rendering later, it should sanitize rendered content appropriately.

For the MVP, a plain text or safe Markdown preview is preferred.

## Telemetry and Analytics

The MVP should not include telemetry or analytics by default.

If analytics are added later, they must be:

- disclosed;
- minimal;
- privacy-conscious;
- free of project content;
- configurable or avoidable where practical.

Analytics must not send project configuration or generated documentation content without explicit user consent.

## Error Reporting

The MVP should not automatically send error reports containing project data.

If future error reporting is added, it must avoid collecting:

- project descriptions;
- generated documentation;
- config contents;
- file contents;
- secrets;
- repository information.

User opt-in should be considered for detailed diagnostics.

## Privacy-Friendly Defaults

The MVP should default to:

- local-only data handling;
- no backend;
- no accounts;
- no telemetry;
- no required AI calls;
- no repository credentials;
- no hidden uploads;
- explicit export and import.

These defaults should be part of the product's trust model.

## User Control

Users should control:

- what information they enter;
- what files are generated;
- what files are exported;
- where exported files are stored;
- whether optional files are included;
- whether future AI or backend integrations are used.

## Security Review Checklist

Before a change is considered ready, verify:

- no secrets are stored in config;
- no hidden network calls were added;
- imported configs are validated;
- generated paths are safe;
- generated content does not invent secrets;
- dependencies are justified;
- static analysis passes locally;
- GitHub CI passes;
- user data remains local in the MVP;
- future backend or AI behavior is not introduced accidentally.

## MVP Non-Goals

The MVP does not include:

- authentication;
- authorization;
- backend storage;
- cloud sync;
- team permissions;
- remote repository access;
- payment handling;
- production secret management;
- hosted AI processing;
- telemetry;
- enterprise compliance features.

These are future concerns if the product expands.

## Future Security Candidates

Future versions may need:

- privacy policy;
- terms of service;
- user data deletion flow;
- encryption strategy;
- access control;
- audit logs;
- secret scanning;
- repository permission review;
- AI provider data controls;
- organization-level policy management;
- compliance review for team or enterprise usage.

## Success Criteria

The security and privacy model is successful if:

1. user project data stays local in the MVP;
2. no backend is required;
3. no AI provider receives data by default;
4. configs do not store secrets;
5. imports are validated before use;
6. generated file paths are safe;
7. users clearly see what will be exported;
8. static analysis runs before commit and in GitHub CI;
9. future backend, AI, and team features have clear security boundaries before implementation.