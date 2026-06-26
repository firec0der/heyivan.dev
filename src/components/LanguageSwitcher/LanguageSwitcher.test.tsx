// @vitest-environment jsdom
import { fireEvent, render, screen } from '@testing-library/react';
import React from 'react';
import { describe, expect, it, vi } from 'vitest';

const usePathname = vi.fn();
const useLocale = vi.fn();

vi.mock('@/i18n/navigation', () => ({
  usePathname: () => usePathname(),
  Link: ({
    href,
    locale,
    children,
    ...props
  }: {
    href: string;
    locale?: string;
    children: React.ReactNode;
    [key: string]: unknown;
  }) => (
    <a href={locale ? `/${locale}${href}` : href} {...props}>
      {children}
    </a>
  )
}));

vi.mock('next-intl', () => ({
  useLocale: () => useLocale()
}));

import { LanguageSwitcher } from './LanguageSwitcher';

describe('LanguageSwitcher', () => {
  it('labels the trigger with the active locale and links each option to its counterpart path', () => {
    usePathname.mockReturnValue('/writing');
    useLocale.mockReturnValue('uk');
    render(<LanguageSwitcher />);
    expect(screen.getByRole('button').textContent).toContain('укр');
    fireEvent.click(screen.getByRole('button'));
    expect(screen.getByRole('link', { name: 'en' }).getAttribute('href')).toBe('/en/writing');
    expect(screen.getByRole('link', { name: 'укр' }).getAttribute('href')).toBe('/uk/writing');
  });

  it('marks the active locale with aria-current', () => {
    usePathname.mockReturnValue('/writing');
    useLocale.mockReturnValue('en');
    render(<LanguageSwitcher />);
    fireEvent.click(screen.getByRole('button'));
    expect(screen.getByRole('link', { name: 'en' }).getAttribute('aria-current')).toBe('page');
    expect(screen.getByRole('link', { name: 'укр' }).getAttribute('aria-current')).toBeNull();
  });

  it('does not render the menu until the trigger is clicked', () => {
    usePathname.mockReturnValue('/');
    useLocale.mockReturnValue('en');
    render(<LanguageSwitcher />);
    expect(screen.queryByRole('link', { name: 'en' })).toBeNull();
  });
});
