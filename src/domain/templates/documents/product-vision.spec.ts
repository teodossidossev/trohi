import { describe, it, expect } from 'vitest';
import { productVisionTemplate } from './product-vision';
import { renderDocument } from '../document-template';
import { RenderingContext } from '../rendering-context';
import { TrohiBootstrapPreset } from '../../config/presets/trohi-bootstrap-preset';
import { ProjectConfig } from '../../config/project-config';
import { ProjectSection } from '../../config/sections/project-section';
import { ProductSection } from '../../config/sections/product-section';
import { ProjectName } from '../../values/project-name';
import { OutputCategory } from '../../output/output-category';
import { OutputTarget } from '../../output/output-target';

describe('productVisionTemplate', () => {
  describe('definition', () => {
    it('writes to docs/PRODUCT_VISION.md', () => {
      expect(productVisionTemplate.definition.path.value).toBe('docs/PRODUCT_VISION.md');
    });

    it('is classified as HumanDocumentation with no agent target', () => {
      expect(productVisionTemplate.definition.category).toBe(OutputCategory.HumanDocumentation);
      expect(productVisionTemplate.definition.target).toBe(OutputTarget.None);
    });
  });

  describe('rendering against the trohi-bootstrap preset', () => {
    const subject = () =>
      renderDocument(
        productVisionTemplate,
        RenderingContext.create({ config: TrohiBootstrapPreset.create() }),
      );

    it('produces a stable, fully-specified Markdown document', () => {
      // Pinning bytes guards against accidental spacing/escaping
      // regressions and makes content changes visible in code review.
      expect(subject().file.content.value).toBe(
        '# Product Vision\n\n' +
          '**trohi** is a software project.\n\n' +
          '*Dev-first tool for creating structured project documentation and AI agent instruction files for new software projects.*\n\n' +
          '## Problem\n\n' +
          'Solo and indie developers lack a repeatable way to define project context, standards, and instructions for AI coding agents before implementation begins.\n\n' +
          '## Value\n\n' +
          'Generate consistent human documentation and AI agent instruction files from one structured project configuration.\n',
      );
    });

    it('emits no warnings when the preset populates every field', () => {
      expect(subject().warnings).toEqual([]);
    });

    it('ends with exactly one trailing newline', () => {
      const value = subject().file.content.value;
      expect(value.endsWith('\n')).toBe(true);
      expect(value.endsWith('\n\n')).toBe(false);
    });

    it('is deterministic across calls', () => {
      const a = subject().file.content.value;
      const b = subject().file.content.value;
      expect(a).toBe(b);
    });
  });

  describe('rendering against a minimal config', () => {
    const minimalContext = () =>
      RenderingContext.create({
        config: ProjectConfig.create({
          configVersion: '1',
          project: ProjectSection.create({ name: ProjectName.create('minimal') }),
        }),
      });

    it('still produces a renderable document with the project header', () => {
      const result = renderDocument(productVisionTemplate, minimalContext());
      expect(result.file.content.value.startsWith('# Product Vision\n')).toBe(true);
      expect(result.file.content.value).toContain('**minimal** is a software project.');
    });

    it('omits Problem and Value sections when the product fields are missing', () => {
      const result = renderDocument(productVisionTemplate, minimalContext());
      expect(result.file.content.value).not.toContain('## Problem');
      expect(result.file.content.value).not.toContain('## Value');
    });

    it('emits one warning per missing field', () => {
      const warnings = renderDocument(productVisionTemplate, minimalContext()).warnings;
      const messages = warnings.map((w) => w.message);
      expect(messages).toHaveLength(2);
      expect(messages.some((m) => m.includes('problemStatement'))).toBe(true);
      expect(messages.some((m) => m.includes('valueProposition'))).toBe(true);
      for (const w of warnings) {
        expect(w.source).toBe('docs/PRODUCT_VISION.md');
      }
    });
  });

  describe('Markdown special character escaping', () => {
    // User-provided values must render literally; they must not be
    // able to forge emphasis, links, code spans, headings, or list
    // items inside the generated document.

    it('escapes inline-special characters in the project name', () => {
      const context = RenderingContext.create({
        config: ProjectConfig.create({
          configVersion: '1',
          project: ProjectSection.create({ name: ProjectName.create('my*proj') }),
        }),
      });
      const value = renderDocument(productVisionTemplate, context).file.content.value;
      // Inline italic must not be activated; the asterisk renders as `\*`.
      expect(value).toContain('**my\\*proj**');
      expect(value).not.toContain('**my*proj**');
    });

    it('escapes link/backtick syntax in the project description', () => {
      const context = RenderingContext.create({
        config: ProjectConfig.create({
          configVersion: '1',
          project: ProjectSection.create({
            name: ProjectName.create('p'),
            description: '[link](x) and `code`',
          }),
        }),
      });
      const value = renderDocument(productVisionTemplate, context).file.content.value;
      expect(value).toContain('*\\[link\\](x) and \\`code\\`*');
    });

    it('escapes leading "#" in the problemStatement so it does not become a heading', () => {
      const context = RenderingContext.create({
        config: ProjectConfig.create({
          configVersion: '1',
          project: ProjectSection.create({ name: ProjectName.create('p') }),
          product: ProductSection.create({
            problemStatement: '# Not a heading',
            valueProposition: 'fine',
          }),
        }),
      });
      const value = renderDocument(productVisionTemplate, context).file.content.value;
      expect(value).toContain('## Problem\n\n\\# Not a heading');
    });

    it('escapes leading "-" in the valueProposition so it does not become a list', () => {
      const context = RenderingContext.create({
        config: ProjectConfig.create({
          configVersion: '1',
          project: ProjectSection.create({ name: ProjectName.create('p') }),
          product: ProductSection.create({
            problemStatement: 'fine',
            valueProposition: '- not a list item',
          }),
        }),
      });
      const value = renderDocument(productVisionTemplate, context).file.content.value;
      expect(value).toContain('## Value\n\n\\- not a list item');
    });
  });
});
