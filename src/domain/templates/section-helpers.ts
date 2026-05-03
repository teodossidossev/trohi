import { heading } from './markdown-helpers';

/**
 * Higher-level rendering helpers shared by templates.
 *
 * Whereas {@link './markdown-helpers'} produces individual Markdown
 * fragments (headings, lists, emphasis), the helpers here compose
 * complete sections and full documents with stable spacing rules so
 * generated output stays diff-friendly.
 *
 * Spacing rules:
 * - sections are separated by a single blank line (`\n\n`);
 * - generated documents end with exactly one trailing newline.
 */

const BLOCK_SEPARATOR = '\n\n';

/**
 * Inputs accepted by {@link section} and {@link optionalSection}.
 */
export interface SectionInput {
  /** Heading text (rendered without escaping). */
  readonly title: string;
  /** Body of the section (Markdown text). May be empty. */
  readonly body: string;
  /**
   * Heading level for the section title. Defaults to 2 because
   * documents typically have a single H1 supplied separately.
   */
  readonly level?: number;
}

/**
 * Render a heading + body section.
 *
 * Always emits the section even when the body is empty (just the
 * heading appears). For "omit when empty" behavior see
 * {@link optionalSection}.
 */
export function section(input: SectionInput): string {
  const level = input.level ?? 2;
  const head = heading(level, input.title);
  if (input.body.length === 0) {
    return head;
  }
  return `${head}\n\n${input.body}`;
}

/**
 * Render a section only when the body has content (after trimming).
 *
 * Returns the empty string when the body is missing/empty, so callers
 * can pass the result straight into {@link joinBlocks} and the
 * placeholder section disappears from the output.
 *
 * Use this for fields the user has not yet filled in: per
 * `docs/MVP_SCOPE.md`, generated files must not pretend to know
 * details the user has not provided.
 */
export function optionalSection(input: SectionInput): string {
  if (input.body.trim().length === 0) {
    return '';
  }
  return section(input);
}

/**
 * Join document blocks (sections, paragraphs, etc.) with a single
 * blank line between non-empty blocks.
 *
 * Empty blocks are dropped entirely, so the resulting document has
 * stable spacing whether or not optional sections are present.
 */
export function joinBlocks(...blocks: readonly string[]): string {
  return blocks.filter((block) => block.length > 0).join(BLOCK_SEPARATOR);
}

/**
 * Wrap a complete document body so it ends with exactly one trailing
 * newline. Idempotent - extra trailing whitespace/newlines collapse to
 * a single `\n`.
 *
 * Apply this once at the end of a top-level template render.
 */
export function finalizeDocument(body: string): string {
  return `${body.replace(/\s+$/u, '')}\n`;
}
