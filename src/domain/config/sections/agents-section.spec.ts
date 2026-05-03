import { describe, it, expect } from 'vitest';
import { AgentsSection } from './agents-section';
import { OutputTarget } from '../../output/output-target';

describe('AgentsSection', () => {
  it('exposes its target sets', () => {
    const section = AgentsSection.create({
      activeTargets: new Set([OutputTarget.Claude, OutputTarget.GenericAgent]),
      deferredTargets: new Set([OutputTarget.Cursor, OutputTarget.Copilot]),
    });
    expect([...section.activeTargets].sort()).toEqual(
      [OutputTarget.Claude, OutputTarget.GenericAgent].sort(),
    );
    expect([...section.deferredTargets].sort()).toEqual(
      [OutputTarget.Cursor, OutputTarget.Copilot].sort(),
    );
  });

  it('rejects a target that is both active and deferred', () => {
    expect(() =>
      AgentsSection.create({
        activeTargets: new Set([OutputTarget.Claude]),
        deferredTargets: new Set([OutputTarget.Claude]),
      }),
    ).toThrow();
  });

  it('accepts empty sets', () => {
    const section = AgentsSection.create({
      activeTargets: new Set(),
      deferredTargets: new Set(),
    });
    expect(section.activeTargets.size).toBe(0);
    expect(section.deferredTargets.size).toBe(0);
  });

  it('does not let mutations to the input set leak into the section', () => {
    const input = new Set([OutputTarget.Claude]);
    const section = AgentsSection.create({
      activeTargets: input,
      deferredTargets: new Set(),
    });
    input.add(OutputTarget.Cursor);
    expect(section.activeTargets.has(OutputTarget.Cursor)).toBe(false);
  });

  it('does not let mutations through the activeTargets getter affect the section', () => {
    // Object.freeze() does not block Set.prototype.add/delete/clear,
    // so a naive defense would silently let consumers corrupt the
    // section. Mutating the returned set must be a no-op against the
    // section's own state.
    const section = AgentsSection.create({
      activeTargets: new Set([OutputTarget.Claude]),
      deferredTargets: new Set([OutputTarget.Cursor]),
    });
    const exposed = section.activeTargets as Set<OutputTarget>;
    try {
      exposed.add(OutputTarget.Copilot);
    } catch {
      // Throwing on add is also acceptable; either way the section's
      // own view must not include the mutation.
    }
    expect(section.activeTargets.has(OutputTarget.Copilot)).toBe(false);
    expect(section.activeTargets.size).toBe(1);
  });

  it('does not let mutations through the deferredTargets getter affect the section', () => {
    const section = AgentsSection.create({
      activeTargets: new Set([OutputTarget.Claude]),
      deferredTargets: new Set([OutputTarget.Cursor]),
    });
    const exposed = section.deferredTargets as Set<OutputTarget>;
    try {
      exposed.delete(OutputTarget.Cursor);
      exposed.clear();
    } catch {
      // ditto: either no-op or throw is acceptable.
    }
    expect(section.deferredTargets.has(OutputTarget.Cursor)).toBe(true);
    expect(section.deferredTargets.size).toBe(1);
  });

  describe('equals', () => {
    it('is true when active and deferred sets contain the same targets', () => {
      const a = AgentsSection.create({
        activeTargets: new Set([OutputTarget.Claude, OutputTarget.GenericAgent]),
        deferredTargets: new Set([OutputTarget.Cursor]),
      });
      const b = AgentsSection.create({
        // Iteration order does not matter; sets compare by membership.
        activeTargets: new Set([OutputTarget.GenericAgent, OutputTarget.Claude]),
        deferredTargets: new Set([OutputTarget.Cursor]),
      });
      expect(a.equals(b)).toBe(true);
    });

    it('is false when activeTargets differ', () => {
      const a = AgentsSection.create({
        activeTargets: new Set([OutputTarget.Claude]),
        deferredTargets: new Set(),
      });
      const b = AgentsSection.create({
        activeTargets: new Set([OutputTarget.Claude, OutputTarget.GenericAgent]),
        deferredTargets: new Set(),
      });
      expect(a.equals(b)).toBe(false);
    });

    it('is false when deferredTargets differ', () => {
      const a = AgentsSection.create({
        activeTargets: new Set(),
        deferredTargets: new Set([OutputTarget.Cursor]),
      });
      const b = AgentsSection.create({
        activeTargets: new Set(),
        deferredTargets: new Set([OutputTarget.Copilot]),
      });
      expect(a.equals(b)).toBe(false);
    });
  });
});
