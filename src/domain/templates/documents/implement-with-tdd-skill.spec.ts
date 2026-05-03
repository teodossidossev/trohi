import { describe, it, expect } from 'vitest';
import { implementWithTddSkillTemplate } from './implement-with-tdd-skill';
import { renderDocument } from '../document-template';
import { RenderingContext } from '../rendering-context';
import { TrohiBootstrapPreset } from '../../config/presets/trohi-bootstrap-preset';
import { OutputCategory } from '../../output/output-category';
import { OutputTarget } from '../../output/output-target';

describe('implementWithTddSkillTemplate', () => {
  describe('definition', () => {
    it('writes to .claude/skills/implement-with-tdd/SKILL.md as Claude/AgentSpecific', () => {
      expect(implementWithTddSkillTemplate.definition.path.value).toBe(
        '.claude/skills/implement-with-tdd/SKILL.md',
      );
      expect(implementWithTddSkillTemplate.definition.category).toBe(
        OutputCategory.AgentSpecificInstructions,
      );
      expect(implementWithTddSkillTemplate.definition.target).toBe(OutputTarget.Claude);
    });
  });

  describe('rendering against the trohi-bootstrap preset', () => {
    const subject = () =>
      renderDocument(
        implementWithTddSkillTemplate,
        RenderingContext.create({ config: TrohiBootstrapPreset.create() }),
      );

    it('produces a stable, fully-specified Markdown document with frontmatter', () => {
      expect(subject().file.content.value).toBe(
        "---\nname: 'implement-with-tdd'\ndescription: 'Implement a focused change in trohi using TDD.'\n---\n\n" +
          '# Implement With TDD\n\n' +
          '## Goal\n\n' +
          "Implement a focused change in **trohi** using TDD while respecting the project's architecture, domain modeling, and feature boundaries.\n\n" +
          '## Before You Start\n\n' +
          '- Read the relevant project documents.\n' +
          '- Identify the owning layer and feature for the change.\n' +
          '- Stop and explain if the requested change conflicts with the docs.\n\n' +
          '## TDD Cycle\n\n' +
          '1. Write a failing test that describes the new behavior.\n' +
          '2. Implement the smallest useful change to make the test pass.\n' +
          '3. Refactor without changing behavior.\n' +
          '4. Re-run relevant local checks before moving on.\n\n' +
          '## Architecture Rules\n\n' +
          '- Do not pass raw JSON through the application; map external DTOs into domain models at boundaries.\n' +
          '- Do not put business logic in views.\n' +
          '- Do not call HttpClient or REST services directly from views.\n' +
          '- Use ports/adapters at infrastructure boundaries.\n\n' +
          '## Local Checks Before Commit\n\n' +
          '- formatting\n' +
          '- linting\n' +
          '- type checking\n' +
          '- unit and integration tests\n' +
          '- snapshot tests for generated Markdown\n' +
          '- affected end-to-end tests\n' +
          '- production build\n',
      );
    });

    it('emits no warnings', () => {
      expect(subject().warnings).toEqual([]);
    });

    it('starts with valid YAML frontmatter naming the skill', () => {
      const value = subject().file.content.value;
      expect(value.startsWith("---\nname: 'implement-with-tdd'")).toBe(true);
      // Frontmatter is followed by a blank line before the heading.
      expect(value).toContain('---\n\n# Implement With TDD');
    });

    it('is deterministic across calls', () => {
      const a = subject().file.content.value;
      const b = subject().file.content.value;
      expect(a).toBe(b);
    });
  });
});
