import { GeneratedFileContent } from '../../output/generated-file-content';
import { OutputCategory } from '../../output/output-category';
import { OutputDefinition } from '../../output/output-definition';
import { OutputTarget } from '../../output/output-target';
import { OutputFilePath } from '../../values/output-file-path';
import { DocumentTemplate } from '../document-template';
import { bulletList, escapeBody, heading } from '../markdown-helpers';
import { finalizeDocument, joinBlocks, optionalSection, section } from '../section-helpers';
import { TemplateRenderResult } from '../template-function';
import { TemplateWarning } from '../template-warning';

const PATH = 'docs/MVP_SCOPE.md';

/**
 * Generates `docs/MVP_SCOPE.md` from the mvp section of the
 * configuration.
 *
 * Renders the primary use case, the included-features list, and the
 * excluded-features list. Each is omitted (with a warning) when the
 * underlying field is empty so the output never invents commitments
 * the user has not made.
 *
 * Source of truth for what this document represents:
 * `docs/OUTPUT_FILES.md` > "docs/MVP_SCOPE.md".
 */
export const mvpScopeTemplate: DocumentTemplate = {
  definition: OutputDefinition.create({
    path: OutputFilePath.create(PATH),
    category: OutputCategory.HumanDocumentation,
    target: OutputTarget.None,
    description: 'What is included and excluded from the first version of the project.',
  }),
  render: (context) => {
    const cfg = context.config;
    const warnings: TemplateWarning[] = [];

    const title = heading(1, 'MVP Scope');

    const primaryUseCase = cfg.mvp?.primaryUseCase ?? '';
    if (primaryUseCase.length === 0) {
      warnings.push(
        TemplateWarning.create({
          message: 'mvp.primaryUseCase is missing; "Primary Use Case" section omitted.',
          source: PATH,
        }),
      );
    }

    const included = cfg.mvp?.includedFeatures ?? [];
    if (included.length === 0) {
      warnings.push(
        TemplateWarning.create({
          message: 'mvp.includedFeatures is empty; "Included" section omitted.',
          source: PATH,
        }),
      );
    }

    const excluded = cfg.mvp?.excludedFeatures ?? [];
    // No warning for empty excludedFeatures: not declaring any
    // exclusions is a legitimate state (the user has nothing to
    // explicitly call out as out-of-scope yet).

    // User-provided list items must be escaped per item so a value
    // like "[link](x)" or a leading "- " in the user's text renders
    // literally instead of producing extra link/list markup.
    const includedBlock =
      included.length > 0
        ? section({
            title: 'Included',
            body: bulletList(included.map(escapeBody)),
          })
        : '';
    const excludedBlock =
      excluded.length > 0
        ? section({
            title: 'Excluded',
            body: bulletList(excluded.map(escapeBody)),
          })
        : '';

    const body = finalizeDocument(
      joinBlocks(
        title,
        optionalSection({ title: 'Primary Use Case', body: escapeBody(primaryUseCase) }),
        includedBlock,
        excludedBlock,
      ),
    );

    return TemplateRenderResult.withWarnings(GeneratedFileContent.create(body), warnings);
  },
};
