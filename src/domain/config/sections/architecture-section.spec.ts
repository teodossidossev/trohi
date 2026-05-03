import { describe, it, expect } from 'vitest';
import { ApplicationType, ArchitectureSection, PersistenceModel } from './architecture-section';

describe('ArchitectureSection', () => {
  it('exposes its decisions', () => {
    const section = ArchitectureSection.create({
      applicationType: ApplicationType.BrowserApp,
      hasBackend: false,
      persistenceModel: PersistenceModel.LocalImportExport,
    });
    expect(section.applicationType).toBe(ApplicationType.BrowserApp);
    expect(section.hasBackend).toBe(false);
    expect(section.persistenceModel).toBe(PersistenceModel.LocalImportExport);
  });

  it('rejects hasBackend=true paired with LocalImportExport persistence', () => {
    expect(() =>
      ArchitectureSection.create({
        applicationType: ApplicationType.BackendApp,
        hasBackend: true,
        persistenceModel: PersistenceModel.LocalImportExport,
      }),
    ).toThrow();
  });

  it('rejects persistenceModel=Backend when hasBackend is false', () => {
    expect(() =>
      ArchitectureSection.create({
        applicationType: ApplicationType.BrowserApp,
        hasBackend: false,
        persistenceModel: PersistenceModel.Backend,
      }),
    ).toThrow();
  });

  it('accepts hasBackend=true with Backend persistence', () => {
    expect(() =>
      ArchitectureSection.create({
        applicationType: ApplicationType.BackendApp,
        hasBackend: true,
        persistenceModel: PersistenceModel.Backend,
      }),
    ).not.toThrow();
  });

  describe('equals', () => {
    const make = (overrides: Partial<Parameters<typeof ArchitectureSection.create>[0]> = {}) =>
      ArchitectureSection.create({
        applicationType: ApplicationType.BrowserApp,
        hasBackend: false,
        persistenceModel: PersistenceModel.LocalImportExport,
        ...overrides,
      });

    it('is true for identical sections', () => {
      expect(make().equals(make())).toBe(true);
    });

    it('is false when applicationType differs', () => {
      expect(make().equals(make({ applicationType: ApplicationType.Cli }))).toBe(false);
    });

    it('is false when hasBackend differs (with matching persistenceModel)', () => {
      const a = ArchitectureSection.create({
        applicationType: ApplicationType.BackendApp,
        hasBackend: true,
        persistenceModel: PersistenceModel.Backend,
      });
      const b = ArchitectureSection.create({
        applicationType: ApplicationType.BackendApp,
        hasBackend: false,
        persistenceModel: PersistenceModel.None,
      });
      expect(a.equals(b)).toBe(false);
    });

    it('is false when persistenceModel differs', () => {
      expect(make().equals(make({ persistenceModel: PersistenceModel.None }))).toBe(false);
    });
  });
});
