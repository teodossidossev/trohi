import { GeneratedFileContent } from '../../output/generated-file-content';
import { OutputCategory } from '../../output/output-category';
import { OutputDefinition } from '../../output/output-definition';
import { OutputTarget } from '../../output/output-target';
import { OutputFilePath } from '../../values/output-file-path';
import { AgentsSection } from '../../config/sections/agents-section';
import { DomainModelingSection } from '../../config/sections/domain-modeling-section';
import { FeatureArchitectureSection } from '../../config/sections/feature-architecture-section';
import { TechnologySection } from '../../config/sections/technology-section';
import { TestingSection } from '../../config/sections/testing-section';
import { DocumentTemplate } from '../document-template';
import { bulletList, escapeBody, escapeInline, heading, italic } from '../markdown-helpers';
import { finalizeDocument, joinBlocks, section } from '../section-helpers';
import { TemplateRenderResult } from '../template-function';
import { TemplateWarning } from '../template-warning';

const PATH = 'AGENTS.md';

/**
 * Generates `AGENTS.md` - the generic AI agent instruction file plus
 * Codex review guidance.
 *
 * Composite document driven by project, technology, domainModeling,
 * featureArchitecture, testing, and agents sections. The deferred-
 * targets list comes straight from `cfg.agents.deferredTargets`, so
 * the document never positively recommends an agent the project has
 * deferred.
 *
 * Source of truth: `docs/OUTPUT_FILES.md` > "AGENTS.md".
 */
export const agentsTemplate: DocumentTemplate = {
  definition: OutputDefinition.create({
    path: OutputFilePath.create(PATH),
    category: OutputCategory.GenericAgentInstructions,
    target: OutputTarget.GenericAgent,
    description: 'Generic AI agent instructions and Codex review guidance.',
  }),
  render: (context) => {
    const cfg = context.config;
    const warnings: TemplateWarning[] = [];

    const title = heading(1, 'Generic Agent Instructions');

    const projectLine = `**${escapeInline(cfg.project.name.value)}** is a software project.`;
    const tagline = cfg.project.description ? italic(escapeInline(cfg.project.description)) : '';

    const techBlock = renderTechContext(cfg.technology, warnings);
    const archBlock = renderArchitectureRules(
      cfg.domainModeling,
      cfg.featureArchitecture,
      warnings,
    );
    const testingBlock = renderTesting(cfg.testing, warnings);
    const reviewBlock = renderReviewFocus(cfg.featureArchitecture);
    const deferredBlock = renderDeferredTargets(cfg.agents);
    const securityBlock = renderSecurityAndPrivacy();

    const body = finalizeDocument(
      joinBlocks(
        title,
        projectLine,
        tagline,
        techBlock,
        archBlock,
        testingBlock,
        reviewBlock,
        deferredBlock,
        securityBlock,
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

function renderArchitectureRules(
  dm: DomainModelingSection | undefined,
  fa: FeatureArchitectureSection | undefined,
  warnings: TemplateWarning[],
): string {
  const lines: string[] = [];
  if (dm !== undefined) {
    lines.push(
      `Use explicit domain models: ${yesNo(dm.useExplicitDomainModels)}`,
      `Require DTO validation before mapping: ${yesNo(dm.requireDtoValidation)}`,
      `Use UI view models in views: ${yesNo(dm.useUiViewModels)}`,
    );
  } else {
    warnings.push(
      TemplateWarning.create({
        message: 'domainModeling section is missing; rules omitted from AGENTS.md.',
        source: PATH,
      }),
    );
  }
  if (fa !== undefined) {
    lines.push(
      `Views are presentational: ${yesNo(fa.viewsArePresentational)}`,
      `Has feature business/application layer: ${yesNo(fa.hasFeatureBusinessLayer)}`,
      `Allow direct HttpClient/REST from views: ${yesNo(fa.allowDirectHttpClientFromViews)}`,
    );
  } else {
    warnings.push(
      TemplateWarning.create({
        message: 'featureArchitecture section is missing; rules omitted from AGENTS.md.',
        source: PATH,
      }),
    );
  }
  if (lines.length === 0) {
    return '';
  }
  return section({ title: 'Architecture Rules', body: bulletList(lines) });
}

function renderTesting(t: TestingSection | undefined, warnings: TemplateWarning[]): string {
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

function renderReviewFocus(fa: FeatureArchitectureSection | undefined): string {
  // Review focus items that apply to any reasonable project. The
  // architecture-specific bullets are added only when the relevant
  // rule is enabled in config so the review checklist never asks
  // reviewers to enforce a rule the project has disabled.
  const items: string[] = ['correctness', 'missing tests', 'broken TDD expectations'];
  if (fa?.viewsArePresentational === true) {
    items.push('view components containing business logic');
  }
  if (fa?.allowDirectHttpClientFromViews === false) {
    items.push('direct HttpClient or REST calls from views');
  }
  items.push(
    'DTOs or raw JSON leaking into UI components',
    'missing or weak mappers',
    'domain models that should protect invariants but do not',
    'inconsistent generated output',
    'unsafe import/export behavior',
    'unsafe generated file paths',
    'scope creep beyond the MVP',
  );
  return section({ title: 'Review Focus', body: bulletList(items) });
}

function renderDeferredTargets(agents: AgentsSection | undefined): string {
  if (agents === undefined || agents.deferredTargets.size === 0) {
    return '';
  }
  const items = [...agents.deferredTargets].map((t) => escapeBody(t));
  return section({
    title: 'Deferred Agent Targets',
    body: bulletList(items),
  });
}

function renderSecurityAndPrivacy(): string {
  return section({
    title: 'Security and Privacy',
    body: bulletList([
      'Do not add hidden network calls.',
      'Do not add telemetry or analytics without explicit approval.',
      'Imported configuration files must be validated before use.',
      'Generated paths must be safe and repository-friendly.',
      'Do not store secrets in configuration or generated files.',
    ]),
  });
}

function yesNo(value: boolean): string {
  return value ? 'yes' : 'no';
}
