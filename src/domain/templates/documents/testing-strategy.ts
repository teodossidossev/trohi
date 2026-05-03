import { GeneratedFileContent } from '../../output/generated-file-content';
import { OutputCategory } from '../../output/output-category';
import { OutputDefinition } from '../../output/output-definition';
import { OutputTarget } from '../../output/output-target';
import { OutputFilePath } from '../../values/output-file-path';
import { DocumentTemplate } from '../document-template';
import { bulletList, escapeInline, heading } from '../markdown-helpers';
import { finalizeDocument, joinBlocks, section } from '../section-helpers';
import { TemplateRenderResult } from '../template-function';
import { TemplateWarning } from '../template-warning';

const PATH = 'docs/TESTING_STRATEGY.md';

/**
 * Generates `docs/TESTING_STRATEGY.md` from the `testing` section of
 * the configuration.
 *
 * The runner names are interpolated from the config (no hardcoded
 * "Vitest" or "Cypress" anywhere); a project that selects different
 * runners gets a document that reflects them.
 *
 * Source of truth for what this document represents:
 * `docs/OUTPUT_FILES.md` > "docs/TESTING_STRATEGY.md".
 */
export const testingStrategyTemplate: DocumentTemplate = {
  definition: OutputDefinition.create({
    path: OutputFilePath.create(PATH),
    category: OutputCategory.HumanDocumentation,
    target: OutputTarget.None,
    description: 'TDD workflow, test runners, and testing expectations.',
  }),
  render: (context) => {
    const cfg = context.config;
    const warnings: TemplateWarning[] = [];

    const title = heading(1, 'Testing Strategy');

    if (cfg.testing === undefined) {
      warnings.push(
        TemplateWarning.create({
          message: 'testing section is missing; "Workflow" and "Runners" sections omitted.',
          source: PATH,
        }),
      );
      return TemplateRenderResult.withWarnings(
        GeneratedFileContent.create(finalizeDocument(title)),
        warnings,
      );
    }

    const t = cfg.testing;

    const workflowBlock = section({
      title: 'Workflow',
      body: bulletList([`Use TDD: ${yesNo(t.useTdd)}`]),
    });

    const runnerLines = [`Unit/integration tests: ${escapeInline(t.unitTestRunner)}`];
    if (t.e2eTestRunner !== undefined) {
      runnerLines.push(`End-to-end tests: ${escapeInline(t.e2eTestRunner)}`);
    } else {
      warnings.push(
        TemplateWarning.create({
          message: 'testing.e2eTestRunner is missing; end-to-end runner not declared.',
          source: PATH,
        }),
      );
    }
    const runnersBlock = section({ title: 'Runners', body: bulletList(runnerLines) });

    const notes: string[] = [];
    if (t.useTdd) {
      notes.push(
        'Follow the TDD cycle: write a failing test, implement the smallest useful change, make the test pass, refactor safely.',
      );
    }
    notes.push(
      `Use ${escapeInline(t.unitTestRunner)} for unit tests, integration tests, mapper tests, domain model tests, validation tests, generation tests, and snapshot tests for generated Markdown.`,
    );
    if (t.e2eTestRunner !== undefined) {
      notes.push(
        `Use ${escapeInline(t.e2eTestRunner)} for critical browser end-to-end flows; do not use it as a substitute for unit and integration tests.`,
      );
    }
    notes.push(
      'Snapshots must not be updated automatically without reviewing the generated output diff.',
    );

    const notesBlock = section({ title: 'Notes', body: bulletList(notes) });

    const body = finalizeDocument(joinBlocks(title, workflowBlock, runnersBlock, notesBlock));
    return TemplateRenderResult.withWarnings(GeneratedFileContent.create(body), warnings);
  },
};

function yesNo(value: boolean): string {
  return value ? 'yes' : 'no';
}
