import { describe, it, expect } from 'vitest';
import { mvpScopeTemplate } from './mvp-scope';
import { renderDocument } from '../document-template';
import { RenderingContext } from '../rendering-context';
import { TrohiBootstrapPreset } from '../../config/presets/trohi-bootstrap-preset';
import { ProjectConfig } from '../../config/project-config';
import { ProjectSection } from '../../config/sections/project-section';
import { MvpSection } from '../../config/sections/mvp-section';
import { ProjectName } from '../../values/project-name';
import { OutputCategory } from '../../output/output-category';
import { OutputTarget } from '../../output/output-target';

describe('mvpScopeTemplate', () => {
  describe('definition', () => {
    it('writes to docs/MVP_SCOPE.md as HumanDocumentation/None', () => {
      expect(mvpScopeTemplate.definition.path.value).toBe('docs/MVP_SCOPE.md');
      expect(mvpScopeTemplate.definition.category).toBe(OutputCategory.HumanDocumentation);
      expect(mvpScopeTemplate.definition.target).toBe(OutputTarget.None);
    });
  });

  describe('rendering against the trohi-bootstrap preset', () => {
    const subject = () =>
      renderDocument(
        mvpScopeTemplate,
        RenderingContext.create({ config: TrohiBootstrapPreset.create() }),
      );

    it('produces a stable, fully-specified Markdown document', () => {
      expect(subject().file.content.value).toBe(
        '# MVP Scope\n\n' +
          '## Primary Use Case\n\n' +
          'A user starts a new software project without documentation, answers a structured wizard, previews generated files, and exports project documentation plus AI agent instruction files.\n\n' +
          '## Included\n\n' +
          '- Project profile creation\n' +
          '- Guided wizard\n' +
          '- Structured source configuration\n' +
          '- Human documentation generation\n' +
          '- AI agent instruction generation\n' +
          '- Preview before export\n' +
          '- ZIP and individual file export\n' +
          '- Config import\n\n' +
          '## Excluded\n\n' +
          '- Backend\n' +
          '- User accounts\n' +
          '- Cloud sync\n' +
          '- Required AI integration\n' +
          '- Repository analysis\n' +
          '- Existing documentation import\n' +
          '- Direct Git integration\n' +
          '- Team workspaces\n' +
          '- Template marketplace\n' +
          '- Non-dev domain presets\n',
      );
    });

    it('emits no warnings when the preset populates every field', () => {
      expect(subject().warnings).toEqual([]);
    });

    it('is deterministic across calls', () => {
      const a = subject().file.content.value;
      const b = subject().file.content.value;
      expect(a).toBe(b);
    });

    it('preserves the config-declared order of features', () => {
      // Features must render in declaration order; reordering would
      // change the document for no good reason and break diffs.
      const value = subject().file.content.value;
      const wizardIdx = value.indexOf('Guided wizard');
      const previewIdx = value.indexOf('Preview before export');
      expect(wizardIdx).toBeGreaterThan(0);
      expect(previewIdx).toBeGreaterThan(wizardIdx);
    });
  });

  describe('rendering against a partial config', () => {
    it('omits the Excluded section without warning when there are no exclusions', () => {
      const config = ProjectConfig.create({
        configVersion: '1',
        project: ProjectSection.create({ name: ProjectName.create('p') }),
        mvp: MvpSection.create({
          primaryUseCase: 'do the thing',
          includedFeatures: ['a'],
        }),
      });
      const result = renderDocument(mvpScopeTemplate, RenderingContext.create({ config }));
      expect(result.file.content.value).toContain('## Included');
      expect(result.file.content.value).not.toContain('## Excluded');
      // No warning for empty excluded - the user simply has not
      // declared exclusions, which is a legitimate state.
      expect(result.warnings).toEqual([]);
    });

    it('emits warnings when primaryUseCase or included is missing', () => {
      const config = ProjectConfig.create({
        configVersion: '1',
        project: ProjectSection.create({ name: ProjectName.create('p') }),
      });
      const warnings = renderDocument(
        mvpScopeTemplate,
        RenderingContext.create({ config }),
      ).warnings;
      const messages = warnings.map((w) => w.message);
      expect(messages.some((m) => m.includes('primaryUseCase'))).toBe(true);
      expect(messages.some((m) => m.includes('includedFeatures'))).toBe(true);
    });
  });

  describe('Markdown special character escaping', () => {
    it('escapes inline specials inside the primaryUseCase body', () => {
      const config = ProjectConfig.create({
        configVersion: '1',
        project: ProjectSection.create({ name: ProjectName.create('p') }),
        mvp: MvpSection.create({
          primaryUseCase: 'render `code` and a [link](x)',
          includedFeatures: ['safe item'],
        }),
      });
      const value = renderDocument(mvpScopeTemplate, RenderingContext.create({ config })).file
        .content.value;
      expect(value).toContain('## Primary Use Case\n\nrender \\`code\\` and a \\[link\\](x)');
    });

    it('escapes inline specials inside feature list items', () => {
      const config = ProjectConfig.create({
        configVersion: '1',
        project: ProjectSection.create({ name: ProjectName.create('p') }),
        mvp: MvpSection.create({
          includedFeatures: ['emphasise *me*', 'inline `code`'],
        }),
      });
      const value = renderDocument(mvpScopeTemplate, RenderingContext.create({ config })).file
        .content.value;
      expect(value).toContain('- emphasise \\*me\\*');
      expect(value).toContain('- inline \\`code\\`');
    });

    it('escapes a leading dash inside an included feature so it does not become a sub-list', () => {
      const config = ProjectConfig.create({
        configVersion: '1',
        project: ProjectSection.create({ name: ProjectName.create('p') }),
        mvp: MvpSection.create({ includedFeatures: ['- nested?'] }),
      });
      const value = renderDocument(mvpScopeTemplate, RenderingContext.create({ config })).file
        .content.value;
      // The list-item prefix is `- `, and the user's leading `-` is
      // escaped so the line is `- \- nested?` and renders as a single
      // item with literal `- nested?` content.
      expect(value).toContain('- \\- nested?');
    });
  });
});
