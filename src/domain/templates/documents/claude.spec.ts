import { describe, it, expect } from 'vitest';
import { claudeTemplate } from './claude';
import { renderDocument } from '../document-template';
import { RenderingContext } from '../rendering-context';
import { TrohiBootstrapPreset } from '../../config/presets/trohi-bootstrap-preset';
import { ProjectConfig } from '../../config/project-config';
import { ProjectSection } from '../../config/sections/project-section';
import { ProjectName } from '../../values/project-name';
import { OutputCategory } from '../../output/output-category';
import { OutputTarget } from '../../output/output-target';

describe('claudeTemplate', () => {
  describe('definition', () => {
    it('writes to CLAUDE.md as AgentSpecificInstructions/Claude', () => {
      expect(claudeTemplate.definition.path.value).toBe('CLAUDE.md');
      expect(claudeTemplate.definition.category).toBe(OutputCategory.AgentSpecificInstructions);
      expect(claudeTemplate.definition.target).toBe(OutputTarget.Claude);
    });
  });

  describe('rendering against the trohi-bootstrap preset', () => {
    const subject = () =>
      renderDocument(
        claudeTemplate,
        RenderingContext.create({ config: TrohiBootstrapPreset.create() }),
      );

    it('produces a stable, fully-specified Markdown document', () => {
      expect(subject().file.content.value).toBe(
        '# Claude Code Instructions\n\n' +
          '**trohi** is a software project.\n\n' +
          '*Dev-first tool for creating structured project documentation and AI agent instruction files for new software projects.*\n\n' +
          '## Tech Stack\n\n' +
          '- Framework: Angular 21\n' +
          '- Runtime: Node.js 22\n' +
          '- Package manager: npm\n' +
          '- Schema validator: Zod\n' +
          '- ZIP library: fflate\n\n' +
          '## Application Type\n\n' +
          '- Application type: browser-app\n' +
          '- Backend: no\n' +
          '- Persistence: local-import-export\n\n' +
          '## Domain Modeling Rules\n\n' +
          '- Use explicit domain models: yes\n' +
          '- Require DTO validation before mapping: yes\n' +
          '- Use UI view models in views: yes\n\n' +
          '## Feature Architecture Rules\n\n' +
          '- Views are presentational: yes\n' +
          '- Has feature business/application layer: yes\n' +
          '- Allow direct HttpClient/REST from views: no\n\n' +
          '## Testing Rules\n\n' +
          '- Use TDD: yes\n' +
          '- Unit/integration tests: Vitest\n' +
          '- End-to-end tests: Cypress\n\n' +
          '## Local Checks Before Commit\n\n' +
          '- formatting\n' +
          '- linting\n' +
          '- type checking\n' +
          '- unit and integration tests\n' +
          '- snapshot tests for generated Markdown\n' +
          '- affected end-to-end tests\n' +
          '- production build\n\n' +
          '## Scope Control\n\n' +
          '- Do not add backend, accounts, cloud sync, or team workspaces.\n' +
          '- Do not add repository analysis or AI generation as a hard requirement.\n' +
          '- Do not introduce non-dev domain presets.\n' +
          '- Do not generate output for deferred agent targets without explicit instruction: cursor, copilot.\n',
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

    describe('config-driven content', () => {
      it('mentions Cursor/Copilot only inside the deferred-targets line', () => {
        const value = subject().file.content.value;
        const cursorMatches = [...value.matchAll(/cursor/g)];
        const copilotMatches = [...value.matchAll(/copilot/g)];
        expect(cursorMatches).toHaveLength(1);
        expect(copilotMatches).toHaveLength(1);
        const deferredIdx = value.indexOf('Do not generate output for deferred');
        expect(deferredIdx).toBeGreaterThan(0);
        expect(cursorMatches[0].index).toBeGreaterThan(deferredIdx);
      });

      it('does not hardcode Jest', () => {
        expect(subject().file.content.value).not.toContain('Jest');
        expect(subject().file.content.value).not.toContain('jest');
      });
    });
  });

  describe('rendering against a minimal config', () => {
    it('still renders title, local checks, and scope control', () => {
      const config = ProjectConfig.create({
        configVersion: '1',
        project: ProjectSection.create({ name: ProjectName.create('m') }),
      });
      const result = renderDocument(claudeTemplate, RenderingContext.create({ config }));
      const value = result.file.content.value;
      expect(value).toContain('# Claude Code Instructions');
      expect(value).toContain('## Local Checks Before Commit');
      expect(value).toContain('## Scope Control');
      // Sections that depend on missing config are absent.
      expect(value).not.toContain('## Tech Stack');
      expect(value).not.toContain('## Testing Rules');
      // The deferred-target bullet is omitted when no agents section.
      expect(value).not.toContain('Do not generate output for deferred');
    });
  });
});
