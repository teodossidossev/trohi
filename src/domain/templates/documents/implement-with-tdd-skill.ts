import { GeneratedFileContent } from '../../output/generated-file-content';
import { OutputCategory } from '../../output/output-category';
import { OutputDefinition } from '../../output/output-definition';
import { OutputTarget } from '../../output/output-target';
import { OutputFilePath } from '../../values/output-file-path';
import { DocumentTemplate } from '../document-template';
import { bulletList, escapeInline, heading, numberedList } from '../markdown-helpers';
import { finalizeDocument, frontmatter, joinBlocks, section } from '../section-helpers';
import { TemplateRenderResult } from '../template-function';

const PATH = '.claude/skills/implement-with-tdd/SKILL.md';
const SKILL_NAME = 'implement-with-tdd';

/**
 * Generates `.claude/skills/implement-with-tdd/SKILL.md` - Claude
 * Code's TDD implementation skill.
 *
 * Output is a Markdown document with YAML frontmatter (name +
 * description) followed by Goal, TDD Cycle, Architecture Rules, and
 * Local Checks sections. The architecture rules and local-check list
 * stay short - they reference the project's main docs as the source
 * of truth instead of duplicating them.
 *
 * Source of truth: `docs/OUTPUT_FILES.md` > Claude skills.
 */
export const implementWithTddSkillTemplate: DocumentTemplate = {
  definition: OutputDefinition.create({
    path: OutputFilePath.create(PATH),
    category: OutputCategory.AgentSpecificInstructions,
    target: OutputTarget.Claude,
    description: 'Claude Code TDD implementation skill.',
  }),
  render: (context) => {
    const projectName = context.config.project.name.value;

    const head = frontmatter({
      name: SKILL_NAME,
      description: `Implement a focused change in ${projectName} using TDD.`,
    });

    const title = heading(1, 'Implement With TDD');

    const goalBlock = section({
      title: 'Goal',
      body: `Implement a focused change in **${escapeInline(projectName)}** using TDD while respecting the project's architecture, domain modeling, and feature boundaries.`,
    });

    const cycleBlock = section({
      title: 'TDD Cycle',
      body: numberedList([
        'Write a failing test that describes the new behavior.',
        'Implement the smallest useful change to make the test pass.',
        'Refactor without changing behavior.',
        'Re-run relevant local checks before moving on.',
      ]),
    });

    const beforeBlock = section({
      title: 'Before You Start',
      body: bulletList([
        'Read the relevant project documents.',
        'Identify the owning layer and feature for the change.',
        'Stop and explain if the requested change conflicts with the docs.',
      ]),
    });

    const archBlock = section({
      title: 'Architecture Rules',
      body: bulletList([
        'Do not pass raw JSON through the application; map external DTOs into domain models at boundaries.',
        'Do not put business logic in views.',
        'Do not call HttpClient or REST services directly from views.',
        'Use ports/adapters at infrastructure boundaries.',
      ]),
    });

    const checksBlock = section({
      title: 'Local Checks Before Commit',
      body: bulletList([
        'formatting',
        'linting',
        'type checking',
        'unit and integration tests',
        'snapshot tests for generated Markdown',
        'affected end-to-end tests',
        'production build',
      ]),
    });

    const body = finalizeDocument(
      joinBlocks(head, title, goalBlock, beforeBlock, cycleBlock, archBlock, checksBlock),
    );

    return TemplateRenderResult.of(GeneratedFileContent.create(body));
  },
};
