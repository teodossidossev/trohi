import { describe, it, expect } from 'vitest';
import { renderDocument, type DocumentTemplate } from './document-template';
import { TemplateRenderResult } from './template-function';
import { TemplateWarning } from './template-warning';
import { GeneratedFileContent } from '../output/generated-file-content';
import { OutputDefinition } from '../output/output-definition';
import { OutputCategory } from '../output/output-category';
import { OutputTarget } from '../output/output-target';
import { OutputFilePath } from '../values/output-file-path';
import { RenderingContext } from './rendering-context';
import { TrohiBootstrapPreset } from '../config/presets/trohi-bootstrap-preset';

const stubTemplate: DocumentTemplate = {
  definition: OutputDefinition.create({
    path: OutputFilePath.create('docs/STUB.md'),
    category: OutputCategory.HumanDocumentation,
    target: OutputTarget.None,
  }),
  render: () =>
    TemplateRenderResult.withWarnings(GeneratedFileContent.create('# Stub\n'), [
      TemplateWarning.create({ message: 'stubbed', source: 'docs/STUB.md' }),
    ]),
};

describe('renderDocument', () => {
  it('binds the rendered content to the template definition', () => {
    const result = renderDocument(
      stubTemplate,
      RenderingContext.create({ config: TrohiBootstrapPreset.create() }),
    );
    expect(result.file.path.value).toBe('docs/STUB.md');
    expect(result.file.category).toBe(OutputCategory.HumanDocumentation);
    expect(result.file.target).toBe(OutputTarget.None);
    expect(result.file.content.value).toBe('# Stub\n');
  });

  it('forwards warnings produced by the template', () => {
    const result = renderDocument(
      stubTemplate,
      RenderingContext.create({ config: TrohiBootstrapPreset.create() }),
    );
    expect(result.warnings).toHaveLength(1);
    expect(result.warnings[0].message).toBe('stubbed');
  });
});
