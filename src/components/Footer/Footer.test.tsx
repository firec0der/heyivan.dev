// @vitest-environment jsdom
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { Footer } from './Footer';

const SOCIAL_LINKS = {
  github: 'https://github.com/firec0der',
  linkedin: 'https://www.linkedin.com/in/firecoder/',
  email: 'i.stetsenko1@gmail.com'
};

describe('Footer', () => {
  it('renders github, linkedin, and email links with the right hrefs', () => {
    render(<Footer socialLinks={SOCIAL_LINKS} />);
    expect(screen.getByRole('link', { name: 'github' }).getAttribute('href')).toBe(
      SOCIAL_LINKS.github
    );
    expect(screen.getByRole('link', { name: 'linkedin' }).getAttribute('href')).toBe(
      SOCIAL_LINKS.linkedin
    );
    expect(screen.getByRole('link', { name: 'email' }).getAttribute('href')).toBe(
      `mailto:${SOCIAL_LINKS.email}`
    );
  });

  it('opens github and linkedin in a new tab with safe rel', () => {
    render(<Footer socialLinks={SOCIAL_LINKS} />);
    for (const name of ['github', 'linkedin']) {
      const link = screen.getByRole('link', { name });
      expect(link.getAttribute('target')).toBe('_blank');
      expect(link.getAttribute('rel')).toBe('noopener noreferrer');
    }
    expect(screen.getByRole('link', { name: 'email' }).getAttribute('target')).toBeNull();
  });

  it('renders the current year in the copyright line', () => {
    render(<Footer socialLinks={SOCIAL_LINKS} />);
    const year = new Date().getFullYear();
    expect(screen.getByText(`© ${year}`)).toBeDefined();
  });
});
