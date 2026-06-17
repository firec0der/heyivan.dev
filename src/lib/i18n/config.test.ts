import { describe, expect, it } from 'vitest';

import { DEFAULT_LOCALE, localeFromPath, LOCALES, localizePath } from './config';

describe('i18n config', () => {
  it('lists en and uk with en as default', () => {
    expect(LOCALES).toEqual(['en', 'uk']);
    expect(DEFAULT_LOCALE).toBe('en');
  });

  describe('localeFromPath', () => {
    it.each([
      ['/', 'en'],
      ['/writing', 'en'],
      ['/writing/hello', 'en'],
      ['/uk', 'uk'],
      ['/uk/writing', 'uk'],
      ['/uk/writing/hello', 'uk'],
      ['/ukulele', 'en'] // not a /uk segment
    ])('maps %s -> %s', (pathname, expected) => {
      expect(localeFromPath(pathname)).toBe(expected);
    });
  });

  describe('localizePath', () => {
    it.each([
      ['/writing', 'uk', '/uk/writing'],
      ['/uk/writing', 'en', '/writing'],
      ['/', 'uk', '/uk'],
      ['/uk', 'en', '/'],
      ['/uk/writing/hello', 'en', '/writing/hello'],
      ['/writing', 'en', '/writing']
    ] as const)('maps (%s, %s) -> %s', (pathname, locale, expected) => {
      expect(localizePath(pathname, locale)).toBe(expected);
    });
  });
});
