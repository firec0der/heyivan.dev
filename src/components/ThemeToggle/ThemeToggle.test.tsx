// @vitest-environment jsdom
import { fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('next-intl', () => ({ useLocale: () => 'en' }));

import { ThemeToggle } from './ThemeToggle';

describe('ThemeToggle', () => {
  beforeEach(() => {
    document.documentElement.removeAttribute('data-theme');
    localStorage.clear();
  });

  afterEach(() => {
    document.documentElement.removeAttribute('data-theme');
    localStorage.clear();
  });

  it('shows the "Switch to dark mode" label and moon glyph when light', () => {
    render(<ThemeToggle />);
    const button = screen.getByRole('button', { name: 'Switch to dark mode' });
    expect(button).toBeDefined();
    expect(button.textContent).toContain('☽');
  });

  it('shows the "Switch to light mode" label and sun glyph when dark', () => {
    document.documentElement.setAttribute('data-theme', 'dark');
    render(<ThemeToggle />);
    const button = screen.getByRole('button', { name: 'Switch to light mode' });
    expect(button).toBeDefined();
    expect(button.textContent).toContain('☼');
  });

  it('toggles data-theme on click', () => {
    render(<ThemeToggle />);
    expect(document.documentElement.hasAttribute('data-theme')).toBe(false);
    fireEvent.click(screen.getByRole('button'));
    expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
    fireEvent.click(screen.getByRole('button'));
    expect(document.documentElement.hasAttribute('data-theme')).toBe(false);
  });
});
