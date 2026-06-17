import path from 'node:path';

import { afterAll, beforeAll, describe, expect, it } from 'vitest';

import { getSiteData } from './site';
import { cleanupFixtureDir, setupFixtureDir } from './test-utils';

describe('site (hermetic)', () => {
  let dir: string;

  beforeAll(async () => {
    dir = await setupFixtureDir({
      'site.yaml': `name: Test User
wordmark: test.
role: Test role.
greeting: "Hello."
social:
  github: https://github.com/test
  linkedin: https://www.linkedin.com/in/test/
  email: test@example.com
`,
      'site.uk.yaml': `role: Тестова роль.
greeting: "Привіт."
`
    });
  });

  afterAll(() => cleanupFixtureDir(dir));

  it('parses identity + social fields', async () => {
    const site = await getSiteData('en', path.join(dir, 'site.yaml'));
    expect(site.name).toBe('Test User');
    expect(site.wordmark).toBe('test.');
    expect(site.social.email).toBe('test@example.com');
  });

  it('deep-merges the uk override, keeping base-only fields', async () => {
    const site = await getSiteData('uk', path.join(dir, 'site.yaml'));
    expect(site.role).toBe('Тестова роль.');
    expect(site.greeting).toBe('Привіт.');
    expect(site.name).toBe('Test User');
    expect(site.social.email).toBe('test@example.com');
  });
});

describe('site (smoke — production content)', () => {
  it('production site.yaml loads and parses', async () => {
    const site = await getSiteData();
    expect(typeof site.name).toBe('string');
    expect(site.social.github).toMatch(/^https:\/\//);
  });
});
