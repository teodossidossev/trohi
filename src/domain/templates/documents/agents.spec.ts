import { describe, it, expect } from 'vitest';
import { agentsTemplate } from './agents';
import { renderDocument } from '../document-template';
import { RenderingContext } from '../rendering-context';
import { TrohiBootstrapPreset } from '../../config/presets/trohi-bootstrap-preset';
import { ProjectConfig } from '../../config/project-config';
import { ProjectSection } from '../../config/sections/project-section';
import { ProjectName } from '../../values/project-name';
import { OutputCategory } from '../../output/output-category';
import { OutputTarget } from '../../output/output-target';

describe('agentsTemplate', () => {
  describe('definition', () => {
    it('writes to AGENTS.md as GenericAgentInstructions/GenericAgent', () => {
      expect(agentsTemplate.definition.path.value).toBe('AGENTS.md');
      expect(agentsTemplate.definition.category).toBe(OutputCategory.GenericAgentInstructions);
      expect(agentsTemplate.definition.target).toBe(OutputTarget.GenericAgent);
    });
  });

  describe('rendering against the trohi-bootstrap preset', () => {
    const subject = () =>
      renderDocument(
        agentsTemplate,
        RenderingContext.create({ config: TrohiBootstrapPreset.create() }),
      );

    it('produces a stable, fully-specified Markdown document', () => {
      expect(subject().file.content.value).toBe(
        '# Generic Agent Instructions\n\n' +
          '**trohi** is a software project.\n\n' +
          '*Dev-first tool for creating structured project documentation and AI agent instruction files for new software projects.*\n\n' +
          '## Tech Context\n\n' +
          '- Framework: Angular 21\n' +
          '- Runtime: Node.js 22\n' +
          '- Package manager: npm\n' +
          '- Schema validator: Zod\n' +
          '- ZIP library: fflate\n\n' +
          '## Architecture Rules\n\n' +
          '- Use explicit domain models: yes\n' +
          '- Require DTO validation before mapping: yes\n' +
          '- Use UI view models in views: yes\n' +
          '- Views are presentational: yes\n' +
          '- Has feature business/application layer: yes\n' +
          '- Allow direct HttpClient/REST from views: no\n\n' +
          '## Testing\n\n' +
          '- Use TDD: yes\n' +
          '- Unit/integration tests: Vitest\n' +
          '- End-to-end tests: Cypress\n\n' +
          '## Review Focus\n\n' +
          '- correctness\n' +
          '- missing tests\n' +
          '- broken TDD expectations\n' +
          '- view components containing business logic\n' +
          '- direct HttpClient or REST calls from views\n' +
          '- DTOs or raw JSON leaking into UI components\n' +
          '- missing or weak mappers\n' +
          '- domain models that should protect invariants but do not\n' +
          '- inconsistent generated output\n' +
          '- unsafe import/export behavior\n' +
          '- unsafe generated file paths\n' +
          '- scope creep beyond the MVP\n\n' +
          '## Deferred Agent Targets\n\n' +
          '- cursor\n' +
          '- copilot\n\n' +
          '## Security and Privacy\n\n' +
          '- Do not add hidden network calls.\n' +
          '- Do not add telemetry or analytics without explicit approval.\n' +
          '- Imported configuration files must be validated before use.\n' +
          '- Generated paths must be safe and repository-friendly.\n' +
          '- Do not store secrets in configuration or generated files.\n',
      );
    });

    it('emits no warnings when the preset populates every section', () => {
      expect(subject().warnings).toEqual([]);
    });

    it('is deterministic across calls', () => {
      const a = subject().file.content.value;
      const b = subject().file.content.value;
      expect(a).toBe(b);
    });

    describe('config-driven rules and review focus', () => {
      it('contains review-focus items conditional on the rules being enabled', () => {
        const value = subject().file.content.value;
        expect(value).toContain('view components containing business logic');
        expect(value).toContain('direct HttpClient or REST calls from views');
      });

      it('does not hardcode Jest', () => {
        expect(subject().file.content.value).not.toContain('Jest');
        expect(subject().file.content.value).not.toContain('jest');
      });
    });
  });

  describe('rendering against a minimal config', () => {
    it('renders the title plus universal sections and warns for missing sections', () => {
      const config = ProjectConfig.create({
        configVersion: '1',
        project: ProjectSection.create({ name: ProjectName.create('m') }),
      });
      const result = renderDocument(agentsTemplate, RenderingContext.create({ config }));
      const value = result.file.content.value;
      expect(value).toContain('# Generic Agent Instructions');
      expect(value).toContain('## Review Focus');
      expect(value).toContain('## Security and Privacy');
      // Sections that depend on missing config are absent.
      expect(value).not.toContain('## Tech Context');
      expect(value).not.toContain('## Testing');
      expect(value).not.toContain('## Architecture Rules');
      expect(value).not.toContain('## Deferred Agent Targets');
      // Warnings are produced for the missing config sections.
      const messages = result.warnings.map((w) => w.message);
      expect(messages.length).toBeGreaterThanOrEqual(3);
    });
  });
});
