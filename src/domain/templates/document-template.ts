import { GeneratedFile } from '../output/generated-file';
import { OutputDefinition } from '../output/output-definition';
import { RenderingContext } from './rendering-context';
import { TemplateFunction } from './template-function';
import { TemplateWarning } from './template-warning';

/**
 * A rendering function paired with the {@link OutputDefinition} that
 * tells the generation engine where its output should be written.
 *
 * Defining the pair as a single record (instead of separate exports
 * per template) means consumers cannot accidentally render with the
 * wrong path, and a future generation engine can iterate over a
 * template catalog without an external mapping table.
 */
export interface DocumentTemplate {
  /** Where the rendered file should be written (path, category, target). */
  readonly definition: OutputDefinition;
  /** Pure render function: same context -> identical output. */
  readonly render: TemplateFunction;
}

/**
 * Outcome of running a {@link DocumentTemplate}: the resulting
 * {@link GeneratedFile} plus any non-blocking warnings the template
 * emitted during rendering.
 */
export interface RenderedDocument {
  readonly file: GeneratedFile;
  readonly warnings: readonly TemplateWarning[];
}

/**
 * Run a {@link DocumentTemplate} against a context and bind the
 * rendered content to the template's declared output definition.
 *
 * Helper for tests and for the future generation engine; keeps callers
 * from having to compose `render(...) + GeneratedFile.create(...)`
 * everywhere.
 */
export function renderDocument(
  template: DocumentTemplate,
  context: RenderingContext,
): RenderedDocument {
  const result = template.render(context);
  return {
    file: GeneratedFile.create({ definition: template.definition, content: result.content }),
    warnings: result.warnings,
  };
}
