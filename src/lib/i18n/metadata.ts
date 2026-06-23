import type { Metadata } from 'next';

import { localizePath } from './config';

/**
 * Build the `alternates.languages` hreflang map for an English route `path`
 * (e.g. `/about`, `/writing/hello`, or `/` for home) and its `/uk` counterpart.
 * Paths are relative; `metadataBase` in the root layout resolves them to absolute URLs.
 */
export const alternatesFor = (path: string): Metadata['alternates'] => ({
  languages: {
    en: path,
    uk: localizePath(path, 'uk'),
    'x-default': path
  }
});
