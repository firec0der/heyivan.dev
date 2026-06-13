// @vitest-environment jsdom
import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { Chevron } from './Chevron';

describe('Chevron', () => {
  it('is decorative (aria-hidden) and not rotated when closed', () => {
    const { container } = render(<Chevron />);
    const svg = container.querySelector('svg')!;
    expect(svg.getAttribute('aria-hidden')).toBe('true');
    expect(svg.getAttribute('class')).not.toContain('rotate-180');
  });

  it('rotates 180° when open', () => {
    const { container } = render(<Chevron open />);
    expect(container.querySelector('svg')!.getAttribute('class')).toContain('rotate-180');
  });
});
