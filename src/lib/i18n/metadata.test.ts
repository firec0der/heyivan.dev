import { describe, expect, it } from 'vitest';

import { alternatesFor } from './metadata';

describe('alternatesFor', () => {
  it('maps the home path to its /uk counterpart', () => {
    expect(alternatesFor('/')).toEqual({
      languages: { en: '/', uk: '/uk', 'x-default': '/' }
    });
  });

  it('prefixes a top-level path with /uk', () => {
    expect(alternatesFor('/about')).toEqual({
      languages: { en: '/about', uk: '/uk/about', 'x-default': '/about' }
    });
  });

  it('prefixes a nested path with /uk', () => {
    expect(alternatesFor('/writing/hello')).toEqual({
      languages: { en: '/writing/hello', uk: '/uk/writing/hello', 'x-default': '/writing/hello' }
    });
  });
});
