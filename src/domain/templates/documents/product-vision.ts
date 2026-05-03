import { GeneratedFileContent } from '../../output/generated-file-content';
import { OutputCategory } from '../../output/output-category';
import { OutputDefinition } from '../../output/output-definition';
import { OutputTarget } from '../../output/output-target';
import { OutputFilePath } from '../../values/output-file-path';
import { DocumentTemplate } from '../document-template';
import { escapeBody, escapeInline, heading, italic } from '../markdown-helpers';
import { finalizeDocument, joinBlocks, optionalSection } from '../section-helpers';
import { TemplateRenderResult } from '../template-function';
import { TemplateWarning } from '../template-warning';

const PATH = 'docs/PRODUCT_VISION.md';

/**
 * Generates `docs/PRODUCT_VISION.md` from the project + product
 * sections of the configuration.
 *
 * Sections that depend on user-supplied free text (problem statement,
 * value proposition) are emitted only when the user has provided them;
 * a {@link TemplateWarning} is recorded for each missing one so the
 * preview UI can show "rendered without X" without the document
 * inventing details the user has not supplied.
 *
 * Source of truth for what this document represents:
 * `docs/OUTPUT_FILES.md` > "docs/PRODUCT_VISION.md".
 */
export const productVisionTemplate: DocumentTemplate = {
  definition: OutputDefinition.create({
    path: OutputFilePath.create(PATH),
    category: OutputCategory.HumanDocumentation,
    target: OutputTarget.None,
    description: 'What the project is, why it exists, and the problem it solves.',
  }),
  render: (context) => {
    const cfg = context.config;
    const warnings: TemplateWarning[] = [];

    const title = heading(1, 'Product Vision');
    // User-provided strings are escaped before interpolation so values
    // like "my*proj" or "[link](x)" render literally instead of
    // activating Markdown emphasis or links.
    const projectLine = `**${escapeInline(cfg.project.name.value)}** is a software project.`;
    const tagline = cfg.project.description ? italic(escapeInline(cfg.project.description)) : '';

    const rawProblem = cfg.product?.problemStatement ?? '';
    if (rawProblem.length === 0) {
      warnings.push(
        TemplateWarning.create({
          message: 'product.problemStatement is missing; "Problem" section omitted.',
          source: PATH,
        }),
      );
    }
    const problemBody = escapeBody(rawProblem);

    const rawValue = cfg.product?.valueProposition ?? '';
    if (rawValue.length === 0) {
      warnings.push(
        TemplateWarning.create({
          message: 'product.valueProposition is missing; "Value" section omitted.',
          source: PATH,
        }),
      );
    }
    const valueBody = escapeBody(rawValue);

    const body = finalizeDocument(
      joinBlocks(
        title,
        projectLine,
        tagline,
        optionalSection({ title: 'Problem', body: problemBody }),
        optionalSection({ title: 'Value', body: valueBody }),
      ),
    );

    return TemplateRenderResult.withWarnings(GeneratedFileContent.create(body), warnings);
  },
};
