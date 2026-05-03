import { GeneratedFileContent } from '../output/generated-file-content';
import { RenderingContext } from './rendering-context';
import { TemplateWarning } from './template-warning';

/**
 * Result returned by every {@link TemplateFunction}.
 *
 * Pairs the rendered file body with any non-blocking warnings the
 * template emitted (e.g. "rendered with a placeholder because the
 * user has not provided X"). Both fields are immutable.
 */
export class TemplateRenderResult {
  private constructor(
    private readonly _content: GeneratedFileContent,
    private readonly _warnings: readonly TemplateWarning[],
  ) {}

  /** Build a result with no warnings (the common case). */
  static of(content: GeneratedFileContent): TemplateRenderResult {
    return new TemplateRenderResult(content, Object.freeze([]));
  }

  /** Build a result with the given warnings (frozen on construction). */
  static withWarnings(
    content: GeneratedFileContent,
    warnings: readonly TemplateWarning[],
  ): TemplateRenderResult {
    return new TemplateRenderResult(content, Object.freeze([...warnings]));
  }

  /** The rendered file body. */
  get content(): GeneratedFileContent {
    return this._content;
  }

  /** Frozen list of warnings produced during rendering. */
  get warnings(): readonly TemplateWarning[] {
    return this._warnings;
  }
}

/**
 * Contract every concrete template must satisfy.
 *
 * A TemplateFunction is a *pure* function from {@link RenderingContext}
 * to {@link TemplateRenderResult}: given the same context, it must
 * return a result whose content and warnings are byte-for-byte equal,
 * across calls and across processes. Implementations must therefore
 * not read clocks, environment variables, file systems, or random
 * sources; any non-deterministic input belongs on the context as an
 * explicit caller-provided field.
 *
 * The function intentionally does not own its {@link OutputDefinition};
 * that pairing is performed by the generation engine in a later phase
 * so the same template body could in principle be reused at multiple
 * paths.
 */
export type TemplateFunction = (context: RenderingContext) => TemplateRenderResult;
