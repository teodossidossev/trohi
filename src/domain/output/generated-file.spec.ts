import { describe, it, expect } from 'vitest';
import { GeneratedFile } from './generated-file';
import { GeneratedFileContent } from './generated-file-content';
import { OutputDefinition } from './output-definition';
import { OutputCategory } from './output-category';
import { OutputTarget } from './output-target';
import { OutputFilePath } from '../values/output-file-path';

const definition = (path: string, category = OutputCategory.HumanDocumentation) =>
  OutputDefinition.create({
    path: OutputFilePath.create(path),
    category,
    target: OutputTarget.None,
  });

describe('GeneratedFile', () => {
  it('exposes its path, content and originating definition', () => {
    const def = definition('docs/x.md');
    const content = GeneratedFileContent.create('# X');
    const file = GeneratedFile.create({ definition: def, content });

    expect(file.path.value).toBe('docs/x.md');
    expect(file.content.equals(content)).toBe(true);
    expect(file.definition).toBe(def);
  });

  it('forwards category and target from its definition', () => {
    const def = OutputDefinition.create({
      path: OutputFilePath.create('CLAUDE.md'),
      category: OutputCategory.AgentSpecificInstructions,
      target: OutputTarget.Claude,
    });
    const file = GeneratedFile.create({
      definition: def,
      content: GeneratedFileContent.create(''),
    });
    expect(file.category).toBe(OutputCategory.AgentSpecificInstructions);
    expect(file.target).toBe(OutputTarget.Claude);
  });

  it('uses path equality for value equality', () => {
    const a = GeneratedFile.create({
      definition: definition('docs/x.md'),
      content: GeneratedFileContent.create('a'),
    });
    const b = GeneratedFile.create({
      definition: definition('docs/x.md'),
      content: GeneratedFileContent.create('b'),
    });
    // Same path, different body: still considered the same logical file
    // for selection/replacement purposes. Content equality is separate.
    expect(a.equals(b)).toBe(true);
  });

  it('treats different paths as not equal', () => {
    const a = GeneratedFile.create({
      definition: definition('docs/A.md'),
      content: GeneratedFileContent.create('x'),
    });
    const b = GeneratedFile.create({
      definition: definition('docs/B.md'),
      content: GeneratedFileContent.create('x'),
    });
    expect(a.equals(b)).toBe(false);
  });
});
