import { GeneratedFileContent } from '../../output/generated-file-content';
import { OutputCategory } from '../../output/output-category';
import { OutputDefinition } from '../../output/output-definition';
import { OutputTarget } from '../../output/output-target';
import { OutputFilePath } from '../../values/output-file-path';
import { DocumentTemplate } from '../document-template';
import { bulletList, escapeInline, heading, numberedList } from '../markdown-helpers';
import { finalizeDocument, frontmatter, joinBlocks, section } from '../section-helpers';
import { TemplateRenderResult } from '../template-function';

const PATH = '.claude/skills/prepare-pr/SKILL.md';
const SKILL_NAME = 'prepare-pr';

/**
 * Generates `.claude/skills/prepare-pr/SKILL.md` - the skill that
 * walks Claude Code through preparing a focused pull request.
 *
 * Source of truth: `docs/OUTPUT_FILES.md` > Claude skills.
 */
export const preparePrSkillTemplate: DocumentTemplate = {
  definition: OutputDefinition.create({
    path: OutputFilePath.create(PATH),
    category: OutputCategory.AgentSpecificInstructions,
    target: OutputTarget.Claude,
    description: 'Claude Code PR preparation skill.',
  }),
  render: (context) => {
    const projectName = context.config.project.name.value;

    const head = frontmatter({
      name: SKILL_NAME,
      description: `Prepare a focused, reviewable ${projectName} pull request.`,
    });

    const title = heading(1, 'Prepare PR');

    const goalBlock = section({
      title: 'Goal',
      body: `Prepare a small, focused pull request for **${escapeInline(projectName)}** that reviewers can read end-to-end without losing scope.`,
    });

    const stepsBlock = section({
      title: 'Steps',
      body: numberedList([
        'Confirm the change is in MVP scope and does not introduce deferred features.',
        'Run all local checks: formatting, linting, type checking, unit and integration tests, snapshot tests, affected end-to-end tests, and the production build.',
        'Update tests and snapshots only after reviewing the diffs.',
        'Stage only the files that belong to this change; do not sweep up unrelated edits.',
        'Open a pull request and fill in every section of the project pull-request template.',
        'Request the review agent (typically Codex) and wait for human approval before merge.',
      ]),
    });

    const dosBlock = section({
      title: "Do's and Don'ts",
      body: bulletList([
        'Do prefer one focused commit per concern over a large mixed commit.',
        'Do reference the relevant project docs in the PR body when explaining a decision.',
        'Do not skip local checks because CI will rerun them.',
        'Do not bypass failing checks or weaken tests, lint rules, or static analysis to pass.',
        'Do not merge your own pull request.',
      ]),
    });

    const body = finalizeDocument(joinBlocks(head, title, goalBlock, stepsBlock, dosBlock));

    return TemplateRenderResult.of(GeneratedFileContent.create(body));
  },
};
