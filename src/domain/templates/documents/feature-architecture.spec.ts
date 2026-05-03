import { describe, it, expect } from 'vitest';
import { featureArchitectureTemplate } from './feature-architecture';
import { renderDocument } from '../document-template';
import { RenderingContext } from '../rendering-context';
import { TrohiBootstrapPreset } from '../../config/presets/trohi-bootstrap-preset';
import { ProjectConfig } from '../../config/project-config';
import { ProjectSection } from '../../config/sections/project-section';
import { FeatureArchitectureSection } from '../../config/sections/feature-architecture-section';
import { ProjectName } from '../../values/project-name';
import { OutputCategory } from '../../output/output-category';
import { OutputTarget } from '../../output/output-target';

describe('featureArchitectureTemplate', () => {
  describe('definition', () => {
    it('writes to docs/FEATURE_ARCHITECTURE.md as HumanDocumentation/None', () => {
      expect(featureArchitectureTemplate.definition.path.value).toBe(
        'docs/FEATURE_ARCHITECTURE.md',
      );
      expect(featureArchitectureTemplate.definition.category).toBe(
        OutputCategory.HumanDocumentation,
      );
      expect(featureArchitectureTemplate.definition.target).toBe(OutputTarget.None);
    });
  });

  describe('rendering against the trohi-bootstrap preset', () => {
    const subject = () =>
      renderDocument(
        featureArchitectureTemplate,
        RenderingContext.create({ config: TrohiBootstrapPreset.create() }),
      );

    it('produces a stable, fully-specified Markdown document', () => {
      expect(subject().file.content.value).toBe(
        '# Feature Architecture\n\n' +
          '## Rules\n\n' +
          '- Views are presentational: yes\n' +
          '- Has feature business/application layer: yes\n' +
          '- Allow direct HttpClient/REST from views: no\n\n' +
          '## Notes\n\n' +
          '- Views render state, bind forms, and emit user intentions; they must not own business rules, mapping, generation, or import/export logic.\n' +
          '- Each non-trivial feature owns its own business/application layer that coordinates domain services, mappers, and infrastructure adapters.\n' +
          '- Views must not inject or call HttpClient or REST services directly; route external communication through feature services and infrastructure adapters.\n' +
          '- Use ports and adapters at infrastructure boundaries so business logic depends on contracts, not concrete browser APIs, ZIP libraries, storage, or future REST clients.\n',
      );
    });

    it('emits no warnings when the preset populates the section', () => {
      expect(subject().warnings).toEqual([]);
    });

    it('is deterministic across calls', () => {
      const a = subject().file.content.value;
      const b = subject().file.content.value;
      expect(a).toBe(b);
    });

    describe('config consistency', () => {
      it('preserves the presentational view rule', () => {
        const value = subject().file.content.value;
        expect(value).toContain('Views are presentational: yes');
        expect(value).toContain('they must not own business rules');
      });

      it('preserves the no-direct-HttpClient rule', () => {
        const value = subject().file.content.value;
        expect(value).toContain('Allow direct HttpClient/REST from views: no');
        expect(value).toContain('Views must not inject or call HttpClient');
      });

      it('mentions ports and adapters', () => {
        expect(subject().file.content.value).toContain('Use ports and adapters');
      });
    });
  });

  describe('rendering with allowDirectHttpClientFromViews=true', () => {
    it('omits the no-direct-HttpClient note when the rule is disabled in config', () => {
      const config = ProjectConfig.create({
        configVersion: '1',
        project: ProjectSection.create({ name: ProjectName.create('p') }),
        featureArchitecture: FeatureArchitectureSection.create({
          viewsArePresentational: false,
          hasFeatureBusinessLayer: false,
          allowDirectHttpClientFromViews: true,
        }),
      });
      const value = renderDocument(featureArchitectureTemplate, RenderingContext.create({ config }))
        .file.content.value;
      expect(value).toContain('Allow direct HttpClient/REST from views: yes');
      // Critical: do not contradict the config.
      expect(value).not.toContain('Views must not inject or call HttpClient');
    });
  });

  describe('rendering against a minimal config', () => {
    it('renders only the title and warns when featureArchitecture is missing', () => {
      const config = ProjectConfig.create({
        configVersion: '1',
        project: ProjectSection.create({ name: ProjectName.create('m') }),
      });
      const result = renderDocument(
        featureArchitectureTemplate,
        RenderingContext.create({ config }),
      );
      expect(result.file.content.value).toBe('# Feature Architecture\n');
      expect(result.warnings).toHaveLength(1);
      expect(result.warnings[0].message).toContain('featureArchitecture');
    });
  });
});
