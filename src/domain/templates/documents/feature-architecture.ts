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

const PATH = 'docs/FEATURE_ARCHITECTURE.md';

/**
 * Generates `docs/FEATURE_ARCHITECTURE.md` from the
 * `featureArchitecture` section of the configuration.
 *
 * Captures whether views stay presentational, whether each non-trivial
 * feature has its own business/application layer, and whether views
 * may call HttpClient directly. The "Notes" section is conditional on
 * the flags so the document never tells agents to apply a rule the
 * config has disabled.
 *
 * Source of truth for what this document represents:
 * `docs/OUTPUT_FILES.md` > "docs/FEATURE_ARCHITECTURE.md".
 */
export const featureArchitectureTemplate: DocumentTemplate = {
  definition: OutputDefinition.create({
    path: OutputFilePath.create(PATH),
    category: OutputCategory.HumanDocumentation,
    target: OutputTarget.None,
    description:
      'Presentational views, feature business/application layer, ports/adapters, and direct-REST rules.',
  }),
  render: (context) => {
    const cfg = context.config;
    const warnings: TemplateWarning[] = [];

    const title = heading(1, 'Feature Architecture');

    if (cfg.featureArchitecture === undefined) {
      warnings.push(
        TemplateWarning.create({
          message: 'featureArchitecture section is missing; "Rules" and "Notes" sections omitted.',
          source: PATH,
        }),
      );
      return TemplateRenderResult.withWarnings(
        GeneratedFileContent.create(finalizeDocument(title)),
        warnings,
      );
    }

    const fa = cfg.featureArchitecture;

    const rulesBlock = section({
      title: 'Rules',
      body: bulletList([
        `Views are presentational: ${yesNo(fa.viewsArePresentational)}`,
        `Has feature business/application layer: ${yesNo(fa.hasFeatureBusinessLayer)}`,
        `Allow direct HttpClient/REST from views: ${yesNo(fa.allowDirectHttpClientFromViews)}`,
      ]),
    });

    const notes: string[] = [];
    if (fa.viewsArePresentational) {
      notes.push(
        'Views render state, bind forms, and emit user intentions; they must not own business rules, mapping, generation, or import/export logic.',
      );
    }
    if (fa.hasFeatureBusinessLayer) {
      notes.push(
        'Each non-trivial feature owns its own business/application layer that coordinates domain services, mappers, and infrastructure adapters.',
      );
    }
    if (!fa.allowDirectHttpClientFromViews) {
      notes.push(
        'Views must not inject or call HttpClient or REST services directly; route external communication through feature services and infrastructure adapters.',
      );
    }
    notes.push(
      'Use ports and adapters at infrastructure boundaries so business logic depends on contracts, not concrete browser APIs, ZIP libraries, storage, or future REST clients.',
    );

    const notesBlock = section({ title: 'Notes', body: bulletList(notes) });

    const body = finalizeDocument(joinBlocks(title, rulesBlock, notesBlock));
    return TemplateRenderResult.withWarnings(GeneratedFileContent.create(body), warnings);
  },
};

function yesNo(value: boolean): string {
  return value ? 'yes' : 'no';
}
