import { afterAll, beforeAll, describe, expect, it } from 'vitest';

import { makeAboutLoader } from './about';
import { cleanupFixtureDir, setupFixtureDir } from './test-utils';

describe('about (hermetic)', () => {
  let dir: string;
  let getAboutContent: ReturnType<typeof makeAboutLoader>;

  beforeAll(async () => {
    dir = await setupFixtureDir({
      'about.mdx': `---
title: About
---

English bio.

## Now

English now.
`,
      'about.uk.mdx': `---
title: Про мене
---

Український текст.

## Now

Український зараз.
`
    });
    getAboutContent = makeAboutLoader(dir);
  });

  afterAll(() => cleanupFixtureDir(dir));

  it('loads the English page with fallback false by default', async () => {
    const page = await getAboutContent();
    expect(page.title).toBe('About');
    expect(page.body).toContain('English bio.');
    expect(page.fallback).toBe(false);
  });

  it('loads the uk translation when present (fallback false)', async () => {
    const page = await getAboutContent('uk');
    expect(page.title).toBe('Про мене');
    expect(page.body).toContain('Український текст.');
    expect(page.fallback).toBe(false);
  });
});

describe('about (fallback)', () => {
  let dir: string;
  let getAboutContent: ReturnType<typeof makeAboutLoader>;

  beforeAll(async () => {
    dir = await setupFixtureDir({
      'about.mdx': `---
title: About
---

English bio only.
`
    });
    getAboutContent = makeAboutLoader(dir);
  });

  afterAll(() => cleanupFixtureDir(dir));

  it('falls back to English when the uk translation is missing (fallback true)', async () => {
    const page = await getAboutContent('uk');
    expect(page.title).toBe('About');
    expect(page.body).toContain('English bio only.');
    expect(page.fallback).toBe(true);
  });
});
