import { describe, it, expect } from 'vitest';
import { TemplateRenderResult, type TemplateFunction } from './template-function';
import { GeneratedFileContent } from '../output/generated-file-content';
import { TemplateWarning } from './template-warning';
import { RenderingContext } from './rendering-context';
import { TrohiBootstrapPreset } from '../config/presets/trohi-bootstrap-preset';

describe('TemplateRenderResult', () => {
  it('builds a result with no warnings via of()', () => {
    const content = GeneratedFileContent.create('# X');
    const result = TemplateRenderResult.of(content);
    expect(result.content).toBe(content);
    expect(result.warnings).toEqual([]);
  });

  it('builds a result with warnings via withWarnings()', () => {
    const content = GeneratedFileContent.create('# X');
    const warning = TemplateWarning.create({ message: 'placeholder used' });
    const result = TemplateRenderResult.withWarnings(content, [warning]);
    expect(result.content).toBe(content);
    expect(result.warnings).toHaveLength(1);
    expect(result.warnings[0].equals(warning)).toBe(true);
  });

  it('exposes a frozen warnings list', () => {
    const content = GeneratedFileContent.create('');
    const result = TemplateRenderResult.withWarnings(content, [
      TemplateWarning.create({ message: 'm' }),
    ]);
    expect(Object.isFrozen(result.warnings)).toBe(true);
  });

  it('does not let later mutations of the input warning list leak in', () => {
    const list = [TemplateWarning.create({ message: 'a' })];
    const result = TemplateRenderResult.withWarnings(GeneratedFileContent.create(''), list);
    list.push(TemplateWarning.create({ message: 'b' }));
    expect(result.warnings).toHaveLength(1);
  });
});

describe('TemplateFunction (contract)', () => {
  it('is satisfied by a pure function returning a TemplateRenderResult', () => {
    const tiny: TemplateFunction = (context) =>
      TemplateRenderResult.of(
        GeneratedFileContent.create(`# ${context.config.project.name.value}\n`),
      );

    const context = RenderingContext.create({ config: TrohiBootstrapPreset.create() });
    const result = tiny(context);

    expect(result).toBeInstanceOf(TemplateRenderResult);
    expect(result.content.value).toBe('# trohi\n');
    expect(result.warnings).toEqual([]);
  });
});
