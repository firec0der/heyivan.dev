// @vitest-environment jsdom
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import type { Role } from '@/lib/content/types';

import { RoleCard } from './RoleCard';

const ROLE: Role = {
  company: 'Acme',
  role: 'Engineer',
  start: '2024-01',
  end: 'present',
  blurb: 'The blurb.',
  description: 'First paragraph.\n\nSecond paragraph.',
  skills: ['Go', 'Postgres']
};

describe('RoleCard', () => {
  it('starts closed by default with aria-expanded="false" and inert region', () => {
    render(<RoleCard role={ROLE} />);
    const button = screen.getByRole('button');
    expect(button.getAttribute('aria-expanded')).toBe('false');
    const region = screen.getByRole('region', { hidden: true });
    expect(region.hasAttribute('inert')).toBe(true);
  });

  it('starts open when defaultOpen=true and region is not inert', () => {
    render(<RoleCard role={ROLE} defaultOpen />);
    const button = screen.getByRole('button');
    expect(button.getAttribute('aria-expanded')).toBe('true');
    const region = screen.getByRole('region');
    expect(region.hasAttribute('inert')).toBe(false);
  });

  it('toggles open/closed on button click', () => {
    render(<RoleCard role={ROLE} />);
    const button = screen.getByRole('button');
    expect(button.getAttribute('aria-expanded')).toBe('false');
    fireEvent.click(button);
    expect(button.getAttribute('aria-expanded')).toBe('true');
    fireEvent.click(button);
    expect(button.getAttribute('aria-expanded')).toBe('false');
  });

  it('renders the formatted month range, role · company, and blurb in the trigger', () => {
    render(<RoleCard role={ROLE} />);
    expect(screen.getByText('Jan 2024 — Present')).toBeDefined();
    expect(screen.getByText('Engineer · Acme')).toBeDefined();
    expect(screen.getByText('The blurb.')).toBeDefined();
  });

  it('gives the trigger a concise accessible name via aria-label', () => {
    render(<RoleCard role={ROLE} />);
    expect(
      screen.getByRole('button', { name: 'Engineer at Acme, Jan 2024 — Present' })
    ).toBeDefined();
  });

  it('renders the description as separate <p> per blank-line break', () => {
    render(<RoleCard role={ROLE} defaultOpen />);
    expect(screen.getByText('First paragraph.')).toBeDefined();
    expect(screen.getByText('Second paragraph.')).toBeDefined();
  });

  it('renders the SKILLS row when skills are present', () => {
    render(<RoleCard role={ROLE} defaultOpen />);
    expect(screen.getByText('Skills')).toBeDefined();
    expect(screen.getByText(/Go · Postgres/)).toBeDefined();
  });

  it('hides the SKILLS row when skills array is empty', () => {
    render(<RoleCard role={{ ...ROLE, skills: [] }} defaultOpen />);
    expect(screen.queryByText('Skills')).toBeNull();
  });
});
