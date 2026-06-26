// @vitest-environment jsdom
import { fireEvent, render, screen } from '@testing-library/react';
import React from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { MobileMenuOverlay } from './MobileMenuOverlay';

vi.mock('@/i18n/navigation', () => ({
  usePathname: () => '/about',
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

describe('MobileMenuOverlay', () => {
  beforeEach(() => {
    document.body.style.overflow = '';
  });

  afterEach(() => {
    document.body.style.overflow = '';
  });

  it('renders nothing when open is false', () => {
    const onClose = vi.fn();
    const { container } = render(
      <MobileMenuOverlay open={false} onClose={onClose} wordmark="ivan." />
    );
    expect(container.firstChild).toBeNull();
  });

  it('renders dialog with wordmark and nav links when open', () => {
    const onClose = vi.fn();
    render(<MobileMenuOverlay open={true} onClose={onClose} wordmark="ivan." />);
    expect(screen.getByRole('dialog', { name: 'Site navigation' })).toBeDefined();
    expect(screen.getByText('ivan.')).toBeDefined();
    for (const label of ['about', 'work', 'projects', 'writing']) {
      expect(screen.getByRole('link', { name: label })).toBeDefined();
    }
  });

  it('locks body scroll while open and restores on close', () => {
    const onClose = vi.fn();
    const { rerender } = render(
      <MobileMenuOverlay open={true} onClose={onClose} wordmark="ivan." />
    );
    expect(document.body.style.overflow).toBe('hidden');
    rerender(<MobileMenuOverlay open={false} onClose={onClose} wordmark="ivan." />);
    expect(document.body.style.overflow).toBe('');
  });

  it('calls onClose when Escape is pressed', () => {
    const onClose = vi.fn();
    render(<MobileMenuOverlay open={true} onClose={onClose} wordmark="ivan." />);
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('calls onClose when the close button is clicked', () => {
    const onClose = vi.fn();
    render(<MobileMenuOverlay open={true} onClose={onClose} wordmark="ivan." />);
    fireEvent.click(screen.getByRole('button', { name: 'Close menu' }));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('calls onClose when a nav link is clicked', () => {
    const onClose = vi.fn();
    render(<MobileMenuOverlay open={true} onClose={onClose} wordmark="ivan." />);
    fireEvent.click(screen.getByRole('link', { name: 'about' }));
    expect(onClose).toHaveBeenCalled();
  });

  it('marks the current pathname link with aria-current="page"', () => {
    const onClose = vi.fn();
    render(<MobileMenuOverlay open={true} onClose={onClose} wordmark="ivan." />);
    expect(screen.getByRole('link', { name: 'about' }).getAttribute('aria-current')).toBe('page');
    expect(screen.getByRole('link', { name: 'work' }).getAttribute('aria-current')).toBeNull();
  });
});
