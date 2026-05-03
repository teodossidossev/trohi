import { describe, it, expect } from 'vitest';
import { domainModelingTemplate } from './domain-modeling';
import { renderDocument } from '../document-template';
import { RenderingContext } from '../rendering-context';
import { TrohiBootstrapPreset } from '../../config/presets/trohi-bootstrap-preset';
import { ProjectConfig } from '../../config/project-config';
import { ProjectSection } from '../../config/sections/project-section';
import { DomainModelingSection } from '../../config/sections/domain-modeling-section';
import { ProjectName } from '../../values/project-name';
import { OutputCategory } from '../../output/output-category';
import { OutputTarget } from '../../output/output-target';

describe('domainModelingTemplate', () => {
  describe('definition', () => {
    it('writes to docs/DOMAIN_MODELING.md as HumanDocumentation/None', () => {
      expect(domainModelingTemplate.definition.path.value).toBe('docs/DOMAIN_MODELING.md');
      expect(domainModelingTemplate.definition.category).toBe(OutputCategory.HumanDocumentation);
      expect(domainModelingTemplate.definition.target).toBe(OutputTarget.None);
    });
  });

  describe('rendering against the trohi-bootstrap preset', () => {
    const subject = () =>
      renderDocument(
        domainModelingTemplate,
        RenderingContext.create({ config: TrohiBootstrapPreset.create() }),
      );

    it('produces a stable, fully-specified Markdown document', () => {
      expect(subject().file.content.value).toBe(
        '# Domain Modeling\n\n' +
          '## Rules\n\n' +
          '- Use explicit domain models: yes\n' +
          '- Require DTO validation before mapping: yes\n' +
          '- Use UI view models in views: yes\n\n' +
          '## Notes\n\n' +
          '- Do not pass raw JSON through the application; map external DTOs into explicit domain models at boundaries.\n' +
          '- Domain models protect invariants and live independently of UI components.\n' +
          '- Imported JSON must be validated before being mapped into domain models.\n' +
          '- UI components consume UI view models, not domain models or DTOs; mappers convert between them.\n',
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
      it('reflects the OOP/explicit-model rule', () => {
        const value = subject().file.content.value;
        expect(value).toContain('Use explicit domain models: yes');
        expect(value).toContain('Do not pass raw JSON');
      });

      it('reflects the DTO validation rule', () => {
        const value = subject().file.content.value;
        expect(value).toContain('Require DTO validation before mapping: yes');
      });

      it('reflects the UI view models rule', () => {
        const value = subject().file.content.value;
        expect(value).toContain('Use UI view models in views: yes');
        expect(value).toContain('UI components consume UI view models');
      });
    });
  });

  describe('rendering with all-false flags', () => {
    it('omits each note that is no longer applicable', () => {
      const config = ProjectConfig.create({
        configVersion: '1',
        project: ProjectSection.create({ name: ProjectName.create('p') }),
        domainModeling: DomainModelingSection.create({
          useExplicitDomainModels: false,
          requireDtoValidation: false,
          useUiViewModels: false,
        }),
      });
      const value = renderDocument(domainModelingTemplate, RenderingContext.create({ config })).file
        .content.value;

      expect(value).toContain('Use explicit domain models: no');
      expect(value).toContain('Require DTO validation before mapping: no');
      expect(value).toContain('Use UI view models in views: no');
      // No notes section when no rule is enabled.
      expect(value).not.toContain('## Notes');
      // Critical: do not contradict the config.
      expect(value).not.toContain('Do not pass raw JSON');
      expect(value).not.toContain('UI components consume UI view models');
    });
  });

  describe('rendering against a minimal config', () => {
    it('emits a warning and renders only the title when domainModeling is missing', () => {
      const config = ProjectConfig.create({
        configVersion: '1',
        project: ProjectSection.create({ name: ProjectName.create('m') }),
      });
      const result = renderDocument(domainModelingTemplate, RenderingContext.create({ config }));
      expect(result.file.content.value).toBe('# Domain Modeling\n');
      expect(result.warnings).toHaveLength(1);
      expect(result.warnings[0].message).toContain('domainModeling');
    });
  });
});
