import { GeneratedFileContent } from '../../output/generated-file-content';
import { OutputCategory } from '../../output/output-category';
import { OutputDefinition } from '../../output/output-definition';
import { OutputTarget } from '../../output/output-target';
import { OutputFilePath } from '../../values/output-file-path';
import { AgentsSection } from '../../config/sections/agents-section';
import { FeatureArchitectureSection } from '../../config/sections/feature-architecture-section';
import { TestingSection } from '../../config/sections/testing-section';
import { DocumentTemplate } from '../document-template';
import { escapeInline, heading } from '../markdown-helpers';
import { finalizeDocument, joinBlocks, section } from '../section-helpers';
import { TemplateRenderResult } from '../template-function';

const PATH = '.github/pull_request_template.md';

/**
 * Generates `.github/pull_request_template.md` - the structured PR
 * checklist used as the body for every pull request.
 *
 * The template body is largely universal (Summary / Why / Scope /
 * Testing / Architecture / Generated Output / Security / AI Agent
 * Usage / Risks-Notes), but a few items are config-driven so the
 * checklist matches the project's actual rules: the testing section
 * names the chosen runners, the architecture section reflects the
 * presentational-views and direct-REST stance, and the AI-agent
 * section is tailored to which agents the project actively uses.
 *
 * Source of truth: `docs/OUTPUT_FILES.md` > ".github/pull_request_template.md".
 */
export const pullRequestTemplateTemplate: DocumentTemplate = {
  definition: OutputDefinition.create({
    path: OutputFilePath.create(PATH),
    category: OutputCategory.RepositoryWorkflow,
    target: OutputTarget.None,
    description: 'Structured PR checklist aligned with testing, architecture, and review rules.',
  }),
  render: (context) => {
    const cfg = context.config;

    const title = heading(1, 'Pull Request');
    const summary = section({
      title: 'Summary',
      body: '<!-- What changed? Keep it concise. -->\n\n-',
    });
    const why = section({
      title: 'Why',
      body: '<!-- Why is this change needed? -->\n\n-',
    });
    const scope = renderScope();
    const testing = renderTesting(cfg.testing);
    const architecture = renderArchitecture(cfg.featureArchitecture);
    const generated = renderGeneratedOutput();
    const security = renderSecurity();
    const agents = renderAiAgents(cfg.agents);
    const risks = section({ title: 'Risks / Notes', body: '-' });

    const trailer = renderCodexTrailer(cfg.agents);

    const body = finalizeDocument(
      joinBlocks(
        title,
        summary,
        why,
        scope,
        testing,
        architecture,
        generated,
        security,
        agents,
        risks,
        trailer,
      ),
    );

    return TemplateRenderResult.of(GeneratedFileContent.create(body));
  },
};

function renderScope(): string {
  return section({
    title: 'Scope',
    body: [
      '- [ ] This change is within MVP scope.',
      '- [ ] No backend, accounts, cloud sync, repo analysis, AI generation, team features, or non-dev presets introduced.',
      '- [ ] Any scope impact is explained below.',
    ].join('\n'),
  });
}

function renderTesting(t: TestingSection | undefined): string {
  const items = [
    '- [ ] Formatting checked.',
    '- [ ] Linting passed.',
    '- [ ] Type checking passed.',
  ];
  if (t === undefined) {
    items.push('- [ ] Unit and integration tests passed.');
    items.push('- [ ] End-to-end tests passed or are not affected.');
  } else {
    items.push(`- [ ] ${escapeInline(t.unitTestRunner)} unit/integration tests passed.`);
    if (t.e2eTestRunner !== undefined) {
      items.push(`- [ ] ${escapeInline(t.e2eTestRunner)} tests passed or are not affected.`);
    }
  }
  items.push('- [ ] Snapshot changes reviewed.');
  items.push('- [ ] Build passed.');
  return section({ title: 'Testing', body: items.join('\n') });
}

function renderArchitecture(fa: FeatureArchitectureSection | undefined): string {
  const items: string[] = [
    '- [ ] No raw JSON / DTO leakage into UI components.',
    '- [ ] UI consumes UI view models.',
    '- [ ] Mappers were added or updated where needed.',
    '- [ ] Domain models protect relevant invariants.',
    '- [ ] Ports/adapters are used for infrastructure boundaries where relevant.',
    '- [ ] No unnecessary inheritance or over-engineered abstractions.',
  ];
  if (fa?.viewsArePresentational === true) {
    items.unshift('- [ ] Views remain presentational.');
  }
  if (fa?.allowDirectHttpClientFromViews === false) {
    items.push('- [ ] No direct HttpClient or REST service calls from views.');
  }
  return section({ title: 'Architecture Checklist', body: items.join('\n') });
}

function renderGeneratedOutput(): string {
  return section({
    title: 'Generated Output Impact',
    body: [
      '- [ ] No generated Markdown changes.',
      '- [ ] Generated Markdown changed and snapshots were reviewed.',
      '',
      'If generated output changed, list affected files and why:',
      '',
      '-',
    ].join('\n'),
  });
}

function renderSecurity(): string {
  return section({
    title: 'Security and Privacy',
    body: [
      '- [ ] No secrets are stored in config or generated files.',
      '- [ ] No hidden network calls were added.',
      '- [ ] No telemetry/analytics were added without explicit approval.',
      '- [ ] Import/export validation and file path safety were considered.',
    ].join('\n'),
  });
}

function renderAiAgents(agents: AgentsSection | undefined): string {
  const items: string[] = [];
  if (agents !== undefined) {
    if (agents.activeTargets.has(OutputTarget.Claude)) {
      items.push('- [ ] Claude Code implemented or assisted.');
    }
    if (agents.activeTargets.has(OutputTarget.GenericAgent)) {
      items.push('- [ ] Codex (or equivalent generic agent) review requested or planned.');
    }
  }
  if (items.length === 0) {
    items.push('- [ ] AI agent involvement noted if relevant.');
  }
  items.push('- [ ] Human approval required before merge.');
  return section({ title: 'AI Agent Usage', body: items.join('\n') });
}

function renderCodexTrailer(agents: AgentsSection | undefined): string {
  // Mention @codex at the foot of the template only when the project
  // actually uses a generic agent (Codex) for review; otherwise leave
  // the trailer empty.
  if (agents?.activeTargets.has(OutputTarget.GenericAgent) === true) {
    return '@codex';
  }
  return '';
}
