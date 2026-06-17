import { describe, expect, it } from 'vitest';

import { en } from './en';
import { getDictionary } from './index';
import { uk } from './uk';

const keys = (obj: object, prefix = ''): string[] =>
  Object.entries(obj).flatMap(([k, v]) =>
    v && typeof v === 'object' ? keys(v, `${prefix}${k}.`) : [`${prefix}${k}`]
  );

describe('dictionaries', () => {
  it('getDictionary selects by locale', () => {
    expect(getDictionary('en')).toBe(en);
    expect(getDictionary('uk')).toBe(uk);
  });

  it('uk has exactly the same key set as en', () => {
    expect(keys(uk).sort()).toEqual(keys(en).sort());
  });
});
