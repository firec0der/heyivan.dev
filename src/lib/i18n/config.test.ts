import { describe, expect, it } from 'vitest';

import { localizePath } from './config';

describe('localizePath', () => {
  it.each([
    ['/', 'en', '/en'],
    ['/', 'uk', '/uk'],
    ['/about', 'en', '/en/about'],
    ['/about', 'uk', '/uk/about'],
    ['/writing/hello', 'uk', '/uk/writing/hello']
  ] as const)('maps (%s, %s) -> %s', (pathname, locale, expected) => {
    expect(localizePath(pathname, locale)).toBe(expected);
  });
});
