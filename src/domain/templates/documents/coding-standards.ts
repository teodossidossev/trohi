import { GeneratedFileContent } from '../../output/generated-file-content';
import { OutputCategory } from '../../output/output-category';
import { OutputDefinition } from '../../output/output-definition';
import { OutputTarget } from '../../output/output-target';
import { OutputFilePath } from '../../values/output-file-path';
import { DomainModelingSection } from '../../config/sections/domain-modeling-section';
import { FeatureArchitectureSection } from '../../config/sections/feature-architecture-section';
import { TechnologySection } from '../../config/sections/technology-section';
import { TestingSection } from '../../config/sections/testing-section';
import { DocumentTemplate } from '../document-template';
import { bulletList, escapeInline, heading } from '../markdown-helpers';
import { finalizeDocument, joinBlocks, section } from '../section-helpers';
import { TemplateRenderResult } from '../template-function';
import { TemplateWarning } from '../template-warning';

const PATH = 'docs/CODING_STANDARDS.md';

/**
 * Universal engineering principles. They are hardcoded because they
 * are not project-specific decisions: any software project benefits
 * from SOLID/DRY/KISS regardless of stack or framework choice. If a
 * future config field starts driving this list, switch to the config.
 */
const ENGINEERING_PRINCIPLES: readonly string[] = Object.freeze([
  'SOLID',
  'DRY',
  'KISS',
  'YAGNI',
  'Convention over Configuration',
  'Composition over Inheritance',
  'Law of Demeter',
]);

/**
 * Generates `docs/CODING_STANDARDS.md` as a composite document that
 * pulls together cross-cutting decisions from the technology,
 * domain-modeling, feature-architecture, and testing sections.
 *
 * The hardcoded "Engineering Principles" list is universal (SOLID,
 * DRY, etc.) and is not driven by the config; everything else is
 * sourced from the appropriate config section so changes to the
 * project's stack, rules, or test runners flow into the generated
 * document automatically.
 *
 * Source of truth for what this document represents:
 * `docs/OUTPUT_FILES.md` > "docs/CODING_STANDARDS.md".
 */
export const codingStandardsTemplate: DocumentTemplate = {
  definition: OutputDefinition.create({
    path: OutputFilePath.create(PATH),
    category: OutputCategory.HumanDocumentation,
    target: OutputTarget.None,
    description:
      'Engineering principles, OOP/domain modeling, feature architecture, testing, and rejected frameworks.',
  }),
  render: (context) => {
    const cfg = context.config;
    const warnings: TemplateWarning[] = [];

    const title = heading(1, 'Coding Standards');

    const techBlock = renderTechContext(cfg.technology, warnings);
    const principlesBlock = section({
      title: 'Engineering Principles',
      body: bulletList([...ENGINEERING_PRINCIPLES]),
    });
    const domainModelingBlock = renderDomainModelingReminder(cfg.domainModeling, warnings);
    const featureArchitectureBlock = renderFeatureArchitectureReminder(
      cfg.featureArchitecture,
      warnings,
    );
    const testingBlock = renderTestingReminder(cfg.testing, warnings);
    const rejectedBlock = renderRejectedFrameworks(cfg.technology);

    const body = finalizeDocument(
      joinBlocks(
        title,
        techBlock,
        principlesBlock,
        domainModelingBlock,
        featureArchitectureBlock,
        testingBlock,
        rejectedBlock,
      ),
    );

    return TemplateRenderResult.withWarnings(GeneratedFileContent.create(body), warnings);
  },
};

function renderTechContext(
  tech: TechnologySection | undefined,
  warnings: TemplateWarning[],
): string {
  if (tech === undefined) {
    warnings.push(
      TemplateWarning.create({
        message: 'technology section is missing; "Tech Context" section omitted.',
        source: PATH,
      }),
    );
    return '';
  }
  const lines = [
    `Framework: ${escapeInline(tech.framework)}`,
    `Runtime: ${escapeInline(tech.runtime)}`,
    `Package manager: ${tech.packageManager}`,
  ];
  if (tech.schemaValidator !== undefined) {
    lines.push(`Schema validator: ${escapeInline(tech.schemaValidator)}`);
  }
  if (tech.zipLibrary !== undefined) {
    lines.push(`ZIP library: ${escapeInline(tech.zipLibrary)}`);
  }
  return section({ title: 'Tech Context', body: bulletList(lines) });
}

function renderDomainModelingReminder(
  dm: DomainModelingSection | undefined,
  warnings: TemplateWarning[],
): string {
  if (dm === undefined) {
    warnings.push(
      TemplateWarning.create({
        message: 'domainModeling section is missing; "Domain Modeling" section omitted.',
        source: PATH,
      }),
    );
    return '';
  }
  return section({
    title: 'Domain Modeling',
    body: bulletList([
      `Use explicit domain models: ${yesNo(dm.useExplicitDomainModels)}`,
      `Require DTO validation before mapping: ${yesNo(dm.requireDtoValidation)}`,
      `Use UI view models in views: ${yesNo(dm.useUiViewModels)}`,
    ]),
  });
}

function renderFeatureArchitectureReminder(
  fa: FeatureArchitectureSection | undefined,
  warnings: TemplateWarning[],
): string {
  if (fa === undefined) {
    warnings.push(
      TemplateWarning.create({
        message: 'featureArchitecture section is missing; "Feature Architecture" section omitted.',
        source: PATH,
      }),
    );
    return '';
  }
  return section({
    title: 'Feature Architecture',
    body: bulletList([
      `Views are presentational: ${yesNo(fa.viewsArePresentational)}`,
      `Has feature business/application layer: ${yesNo(fa.hasFeatureBusinessLayer)}`,
      `Allow direct HttpClient/REST from views: ${yesNo(fa.allowDirectHttpClientFromViews)}`,
    ]),
  });
}

function renderTestingReminder(t: TestingSection | undefined, warnings: TemplateWarning[]): string {
  if (t === undefined) {
    warnings.push(
      TemplateWarning.create({
        message: 'testing section is missing; "Testing" section omitted.',
        source: PATH,
      }),
    );
    return '';
  }
  const lines = [
    `Use TDD: ${yesNo(t.useTdd)}`,
    `Unit/integration tests: ${escapeInline(t.unitTestRunner)}`,
  ];
  if (t.e2eTestRunner !== undefined) {
    lines.push(`End-to-end tests: ${escapeInline(t.e2eTestRunner)}`);
  }
  return section({ title: 'Testing', body: bulletList(lines) });
}

function renderRejectedFrameworks(tech: TechnologySection | undefined): string {
  if (tech === undefined || tech.rejectedFrameworks.length === 0) {
    return '';
  }
  return section({
    title: 'Rejected Frameworks',
    body: bulletList(tech.rejectedFrameworks.map(escapeInline)),
  });
}

function yesNo(value: boolean): string {
  return value ? 'yes' : 'no';
}
