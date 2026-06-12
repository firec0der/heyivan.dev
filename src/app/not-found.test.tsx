// @vitest-environment jsdom
import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import NotFoundPage from './not-found';

vi.mock('@/lib/content/articles', () => {
  const fixtures = [5, 4, 3, 2, 1].map((n) => ({
    slug: `post-${n}`,
    title: `Post ${n}`,
    date: `2026-0${n}-01`,
    description: null,
    draft: false,
    body: '',
    readingTimeMinutes: 1
  }));
  return {
    getRecentArticles: async (limit: number) => fixtures.slice(0, limit)
  };
});

describe('NotFoundPage', () => {
  it('renders stamp, headline, body line, section label, rows, and back link', async () => {
    render(await NotFoundPage());

    expect(screen.getByText('404')).toBeDefined();
    expect(screen.getByRole('heading', { level: 1, name: 'Not found.' })).toBeDefined();
    expect(screen.getByText("That URL doesn't lead anywhere on this site.")).toBeDefined();
    expect(screen.getByText('Recent writing')).toBeDefined();

    const articleLinks = screen
      .getAllByRole('link')
      .filter((l) => l.getAttribute('href')?.startsWith('/writing/'));
    expect(articleLinks.length).toBe(5);

    const home = screen.getByRole('link', { name: /Back home/ });
    expect(home.getAttribute('href')).toBe('/');
  });
});
