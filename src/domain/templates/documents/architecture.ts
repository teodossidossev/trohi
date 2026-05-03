import { GeneratedFileContent } from '../../output/generated-file-content';
import { OutputCategory } from '../../output/output-category';
import { OutputDefinition } from '../../output/output-definition';
import { OutputTarget } from '../../output/output-target';
import { OutputFilePath } from '../../values/output-file-path';
import { ArchitectureSection } from '../../config/sections/architecture-section';
import { DomainModelingSection } from '../../config/sections/domain-modeling-section';
import { FeatureArchitectureSection } from '../../config/sections/feature-architecture-section';
import { TechnologySection } from '../../config/sections/technology-section';
import { DocumentTemplate } from '../document-template';
import { bulletList, escapeInline, heading } from '../markdown-helpers';
import { finalizeDocument, joinBlocks, section } from '../section-helpers';
import { TemplateRenderResult } from '../template-function';
import { TemplateWarning } from '../template-warning';

const PATH = 'docs/ARCHITECTURE.md';

/**
 * Generates `docs/ARCHITECTURE.md` from the architecture, technology,
 * domain-modeling, and feature-architecture sections of the
 * configuration.
 *
 * Each subsection reflects only the fields the user has provided; if
 * a whole section is missing the template skips that subsection and
 * records a warning. The document never contradicts the config (e.g.
 * if `architecture.hasBackend` is false, the rendered text says so).
 *
 * Source of truth for what this document represents:
 * `docs/OUTPUT_FILES.md` > "docs/ARCHITECTURE.md".
 */
export const architectureTemplate: DocumentTemplate = {
  definition: OutputDefinition.create({
    path: OutputFilePath.create(PATH),
    category: OutputCategory.HumanDocumentation,
    target: OutputTarget.None,
    description:
      'High-level technical direction, system boundaries, domain modeling, and feature architecture.',
  }),
  render: (context) => {
    const cfg = context.config;
    const warnings: TemplateWarning[] = [];

    const title = heading(1, 'Architecture');

    const applicationBlock = renderApplicationSection(cfg.architecture, warnings);
    const technologyBlock = renderTechnologySection(cfg.technology, warnings);
    const domainModelingBlock = renderDomainModelingSection(cfg.domainModeling, warnings);
    const featureArchitectureBlock = renderFeatureArchitectureSection(
      cfg.featureArchitecture,
      warnings,
    );

    const body = finalizeDocument(
      joinBlocks(
        title,
        applicationBlock,
        technologyBlock,
        domainModelingBlock,
        featureArchitectureBlock,
      ),
    );

    return TemplateRenderResult.withWarnings(GeneratedFileContent.create(body), warnings);
  },
};

function renderApplicationSection(
  arch: ArchitectureSection | undefined,
  warnings: TemplateWarning[],
): string {
  if (arch === undefined) {
    warnings.push(
      TemplateWarning.create({
        message: 'architecture section is missing; "Application" section omitted.',
        source: PATH,
      }),
    );
    return '';
  }
  return section({
    title: 'Application',
    body: bulletList([
      `Application type: ${arch.applicationType}`,
      `Backend: ${yesNo(arch.hasBackend)}`,
      `Persistence: ${arch.persistenceModel}`,
    ]),
  });
}

function renderTechnologySection(
  tech: TechnologySection | undefined,
  warnings: TemplateWarning[],
): string {
  if (tech === undefined) {
    warnings.push(
      TemplateWarning.create({
        message: 'technology section is missing; "Technology Stack" section omitted.',
        source: PATH,
      }),
    );
    return '';
  }
  // User-provided strings (framework name, runtime, libraries) are
  // escaped before interpolation; enum-typed fields (packageManager)
  // are domain-controlled and safe.
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
  const stack = section({ title: 'Technology Stack', body: bulletList(lines) });
  if (tech.rejectedFrameworks.length === 0) {
    return stack;
  }
  const rejected = section({
    title: 'Rejected Frameworks',
    body: bulletList(tech.rejectedFrameworks.map(escapeInline)),
    level: 3,
  });
  return joinBlocks(stack, rejected);
}

function renderDomainModelingSection(
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
      `Require DTO validation: ${yesNo(dm.requireDtoValidation)}`,
      `Use UI view models: ${yesNo(dm.useUiViewModels)}`,
    ]),
  });
}

function renderFeatureArchitectureSection(
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
      // The feature-architecture/coding-standards templates also render
      // this rule; the wording must stay identical across docs.
      `Has feature business/application layer: ${yesNo(fa.hasFeatureBusinessLayer)}`,
      `Allow direct HttpClient/REST from views: ${yesNo(fa.allowDirectHttpClientFromViews)}`,
    ]),
  });
}

function yesNo(value: boolean): string {
  return value ? 'yes' : 'no';
}
