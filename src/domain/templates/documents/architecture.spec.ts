import { describe, it, expect } from 'vitest';
import { architectureTemplate } from './architecture';
import { renderDocument } from '../document-template';
import { RenderingContext } from '../rendering-context';
import { TrohiBootstrapPreset } from '../../config/presets/trohi-bootstrap-preset';
import { ProjectConfig } from '../../config/project-config';
import { ProjectSection } from '../../config/sections/project-section';
import {
  ApplicationType,
  ArchitectureSection,
  PersistenceModel,
} from '../../config/sections/architecture-section';
import { PackageManager, TechnologySection } from '../../config/sections/technology-section';
import { ProjectName } from '../../values/project-name';
import { OutputCategory } from '../../output/output-category';
import { OutputTarget } from '../../output/output-target';

describe('architectureTemplate', () => {
  describe('definition', () => {
    it('writes to docs/ARCHITECTURE.md as HumanDocumentation/None', () => {
      expect(architectureTemplate.definition.path.value).toBe('docs/ARCHITECTURE.md');
      expect(architectureTemplate.definition.category).toBe(OutputCategory.HumanDocumentation);
      expect(architectureTemplate.definition.target).toBe(OutputTarget.None);
    });
  });

  describe('rendering against the trohi-bootstrap preset', () => {
    const subject = () =>
      renderDocument(
        architectureTemplate,
        RenderingContext.create({ config: TrohiBootstrapPreset.create() }),
      );

    it('produces a stable, fully-specified Markdown document', () => {
      expect(subject().file.content.value).toBe(
        '# Architecture\n\n' +
          '## Application\n\n' +
          '- Application type: browser-app\n' +
          '- Backend: no\n' +
          '- Persistence: local-import-export\n\n' +
          '## Technology Stack\n\n' +
          '- Framework: Angular 21\n' +
          '- Runtime: Node.js 22\n' +
          '- Package manager: npm\n' +
          '- Schema validator: Zod\n' +
          '- ZIP library: fflate\n\n' +
          '### Rejected Frameworks\n\n' +
          '- React\n\n' +
          '## Domain Modeling\n\n' +
          '- Use explicit domain models: yes\n' +
          '- Require DTO validation: yes\n' +
          '- Use UI view models: yes\n\n' +
          '## Feature Architecture\n\n' +
          '- Views are presentational: yes\n' +
          '- Has feature business/application layer: yes\n' +
          '- Allow direct HttpClient/REST from views: no\n',
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

    describe('config consistency', () => {
      it('reflects hasBackend=false from the config (does not contradict it)', () => {
        const value = subject().file.content.value;
        expect(value).toContain('Backend: no');
        expect(value).not.toContain('Backend: yes');
      });

      it('reflects rejected-React from the config', () => {
        const value = subject().file.content.value;
        expect(value).toContain('### Rejected Frameworks');
        expect(value).toContain('- React');
      });

      it('reflects allowDirectHttpClientFromViews=false using the shared wording', () => {
        expect(subject().file.content.value).toContain(
          'Allow direct HttpClient/REST from views: no',
        );
      });
    });
  });

  describe('rendering with different config values', () => {
    it('changes Backend line to "yes" when the config has hasBackend=true', () => {
      const config = ProjectConfig.create({
        configVersion: '1',
        project: ProjectSection.create({ name: ProjectName.create('p') }),
        architecture: ArchitectureSection.create({
          applicationType: ApplicationType.BackendApp,
          hasBackend: true,
          persistenceModel: PersistenceModel.Backend,
        }),
      });
      const value = renderDocument(architectureTemplate, RenderingContext.create({ config })).file
        .content.value;
      expect(value).toContain('Backend: yes');
      expect(value).toContain('Application type: backend-app');
      expect(value).toContain('Persistence: backend');
    });

    it('omits the Rejected Frameworks subsection when the config has none', () => {
      const config = ProjectConfig.create({
        configVersion: '1',
        project: ProjectSection.create({ name: ProjectName.create('p') }),
        technology: TechnologySection.create({
          framework: 'Vue 3',
          runtime: 'Node.js 22',
          packageManager: PackageManager.Pnpm,
        }),
      });
      const value = renderDocument(architectureTemplate, RenderingContext.create({ config })).file
        .content.value;
      expect(value).toContain('Framework: Vue 3');
      expect(value).not.toContain('Rejected Frameworks');
    });
  });

  describe('rendering against a minimal config', () => {
    const minimal = () =>
      RenderingContext.create({
        config: ProjectConfig.create({
          configVersion: '1',
          project: ProjectSection.create({ name: ProjectName.create('m') }),
        }),
      });

    it('still renders the title and ends with a single trailing newline', () => {
      const value = renderDocument(architectureTemplate, minimal()).file.content.value;
      expect(value.startsWith('# Architecture\n')).toBe(true);
      expect(value.endsWith('\n')).toBe(true);
      expect(value.endsWith('\n\n')).toBe(false);
    });

    it('omits every absent subsection without inventing content', () => {
      const value = renderDocument(architectureTemplate, minimal()).file.content.value;
      expect(value).not.toContain('## Application');
      expect(value).not.toContain('## Technology Stack');
      expect(value).not.toContain('## Domain Modeling');
      expect(value).not.toContain('## Feature Architecture');
    });

    it('emits one warning per missing section', () => {
      const warnings = renderDocument(architectureTemplate, minimal()).warnings;
      const messages = warnings.map((w) => w.message);
      expect(messages.length).toBe(4);
      expect(messages.some((m) => m.includes('architecture'))).toBe(true);
      expect(messages.some((m) => m.includes('technology'))).toBe(true);
      expect(messages.some((m) => m.includes('domainModeling'))).toBe(true);
      expect(messages.some((m) => m.includes('featureArchitecture'))).toBe(true);
    });
  });

  describe('Markdown special character escaping', () => {
    it('escapes inline specials in framework, runtime, and library fields', () => {
      const config = ProjectConfig.create({
        configVersion: '1',
        project: ProjectSection.create({ name: ProjectName.create('p') }),
        technology: TechnologySection.create({
          framework: 'My*Framework',
          runtime: '`Node`',
          packageManager: PackageManager.Npm,
          schemaValidator: '[zod](x)',
          zipLibrary: 'fflate_v2',
          rejectedFrameworks: ['Re*act'],
        }),
      });
      const value = renderDocument(architectureTemplate, RenderingContext.create({ config })).file
        .content.value;
      expect(value).toContain('Framework: My\\*Framework');
      expect(value).toContain('Runtime: \\`Node\\`');
      expect(value).toContain('Schema validator: \\[zod\\](x)');
      expect(value).toContain('ZIP library: fflate\\_v2');
      expect(value).toContain('- Re\\*act');
    });
  });
});
