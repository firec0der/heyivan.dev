// @vitest-environment jsdom
import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

vi.mock('next-intl/server', () => ({
  getLocale: async () => 'en'
}));
vi.mock('@/lib/content/articles', () => ({
  getRecentArticles: async (limit: number) =>
    [5, 4, 3, 2, 1].slice(0, limit).map((n) => ({
      slug: `post-${n}`,
      title: `Post ${n}`,
      date: `2026-0${n}-01`,
      description: null,
      draft: false,
      body: '',
      readingTimeMinutes: 1
    }))
}));

import NotFoundPage from './not-found';

describe('NotFoundPage', () => {
  it('renders stamp, headline, body line, section label, rows, and back link', async () => {
    render(await NotFoundPage());

    expect(screen.getByText('404')).toBeDefined();
    expect(screen.getByRole('heading', { level: 1, name: 'Page not found' })).toBeDefined();
    expect(
      screen.getByText('That page does not exist. Here is some recent writing instead.')
    ).toBeDefined();
    expect(screen.getByText('Latest writing')).toBeDefined();

    const articleLinks = screen
      .getAllByRole('link')
      .filter((l) => l.getAttribute('href')?.startsWith('/writing/'));
    expect(articleLinks.length).toBe(5);

    const home = screen.getByRole('link', { name: /Back home/ });
    expect(home.getAttribute('href')).toBe('/');
  });
});
