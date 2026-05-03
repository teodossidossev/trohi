import { describe, it, expect } from 'vitest';
import { ProjectConfig } from './project-config';
import { ProjectSection } from './sections/project-section';
import { ProjectName } from '../values/project-name';

const project = (name: string) => ProjectSection.create({ name: ProjectName.create(name) });

describe('ProjectConfig', () => {
  it('exposes its configuration version and project section', () => {
    const config = ProjectConfig.create({
      configVersion: '1',
      project: project('trohi'),
    });
    expect(config.configVersion).toBe('1');
    expect(config.project.name.value).toBe('trohi');
  });

  it('leaves every non-required section as undefined when not provided', () => {
    const config = ProjectConfig.create({
      configVersion: '1',
      project: project('trohi'),
    });
    expect(config.product).toBeUndefined();
    expect(config.mvp).toBeUndefined();
    expect(config.architecture).toBeUndefined();
    expect(config.domainModeling).toBeUndefined();
    expect(config.featureArchitecture).toBeUndefined();
    expect(config.technology).toBeUndefined();
    expect(config.testing).toBeUndefined();
    expect(config.agents).toBeUndefined();
    expect(config.outputs).toBeUndefined();
  });

  it('rejects an empty config version', () => {
    expect(() =>
      ProjectConfig.create({
        configVersion: '',
        project: project('trohi'),
      }),
    ).toThrow();
  });

  it('rejects a whitespace-only config version', () => {
    expect(() =>
      ProjectConfig.create({
        configVersion: '   ',
        project: project('trohi'),
      }),
    ).toThrow();
  });

  it('considers two configs with the same version and project name equal', () => {
    const a = ProjectConfig.create({ configVersion: '1', project: project('trohi') });
    const b = ProjectConfig.create({ configVersion: '1', project: project('trohi') });
    expect(a.equals(b)).toBe(true);
  });

  it('considers configs with different project names not equal', () => {
    const a = ProjectConfig.create({ configVersion: '1', project: project('trohi') });
    const b = ProjectConfig.create({ configVersion: '1', project: project('other') });
    expect(a.equals(b)).toBe(false);
  });

  describe('value-based equality across sections', () => {
    // Regression: equals must reflect every section, not just identity.
    // Two configs that differ in any meaningful section must not compare
    // equal - otherwise dirty-state detection, regeneration gating, and
    // preset comparison silently miss real changes.

    it('treats configs that differ in MVP scope as not equal', async () => {
      const { MvpSection } = await import('./sections/mvp-section');
      const a = ProjectConfig.create({
        configVersion: '1',
        project: project('trohi'),
        mvp: MvpSection.create({ includedFeatures: ['wizard'] }),
      });
      const b = ProjectConfig.create({
        configVersion: '1',
        project: project('trohi'),
        mvp: MvpSection.create({ includedFeatures: ['wizard', 'preview'] }),
      });
      expect(a.equals(b)).toBe(false);
    });

    it('treats configs that differ in architecture as not equal', async () => {
      const { ArchitectureSection, ApplicationType, PersistenceModel } =
        await import('./sections/architecture-section');
      const a = ProjectConfig.create({
        configVersion: '1',
        project: project('trohi'),
        architecture: ArchitectureSection.create({
          applicationType: ApplicationType.BrowserApp,
          hasBackend: false,
          persistenceModel: PersistenceModel.LocalImportExport,
        }),
      });
      const b = ProjectConfig.create({
        configVersion: '1',
        project: project('trohi'),
        architecture: ArchitectureSection.create({
          applicationType: ApplicationType.Cli,
          hasBackend: false,
          persistenceModel: PersistenceModel.LocalImportExport,
        }),
      });
      expect(a.equals(b)).toBe(false);
    });

    it('treats configs that differ in technology stack as not equal', async () => {
      const { TechnologySection, PackageManager } = await import('./sections/technology-section');
      const a = ProjectConfig.create({
        configVersion: '1',
        project: project('trohi'),
        technology: TechnologySection.create({
          framework: 'Angular 21',
          runtime: 'Node.js 22',
          packageManager: PackageManager.Npm,
        }),
      });
      const b = ProjectConfig.create({
        configVersion: '1',
        project: project('trohi'),
        technology: TechnologySection.create({
          framework: 'Angular 21',
          runtime: 'Node.js 22',
          packageManager: PackageManager.Pnpm,
        }),
      });
      expect(a.equals(b)).toBe(false);
    });

    it('treats configs that differ only in agents.activeTargets as not equal', async () => {
      const { AgentsSection } = await import('./sections/agents-section');
      const { OutputTarget } = await import('../output/output-target');
      const a = ProjectConfig.create({
        configVersion: '1',
        project: project('trohi'),
        agents: AgentsSection.create({
          activeTargets: new Set([OutputTarget.Claude]),
          deferredTargets: new Set(),
        }),
      });
      const b = ProjectConfig.create({
        configVersion: '1',
        project: project('trohi'),
        agents: AgentsSection.create({
          activeTargets: new Set([OutputTarget.Claude, OutputTarget.GenericAgent]),
          deferredTargets: new Set(),
        }),
      });
      expect(a.equals(b)).toBe(false);
    });

    it('treats one config with a section and another without it as not equal', async () => {
      const { ProductSection } = await import('./sections/product-section');
      const a = ProjectConfig.create({ configVersion: '1', project: project('trohi') });
      const b = ProjectConfig.create({
        configVersion: '1',
        project: project('trohi'),
        product: ProductSection.create({ problemStatement: 'something' }),
      });
      expect(a.equals(b)).toBe(false);
    });

    it('is true for two configs with identical full sections', async () => {
      const { ProductSection } = await import('./sections/product-section');
      const { TestingSection } = await import('./sections/testing-section');
      const make = () =>
        ProjectConfig.create({
          configVersion: '1',
          project: project('trohi'),
          product: ProductSection.create({ problemStatement: 'p' }),
          testing: TestingSection.create({ useTdd: true, unitTestRunner: 'Vitest' }),
        });
      expect(make().equals(make())).toBe(true);
    });
  });

  describe('cross-section invariants', () => {
    // The agents and outputs sections are validated locally in their
    // own classes, but the trohi-bootstrap policy is a *cross-section*
    // rule: when outputs.scope is TrohiBootstrap, the deferred agents
    // (Cursor, Copilot) must not appear in agents.activeTargets.
    // Sources of truth: docs/CONFIG_MODEL.md and
    // docs/AGENT_BOOTSTRAP_SCOPE.md.

    const baseInput = () => ({ configVersion: '1', project: project('trohi') });

    it('rejects TrohiBootstrap scope with Cursor in agents.activeTargets', async () => {
      const { AgentsSection } = await import('./sections/agents-section');
      const { OutputsSection, OutputScope } = await import('./sections/outputs-section');
      const { OutputTarget } = await import('../output/output-target');

      expect(() =>
        ProjectConfig.create({
          ...baseInput(),
          agents: AgentsSection.create({
            activeTargets: new Set([OutputTarget.Claude, OutputTarget.Cursor]),
            deferredTargets: new Set(),
          }),
          outputs: OutputsSection.create({ scope: OutputScope.TrohiBootstrap }),
        }),
      ).toThrow();
    });

    it('rejects TrohiBootstrap scope with Copilot in agents.activeTargets', async () => {
      const { AgentsSection } = await import('./sections/agents-section');
      const { OutputsSection, OutputScope } = await import('./sections/outputs-section');
      const { OutputTarget } = await import('../output/output-target');

      expect(() =>
        ProjectConfig.create({
          ...baseInput(),
          agents: AgentsSection.create({
            activeTargets: new Set([OutputTarget.Copilot]),
            deferredTargets: new Set(),
          }),
          outputs: OutputsSection.create({ scope: OutputScope.TrohiBootstrap }),
        }),
      ).toThrow();
    });

    it('accepts TrohiBootstrap scope with Cursor only in deferredTargets', async () => {
      const { AgentsSection } = await import('./sections/agents-section');
      const { OutputsSection, OutputScope } = await import('./sections/outputs-section');
      const { OutputTarget } = await import('../output/output-target');

      expect(() =>
        ProjectConfig.create({
          ...baseInput(),
          agents: AgentsSection.create({
            activeTargets: new Set([OutputTarget.Claude, OutputTarget.GenericAgent]),
            deferredTargets: new Set([OutputTarget.Cursor, OutputTarget.Copilot]),
          }),
          outputs: OutputsSection.create({ scope: OutputScope.TrohiBootstrap }),
        }),
      ).not.toThrow();
    });

    it('accepts ProductMvp scope with Cursor in agents.activeTargets', async () => {
      const { AgentsSection } = await import('./sections/agents-section');
      const { OutputsSection, OutputScope } = await import('./sections/outputs-section');
      const { OutputTarget } = await import('../output/output-target');

      expect(() =>
        ProjectConfig.create({
          ...baseInput(),
          agents: AgentsSection.create({
            activeTargets: new Set([OutputTarget.Cursor]),
            deferredTargets: new Set(),
          }),
          outputs: OutputsSection.create({ scope: OutputScope.ProductMvp }),
        }),
      ).not.toThrow();
    });

    it('does not run cross-section checks when agents or outputs are absent', async () => {
      const { AgentsSection } = await import('./sections/agents-section');
      const { OutputTarget } = await import('../output/output-target');

      // Only agents present: no outputs scope to compare against.
      expect(() =>
        ProjectConfig.create({
          ...baseInput(),
          agents: AgentsSection.create({
            activeTargets: new Set([OutputTarget.Cursor, OutputTarget.Copilot]),
            deferredTargets: new Set(),
          }),
        }),
      ).not.toThrow();
    });
  });
});
