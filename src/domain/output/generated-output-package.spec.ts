import { describe, it, expect } from 'vitest';
import { GeneratedOutputPackage, GeneratedOutputPackageError } from './generated-output-package';
import { GeneratedFile } from './generated-file';
import { GeneratedFileContent } from './generated-file-content';
import { OutputDefinition } from './output-definition';
import { OutputCategory } from './output-category';
import { OutputTarget } from './output-target';
import { OutputFilePath } from '../values/output-file-path';

const file = (
  path: string,
  category = OutputCategory.HumanDocumentation,
  target = OutputTarget.None,
) =>
  GeneratedFile.create({
    definition: OutputDefinition.create({
      path: OutputFilePath.create(path),
      category,
      target,
    }),
    content: GeneratedFileContent.create(`# ${path}`),
  });

describe('GeneratedOutputPackage', () => {
  describe('empty', () => {
    it('starts with no files', () => {
      const pkg = GeneratedOutputPackage.empty();
      expect(pkg.size).toBe(0);
      expect(pkg.files).toEqual([]);
    });
  });

  describe('add', () => {
    it('returns a new package containing the added file (immutability)', () => {
      const original = GeneratedOutputPackage.empty();
      const next = original.add(file('docs/x.md'));

      expect(original.size).toBe(0);
      expect(next.size).toBe(1);
      expect(next.files[0].path.value).toBe('docs/x.md');
    });

    it('preserves insertion order across multiple adds', () => {
      const pkg = GeneratedOutputPackage.empty()
        .add(file('AGENTS.md', OutputCategory.GenericAgentInstructions, OutputTarget.GenericAgent))
        .add(file('docs/x.md'))
        .add(file('CLAUDE.md', OutputCategory.AgentSpecificInstructions, OutputTarget.Claude));

      expect(pkg.files.map((f) => f.path.value)).toEqual(['AGENTS.md', 'docs/x.md', 'CLAUDE.md']);
    });

    it('rejects adding a file at a path that is already present', () => {
      const pkg = GeneratedOutputPackage.empty().add(file('docs/x.md'));
      expect(() => pkg.add(file('docs/x.md'))).toThrow(GeneratedOutputPackageError);
    });
  });

  describe('lookup', () => {
    it('finds a file by its path', () => {
      const pkg = GeneratedOutputPackage.empty().add(file('docs/x.md'));
      const found = pkg.getByPath(OutputFilePath.create('docs/x.md'));
      expect(found?.path.value).toBe('docs/x.md');
    });

    it('returns undefined when no file matches the path', () => {
      const pkg = GeneratedOutputPackage.empty().add(file('docs/x.md'));
      expect(pkg.getByPath(OutputFilePath.create('docs/y.md'))).toBeUndefined();
    });

    it('reports membership via has()', () => {
      const pkg = GeneratedOutputPackage.empty().add(file('docs/x.md'));
      expect(pkg.has(OutputFilePath.create('docs/x.md'))).toBe(true);
      expect(pkg.has(OutputFilePath.create('docs/y.md'))).toBe(false);
    });
  });

  describe('filtering', () => {
    const sample = () =>
      GeneratedOutputPackage.empty()
        .add(file('docs/A.md', OutputCategory.HumanDocumentation, OutputTarget.None))
        .add(file('AGENTS.md', OutputCategory.GenericAgentInstructions, OutputTarget.GenericAgent))
        .add(file('CLAUDE.md', OutputCategory.AgentSpecificInstructions, OutputTarget.Claude))
        .add(
          file(
            '.cursor/rules/x.mdc',
            OutputCategory.AgentSpecificInstructions,
            OutputTarget.Cursor,
          ),
        );

    it('filters by category', () => {
      const docs = sample().filterByCategory(OutputCategory.HumanDocumentation);
      expect(docs.map((f) => f.path.value)).toEqual(['docs/A.md']);
    });

    it('filters by target', () => {
      const claude = sample().filterByTarget(OutputTarget.Claude);
      expect(claude.map((f) => f.path.value)).toEqual(['CLAUDE.md']);
    });

    it('returns an empty list when nothing matches', () => {
      const copilot = sample().filterByTarget(OutputTarget.Copilot);
      expect(copilot).toEqual([]);
    });
  });

  describe('factories', () => {
    it('builds from a list of files when there are no duplicates', () => {
      const pkg = GeneratedOutputPackage.fromFiles([file('docs/A.md'), file('docs/B.md')]);
      expect(pkg.size).toBe(2);
    });

    it('rejects an input list with duplicate paths', () => {
      expect(() =>
        GeneratedOutputPackage.fromFiles([file('docs/A.md'), file('docs/A.md')]),
      ).toThrow(GeneratedOutputPackageError);
    });
  });
});
