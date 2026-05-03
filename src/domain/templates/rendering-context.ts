import { ProjectConfig } from '../config/project-config';

/**
 * Inputs accepted when constructing a {@link RenderingContext}.
 */
export interface RenderingContextCreateInput {
  readonly config: ProjectConfig;
}

/**
 * Immutable bundle of inputs passed to every {@link TemplateFunction}
 * during a single generation run.
 *
 * Holds only what templates legitimately need to read. Time, random
 * sources, environment, and any other non-deterministic input must
 * never be reached for from inside a template; if a future template
 * needs them, they belong on this context as explicit fields the
 * caller passes in.
 *
 * Skeleton scope (Phase 4): the only field is the project config.
 * Template/generator versions and other fields will be added when a
 * concrete template needs them.
 */
export class RenderingContext {
  private constructor(private readonly _config: ProjectConfig) {}

  /** Build a RenderingContext from already-validated inputs. */
  static create(input: RenderingContextCreateInput): RenderingContext {
    return new RenderingContext(input.config);
  }

  /** The validated project configuration the templates render from. */
  get config(): ProjectConfig {
    return this._config;
  }
}
