import { describe, it, expect } from 'vitest';
import { TrohiBootstrapPreset } from './trohi-bootstrap-preset';
import { ApplicationType, PersistenceModel } from '../sections/architecture-section';
import { PackageManager } from '../sections/technology-section';
import { OutputScope } from '../sections/outputs-section';
import { OutputTarget } from '../../output/output-target';
import { OutputSelection } from '../../output/output-selection';
import {
  DEFERRED_BOOTSTRAP_OUTPUTS,
  TROHI_BOOTSTRAP_OUTPUTS,
} from '../../output/output-definitions';

describe('TrohiBootstrapPreset', () => {
  it('builds a config without throwing', () => {
    expect(() => TrohiBootstrapPreset.create()).not.toThrow();
  });

  it('identifies the project as "trohi"', () => {
    const config = TrohiBootstrapPreset.create();
    expect(config.project.name.value).toBe('trohi');
    expect(config.project.description).toBeDefined();
  });

  it('uses configVersion "1"', () => {
    expect(TrohiBootstrapPreset.create().configVersion).toBe('1');
  });

  it('populates every optional section (no hidden defaults)', () => {
    const config = TrohiBootstrapPreset.create();
    expect(config.product).toBeDefined();
    expect(config.mvp).toBeDefined();
    expect(config.architecture).toBeDefined();
    expect(config.domainModeling).toBeDefined();
    expect(config.featureArchitecture).toBeDefined();
    expect(config.technology).toBeDefined();
    expect(config.testing).toBeDefined();
    expect(config.agents).toBeDefined();
    expect(config.outputs).toBeDefined();
  });

  describe('architecture decisions', () => {
    it('declares a browser app with no backend and local import/export persistence', () => {
      const arch = TrohiBootstrapPreset.create().architecture;
      expect(arch?.applicationType).toBe(ApplicationType.BrowserApp);
      expect(arch?.hasBackend).toBe(false);
      expect(arch?.persistenceModel).toBe(PersistenceModel.LocalImportExport);
    });

    it('locks in the no-raw-JSON-in-UI rule via domain modeling and feature architecture', () => {
      const config = TrohiBootstrapPreset.create();
      expect(config.domainModeling?.useExplicitDomainModels).toBe(true);
      expect(config.domainModeling?.requireDtoValidation).toBe(true);
      expect(config.domainModeling?.useUiViewModels).toBe(true);
      expect(config.featureArchitecture?.viewsArePresentational).toBe(true);
      expect(config.featureArchitecture?.hasFeatureBusinessLayer).toBe(true);
      expect(config.featureArchitecture?.allowDirectHttpClientFromViews).toBe(false);
    });
  });

  describe('technology stack', () => {
    it('matches the chosen MVP stack', () => {
      const tech = TrohiBootstrapPreset.create().technology;
      expect(tech?.framework).toBe('Angular 21');
      expect(tech?.runtime).toBe('Node.js 22');
      expect(tech?.packageManager).toBe(PackageManager.Npm);
      expect(tech?.schemaValidator).toBe('Zod');
      expect(tech?.zipLibrary).toBe('fflate');
    });

    it('explicitly rejects React', () => {
      expect(TrohiBootstrapPreset.create().technology?.rejectedFrameworks).toContain('React');
    });
  });

  describe('testing strategy', () => {
    it('selects TDD with Vitest and Cypress', () => {
      const testing = TrohiBootstrapPreset.create().testing;
      expect(testing?.useTdd).toBe(true);
      expect(testing?.unitTestRunner).toBe('Vitest');
      expect(testing?.e2eTestRunner).toBe('Cypress');
    });
  });

  describe('agents', () => {
    it('activates Claude and GenericAgent', () => {
      const agents = TrohiBootstrapPreset.create().agents;
      expect(agents?.activeTargets.has(OutputTarget.Claude)).toBe(true);
      expect(agents?.activeTargets.has(OutputTarget.GenericAgent)).toBe(true);
    });

    it('defers Cursor and Copilot for trohi repo bootstrap', () => {
      const agents = TrohiBootstrapPreset.create().agents;
      expect(agents?.deferredTargets.has(OutputTarget.Cursor)).toBe(true);
      expect(agents?.deferredTargets.has(OutputTarget.Copilot)).toBe(true);
    });

    it('never marks the same target as both active and deferred', () => {
      const agents = TrohiBootstrapPreset.create().agents;
      const overlap = [...(agents?.activeTargets ?? [])].filter((t) =>
        agents?.deferredTargets.has(t),
      );
      expect(overlap).toEqual([]);
    });
  });

  describe('outputs scope drives OutputSelection', () => {
    it('uses the trohi-bootstrap scope', () => {
      expect(TrohiBootstrapPreset.create().outputs?.scope).toBe(OutputScope.TrohiBootstrap);
    });

    it('the bootstrap selection contains exactly TROHI_BOOTSTRAP_OUTPUTS', () => {
      // Sanity: pairing the preset's scope with OutputSelection produces
      // the agreed-upon set, never the deferred Cursor/Copilot files.
      const selected = OutputSelection.forTrohiBootstrap();
      expect(selected.map((d) => d.path.value).sort()).toEqual(
        TROHI_BOOTSTRAP_OUTPUTS.map((d) => d.path.value).sort(),
      );
    });

    it('the bootstrap selection contains no deferred path', () => {
      const deferredPaths = new Set(DEFERRED_BOOTSTRAP_OUTPUTS.map((d) => d.path.value));
      for (const def of OutputSelection.forTrohiBootstrap()) {
        expect(deferredPaths.has(def.path.value)).toBe(false);
      }
    });
  });

  describe('determinism', () => {
    it('produces equal configs on repeated calls', () => {
      const a = TrohiBootstrapPreset.create();
      const b = TrohiBootstrapPreset.create();
      expect(a.equals(b)).toBe(true);
    });

    it('mutating the result of one call does not leak into another', () => {
      // The preset returns fresh instances; section state is immutable
      // so even if a caller tried to mutate references, subsequent
      // callers would see clean values.
      const a = TrohiBootstrapPreset.create();
      const b = TrohiBootstrapPreset.create();
      expect(a.technology).not.toBe(b.technology);
      expect(a.technology?.framework).toBe(b.technology?.framework);
    });
  });
});
