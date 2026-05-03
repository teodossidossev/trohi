import { GeneratedFileContent } from '../../output/generated-file-content';
import { OutputCategory } from '../../output/output-category';
import { OutputDefinition } from '../../output/output-definition';
import { OutputTarget } from '../../output/output-target';
import { OutputFilePath } from '../../values/output-file-path';
import { DocumentTemplate } from '../document-template';
import { bulletList, escapeInline, heading, numberedList } from '../markdown-helpers';
import { finalizeDocument, frontmatter, joinBlocks, section } from '../section-helpers';
import { TemplateRenderResult } from '../template-function';

const PATH = '.claude/skills/respond-to-review/SKILL.md';
const SKILL_NAME = 'respond-to-review';

/**
 * Generates `.claude/skills/respond-to-review/SKILL.md` - the skill
 * that walks Claude Code through addressing review feedback without
 * scope creep or weakening of quality gates.
 *
 * Source of truth: `docs/OUTPUT_FILES.md` > Claude skills.
 */
export const respondToReviewSkillTemplate: DocumentTemplate = {
  definition: OutputDefinition.create({
    path: OutputFilePath.create(PATH),
    category: OutputCategory.AgentSpecificInstructions,
    target: OutputTarget.Claude,
    description: 'Claude Code skill for responding to Codex or human review feedback.',
  }),
  render: (context) => {
    const projectName = context.config.project.name.value;

    const head = frontmatter({
      name: SKILL_NAME,
      description: `Respond to Codex or human review feedback on a ${projectName} pull request.`,
    });

    const title = heading(1, 'Respond To Review');

    const goalBlock = section({
      title: 'Goal',
      body: `Address valid review feedback on **${escapeInline(projectName)}** PRs without expanding scope or weakening quality gates.`,
    });

    const triageBlock = section({
      title: 'Triage Each Comment',
      body: bulletList([
        'valid and in scope',
        'valid but out of scope',
        'incorrect or not applicable',
        'unclear and needs clarification',
      ]),
    });

    const validBlock = section({
      title: 'Valid In-Scope Feedback',
      body: numberedList([
        'Add or update tests first when practical.',
        'Make the smallest code change that addresses the issue.',
        'Preserve architecture boundaries.',
        'Update snapshots only after reviewing the diff.',
        'Run relevant local checks.',
        'Reply with what changed.',
      ]),
    });

    const outOfScopeBlock = section({
      title: 'Valid Out-of-Scope Feedback',
      body: bulletList([
        'Acknowledge the point.',
        'Explain why it is out of scope for this PR.',
        'Suggest a follow-up issue or future task if useful.',
        'Do not expand the PR without human approval.',
      ]),
    });

    const incorrectBlock = section({
      title: 'Incorrect Feedback',
      body: bulletList([
        'Explain briefly and respectfully.',
        'Reference the relevant project document or code path.',
        'Do not change code just to satisfy an incorrect comment.',
      ]),
    });

    const body = finalizeDocument(
      joinBlocks(head, title, goalBlock, triageBlock, validBlock, outOfScopeBlock, incorrectBlock),
    );

    return TemplateRenderResult.of(GeneratedFileContent.create(body));
  },
};
