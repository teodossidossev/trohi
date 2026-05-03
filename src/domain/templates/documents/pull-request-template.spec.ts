import { describe, it, expect } from 'vitest';
import { pullRequestTemplateTemplate } from './pull-request-template';
import { renderDocument } from '../document-template';
import { RenderingContext } from '../rendering-context';
import { TrohiBootstrapPreset } from '../../config/presets/trohi-bootstrap-preset';
import { ProjectConfig } from '../../config/project-config';
import { ProjectSection } from '../../config/sections/project-section';
import { AgentsSection } from '../../config/sections/agents-section';
import { ProjectName } from '../../values/project-name';
import { OutputCategory } from '../../output/output-category';
import { OutputTarget } from '../../output/output-target';

describe('pullRequestTemplateTemplate', () => {
  describe('definition', () => {
    it('writes to .github/pull_request_template.md as RepositoryWorkflow/None', () => {
      expect(pullRequestTemplateTemplate.definition.path.value).toBe(
        '.github/pull_request_template.md',
      );
      expect(pullRequestTemplateTemplate.definition.category).toBe(
        OutputCategory.RepositoryWorkflow,
      );
      expect(pullRequestTemplateTemplate.definition.target).toBe(OutputTarget.None);
    });
  });

  describe('rendering against the trohi-bootstrap preset', () => {
    const subject = () =>
      renderDocument(
        pullRequestTemplateTemplate,
        RenderingContext.create({ config: TrohiBootstrapPreset.create() }),
      );

    it('produces a stable, fully-specified Markdown document', () => {
      expect(subject().file.content.value).toBe(
        '# Pull Request\n\n' +
          '## Summary\n\n' +
          '<!-- What changed? Keep it concise. -->\n\n' +
          '-\n\n' +
          '## Why\n\n' +
          '<!-- Why is this change needed? -->\n\n' +
          '-\n\n' +
          '## Scope\n\n' +
          '- [ ] This change is within MVP scope.\n' +
          '- [ ] No backend, accounts, cloud sync, repo analysis, AI generation, team features, or non-dev presets introduced.\n' +
          '- [ ] Any scope impact is explained below.\n\n' +
          '## Testing\n\n' +
          '- [ ] Formatting checked.\n' +
          '- [ ] Linting passed.\n' +
          '- [ ] Type checking passed.\n' +
          '- [ ] Vitest unit/integration tests passed.\n' +
          '- [ ] Cypress tests passed or are not affected.\n' +
          '- [ ] Snapshot changes reviewed.\n' +
          '- [ ] Build passed.\n\n' +
          '## Architecture Checklist\n\n' +
          '- [ ] Views remain presentational.\n' +
          '- [ ] No raw JSON / DTO leakage into UI components.\n' +
          '- [ ] UI consumes UI view models.\n' +
          '- [ ] Mappers were added or updated where needed.\n' +
          '- [ ] Domain models protect relevant invariants.\n' +
          '- [ ] Ports/adapters are used for infrastructure boundaries where relevant.\n' +
          '- [ ] No unnecessary inheritance or over-engineered abstractions.\n' +
          '- [ ] No direct HttpClient or REST service calls from views.\n\n' +
          '## Generated Output Impact\n\n' +
          '- [ ] No generated Markdown changes.\n' +
          '- [ ] Generated Markdown changed and snapshots were reviewed.\n\n' +
          'If generated output changed, list affected files and why:\n\n' +
          '-\n\n' +
          '## Security and Privacy\n\n' +
          '- [ ] No secrets are stored in config or generated files.\n' +
          '- [ ] No hidden network calls were added.\n' +
          '- [ ] No telemetry/analytics were added without explicit approval.\n' +
          '- [ ] Import/export validation and file path safety were considered.\n\n' +
          '## AI Agent Usage\n\n' +
          '- [ ] Claude Code implemented or assisted.\n' +
          '- [ ] Codex (or equivalent generic agent) review requested or planned.\n' +
          '- [ ] Human approval required before merge.\n\n' +
          '## Risks / Notes\n\n' +
          '-\n\n' +
          '@codex\n',
      );
    });

    it('emits no warnings', () => {
      expect(subject().warnings).toEqual([]);
    });

    it('is deterministic across calls', () => {
      const a = subject().file.content.value;
      const b = subject().file.content.value;
      expect(a).toBe(b);
    });

    describe('config-driven items', () => {
      it('names the chosen test runners (Vitest + Cypress)', () => {
        const value = subject().file.content.value;
        expect(value).toContain('Vitest unit/integration tests passed.');
        expect(value).toContain('Cypress tests passed or are not affected.');
      });

      it('mentions Claude and Codex because both are active in the preset', () => {
        const value = subject().file.content.value;
        expect(value).toContain('Claude Code implemented');
        expect(value).toContain('Codex');
      });

      it('includes the @codex trailer when GenericAgent is active', () => {
        expect(subject().file.content.value.endsWith('@codex\n')).toBe(true);
      });
    });
  });

  describe('rendering for a project that does not use Codex', () => {
    it('omits the @codex trailer and Codex review checkbox', () => {
      const config = ProjectConfig.create({
        configVersion: '1',
        project: ProjectSection.create({ name: ProjectName.create('p') }),
        agents: AgentsSection.create({
          activeTargets: new Set([OutputTarget.Claude]),
          deferredTargets: new Set([
            OutputTarget.Cursor,
            OutputTarget.Copilot,
            OutputTarget.GenericAgent,
          ]),
        }),
      });
      const value = renderDocument(pullRequestTemplateTemplate, RenderingContext.create({ config }))
        .file.content.value;
      expect(value).toContain('Claude Code implemented');
      expect(value).not.toContain('Codex');
      expect(value.endsWith('@codex\n')).toBe(false);
    });
  });
});
