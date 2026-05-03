import { describe, it, expect } from 'vitest';
import { preparePrSkillTemplate } from './prepare-pr-skill';
import { renderDocument } from '../document-template';
import { RenderingContext } from '../rendering-context';
import { TrohiBootstrapPreset } from '../../config/presets/trohi-bootstrap-preset';
import { OutputCategory } from '../../output/output-category';
import { OutputTarget } from '../../output/output-target';

describe('preparePrSkillTemplate', () => {
  describe('definition', () => {
    it('writes to .claude/skills/prepare-pr/SKILL.md as Claude/AgentSpecific', () => {
      expect(preparePrSkillTemplate.definition.path.value).toBe(
        '.claude/skills/prepare-pr/SKILL.md',
      );
      expect(preparePrSkillTemplate.definition.category).toBe(
        OutputCategory.AgentSpecificInstructions,
      );
      expect(preparePrSkillTemplate.definition.target).toBe(OutputTarget.Claude);
    });
  });

  describe('rendering against the trohi-bootstrap preset', () => {
    const subject = () =>
      renderDocument(
        preparePrSkillTemplate,
        RenderingContext.create({ config: TrohiBootstrapPreset.create() }),
      );

    it('produces a stable, fully-specified Markdown document with frontmatter', () => {
      expect(subject().file.content.value).toBe(
        "---\nname: 'prepare-pr'\ndescription: 'Prepare a focused, reviewable trohi pull request.'\n---\n\n" +
          '# Prepare PR\n\n' +
          '## Goal\n\n' +
          'Prepare a small, focused pull request for **trohi** that reviewers can read end-to-end without losing scope.\n\n' +
          '## Steps\n\n' +
          '1. Confirm the change is in MVP scope and does not introduce deferred features.\n' +
          '2. Run all local checks: formatting, linting, type checking, unit and integration tests, snapshot tests, affected end-to-end tests, and the production build.\n' +
          '3. Update tests and snapshots only after reviewing the diffs.\n' +
          '4. Stage only the files that belong to this change; do not sweep up unrelated edits.\n' +
          '5. Open a pull request and fill in every section of the project pull-request template.\n' +
          '6. Request the review agent (typically Codex) and wait for human approval before merge.\n\n' +
          "## Do's and Don'ts\n\n" +
          '- Do prefer one focused commit per concern over a large mixed commit.\n' +
          '- Do reference the relevant project docs in the PR body when explaining a decision.\n' +
          '- Do not skip local checks because CI will rerun them.\n' +
          '- Do not bypass failing checks or weaken tests, lint rules, or static analysis to pass.\n' +
          '- Do not merge your own pull request.\n',
      );
    });

    it('emits no warnings', () => {
      expect(subject().warnings).toEqual([]);
    });

    it('is deterministic across calls', () => {
      const a = subject().file.content.value;
      const b = subject().file.content.value;
      expect(a).toBe(b);
    });
  });
});
