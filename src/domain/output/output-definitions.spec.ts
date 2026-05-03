import { describe, it, expect } from 'vitest';
import {
  DEFERRED_BOOTSTRAP_OUTPUTS,
  PRODUCT_MVP_OUTPUTS,
  TROHI_BOOTSTRAP_OUTPUTS,
} from './output-definitions';
import { OutputCategory } from './output-category';
import { OutputTarget } from './output-target';

const paths = (defs: readonly { path: { value: string } }[]) => defs.map((d) => d.path.value);

describe('output-definitions catalogs', () => {
  describe('TROHI_BOOTSTRAP_OUTPUTS', () => {
    // Source of truth: docs/OUTPUT_FILES.md > "Required trohi Repository Bootstrap Outputs"
    const expected = [
      'CLAUDE.md',
      'AGENTS.md',
      '.claude/skills/implement-with-tdd/SKILL.md',
      '.claude/skills/prepare-pr/SKILL.md',
      '.claude/skills/respond-to-review/SKILL.md',
      '.github/pull_request_template.md',
      'docs/AGENT_BOOTSTRAP_SCOPE.md',
    ];

    it('contains exactly the bootstrap files listed in OUTPUT_FILES.md', () => {
      expect(paths(TROHI_BOOTSTRAP_OUTPUTS).sort()).toEqual([...expected].sort());
    });

    it('contains no Cursor or Copilot targets', () => {
      const targets = TROHI_BOOTSTRAP_OUTPUTS.map((d) => d.target);
      expect(targets).not.toContain(OutputTarget.Cursor);
      expect(targets).not.toContain(OutputTarget.Copilot);
    });

    it('contains no duplicate paths', () => {
      expect(new Set(paths(TROHI_BOOTSTRAP_OUTPUTS)).size).toBe(TROHI_BOOTSTRAP_OUTPUTS.length);
    });
  });

  describe('PRODUCT_MVP_OUTPUTS', () => {
    // Source of truth: docs/OUTPUT_FILES.md > "Required Product MVP Outputs"
    const expected = [
      'docs/PRODUCT_VISION.md',
      'docs/MVP_SCOPE.md',
      'docs/ARCHITECTURE.md',
      'docs/DOMAIN_MODELING.md',
      'docs/FEATURE_ARCHITECTURE.md',
      'docs/CODING_STANDARDS.md',
      'docs/TESTING_STRATEGY.md',
      'docs/GIT_WORKFLOW.md',
      'docs/CI_CD_STRATEGY.md',
      'AGENTS.md',
      'trohi.config.json',
    ];

    it('contains exactly the product MVP files listed in OUTPUT_FILES.md', () => {
      expect(paths(PRODUCT_MVP_OUTPUTS).sort()).toEqual([...expected].sort());
    });

    it('classifies the doc files as HumanDocumentation', () => {
      const docs = PRODUCT_MVP_OUTPUTS.filter((d) => d.path.value.startsWith('docs/'));
      for (const d of docs) {
        expect(d.category).toBe(OutputCategory.HumanDocumentation);
        expect(d.target).toBe(OutputTarget.None);
      }
    });

    it('contains no duplicate paths', () => {
      expect(new Set(paths(PRODUCT_MVP_OUTPUTS)).size).toBe(PRODUCT_MVP_OUTPUTS.length);
    });
  });

  describe('DEFERRED_BOOTSTRAP_OUTPUTS', () => {
    // Source of truth: docs/OUTPUT_FILES.md > "Deferred Repository Bootstrap Outputs"
    const expected = [
      '.cursor/rules/project.mdc',
      '.cursor/rules/code-style.mdc',
      '.cursor/rules/testing.mdc',
      '.github/copilot-instructions.md',
    ];

    it('contains exactly the deferred files listed in OUTPUT_FILES.md', () => {
      expect(paths(DEFERRED_BOOTSTRAP_OUTPUTS).sort()).toEqual([...expected].sort());
    });

    it('targets only Cursor and Copilot', () => {
      const targets = new Set(DEFERRED_BOOTSTRAP_OUTPUTS.map((d) => d.target));
      expect(targets).toEqual(new Set([OutputTarget.Cursor, OutputTarget.Copilot]));
    });
  });

  describe('cross-catalog rules', () => {
    it('does not place any deferred path in the bootstrap catalog', () => {
      const bootstrapPaths = new Set(paths(TROHI_BOOTSTRAP_OUTPUTS));
      for (const def of DEFERRED_BOOTSTRAP_OUTPUTS) {
        expect(bootstrapPaths.has(def.path.value)).toBe(false);
      }
    });

    it('AGENTS.md is shared between bootstrap and product MVP catalogs', () => {
      // Both catalogs reference AGENTS.md but as distinct OutputDefinition
      // instances; document this so it is not mistaken for a duplication bug.
      const bootstrap = TROHI_BOOTSTRAP_OUTPUTS.find((d) => d.path.value === 'AGENTS.md');
      const product = PRODUCT_MVP_OUTPUTS.find((d) => d.path.value === 'AGENTS.md');
      expect(bootstrap).toBeDefined();
      expect(product).toBeDefined();
    });

    it('every catalog entry has a non-empty description', () => {
      const all = [
        ...TROHI_BOOTSTRAP_OUTPUTS,
        ...PRODUCT_MVP_OUTPUTS,
        ...DEFERRED_BOOTSTRAP_OUTPUTS,
      ];
      for (const d of all) {
        expect(d.description).toBeTruthy();
      }
    });

    it('all catalog paths are valid relative POSIX paths (constructed without throwing)', () => {
      // Implicitly verified: the catalogs are eagerly built at module load,
      // and OutputFilePath.create throws on unsafe paths. If any unsafe
      // path slipped in, importing the module would have failed before
      // this test ran. This assertion documents the invariant.
      expect(TROHI_BOOTSTRAP_OUTPUTS.length).toBeGreaterThan(0);
      expect(PRODUCT_MVP_OUTPUTS.length).toBeGreaterThan(0);
      expect(DEFERRED_BOOTSTRAP_OUTPUTS.length).toBeGreaterThan(0);
    });
  });
});
