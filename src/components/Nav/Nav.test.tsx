// @vitest-environment jsdom
import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { isActiveRoute } from './links';
import { Nav } from './Nav';

vi.mock('@/i18n/navigation', () => ({
  usePathname: () => '/writing/hello-world',
  Link: ({
    href,
    children,
    ...props
  }: {
    href: string;
    children: React.ReactNode;
    [key: string]: unknown;
  }) => (
    <a href={href} {...props}>
      {children}
    </a>
  )
}));

vi.mock('next-intl', () => ({
  useLocale: () => 'en'
}));

describe('isActiveRoute', () => {
  it('matches exact path', () => {
    expect(isActiveRoute('/writing', '/writing')).toBe(true);
  });
  it('matches nested path', () => {
    expect(isActiveRoute('/writing/hello-world', '/writing')).toBe(true);
  });
  it('does not match sibling path', () => {
    expect(isActiveRoute('/about', '/writing')).toBe(false);
  });
  it('does not false-match /about against /', () => {
    expect(isActiveRoute('/about', '/')).toBe(false);
  });
  it('matches root exactly', () => {
    expect(isActiveRoute('/', '/')).toBe(true);
  });
});

describe('Nav', () => {
  it('renders the wordmark linking to root', () => {
    render(<Nav wordmark="ivan." />);
    const home = screen.getByRole('link', { name: 'ivan.' });
    expect(home.getAttribute('href')).toBe('/');
  });

  it('marks the route matching the current pathname with aria-current="page"', () => {
    render(<Nav wordmark="ivan." />);
    const writingLinks = screen.getAllByRole('link', { name: 'writing' });
    const active = writingLinks.find((l) => l.getAttribute('aria-current') === 'page');
    expect(active).toBeDefined();
  });

  it('opens the mobile menu overlay when the hamburger is clicked', () => {
    render(<Nav wordmark="ivan." />);
    expect(screen.queryByRole('dialog', { name: 'Site navigation' })).toBeNull();
    fireEvent.click(screen.getByRole('button', { name: 'Open menu' }));
    expect(screen.getByRole('dialog', { name: 'Site navigation' })).toBeDefined();
  });
});
