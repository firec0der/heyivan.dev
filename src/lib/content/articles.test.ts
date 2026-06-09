import { describe, expect, it } from 'vitest';

import { getAllArticles, getArticleBySlug } from './articles';

describe('articles', () => {
  it('lists non-draft non-future articles sorted by date desc', async () => {
    const articles = await getAllArticles();
    expect(articles.length).toBeGreaterThan(0);
    for (let i = 1; i < articles.length; i++) {
      expect(articles[i - 1]!.date >= articles[i]!.date).toBe(true);
    }
  });

  it('loads an article by slug', async () => {
    const a = await getArticleBySlug('hello-world');
    expect(a?.title).toBe('Hello, world.');
    expect(a?.slug).toBe('hello-world');
    expect(a?.bodyHtml).toContain('<p>');
    expect(a?.readingTimeMinutes).toBeGreaterThanOrEqual(1);
  });

  it('returns null for unknown slug', async () => {
    expect(await getArticleBySlug('does-not-exist')).toBeNull();
  });
});
