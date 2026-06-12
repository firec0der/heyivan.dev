// @vitest-environment jsdom
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { WritingListItem } from './WritingListItem';

describe('WritingListItem', () => {
  it('renders an article link with date and title', () => {
    render(
      <ul>
        <WritingListItem slug="hello-world" title="Hello, world." date="2026-01-04" />
      </ul>
    );

    const link = screen.getByRole('link', { name: /Hello, world\./ });
    expect(link.getAttribute('href')).toBe('/writing/hello-world');

    const time = link.querySelector('time');
    expect(time?.getAttribute('datetime')).toBe('2026-01-04');
    expect(time?.textContent).toBe('2026-01-04');

    expect(screen.getByText('Hello, world.')).toBeDefined();
  });
});
