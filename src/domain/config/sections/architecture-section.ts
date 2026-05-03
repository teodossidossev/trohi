/**
 * High-level kind of application a project ships.
 */
export enum ApplicationType {
  BrowserApp = 'browser-app',
  BackendApp = 'backend-app',
  Cli = 'cli',
  Library = 'library',
  Desktop = 'desktop',
  Mobile = 'mobile',
}

/**
 * Where the project's persistent data lives.
 */
export enum PersistenceModel {
  /** Local file import/export only (current trohi MVP). */
  LocalImportExport = 'local-import-export',
  /** Browser storage (LocalStorage, IndexedDB, ...). */
  BrowserStorage = 'browser-storage',
  /** Server-backed persistence. */
  Backend = 'backend',
  /** No persistence at all. */
  None = 'none',
}

/**
 * Inputs accepted when constructing an {@link ArchitectureSection}.
 */
export interface ArchitectureSectionCreateInput {
  readonly applicationType: ApplicationType;
  readonly hasBackend: boolean;
  readonly persistenceModel: PersistenceModel;
}

/**
 * Architecture decisions section of the configuration model.
 *
 * Captures the high-level technical direction (kind of app, whether
 * there is a backend, where data lives). Maps to the `architecture`
 * section in `docs/CONFIG_MODEL.md`.
 *
 * Enforces one cross-field invariant: if `hasBackend` is true, the
 * persistence model must not be the local-only one (LocalImportExport)
 * because local-only persistence excludes a backend by definition.
 * Conversely, the {@link PersistenceModel.Backend} model implies a
 * backend and is rejected when `hasBackend` is false.
 */
export class ArchitectureSection {
  private constructor(
    private readonly _applicationType: ApplicationType,
    private readonly _hasBackend: boolean,
    private readonly _persistenceModel: PersistenceModel,
  ) {}

  /**
   * Build an ArchitectureSection.
   *
   * @throws Error if hasBackend conflicts with the chosen persistence
   * model.
   */
  static create(input: ArchitectureSectionCreateInput): ArchitectureSection {
    if (input.hasBackend && input.persistenceModel === PersistenceModel.LocalImportExport) {
      throw new Error(
        'ArchitectureSection: hasBackend=true conflicts with persistenceModel=LocalImportExport.',
      );
    }
    if (!input.hasBackend && input.persistenceModel === PersistenceModel.Backend) {
      throw new Error('ArchitectureSection: persistenceModel=Backend requires hasBackend=true.');
    }
    return new ArchitectureSection(input.applicationType, input.hasBackend, input.persistenceModel);
  }

  /** Kind of application (browser, backend, CLI, ...). */
  get applicationType(): ApplicationType {
    return this._applicationType;
  }

  /** True when the project includes a server-side backend. */
  get hasBackend(): boolean {
    return this._hasBackend;
  }

  /** Where persistent data lives. */
  get persistenceModel(): PersistenceModel {
    return this._persistenceModel;
  }

  /** Value-based equality across all three fields. */
  equals(other: ArchitectureSection): boolean {
    return (
      this._applicationType === other._applicationType &&
      this._hasBackend === other._hasBackend &&
      this._persistenceModel === other._persistenceModel
    );
  }
}
