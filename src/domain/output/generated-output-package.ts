import { GeneratedFile } from './generated-file';
import { OutputCategory } from './output-category';
import { OutputFilePath } from '../values/output-file-path';
import { OutputTarget } from './output-target';

/**
 * Error thrown when a {@link GeneratedOutputPackage} would violate its
 * uniqueness invariant (two files at the same path).
 */
export class GeneratedOutputPackageError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'GeneratedOutputPackageError';
  }
}

/**
 * Immutable collection of {@link GeneratedFile}s for a single
 * generation run.
 *
 * The package guarantees a single file per path so downstream export
 * (ZIP, individual download, file-system write) cannot accidentally
 * collide. Mutating-style methods (`add`) return a new package so the
 * preview/export pipelines can hold onto a stable snapshot while the
 * user iterates on configuration.
 */
export class GeneratedOutputPackage {
  private constructor(private readonly _files: readonly GeneratedFile[]) {}

  /** A package with no files. */
  static empty(): GeneratedOutputPackage {
    return new GeneratedOutputPackage(Object.freeze([]));
  }

  /**
   * Build a package from a pre-existing list of files.
   *
   * @throws GeneratedOutputPackageError if two files share a path.
   */
  static fromFiles(files: readonly GeneratedFile[]): GeneratedOutputPackage {
    const seen = new Set<string>();
    for (const file of files) {
      const key = file.path.value;
      if (seen.has(key)) {
        throw new GeneratedOutputPackageError(`Duplicate output path: "${key}".`);
      }
      seen.add(key);
    }
    return new GeneratedOutputPackage(Object.freeze([...files]));
  }

  /** All files in insertion order. */
  get files(): readonly GeneratedFile[] {
    return this._files;
  }

  /** Number of files in the package. */
  get size(): number {
    return this._files.length;
  }

  /** True when a file exists at the given path. */
  has(path: OutputFilePath): boolean {
    return this._files.some((f) => f.path.equals(path));
  }

  /** Return the file at the given path, or undefined. */
  getByPath(path: OutputFilePath): GeneratedFile | undefined {
    return this._files.find((f) => f.path.equals(path));
  }

  /** All files matching the given category, in insertion order. */
  filterByCategory(category: OutputCategory): readonly GeneratedFile[] {
    return this._files.filter((f) => f.category === category);
  }

  /** All files matching the given target, in insertion order. */
  filterByTarget(target: OutputTarget): readonly GeneratedFile[] {
    return this._files.filter((f) => f.target === target);
  }

  /**
   * Return a new package with the additional file appended.
   *
   * @throws GeneratedOutputPackageError if a file at the same path
   * already exists in this package.
   */
  add(file: GeneratedFile): GeneratedOutputPackage {
    if (this.has(file.path)) {
      throw new GeneratedOutputPackageError(`Duplicate output path: "${file.path.value}".`);
    }
    return new GeneratedOutputPackage(Object.freeze([...this._files, file]));
  }
}
