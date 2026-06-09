import path from 'node:path';

import { afterAll, beforeAll, describe, expect, it } from 'vitest';

import { getAboutPage } from './about';
import { cleanupFixtureDir, setupFixtureDir } from './test-utils';

describe('about (hermetic)', () => {
  let dir: string;

  beforeAll(async () => {
    dir = await setupFixtureDir({
      'about.md': `---
title: About
---

Bio paragraph one.

## Section

Bio paragraph two.
`
    });
  });

  afterAll(() => cleanupFixtureDir(dir));

  it('parses title and renders body', async () => {
    const about = await getAboutPage(path.join(dir, 'about.md'));
    expect(about.title).toBe('About');
    expect(about.bodyHtml).toContain('<p>Bio paragraph one.</p>');
    expect(about.bodyHtml).toContain('<h2 id="section">');
  });
});

describe('about (smoke — production content)', () => {
  it('production about.md loads and renders', async () => {
    const about = await getAboutPage();
    expect(typeof about.title).toBe('string');
    expect(about.bodyHtml).toContain('<p>');
  });
});
