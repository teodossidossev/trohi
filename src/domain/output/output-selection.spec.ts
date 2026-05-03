import { describe, it, expect } from 'vitest';
import { OutputSelection } from './output-selection';
import {
  DEFERRED_BOOTSTRAP_OUTPUTS,
  PRODUCT_MVP_OUTPUTS,
  TROHI_BOOTSTRAP_OUTPUTS,
} from './output-definitions';
import { OutputTarget } from './output-target';

const pathsOf = (defs: readonly { path: { value: string } }[]) => defs.map((d) => d.path.value);

describe('OutputSelection', () => {
  describe('forTrohiBootstrap', () => {
    it('returns exactly the bootstrap catalog', () => {
      const selected = OutputSelection.forTrohiBootstrap();
      expect(pathsOf(selected).sort()).toEqual(pathsOf(TROHI_BOOTSTRAP_OUTPUTS).sort());
    });

    it('never includes Cursor or Copilot files, even if selectedTargets would imply them', () => {
      // Bootstrap is a fixed Claude+GenericAgent workflow; the API takes
      // no input here so callers cannot accidentally request Cursor or
      // Copilot for trohi's own development.
      const selected = OutputSelection.forTrohiBootstrap();
      const targets = selected.map((d) => d.target);
      expect(targets).not.toContain(OutputTarget.Cursor);
      expect(targets).not.toContain(OutputTarget.Copilot);
    });

    it('contains no path from the deferred bootstrap catalog', () => {
      const deferred = new Set(pathsOf(DEFERRED_BOOTSTRAP_OUTPUTS));
      for (const def of OutputSelection.forTrohiBootstrap()) {
        expect(deferred.has(def.path.value)).toBe(false);
      }
    });

    it('is deterministic across calls', () => {
      const a = pathsOf(OutputSelection.forTrohiBootstrap());
      const b = pathsOf(OutputSelection.forTrohiBootstrap());
      expect(a).toEqual(b);
    });
  });

  describe('forProductMvp', () => {
    it('returns at least the required product MVP set when no targets are selected', () => {
      const selected = OutputSelection.forProductMvp({
        selectedTargets: new Set<OutputTarget>(),
      });
      expect(pathsOf(selected).sort()).toEqual(pathsOf(PRODUCT_MVP_OUTPUTS).sort());
    });

    it('adds Cursor files only when Cursor is selected', () => {
      const withCursor = pathsOf(
        OutputSelection.forProductMvp({
          selectedTargets: new Set([OutputTarget.Cursor]),
        }),
      );
      const withoutCursor = pathsOf(
        OutputSelection.forProductMvp({
          selectedTargets: new Set<OutputTarget>(),
        }),
      );

      const cursorPaths = pathsOf(
        DEFERRED_BOOTSTRAP_OUTPUTS.filter((d) => d.target === OutputTarget.Cursor),
      );
      expect(cursorPaths.length).toBeGreaterThan(0);

      // Each Cursor path appears with selection, none without.
      for (const cursor of cursorPaths) {
        expect(withCursor).toContain(cursor);
        expect(withoutCursor).not.toContain(cursor);
      }
    });

    it('adds Copilot files only when Copilot is selected', () => {
      const withCopilot = pathsOf(
        OutputSelection.forProductMvp({
          selectedTargets: new Set([OutputTarget.Copilot]),
        }),
      );
      const copilotPaths = pathsOf(
        DEFERRED_BOOTSTRAP_OUTPUTS.filter((d) => d.target === OutputTarget.Copilot),
      );
      for (const copilot of copilotPaths) {
        expect(withCopilot).toContain(copilot);
      }
    });

    it('combines Cursor and Copilot selections additively', () => {
      const combined = pathsOf(
        OutputSelection.forProductMvp({
          selectedTargets: new Set([OutputTarget.Cursor, OutputTarget.Copilot]),
        }),
      );
      // Should contain every deferred path plus all required.
      const expected = [...pathsOf(PRODUCT_MVP_OUTPUTS), ...pathsOf(DEFERRED_BOOTSTRAP_OUTPUTS)];
      expect(combined.sort()).toEqual(expected.sort());
    });

    it('ignores targets that have no optional output associated with them', () => {
      // GenericAgent is already covered by the required base set;
      // selecting it should not duplicate or expand the result.
      const selected = pathsOf(
        OutputSelection.forProductMvp({
          selectedTargets: new Set([OutputTarget.GenericAgent]),
        }),
      );
      expect(selected.sort()).toEqual(pathsOf(PRODUCT_MVP_OUTPUTS).sort());
    });

    it('produces no duplicate paths', () => {
      const selected = pathsOf(
        OutputSelection.forProductMvp({
          selectedTargets: new Set([OutputTarget.Cursor, OutputTarget.Copilot]),
        }),
      );
      expect(new Set(selected).size).toBe(selected.length);
    });

    it('is deterministic for the same input', () => {
      const args = { selectedTargets: new Set([OutputTarget.Cursor]) };
      const a = pathsOf(OutputSelection.forProductMvp(args));
      const b = pathsOf(OutputSelection.forProductMvp(args));
      expect(a).toEqual(b);
    });
  });
});
