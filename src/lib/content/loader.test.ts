import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { z } from 'zod';

import { listContentFiles, loadContentFile, resolveLocalizedFile, sortByDateDesc } from './loader';
import { cleanupFixtureDir, setupFixtureDir } from './test-utils';

const baseSchema = z.object({
  title: z.string(),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/)
});

describe('loader', () => {
  let dir: string;

  beforeAll(async () => {
    dir = await setupFixtureDir({
      'sample.mdx': `---
title: Sample
date: 2026-02-14
---

Sample body. Has a paragraph.
`,
      'README.txt': 'Should be ignored by listContentFiles.\n'
    });
  });

  afterAll(() => cleanupFixtureDir(dir));

  describe('loadContentFile', () => {
    it('returns the slug derived from the filename', async () => {
      const file = await loadContentFile(dir, 'sample.mdx', baseSchema);
      expect(file.slug).toBe('sample');
    });

    it('coerces YAML Date objects to ISO strings before schema validation', async () => {
      const file = await loadContentFile(dir, 'sample.mdx', baseSchema);
      expect(file.frontmatter.date).toBe('2026-02-14');
    });

    it('exposes the raw body without rendering', async () => {
      const file = await loadContentFile(dir, 'sample.mdx', baseSchema);
      expect(file.body.trim()).toBe('Sample body. Has a paragraph.');
    });

    it('throws when the schema rejects the frontmatter', async () => {
      const strict = baseSchema.extend({ never_present: z.string() });
      await expect(loadContentFile(dir, 'sample.mdx', strict)).rejects.toThrow();
    });
  });

  describe('listContentFiles', () => {
    it('returns only .mdx files', async () => {
      const files = await listContentFiles(dir);
      expect(files).toEqual(['sample.mdx']);
    });
  });

  describe('sortByDateDesc', () => {
    it('sorts newest first without mutating input', () => {
      const input = [{ date: '2024-01-01' }, { date: '2026-06-01' }, { date: '2025-03-15' }];
      const original = [...input];
      const sorted = sortByDateDesc(input);
      expect(sorted.map((i) => i.date)).toEqual(['2026-06-01', '2025-03-15', '2024-01-01']);
      expect(input).toEqual(original);
    });

    it('preserves order for equal dates', () => {
      const input = [
        { date: '2026-01-01', id: 'a' },
        { date: '2026-01-01', id: 'b' }
      ];
      const sorted = sortByDateDesc(input);
      expect(sorted.map((i) => i.id)).toEqual(['a', 'b']);
    });
  });
});

describe('locale-aware resolution', () => {
  let dir: string;

  beforeAll(async () => {
    dir = await setupFixtureDir({
      'sample.mdx': `---
title: Sample
date: 2026-02-14
---

Sample body.
`,
      'sample.uk.mdx': `---
title: Зразок
date: 2026-02-14
---

Тіло зразка.
`,
      'only-en.mdx': `---
title: Only EN
date: 2026-01-01
---

Body.
`,
      'README.txt': 'Should be ignored by listContentFiles.\n'
    });
  });

  afterAll(() => cleanupFixtureDir(dir));

  describe('resolveLocalizedFile', () => {
    it('returns the base file for en with no fallback', async () => {
      expect(await resolveLocalizedFile(dir, 'sample', 'en')).toEqual({
        filename: 'sample.mdx',
        fallback: false
      });
    });

    it('returns the localized file when it exists', async () => {
      expect(await resolveLocalizedFile(dir, 'sample', 'uk')).toEqual({
        filename: 'sample.uk.mdx',
        fallback: false
      });
    });

    it('falls back to the base file when the localized file is missing', async () => {
      expect(await resolveLocalizedFile(dir, 'only-en', 'uk')).toEqual({
        filename: 'only-en.mdx',
        fallback: true
      });
    });
  });

  describe('listContentFiles', () => {
    it('excludes locale-suffixed files', async () => {
      const files = await listContentFiles(dir);
      expect(files).toContain('sample.mdx');
      expect(files).toContain('only-en.mdx');
      expect(files).not.toContain('sample.uk.mdx');
    });
  });
});
