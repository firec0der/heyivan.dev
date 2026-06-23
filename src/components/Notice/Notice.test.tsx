// @vitest-environment jsdom
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { Notice } from './Notice';

describe('Notice', () => {
  it('renders children', () => {
    render(<Notice>This page has not been translated yet.</Notice>);
    expect(screen.getByText('This page has not been translated yet.')).toBeTruthy();
  });

  it('merges className', () => {
    render(<Notice className="mb-lg">Message</Notice>);
    expect(screen.getByText('Message').className).toContain('mb-lg');
  });
});
