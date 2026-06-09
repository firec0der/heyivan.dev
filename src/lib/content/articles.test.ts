import { describe, expect, it } from 'vitest';

import { getAllArticles, getArticleBySlug, getArticleSlugs, isPublishable } from './articles';
import type { Article } from './types';

function fakeArticle(overrides: Partial<Article> = {}): Article {
  return {
    slug: 'fake',
    title: 'Fake',
    date: '2026-01-01',
    description: null,
    draft: false,
    body: '',
    bodyHtml: '',
    readingTimeMinutes: 1,
    ...overrides
  };
}

describe('articles', () => {
  it('lists articles sorted by date desc', async () => {
    const articles = await getAllArticles();
    expect(articles.length).toBeGreaterThan(0);
    for (let i = 1; i < articles.length; i++) {
      expect(articles[i - 1]!.date >= articles[i]!.date).toBe(true);
    }
  });

  it('loads an article by slug', async () => {
    const a = await getArticleBySlug('hello-world');
    expect(a?.slug).toBe('hello-world');
    expect(a?.title).toBe('Hello, world.');
    expect(a?.description?.length).toBeGreaterThan(0);
    expect(a?.draft).toBe(false);
    expect(a?.readingTimeMinutes).toBeGreaterThanOrEqual(1);
    expect(a?.bodyHtml).toContain('<p>');
  });

  it('returns null for unknown slug', async () => {
    expect(await getArticleBySlug('does-not-exist')).toBeNull();
  });

  it('lists slugs matching getAllArticles', async () => {
    const articles = await getAllArticles();
    const slugs = await getArticleSlugs();
    expect(slugs).toEqual(articles.map((a) => a.slug));
  });

  it('excludes draft posts', async () => {
    const slugs = await getArticleSlugs();
    expect(slugs).not.toContain('draft-example');
  });

  it('excludes future-dated posts', async () => {
    const slugs = await getArticleSlugs();
    expect(slugs).not.toContain('future-post');
  });

  it('still loads draft and future posts when requested by exact slug', async () => {
    expect((await getArticleBySlug('draft-example'))?.draft).toBe(true);
    expect((await getArticleBySlug('future-post'))?.date).toBe('2099-01-01');
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

  it("accepts articles dated today", () => {
    expect(isPublishable(fakeArticle({ date: '2026-06-15' }), now)).toBe(true);
  });
});
