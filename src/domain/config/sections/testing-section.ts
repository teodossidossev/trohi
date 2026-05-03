/**
 * Inputs accepted when constructing a {@link TestingSection}.
 */
export interface TestingSectionCreateInput {
  readonly useTdd: boolean;
  readonly unitTestRunner: string;
  readonly e2eTestRunner?: string;
}

/**
 * Testing strategy section of the configuration model.
 *
 * Captures the workflow choice (TDD or not) and the chosen test
 * runners. Maps to the `testing` section in `docs/CONFIG_MODEL.md`.
 *
 * The skeleton holds enough to drive generated docs/agent files; richer
 * concepts (snapshot policy, coverage thresholds, mock guidance) will
 * be added later.
 */
export class TestingSection {
  private constructor(
    private readonly _useTdd: boolean,
    private readonly _unitTestRunner: string,
    private readonly _e2eTestRunner: string | undefined,
  ) {}

  /**
   * Build a TestingSection.
   *
   * @throws Error if the unit test runner is blank or the e2e runner is
   * provided but blank.
   */
  static create(input: TestingSectionCreateInput): TestingSection {
    const unit = input.unitTestRunner.trim();
    if (unit.length === 0) {
      throw new Error('TestingSection unitTestRunner must not be blank.');
    }
    let e2e: string | undefined;
    if (input.e2eTestRunner !== undefined) {
      e2e = input.e2eTestRunner.trim();
      if (e2e.length === 0) {
        throw new Error('TestingSection e2eTestRunner must not be blank when provided.');
      }
    }
    return new TestingSection(input.useTdd, unit, e2e);
  }

  /** True when the project uses TDD as its preferred workflow. */
  get useTdd(): boolean {
    return this._useTdd;
  }

  /** Chosen unit/integration test runner, e.g. "Vitest". */
  get unitTestRunner(): string {
    return this._unitTestRunner;
  }

  /** Optional end-to-end test runner, e.g. "Cypress". */
  get e2eTestRunner(): string | undefined {
    return this._e2eTestRunner;
  }

  /** Value-based equality across all fields. */
  equals(other: TestingSection): boolean {
    return (
      this._useTdd === other._useTdd &&
      this._unitTestRunner === other._unitTestRunner &&
      this._e2eTestRunner === other._e2eTestRunner
    );
  }
}
