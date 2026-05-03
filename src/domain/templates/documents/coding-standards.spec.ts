import { describe, it, expect } from 'vitest';
import { codingStandardsTemplate } from './coding-standards';
import { renderDocument } from '../document-template';
import { RenderingContext } from '../rendering-context';
import { TrohiBootstrapPreset } from '../../config/presets/trohi-bootstrap-preset';
import { ProjectConfig } from '../../config/project-config';
import { ProjectSection } from '../../config/sections/project-section';
import { PackageManager, TechnologySection } from '../../config/sections/technology-section';
import { ProjectName } from '../../values/project-name';
import { OutputCategory } from '../../output/output-category';
import { OutputTarget } from '../../output/output-target';

describe('codingStandardsTemplate', () => {
  describe('definition', () => {
    it('writes to docs/CODING_STANDARDS.md as HumanDocumentation/None', () => {
      expect(codingStandardsTemplate.definition.path.value).toBe('docs/CODING_STANDARDS.md');
      expect(codingStandardsTemplate.definition.category).toBe(OutputCategory.HumanDocumentation);
      expect(codingStandardsTemplate.definition.target).toBe(OutputTarget.None);
    });
  });

  describe('rendering against the trohi-bootstrap preset', () => {
    const subject = () =>
      renderDocument(
        codingStandardsTemplate,
        RenderingContext.create({ config: TrohiBootstrapPreset.create() }),
      );

    it('produces a stable, fully-specified Markdown document', () => {
      expect(subject().file.content.value).toBe(
        '# Coding Standards\n\n' +
          '## Tech Context\n\n' +
          '- Framework: Angular 21\n' +
          '- Runtime: Node.js 22\n' +
          '- Package manager: npm\n' +
          '- Schema validator: Zod\n' +
          '- ZIP library: fflate\n\n' +
          '## Engineering Principles\n\n' +
          '- SOLID\n' +
          '- DRY\n' +
          '- KISS\n' +
          '- YAGNI\n' +
          '- Convention over Configuration\n' +
          '- Composition over Inheritance\n' +
          '- Law of Demeter\n\n' +
          '## Domain Modeling\n\n' +
          '- Use explicit domain models: yes\n' +
          '- Require DTO validation before mapping: yes\n' +
          '- Use UI view models in views: yes\n\n' +
          '## Feature Architecture\n\n' +
          '- Views are presentational: yes\n' +
          '- Has feature business/application layer: yes\n' +
          '- Allow direct HttpClient/REST from views: no\n\n' +
          '## Testing\n\n' +
          '- Use TDD: yes\n' +
          '- Unit/integration tests: Vitest\n' +
          '- End-to-end tests: Cypress\n\n' +
          '## Rejected Frameworks\n\n' +
          '- React\n',
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

    describe('config consistency / no rule drift', () => {
      it('reflects every domain modeling and feature architecture rule', () => {
        const value = subject().file.content.value;
        expect(value).toContain('Use explicit domain models: yes');
        expect(value).toContain('Use UI view models in views: yes');
        expect(value).toContain('Views are presentational: yes');
        expect(value).toContain('Allow direct HttpClient/REST from views: no');
      });

      it('mentions Vitest and Cypress only via the testing config (no hardcoded references)', () => {
        const value = subject().file.content.value;
        expect(value).toContain('Unit/integration tests: Vitest');
        expect(value).toContain('End-to-end tests: Cypress');
        // Jest must never appear (DECISION 011: Jest not selected).
        expect(value).not.toContain('Jest');
        expect(value).not.toContain('jest');
      });

      it('mentions React only inside the data-driven Rejected Frameworks list', () => {
        // React must not appear anywhere as a positive recommendation;
        // the only legitimate mention is inside the rejected-frameworks
        // list, which comes from cfg.technology.rejectedFrameworks.
        const value = subject().file.content.value;
        const reactPositions = [...value.matchAll(/React/g)].map((m) => m.index);
        expect(reactPositions.length).toBe(1);
        const rejectedHeadingIdx = value.indexOf('## Rejected Frameworks');
        expect(rejectedHeadingIdx).toBeGreaterThan(0);
        expect(reactPositions[0]).toBeGreaterThan(rejectedHeadingIdx);
      });
    });
  });

  describe('rendering with a different stack (no Angular, no Vitest, no React rejected)', () => {
    it('produces a document driven entirely by the config (no Angular/Vitest/React/Jest leakage)', () => {
      const config = ProjectConfig.create({
        configVersion: '1',
        project: ProjectSection.create({ name: ProjectName.create('p') }),
        technology: TechnologySection.create({
          framework: 'Vue 3',
          runtime: 'Bun 1',
          packageManager: PackageManager.Pnpm,
        }),
      });
      const value = renderDocument(codingStandardsTemplate, RenderingContext.create({ config }))
        .file.content.value;
      expect(value).toContain('Framework: Vue 3');
      expect(value).toContain('Runtime: Bun 1');
      expect(value).not.toContain('Angular');
      expect(value).not.toContain('Vitest');
      expect(value).not.toContain('Cypress');
      expect(value).not.toContain('React');
      expect(value).not.toContain('Jest');
      expect(value).not.toContain('## Rejected Frameworks');
    });
  });

  describe('engineering principles', () => {
    it('always lists SOLID, DRY, KISS, YAGNI (not config-driven)', () => {
      const value = renderDocument(
        codingStandardsTemplate,
        RenderingContext.create({ config: TrohiBootstrapPreset.create() }),
      ).file.content.value;
      expect(value).toContain('## Engineering Principles');
      for (const principle of [
        'SOLID',
        'DRY',
        'KISS',
        'YAGNI',
        'Convention over Configuration',
        'Composition over Inheritance',
        'Law of Demeter',
      ]) {
        expect(value).toContain(`- ${principle}`);
      }
    });
  });

  describe('rendering against a minimal config', () => {
    it('still lists engineering principles and warns for missing sections', () => {
      const config = ProjectConfig.create({
        configVersion: '1',
        project: ProjectSection.create({ name: ProjectName.create('m') }),
      });
      const result = renderDocument(codingStandardsTemplate, RenderingContext.create({ config }));
      const value = result.file.content.value;
      expect(value).toContain('## Engineering Principles');
      expect(value).toContain('- SOLID');
      // Missing sections produce warnings.
      const messages = result.warnings.map((w) => w.message);
      expect(messages.length).toBe(4);
      expect(messages.some((m) => m.includes('technology'))).toBe(true);
      expect(messages.some((m) => m.includes('domainModeling'))).toBe(true);
      expect(messages.some((m) => m.includes('featureArchitecture'))).toBe(true);
      expect(messages.some((m) => m.includes('testing'))).toBe(true);
    });
  });

  describe('Markdown special character escaping', () => {
    it('escapes inline specials in framework, runtime, and rejected entries', () => {
      const config = ProjectConfig.create({
        configVersion: '1',
        project: ProjectSection.create({ name: ProjectName.create('p') }),
        technology: TechnologySection.create({
          framework: 'My*Framework',
          runtime: '`Node`',
          packageManager: PackageManager.Npm,
          rejectedFrameworks: ['Re*act'],
        }),
      });
      const value = renderDocument(codingStandardsTemplate, RenderingContext.create({ config }))
        .file.content.value;
      expect(value).toContain('Framework: My\\*Framework');
      expect(value).toContain('Runtime: \\`Node\\`');
      expect(value).toContain('- Re\\*act');
    });
  });
});
