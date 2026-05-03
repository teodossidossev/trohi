import { GeneratedFileContent } from '../../output/generated-file-content';
import { OutputCategory } from '../../output/output-category';
import { OutputDefinition } from '../../output/output-definition';
import { OutputTarget } from '../../output/output-target';
import { OutputFilePath } from '../../values/output-file-path';
import { AgentsSection } from '../../config/sections/agents-section';
import { ArchitectureSection } from '../../config/sections/architecture-section';
import { DomainModelingSection } from '../../config/sections/domain-modeling-section';
import { FeatureArchitectureSection } from '../../config/sections/feature-architecture-section';
import { TechnologySection } from '../../config/sections/technology-section';
import { TestingSection } from '../../config/sections/testing-section';
import { DocumentTemplate } from '../document-template';
import { bulletList, escapeBody, escapeInline, heading, italic } from '../markdown-helpers';
import { finalizeDocument, joinBlocks, section } from '../section-helpers';
import { TemplateRenderResult } from '../template-function';
import { TemplateWarning } from '../template-warning';

const PATH = 'CLAUDE.md';

/**
 * Generates `CLAUDE.md` - project-level Claude Code implementation
 * guidance.
 *
 * Where AGENTS.md focuses on review, this document focuses on
 * implementation: which stack, which architecture rules to honor,
 * which local checks to run before committing, and what scope is
 * explicitly out of bounds. All rules come from the config; the
 * scope-control list omits agents the project has deferred so Claude
 * is not told to honor a workflow the project has not adopted.
 *
 * Source of truth: `docs/OUTPUT_FILES.md` > "CLAUDE.md".
 */
export const claudeTemplate: DocumentTemplate = {
  definition: OutputDefinition.create({
    path: OutputFilePath.create(PATH),
    category: OutputCategory.AgentSpecificInstructions,
    target: OutputTarget.Claude,
    description: 'Project-level instructions for Claude Code.',
  }),
  render: (context) => {
    const cfg = context.config;
    const warnings: TemplateWarning[] = [];

    const title = heading(1, 'Claude Code Instructions');
    const projectLine = `**${escapeInline(cfg.project.name.value)}** is a software project.`;
    const tagline = cfg.project.description ? italic(escapeInline(cfg.project.description)) : '';

    const stackBlock = renderStack(cfg.technology, warnings);
    const appBlock = renderApplicationType(cfg.architecture, warnings);
    const domainModelingBlock = renderDomainModelingRules(cfg.domainModeling, warnings);
    const featureArchitectureBlock = renderFeatureArchitectureRules(
      cfg.featureArchitecture,
      warnings,
    );
    const testingBlock = renderTestingRules(cfg.testing, warnings);
    const localChecksBlock = renderLocalChecks();
    const scopeBlock = renderScopeControl(cfg.agents);

    const body = finalizeDocument(
      joinBlocks(
        title,
        projectLine,
        tagline,
        stackBlock,
        appBlock,
        domainModelingBlock,
        featureArchitectureBlock,
        testingBlock,
        localChecksBlock,
        scopeBlock,
      ),
    );

    return TemplateRenderResult.withWarnings(GeneratedFileContent.create(body), warnings);
  },
};

function renderStack(tech: TechnologySection | undefined, warnings: TemplateWarning[]): string {
  if (tech === undefined) {
    warnings.push(
      TemplateWarning.create({
        message: 'technology section is missing; "Tech Stack" section omitted.',
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
  return section({ title: 'Tech Stack', body: bulletList(lines) });
}

function renderApplicationType(
  arch: ArchitectureSection | undefined,
  warnings: TemplateWarning[],
): string {
  if (arch === undefined) {
    warnings.push(
      TemplateWarning.create({
        message: 'architecture section is missing; "Application Type" section omitted.',
        source: PATH,
      }),
    );
    return '';
  }
  return section({
    title: 'Application Type',
    body: bulletList([
      `Application type: ${arch.applicationType}`,
      `Backend: ${yesNo(arch.hasBackend)}`,
      `Persistence: ${arch.persistenceModel}`,
    ]),
  });
}

function renderDomainModelingRules(
  dm: DomainModelingSection | undefined,
  warnings: TemplateWarning[],
): string {
  if (dm === undefined) {
    warnings.push(
      TemplateWarning.create({
        message: 'domainModeling section is missing; "Domain Modeling Rules" section omitted.',
        source: PATH,
      }),
    );
    return '';
  }
  return section({
    title: 'Domain Modeling Rules',
    body: bulletList([
      `Use explicit domain models: ${yesNo(dm.useExplicitDomainModels)}`,
      `Require DTO validation before mapping: ${yesNo(dm.requireDtoValidation)}`,
      `Use UI view models in views: ${yesNo(dm.useUiViewModels)}`,
    ]),
  });
}

function renderFeatureArchitectureRules(
  fa: FeatureArchitectureSection | undefined,
  warnings: TemplateWarning[],
): string {
  if (fa === undefined) {
    warnings.push(
      TemplateWarning.create({
        message:
          'featureArchitecture section is missing; "Feature Architecture Rules" section omitted.',
        source: PATH,
      }),
    );
    return '';
  }
  return section({
    title: 'Feature Architecture Rules',
    body: bulletList([
      `Views are presentational: ${yesNo(fa.viewsArePresentational)}`,
      `Has feature business/application layer: ${yesNo(fa.hasFeatureBusinessLayer)}`,
      `Allow direct HttpClient/REST from views: ${yesNo(fa.allowDirectHttpClientFromViews)}`,
    ]),
  });
}

function renderTestingRules(t: TestingSection | undefined, warnings: TemplateWarning[]): string {
  if (t === undefined) {
    warnings.push(
      TemplateWarning.create({
        message: 'testing section is missing; "Testing Rules" section omitted.',
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
  return section({ title: 'Testing Rules', body: bulletList(lines) });
}

function renderLocalChecks(): string {
  return section({
    title: 'Local Checks Before Commit',
    body: bulletList([
      'formatting',
      'linting',
      'type checking',
      'unit and integration tests',
      'snapshot tests for generated Markdown',
      'affected end-to-end tests',
      'production build',
    ]),
  });
}

function renderScopeControl(agents: AgentsSection | undefined): string {
  const items: string[] = [
    'Do not add backend, accounts, cloud sync, or team workspaces.',
    'Do not add repository analysis or AI generation as a hard requirement.',
    'Do not introduce non-dev domain presets.',
  ];
  if (agents !== undefined && agents.deferredTargets.size > 0) {
    const deferred = [...agents.deferredTargets].map((t) => escapeBody(t)).join(', ');
    items.push(
      `Do not generate output for deferred agent targets without explicit instruction: ${deferred}.`,
    );
  }
  return section({ title: 'Scope Control', body: bulletList(items) });
}

function yesNo(value: boolean): string {
  return value ? 'yes' : 'no';
}
