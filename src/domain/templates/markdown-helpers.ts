/**
 * Pure-function Markdown formatting helpers shared by all templates.
 *
 * Helpers must be deterministic: the same arguments always produce
 * the same string, and they must never read clocks, environment
 * variables, or random sources. They emit POSIX line endings (`\n`)
 * exclusively so generated output is identical across platforms.
 *
 * Helpers do not auto-escape their inputs; templates that render
 * untrusted or potentially-special-character text should pass it
 * through {@link escapeInline} first.
 */

const MIN_HEADING_LEVEL = 1;
const MAX_HEADING_LEVEL = 6;

/**
 * Build a Markdown ATX heading.
 *
 * @throws Error when `level` is not an integer in [1, 6].
 */
export function heading(level: number, text: string): string {
  if (!Number.isInteger(level) || level < MIN_HEADING_LEVEL || level > MAX_HEADING_LEVEL) {
    throw new Error(
      `Markdown heading level must be an integer in [${MIN_HEADING_LEVEL}, ${MAX_HEADING_LEVEL}], got ${level}.`,
    );
  }
  return `${'#'.repeat(level)} ${text}`;
}

/** Wrap text in `**...**`. */
export function bold(text: string): string {
  return `**${text}**`;
}

/** Wrap text in `*...*`. */
export function italic(text: string): string {
  return `*${text}*`;
}

/** Wrap text in single backticks. */
export function inlineCode(text: string): string {
  return `\`${text}\``;
}

/**
 * Build a fenced code block.
 *
 * Uses triple-backtick fences with the optional language tag on the
 * opening fence. The body is emitted as-is (no escaping). Exactly one
 * newline always separates the body from the closing fence: callers
 * may pre-terminate their body with `\n` without producing a blank
 * line, but additional trailing newlines (`\n\n`, ...) are kept and
 * render as intentional blank lines inside the block.
 */
export function codeBlock(input: { language?: string; code: string }): string {
  const fence = '```';
  const opener = input.language === undefined ? fence : `${fence}${input.language}`;
  // Skip the auto-newline when the body already ends in one, so a
  // pre-terminated body does not get an extra blank line in front of
  // the closing fence.
  const separator = input.code.endsWith('\n') ? '' : '\n';
  return `${opener}\n${input.code}${separator}${fence}`;
}

/**
 * Build an unordered Markdown list, one item per line, joined with `\n`.
 *
 * Empty input produces an empty string. Items are emitted verbatim;
 * pre-process them with {@link escapeInline} if needed.
 */
export function bulletList(items: readonly string[]): string {
  if (items.length === 0) {
    return '';
  }
  return items.map((item) => `- ${item}`).join('\n');
}

/**
 * Build an ordered Markdown list, joined with `\n`.
 *
 * Numbering starts at 1.
 */
export function numberedList(items: readonly string[]): string {
  if (items.length === 0) {
    return '';
  }
  return items.map((item, index) => `${index + 1}. ${item}`).join('\n');
}

/** A horizontal rule (`---`). */
export function horizontalRule(): string {
  return '---';
}

/**
 * Escape characters that have special meaning in Markdown when used
 * inline (paragraph or list-item context). Conservative: prefers a
 * possibly-redundant backslash over breaking layout.
 *
 * Templates that emit known-safe text (e.g. enum values, validated
 * paths) should not call this; it is for user-provided strings.
 */
export function escapeInline(text: string): string {
  // Escape backslash first so subsequent escapes do not double-escape.
  return text.replace(/[\\`*_{}[\]()<>#+\-!|~]/g, (char) => `\\${char}`);
}
