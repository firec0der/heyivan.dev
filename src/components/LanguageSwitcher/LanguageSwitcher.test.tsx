// @vitest-environment jsdom
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

const usePathname = vi.fn();
vi.mock('next/navigation', () => ({ usePathname: () => usePathname() }));

import { LanguageSwitcher } from './LanguageSwitcher';

describe('LanguageSwitcher', () => {
  it('labels the trigger with the active locale and links each option to its counterpart path', () => {
    usePathname.mockReturnValue('/uk/writing');
    render(<LanguageSwitcher />);
    expect(screen.getByRole('button').textContent).toContain('укр');
    fireEvent.click(screen.getByRole('button'));
    expect(screen.getByRole('link', { name: 'en' }).getAttribute('href')).toBe('/writing');
    expect(screen.getByRole('link', { name: 'укр' }).getAttribute('href')).toBe('/uk/writing');
  });

  it('marks the active locale with aria-current', () => {
    usePathname.mockReturnValue('/writing');
    render(<LanguageSwitcher />);
    fireEvent.click(screen.getByRole('button'));
    expect(screen.getByRole('link', { name: 'en' }).getAttribute('aria-current')).toBe('true');
    expect(screen.getByRole('link', { name: 'укр' }).getAttribute('aria-current')).toBeNull();
  });

  it('does not render the menu until the trigger is clicked', () => {
    usePathname.mockReturnValue('/');
    render(<LanguageSwitcher />);
    expect(screen.queryByRole('link', { name: 'en' })).toBeNull();
  });
});
