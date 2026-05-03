import { describe, it, expect } from 'vitest';
import { agentsTemplate } from './agents';
import { architectureTemplate } from './architecture';
import { claudeTemplate } from './claude';
import { codingStandardsTemplate } from './coding-standards';
import { featureArchitectureTemplate } from './feature-architecture';
import { renderDocument } from '../document-template';
import { RenderingContext } from '../rendering-context';
import { TrohiBootstrapPreset } from '../../config/presets/trohi-bootstrap-preset';

/**
 * Guards against architecture-rule drift across generated outputs.
 *
 * Multiple documents render the same rule (driven by the same config
 * flag), and they must describe it identically so a reader is not
 * told different things in different files. Per docs/OUTPUT_FILES.md
 * Consistency Rules: "the same project decision must not be
 * expressed differently across files".
 */
describe('cross-document consistency', () => {
  const renderAll = () => {
    const context = RenderingContext.create({ config: TrohiBootstrapPreset.create() });
    return {
      architecture: renderDocument(architectureTemplate, context).file.content.value,
      featureArchitecture: renderDocument(featureArchitectureTemplate, context).file.content.value,
      codingStandards: renderDocument(codingStandardsTemplate, context).file.content.value,
    };
  };

  describe('deferred agent targets (Cursor, Copilot)', () => {
    // Per docs/AGENT_BOOTSTRAP_SCOPE.md and the trohi-bootstrap preset,
    // Cursor and Copilot are deferred. AGENTS.md and CLAUDE.md must
    // mention them only in deferred-context, never as positive
    // recommendations.

    const renderTwo = () => {
      const context = RenderingContext.create({ config: TrohiBootstrapPreset.create() });
      return {
        agents: renderDocument(agentsTemplate, context).file.content.value,
        claude: renderDocument(claudeTemplate, context).file.content.value,
      };
    };

    it('AGENTS.md mentions Cursor and Copilot only inside the Deferred Agent Targets section', () => {
      const { agents } = renderTwo();
      const deferredHeadingIdx = agents.indexOf('## Deferred Agent Targets');
      expect(deferredHeadingIdx).toBeGreaterThan(0);

      for (const target of ['cursor', 'copilot']) {
        const matches = [...agents.matchAll(new RegExp(target, 'g'))];
        expect(matches).toHaveLength(1);
        expect(matches[0].index).toBeGreaterThan(deferredHeadingIdx);
      }
    });

    it('CLAUDE.md mentions Cursor and Copilot only inside the deferred-targets sentence', () => {
      const { claude } = renderTwo();
      const deferredIdx = claude.indexOf('Do not generate output for deferred');
      expect(deferredIdx).toBeGreaterThan(0);

      for (const target of ['cursor', 'copilot']) {
        const matches = [...claude.matchAll(new RegExp(target, 'g'))];
        expect(matches).toHaveLength(1);
        expect(matches[0].index).toBeGreaterThan(deferredIdx);
      }
    });

    it('neither AGENTS.md nor CLAUDE.md positively recommends a Cursor or Copilot file path', () => {
      const { agents, claude } = renderTwo();
      // Vendor-specific paths must not appear as recommendations.
      for (const text of [agents, claude]) {
        expect(text).not.toContain('.cursor/');
        expect(text).not.toContain('.github/copilot-instructions.md');
      }
    });
  });

  describe('the no-direct-HttpClient/REST rule', () => {
    // The rule is driven by featureArchitecture.allowDirectHttpClientFromViews.
    // It must use the same wording wherever it appears.
    const RULE_WORDING = 'Allow direct HttpClient/REST from views:';

    it('uses the same wording in architecture, feature-architecture, and coding-standards', () => {
      const docs = renderAll();
      expect(docs.architecture).toContain(RULE_WORDING);
      expect(docs.featureArchitecture).toContain(RULE_WORDING);
      expect(docs.codingStandards).toContain(RULE_WORDING);
    });

    it('does not render the narrower "HttpClient from views" form anywhere', () => {
      // Catches the regression where one document said "HttpClient from
      // views" while the others said "HttpClient/REST from views",
      // making the docs disagree.
      const docs = renderAll();
      const narrow = /Allow direct HttpClient from views:/;
      expect(docs.architecture).not.toMatch(narrow);
      expect(docs.featureArchitecture).not.toMatch(narrow);
      expect(docs.codingStandards).not.toMatch(narrow);
    });
  });
});
