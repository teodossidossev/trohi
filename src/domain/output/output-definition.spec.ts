import { describe, it, expect } from 'vitest';
import { OutputDefinition, OutputDefinitionError } from './output-definition';
import { OutputCategory } from './output-category';
import { OutputTarget } from './output-target';
import { OutputFilePath } from '../values/output-file-path';

describe('OutputDefinition', () => {
  it('exposes its path, category, target and description', () => {
    const def = OutputDefinition.create({
      path: OutputFilePath.create('AGENTS.md'),
      category: OutputCategory.GenericAgentInstructions,
      target: OutputTarget.GenericAgent,
      description: 'Generic AI agent instructions and Codex review guidance.',
    });
    expect(def.path.value).toBe('AGENTS.md');
    expect(def.category).toBe(OutputCategory.GenericAgentInstructions);
    expect(def.target).toBe(OutputTarget.GenericAgent);
    expect(def.description).toBe('Generic AI agent instructions and Codex review guidance.');
  });

  it('treats description as optional', () => {
    const def = OutputDefinition.create({
      path: OutputFilePath.create('docs/x.md'),
      category: OutputCategory.HumanDocumentation,
      target: OutputTarget.None,
    });
    expect(def.description).toBeUndefined();
  });

  it('uses path equality for value equality', () => {
    const a = OutputDefinition.create({
      path: OutputFilePath.create('AGENTS.md'),
      category: OutputCategory.GenericAgentInstructions,
      target: OutputTarget.GenericAgent,
    });
    const b = OutputDefinition.create({
      path: OutputFilePath.create('AGENTS.md'),
      category: OutputCategory.GenericAgentInstructions,
      target: OutputTarget.GenericAgent,
    });
    expect(a.equals(b)).toBe(true);
  });

  it('considers different paths not equal even when category and target match', () => {
    const a = OutputDefinition.create({
      path: OutputFilePath.create('docs/A.md'),
      category: OutputCategory.HumanDocumentation,
      target: OutputTarget.None,
    });
    const b = OutputDefinition.create({
      path: OutputFilePath.create('docs/B.md'),
      category: OutputCategory.HumanDocumentation,
      target: OutputTarget.None,
    });
    expect(a.equals(b)).toBe(false);
  });

  describe('consistency invariants (path -> required category/target)', () => {
    // The well-known paths declared in docs/OUTPUT_FILES.md > "File Path
    // Rules" carry implicit category/target requirements. Constructing a
    // definition that violates them must fail at the boundary, not at
    // generation/export time.

    it('rejects .cursor/* paths declared with a non-Cursor target', () => {
      expect(() =>
        OutputDefinition.create({
          path: OutputFilePath.create('.cursor/rules/project.mdc'),
          category: OutputCategory.AgentSpecificInstructions,
          target: OutputTarget.Claude,
        }),
      ).toThrow(OutputDefinitionError);
    });

    it('rejects .github/copilot-instructions.md declared with target None', () => {
      expect(() =>
        OutputDefinition.create({
          path: OutputFilePath.create('.github/copilot-instructions.md'),
          category: OutputCategory.AgentSpecificInstructions,
          target: OutputTarget.None,
        }),
      ).toThrow(OutputDefinitionError);
    });

    it('rejects AGENTS.md classified as HumanDocumentation', () => {
      expect(() =>
        OutputDefinition.create({
          path: OutputFilePath.create('AGENTS.md'),
          category: OutputCategory.HumanDocumentation,
          target: OutputTarget.None,
        }),
      ).toThrow(OutputDefinitionError);
    });

    it('rejects CLAUDE.md classified with the wrong target', () => {
      expect(() =>
        OutputDefinition.create({
          path: OutputFilePath.create('CLAUDE.md'),
          category: OutputCategory.AgentSpecificInstructions,
          target: OutputTarget.GenericAgent,
        }),
      ).toThrow(OutputDefinitionError);
    });

    it('rejects .claude/* paths declared with a non-Claude target', () => {
      expect(() =>
        OutputDefinition.create({
          path: OutputFilePath.create('.claude/skills/foo/SKILL.md'),
          category: OutputCategory.AgentSpecificInstructions,
          target: OutputTarget.Cursor,
        }),
      ).toThrow(OutputDefinitionError);
    });

    it('rejects docs/* paths classified as anything other than HumanDocumentation', () => {
      expect(() =>
        OutputDefinition.create({
          path: OutputFilePath.create('docs/x.md'),
          category: OutputCategory.RepositoryWorkflow,
          target: OutputTarget.None,
        }),
      ).toThrow(OutputDefinitionError);
    });

    it('rejects docs/* paths declared with a non-None target', () => {
      expect(() =>
        OutputDefinition.create({
          path: OutputFilePath.create('docs/x.md'),
          category: OutputCategory.HumanDocumentation,
          target: OutputTarget.Claude,
        }),
      ).toThrow(OutputDefinitionError);
    });

    it('rejects trohi.config.json declared as anything other than RepositoryWorkflow/None', () => {
      expect(() =>
        OutputDefinition.create({
          path: OutputFilePath.create('trohi.config.json'),
          category: OutputCategory.HumanDocumentation,
          target: OutputTarget.None,
        }),
      ).toThrow(OutputDefinitionError);
    });

    it('rejects an AgentSpecificInstructions entry with target None', () => {
      // Agent-specific files must declare which agent they target,
      // even if the path is not yet recognized as well-known.
      expect(() =>
        OutputDefinition.create({
          path: OutputFilePath.create('some/future/path.md'),
          category: OutputCategory.AgentSpecificInstructions,
          target: OutputTarget.None,
        }),
      ).toThrow(OutputDefinitionError);
    });

    it('rejects Cursor target with a path that is not under .cursor/', () => {
      expect(() =>
        OutputDefinition.create({
          path: OutputFilePath.create('docs/cursor.md'),
          category: OutputCategory.AgentSpecificInstructions,
          target: OutputTarget.Cursor,
        }),
      ).toThrow(OutputDefinitionError);
    });

    it('rejects Copilot target with a path that is not the copilot instructions file', () => {
      expect(() =>
        OutputDefinition.create({
          path: OutputFilePath.create('docs/copilot.md'),
          category: OutputCategory.AgentSpecificInstructions,
          target: OutputTarget.Copilot,
        }),
      ).toThrow(OutputDefinitionError);
    });

    it('accepts an unknown path with sensible category/target combination', () => {
      // Unknown (i.e. non-well-known) paths should not be over-blocked.
      // Future legitimate outputs must remain creatable.
      const def = OutputDefinition.create({
        path: OutputFilePath.create('some/future/path.md'),
        category: OutputCategory.HumanDocumentation,
        target: OutputTarget.None,
      });
      expect(def.path.value).toBe('some/future/path.md');
    });

    it('accepts all currently shipped well-known combinations', () => {
      // Spot-check the canonical pairings actually used by the catalogs.
      expect(() =>
        OutputDefinition.create({
          path: OutputFilePath.create('CLAUDE.md'),
          category: OutputCategory.AgentSpecificInstructions,
          target: OutputTarget.Claude,
        }),
      ).not.toThrow();

      expect(() =>
        OutputDefinition.create({
          path: OutputFilePath.create('AGENTS.md'),
          category: OutputCategory.GenericAgentInstructions,
          target: OutputTarget.GenericAgent,
        }),
      ).not.toThrow();

      expect(() =>
        OutputDefinition.create({
          path: OutputFilePath.create('.github/pull_request_template.md'),
          category: OutputCategory.RepositoryWorkflow,
          target: OutputTarget.None,
        }),
      ).not.toThrow();

      expect(() =>
        OutputDefinition.create({
          path: OutputFilePath.create('.cursor/rules/project.mdc'),
          category: OutputCategory.AgentSpecificInstructions,
          target: OutputTarget.Cursor,
        }),
      ).not.toThrow();

      expect(() =>
        OutputDefinition.create({
          path: OutputFilePath.create('.github/copilot-instructions.md'),
          category: OutputCategory.AgentSpecificInstructions,
          target: OutputTarget.Copilot,
        }),
      ).not.toThrow();
    });
  });
});
