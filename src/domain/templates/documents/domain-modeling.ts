import { GeneratedFileContent } from '../../output/generated-file-content';
import { OutputCategory } from '../../output/output-category';
import { OutputDefinition } from '../../output/output-definition';
import { OutputTarget } from '../../output/output-target';
import { OutputFilePath } from '../../values/output-file-path';
import { DocumentTemplate } from '../document-template';
import { bulletList, heading } from '../markdown-helpers';
import { finalizeDocument, joinBlocks, section } from '../section-helpers';
import { TemplateRenderResult } from '../template-function';
import { TemplateWarning } from '../template-warning';

const PATH = 'docs/DOMAIN_MODELING.md';

/**
 * Generates `docs/DOMAIN_MODELING.md` from the `domainModeling`
 * section of the configuration.
 *
 * Renders the project's stance on the no-raw-JSON rule, DTO validation
 * at boundaries, and UI view models. The "Notes" sections vary based
 * on whether each flag is enabled so the document never contradicts
 * the config (e.g. if `useUiViewModels=false` the doc does not tell
 * agents to "always use UI view models").
 *
 * Source of truth for what this document represents:
 * `docs/OUTPUT_FILES.md` > "docs/DOMAIN_MODELING.md".
 */
export const domainModelingTemplate: DocumentTemplate = {
  definition: OutputDefinition.create({
    path: OutputFilePath.create(PATH),
    category: OutputCategory.HumanDocumentation,
    target: OutputTarget.None,
    description: 'DTOs, domain models, value objects, mappers, and the no-raw-JSON rule.',
  }),
  render: (context) => {
    const cfg = context.config;
    const warnings: TemplateWarning[] = [];

    const title = heading(1, 'Domain Modeling');

    if (cfg.domainModeling === undefined) {
      warnings.push(
        TemplateWarning.create({
          message: 'domainModeling section is missing; "Rules" and "Notes" sections omitted.',
          source: PATH,
        }),
      );
      return TemplateRenderResult.withWarnings(
        GeneratedFileContent.create(finalizeDocument(title)),
        warnings,
      );
    }

    const dm = cfg.domainModeling;

    const rulesBlock = section({
      title: 'Rules',
      body: bulletList([
        `Use explicit domain models: ${yesNo(dm.useExplicitDomainModels)}`,
        `Require DTO validation before mapping: ${yesNo(dm.requireDtoValidation)}`,
        `Use UI view models in views: ${yesNo(dm.useUiViewModels)}`,
      ]),
    });

    const notes: string[] = [];
    if (dm.useExplicitDomainModels) {
      notes.push(
        'Do not pass raw JSON through the application; map external DTOs into explicit domain models at boundaries.',
        'Domain models protect invariants and live independently of UI components.',
      );
    }
    if (dm.requireDtoValidation) {
      notes.push('Imported JSON must be validated before being mapped into domain models.');
    }
    if (dm.useUiViewModels) {
      notes.push(
        'UI components consume UI view models, not domain models or DTOs; mappers convert between them.',
      );
    }

    const notesBlock = notes.length > 0 ? section({ title: 'Notes', body: bulletList(notes) }) : '';

    const body = finalizeDocument(joinBlocks(title, rulesBlock, notesBlock));
    return TemplateRenderResult.withWarnings(GeneratedFileContent.create(body), warnings);
  },
};

function yesNo(value: boolean): string {
  return value ? 'yes' : 'no';
}
