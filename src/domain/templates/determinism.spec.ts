import { describe, it, expect } from 'vitest';
import { GeneratedFileContent } from '../output/generated-file-content';
import { TrohiBootstrapPreset } from '../config/presets/trohi-bootstrap-preset';
import { RenderingContext } from './rendering-context';
import { TemplateRenderResult, type TemplateFunction } from './template-function';
import { TemplateWarning } from './template-warning';
import { bulletList, heading, italic } from './markdown-helpers';
import { finalizeDocument, joinBlocks, optionalSection, section } from './section-helpers';

/**
 * A small composite template used only by these tests. It exercises
 * every helper in the templates module so that any future change to
 * spacing, escaping, or output ordering surfaces here.
 *
 * Real product document templates land in Phase 5; this is the
 * smallest possible end-to-end verification of the foundation.
 */
const sampleTemplate: TemplateFunction = (context) => {
  const cfg = context.config;
  const warnings: TemplateWarning[] = [];

  const titleBlock = heading(1, cfg.project.name.value);
  const tagline = cfg.project.description ? italic(cfg.project.description) : '';

  const stack = cfg.technology
    ? section({
        title: 'Tech Stack',
        body: bulletList([
          cfg.technology.framework,
          cfg.technology.runtime,
          `package manager: ${cfg.technology.packageManager}`,
        ]),
      })
    : '';

  const features = cfg.mvp
    ? optionalSection({
        title: 'Included Features',
        body: bulletList([...cfg.mvp.includedFeatures]),
      })
    : '';

  if (cfg.product?.problemStatement === undefined) {
    warnings.push(
      TemplateWarning.create({
        message: 'product.problemStatement missing - omitted from output.',
        source: 'sample-template',
      }),
    );
  }

  const body = finalizeDocument(joinBlocks(titleBlock, tagline, stack, features));
  return TemplateRenderResult.withWarnings(GeneratedFileContent.create(body), warnings);
};

describe('template foundation - end-to-end determinism', () => {
  const context = () => RenderingContext.create({ config: TrohiBootstrapPreset.create() });

  it('produces byte-equal content across repeated calls with the same context', () => {
    const a = sampleTemplate(context());
    const b = sampleTemplate(context());
    expect(a.content.value).toBe(b.content.value);
    expect(a.warnings.length).toBe(b.warnings.length);
  });

  it('produces a stable, fully-specified Markdown document', () => {
    // Pinning the exact bytes makes any accidental spacing/escaping
    // regression fail loudly. The trohi-bootstrap preset has all
    // sections populated, so warnings should be empty for this run.
    const result = sampleTemplate(context());
    expect(result.content.value).toBe(
      '# trohi\n\n' +
        '*Dev-first tool for creating structured project documentation and AI agent instruction files for new software projects.*\n\n' +
        '## Tech Stack\n\n' +
        '- Angular 21\n' +
        '- Node.js 22\n' +
        '- package manager: npm\n\n' +
        '## Included Features\n\n' +
        '- Project profile creation\n' +
        '- Guided wizard\n' +
        '- Structured source configuration\n' +
        '- Human documentation generation\n' +
        '- AI agent instruction generation\n' +
        '- Preview before export\n' +
        '- ZIP and individual file export\n' +
        '- Config import\n',
    );
    expect(result.warnings).toEqual([]);
  });

  it('ends with exactly one trailing newline regardless of input shape', () => {
    const result = sampleTemplate(context());
    expect(result.content.value.endsWith('\n')).toBe(true);
    expect(result.content.value.endsWith('\n\n')).toBe(false);
  });

  it('emits the warning when a referenced field is missing', async () => {
    // Build a config where product is absent so the template's
    // missing-field path is exercised.
    const { ProjectConfig } = await import('../config/project-config');
    const { ProjectSection } = await import('../config/sections/project-section');
    const { ProjectName } = await import('../values/project-name');

    const config = ProjectConfig.create({
      configVersion: '1',
      project: ProjectSection.create({ name: ProjectName.create('minimal') }),
    });
    const result = sampleTemplate(RenderingContext.create({ config }));

    expect(result.warnings).toHaveLength(1);
    expect(result.warnings[0].message).toContain('product.problemStatement');
    // The body still renders, just without the absent section.
    expect(result.content.value.startsWith('# minimal\n')).toBe(true);
  });

  it('helpers do not leak time or random sources (different render times match)', async () => {
    // Run the template, sleep a tiny amount, run again. The result
    // must be identical to the first run.
    const a = sampleTemplate(context());
    await new Promise((resolve) => setTimeout(resolve, 10));
    const b = sampleTemplate(context());
    expect(a.content.value).toBe(b.content.value);
  });
});
