import { describe, it, expect } from 'vitest';
import { ProjectConfig } from './project-config';
import { ProjectName } from '../values/project-name';

describe('ProjectConfig', () => {
  it('exposes its configuration version and project name', () => {
    const config = ProjectConfig.create({
      configVersion: '1',
      projectName: ProjectName.create('trohi'),
    });
    expect(config.configVersion).toBe('1');
    expect(config.projectName.value).toBe('trohi');
  });

  it('is immutable: configVersion and projectName are accessors only', () => {
    const config = ProjectConfig.create({
      configVersion: '1',
      projectName: ProjectName.create('trohi'),
    });
    const descriptor = Object.getOwnPropertyDescriptor(
      Object.getPrototypeOf(config) as object,
      'configVersion',
    );
    expect(descriptor?.set).toBeUndefined();
  });

  it('rejects an empty config version', () => {
    expect(() =>
      ProjectConfig.create({
        configVersion: '',
        projectName: ProjectName.create('trohi'),
      }),
    ).toThrow();
  });

  it('considers two configs with the same version and name equal', () => {
    const a = ProjectConfig.create({
      configVersion: '1',
      projectName: ProjectName.create('trohi'),
    });
    const b = ProjectConfig.create({
      configVersion: '1',
      projectName: ProjectName.create('trohi'),
    });
    expect(a.equals(b)).toBe(true);
  });

  it('considers configs with different names not equal', () => {
    const a = ProjectConfig.create({
      configVersion: '1',
      projectName: ProjectName.create('trohi'),
    });
    const b = ProjectConfig.create({
      configVersion: '1',
      projectName: ProjectName.create('other'),
    });
    expect(a.equals(b)).toBe(false);
  });
});
