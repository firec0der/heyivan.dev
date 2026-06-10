import { afterAll, beforeAll, describe, expect, it } from 'vitest';

import { getAllArticles, getArticleSlugs, isPublishable, makeArticleLoaders } from './articles';
import { cleanupFixtureDir, setupFixtureDir } from './test-utils';
import type { Article } from './types';

function fakeArticle(overrides: Partial<Article> = {}): Article {
  return {
    slug: 'fake',
    title: 'Fake',
    date: '2026-01-01',
    description: null,
    draft: false,
    body: '',
    readingTimeMinutes: 1,
    ...overrides
  };
}

describe('articles (hermetic)', () => {
  let dir: string;
  let loaders: ReturnType<typeof makeArticleLoaders>;

  beforeAll(async () => {
    dir = await setupFixtureDir({
      'hello.mdx': `---
title: Hello, world.
date: 2026-01-04
description: First post.
draft: false
---

Welcome to the site. This is the first post.
`,
      'older.mdx': `---
title: Older post
date: 2025-12-01
description: An older entry.
draft: false
---

Body of the older post.
`,
      'draft.mdx': `---
title: Draft entry
date: 2026-01-15
description: Should be filtered.
draft: true
---

Should never appear.
`,
      'future.mdx': `---
title: Future entry
date: 2099-01-01
description: Long way off.
draft: false
---

Should never appear before 2099.
`
    });
    loaders = makeArticleLoaders(dir);
  });

  afterAll(() => cleanupFixtureDir(dir));

  it('lists articles sorted by date desc', async () => {
    const articles = await loaders.getAllArticles();
    expect(articles.length).toBe(2);
    expect(articles[0]!.slug).toBe('hello');
    expect(articles[1]!.slug).toBe('older');
  });

  it('loads an article by slug', async () => {
    const a = await loaders.getArticleBySlug('hello');
    expect(a?.slug).toBe('hello');
    expect(a?.title).toBe('Hello, world.');
    expect(a?.description).toBe('First post.');
    expect(a?.draft).toBe(false);
    expect(a?.readingTimeMinutes).toBeGreaterThanOrEqual(1);
    expect(a?.body).toContain('Welcome to the site.');
  });

  it('returns null for unknown slug', async () => {
    expect(await loaders.getArticleBySlug('does-not-exist')).toBeNull();
  });

  it('lists slugs matching getAllArticles', async () => {
    const articles = await loaders.getAllArticles();
    const slugs = await loaders.getArticleSlugs();
    expect(slugs).toEqual(articles.map((a) => a.slug));
  });

  it('excludes draft posts', async () => {
    const slugs = await loaders.getArticleSlugs();
    expect(slugs).not.toContain('draft');
  });

  it('excludes future-dated posts', async () => {
    const slugs = await loaders.getArticleSlugs();
    expect(slugs).not.toContain('future');
  });

  it('still loads draft and future posts when requested by exact slug', async () => {
    expect((await loaders.getArticleBySlug('draft'))?.draft).toBe(true);
    expect((await loaders.getArticleBySlug('future'))?.date).toBe('2099-01-01');
  });
});

describe('isPublishable', () => {
  const now = new Date('2026-06-15T12:00:00Z');

  it('rejects drafts regardless of date', () => {
    expect(isPublishable(fakeArticle({ draft: true, date: '2020-01-01' }), now)).toBe(false);
  });

  it('rejects future-dated articles', () => {
    expect(isPublishable(fakeArticle({ date: '2099-01-01' }), now)).toBe(false);
  });

  it('accepts past-dated articles', () => {
    expect(isPublishable(fakeArticle({ date: '2024-03-22' }), now)).toBe(true);
  });

  it('accepts articles dated today', () => {
    expect(isPublishable(fakeArticle({ date: '2026-06-15' }), now)).toBe(true);
  });
});

describe('articles (smoke — production content)', () => {
  it('production content loads and parses', async () => {
    const articles = await getAllArticles();
    expect(Array.isArray(articles)).toBe(true);
  });

  it('production content has no slug collisions', async () => {
    const slugs = await getArticleSlugs();
    expect(new Set(slugs).size).toBe(slugs.length);
  });
});
