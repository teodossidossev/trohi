import { ProjectConfig } from '../project-config';
import { ProjectSection } from '../sections/project-section';
import { ProductSection } from '../sections/product-section';
import { MvpSection } from '../sections/mvp-section';
import {
  ApplicationType,
  ArchitectureSection,
  PersistenceModel,
} from '../sections/architecture-section';
import { DomainModelingSection } from '../sections/domain-modeling-section';
import { FeatureArchitectureSection } from '../sections/feature-architecture-section';
import { PackageManager, TechnologySection } from '../sections/technology-section';
import { TestingSection } from '../sections/testing-section';
import { AgentsSection } from '../sections/agents-section';
import { OutputScope, OutputsSection } from '../sections/outputs-section';
import { ProjectName } from '../../values/project-name';
import { OutputTarget } from '../../output/output-target';

/**
 * Default preset that captures the configuration trohi uses to develop
 * itself.
 *
 * The values mirror `docs/PRODUCT_VISION.md`, `docs/MVP_SCOPE.md`,
 * `docs/TECH_STACK.md`, `docs/AGENT_BOOTSTRAP_SCOPE.md`, and the
 * decisions in `docs/DECISIONS.md`. Generating the trohi repo from
 * this preset must produce a configuration consistent with what the
 * project already documents about itself.
 *
 * The preset intentionally hard-codes the stack and workflow
 * (Angular 21, Node 22, npm, Vitest, Cypress, Zod, fflate, Claude +
 * Codex, Cursor/Copilot deferred). It is not parameterized: callers
 * who want a different default should define their own preset rather
 * than mutate this one.
 */
export class TrohiBootstrapPreset {
  /** Build a fully populated {@link ProjectConfig} for trohi's own bootstrap. */
  static create(): ProjectConfig {
    return ProjectConfig.create({
      configVersion: '1',
      project: ProjectSection.create({
        name: ProjectName.create('trohi'),
        description:
          'Dev-first tool for creating structured project documentation and AI agent instruction files for new software projects.',
      }),
      product: ProductSection.create({
        problemStatement:
          'Solo and indie developers lack a repeatable way to define project context, standards, and instructions for AI coding agents before implementation begins.',
        valueProposition:
          'Generate consistent human documentation and AI agent instruction files from one structured project configuration.',
      }),
      mvp: MvpSection.create({
        primaryUseCase:
          'A user starts a new software project without documentation, answers a structured wizard, previews generated files, and exports project documentation plus AI agent instruction files.',
        includedFeatures: [
          'Project profile creation',
          'Guided wizard',
          'Structured source configuration',
          'Human documentation generation',
          'AI agent instruction generation',
          'Preview before export',
          'ZIP and individual file export',
          'Config import',
        ],
        excludedFeatures: [
          'Backend',
          'User accounts',
          'Cloud sync',
          'Required AI integration',
          'Repository analysis',
          'Existing documentation import',
          'Direct Git integration',
          'Team workspaces',
          'Template marketplace',
          'Non-dev domain presets',
        ],
      }),
      architecture: ArchitectureSection.create({
        applicationType: ApplicationType.BrowserApp,
        hasBackend: false,
        persistenceModel: PersistenceModel.LocalImportExport,
      }),
      domainModeling: DomainModelingSection.create({
        useExplicitDomainModels: true,
        requireDtoValidation: true,
        useUiViewModels: true,
      }),
      featureArchitecture: FeatureArchitectureSection.create({
        viewsArePresentational: true,
        hasFeatureBusinessLayer: true,
        allowDirectHttpClientFromViews: false,
      }),
      technology: TechnologySection.create({
        framework: 'Angular 21',
        runtime: 'Node.js 22',
        packageManager: PackageManager.Npm,
        schemaValidator: 'Zod',
        zipLibrary: 'fflate',
        rejectedFrameworks: ['React'],
      }),
      testing: TestingSection.create({
        useTdd: true,
        unitTestRunner: 'Vitest',
        e2eTestRunner: 'Cypress',
      }),
      agents: AgentsSection.create({
        activeTargets: new Set([OutputTarget.Claude, OutputTarget.GenericAgent]),
        deferredTargets: new Set([OutputTarget.Cursor, OutputTarget.Copilot]),
      }),
      outputs: OutputsSection.create({ scope: OutputScope.TrohiBootstrap }),
    });
  }
}
