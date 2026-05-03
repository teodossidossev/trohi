import { GeneratedFileContent } from './generated-file-content';
import { OutputCategory } from './output-category';
import { OutputDefinition } from './output-definition';
import { OutputFilePath } from '../values/output-file-path';
import { OutputTarget } from './output-target';

/**
 * Inputs accepted when constructing a {@link GeneratedFile}.
 */
export interface GeneratedFileCreateInput {
  readonly definition: OutputDefinition;
  readonly content: GeneratedFileContent;
}

/**
 * The output produced by running templates over the project config.
 *
 * A GeneratedFile binds together *what was supposed to be generated*
 * (the {@link OutputDefinition}) and *what was actually produced* (the
 * {@link GeneratedFileContent}). Path, category, and target are read
 * back from the definition so a file cannot drift from the catalog
 * entry that produced it.
 *
 * Equality is path-based: two GeneratedFiles at the same path are
 * considered the same logical file for selection and replacement
 * purposes. Content equality is a separate, stricter check.
 */
export class GeneratedFile {
  private constructor(
    private readonly _definition: OutputDefinition,
    private readonly _content: GeneratedFileContent,
  ) {}

  /** Build a GeneratedFile from a definition and its rendered content. */
  static create(input: GeneratedFileCreateInput): GeneratedFile {
    return new GeneratedFile(input.definition, input.content);
  }

  /** Path the file should be written to. */
  get path(): OutputFilePath {
    return this._definition.path;
  }

  /** Rendered file body. */
  get content(): GeneratedFileContent {
    return this._content;
  }

  /** Originating output definition (carries category/target metadata). */
  get definition(): OutputDefinition {
    return this._definition;
  }

  /** Forwarded from the originating definition. */
  get category(): OutputCategory {
    return this._definition.category;
  }

  /** Forwarded from the originating definition. */
  get target(): OutputTarget {
    return this._definition.target;
  }

  /** Path-based equality. */
  equals(other: GeneratedFile): boolean {
    return this._definition.path.equals(other._definition.path);
  }
}
