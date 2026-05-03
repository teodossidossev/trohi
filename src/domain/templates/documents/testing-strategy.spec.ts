import { describe, it, expect } from 'vitest';
import { testingStrategyTemplate } from './testing-strategy';
import { renderDocument } from '../document-template';
import { RenderingContext } from '../rendering-context';
import { TrohiBootstrapPreset } from '../../config/presets/trohi-bootstrap-preset';
import { ProjectConfig } from '../../config/project-config';
import { ProjectSection } from '../../config/sections/project-section';
import { TestingSection } from '../../config/sections/testing-section';
import { ProjectName } from '../../values/project-name';
import { OutputCategory } from '../../output/output-category';
import { OutputTarget } from '../../output/output-target';

describe('testingStrategyTemplate', () => {
  describe('definition', () => {
    it('writes to docs/TESTING_STRATEGY.md as HumanDocumentation/None', () => {
      expect(testingStrategyTemplate.definition.path.value).toBe('docs/TESTING_STRATEGY.md');
      expect(testingStrategyTemplate.definition.category).toBe(OutputCategory.HumanDocumentation);
      expect(testingStrategyTemplate.definition.target).toBe(OutputTarget.None);
    });
  });

  describe('rendering against the trohi-bootstrap preset', () => {
    const subject = () =>
      renderDocument(
        testingStrategyTemplate,
        RenderingContext.create({ config: TrohiBootstrapPreset.create() }),
      );

    it('produces a stable, fully-specified Markdown document', () => {
      expect(subject().file.content.value).toBe(
        '# Testing Strategy\n\n' +
          '## Workflow\n\n' +
          '- Use TDD: yes\n\n' +
          '## Runners\n\n' +
          '- Unit/integration tests: Vitest\n' +
          '- End-to-end tests: Cypress\n\n' +
          '## Notes\n\n' +
          '- Follow the TDD cycle: write a failing test, implement the smallest useful change, make the test pass, refactor safely.\n' +
          '- Use Vitest for unit tests, integration tests, mapper tests, domain model tests, validation tests, generation tests, and snapshot tests for generated Markdown.\n' +
          '- Use Cypress for critical browser end-to-end flows; do not use it as a substitute for unit and integration tests.\n' +
          '- Snapshots must not be updated automatically without reviewing the generated output diff.\n',
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

    describe('config consistency / no rule drift', () => {
      it('mentions the runners chosen in config (Vitest + Cypress)', () => {
        const value = subject().file.content.value;
        expect(value).toContain('Unit/integration tests: Vitest');
        expect(value).toContain('End-to-end tests: Cypress');
      });

      it('does not hardcode Jest anywhere', () => {
        // Jest is explicitly not selected (DECISION 011); the document
        // must not refer to it under any circumstances.
        expect(subject().file.content.value).not.toContain('Jest');
        expect(subject().file.content.value).not.toContain('jest');
      });

      it('preserves the snapshot review rule', () => {
        expect(subject().file.content.value).toContain(
          'Snapshots must not be updated automatically without reviewing',
        );
      });
    });
  });

  describe('rendering with a different runner choice', () => {
    it('renders the chosen runners verbatim (no Vitest/Cypress hardcoded)', () => {
      const config = ProjectConfig.create({
        configVersion: '1',
        project: ProjectSection.create({ name: ProjectName.create('p') }),
        testing: TestingSection.create({
          useTdd: false,
          unitTestRunner: 'Mocha',
          e2eTestRunner: 'Playwright',
        }),
      });
      const value = renderDocument(testingStrategyTemplate, RenderingContext.create({ config }))
        .file.content.value;
      expect(value).toContain('Use TDD: no');
      expect(value).toContain('Unit/integration tests: Mocha');
      expect(value).toContain('End-to-end tests: Playwright');
      expect(value).not.toContain('Vitest');
      expect(value).not.toContain('Cypress');
      expect(value).not.toContain('TDD cycle'); // Notes adapt to useTdd=false.
    });

    it('omits the e2e runner line and warns when not provided', () => {
      const config = ProjectConfig.create({
        configVersion: '1',
        project: ProjectSection.create({ name: ProjectName.create('p') }),
        testing: TestingSection.create({ useTdd: true, unitTestRunner: 'Vitest' }),
      });
      const result = renderDocument(testingStrategyTemplate, RenderingContext.create({ config }));
      expect(result.file.content.value).toContain('Unit/integration tests: Vitest');
      expect(result.file.content.value).not.toContain('End-to-end tests:');
      expect(result.warnings.some((w) => w.message.includes('e2eTestRunner'))).toBe(true);
    });
  });

  describe('Markdown special character escaping', () => {
    it('escapes inline specials in runner names', () => {
      const config = ProjectConfig.create({
        configVersion: '1',
        project: ProjectSection.create({ name: ProjectName.create('p') }),
        testing: TestingSection.create({
          useTdd: false,
          unitTestRunner: 'My*Runner',
          e2eTestRunner: '`E2E`',
        }),
      });
      const value = renderDocument(testingStrategyTemplate, RenderingContext.create({ config }))
        .file.content.value;
      expect(value).toContain('Unit/integration tests: My\\*Runner');
      expect(value).toContain('End-to-end tests: \\`E2E\\`');
    });
  });

  describe('rendering against a minimal config', () => {
    it('renders only the title and warns when testing is missing', () => {
      const config = ProjectConfig.create({
        configVersion: '1',
        project: ProjectSection.create({ name: ProjectName.create('m') }),
      });
      const result = renderDocument(testingStrategyTemplate, RenderingContext.create({ config }));
      expect(result.file.content.value).toBe('# Testing Strategy\n');
      expect(result.warnings).toHaveLength(1);
      expect(result.warnings[0].message).toContain('testing');
    });
  });
});
