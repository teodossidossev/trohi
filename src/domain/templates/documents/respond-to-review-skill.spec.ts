import { describe, it, expect } from 'vitest';
import { respondToReviewSkillTemplate } from './respond-to-review-skill';
import { renderDocument } from '../document-template';
import { RenderingContext } from '../rendering-context';
import { TrohiBootstrapPreset } from '../../config/presets/trohi-bootstrap-preset';
import { OutputCategory } from '../../output/output-category';
import { OutputTarget } from '../../output/output-target';

describe('respondToReviewSkillTemplate', () => {
  describe('definition', () => {
    it('writes to .claude/skills/respond-to-review/SKILL.md as Claude/AgentSpecific', () => {
      expect(respondToReviewSkillTemplate.definition.path.value).toBe(
        '.claude/skills/respond-to-review/SKILL.md',
      );
      expect(respondToReviewSkillTemplate.definition.category).toBe(
        OutputCategory.AgentSpecificInstructions,
      );
      expect(respondToReviewSkillTemplate.definition.target).toBe(OutputTarget.Claude);
    });
  });

  describe('rendering against the trohi-bootstrap preset', () => {
    const subject = () =>
      renderDocument(
        respondToReviewSkillTemplate,
        RenderingContext.create({ config: TrohiBootstrapPreset.create() }),
      );

    it('produces a stable, fully-specified Markdown document with frontmatter', () => {
      expect(subject().file.content.value).toBe(
        "---\nname: 'respond-to-review'\ndescription: 'Respond to Codex or human review feedback on a trohi pull request.'\n---\n\n" +
          '# Respond To Review\n\n' +
          '## Goal\n\n' +
          'Address valid review feedback on **trohi** PRs without expanding scope or weakening quality gates.\n\n' +
          '## Triage Each Comment\n\n' +
          '- valid and in scope\n' +
          '- valid but out of scope\n' +
          '- incorrect or not applicable\n' +
          '- unclear and needs clarification\n\n' +
          '## Valid In-Scope Feedback\n\n' +
          '1. Add or update tests first when practical.\n' +
          '2. Make the smallest code change that addresses the issue.\n' +
          '3. Preserve architecture boundaries.\n' +
          '4. Update snapshots only after reviewing the diff.\n' +
          '5. Run relevant local checks.\n' +
          '6. Reply with what changed.\n\n' +
          '## Valid Out-of-Scope Feedback\n\n' +
          '- Acknowledge the point.\n' +
          '- Explain why it is out of scope for this PR.\n' +
          '- Suggest a follow-up issue or future task if useful.\n' +
          '- Do not expand the PR without human approval.\n\n' +
          '## Incorrect Feedback\n\n' +
          '- Explain briefly and respectfully.\n' +
          '- Reference the relevant project document or code path.\n' +
          '- Do not change code just to satisfy an incorrect comment.\n',
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
