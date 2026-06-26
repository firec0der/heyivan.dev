import { describe, expect, it } from 'vitest';

import { alternatesFor } from './metadata';

describe('alternatesFor', () => {
  it('builds alternates for the home path', () => {
    expect(alternatesFor('/')).toEqual({
      languages: { en: '/en', uk: '/uk', 'x-default': '/en' }
    });
  });

  it('prefixes a top-level path with the locale', () => {
    expect(alternatesFor('/about')).toEqual({
      languages: { en: '/en/about', uk: '/uk/about', 'x-default': '/en/about' }
    });
  });

  it('prefixes a nested path with the locale', () => {
    expect(alternatesFor('/writing/hello')).toEqual({
      languages: {
        en: '/en/writing/hello',
        uk: '/uk/writing/hello',
        'x-default': '/en/writing/hello'
      }
    });
  });
});
