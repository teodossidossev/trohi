import { describe, it, expect } from 'vitest';
import { RenderingContext } from './rendering-context';
import { TrohiBootstrapPreset } from '../config/presets/trohi-bootstrap-preset';

describe('RenderingContext', () => {
  it('exposes the project config it was built with', () => {
    const config = TrohiBootstrapPreset.create();
    const context = RenderingContext.create({ config });
    expect(context.config).toBe(config);
  });

  it('exposes only the config (no incidental properties)', () => {
    const context = RenderingContext.create({ config: TrohiBootstrapPreset.create() });
    // Templates must not reach for time, env, or random sources via the
    // context. The only public surface should be `config`.
    const ownKeys = Object.keys(context);
    expect(ownKeys).toEqual(['_config']);
  });
});
