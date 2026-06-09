import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { z } from 'zod';

import { listMarkdownFiles, loadMarkdownFile, sortByDateDesc } from './loader';
import { cleanupFixtureDir, setupFixtureDir } from './test-utils';

const baseSchema = z.object({
  title: z.string(),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/)
});

describe('loader', () => {
  let dir: string;

  beforeAll(async () => {
    dir = await setupFixtureDir({
      'sample.md': `---
title: Sample
date: 2026-02-14
---

Sample body. Has a paragraph.
`,
      'README.txt': 'Should be ignored by listMarkdownFiles.\n'
    });
  });

  afterAll(() => cleanupFixtureDir(dir));

  describe('loadMarkdownFile', () => {
    it('returns the slug derived from the filename', async () => {
      const file = await loadMarkdownFile(dir, 'sample.md', baseSchema);
      expect(file.slug).toBe('sample');
    });

    it('coerces YAML Date objects to ISO strings before schema validation', async () => {
      const file = await loadMarkdownFile(dir, 'sample.md', baseSchema);
      expect(file.frontmatter.date).toBe('2026-02-14');
    });

    it('renders the body to HTML and exposes the raw body', async () => {
      const file = await loadMarkdownFile(dir, 'sample.md', baseSchema);
      expect(file.bodyHtml).toContain('<p>');
      expect(file.body.trim().length).toBeGreaterThan(0);
    });

    it('throws when the schema rejects the frontmatter', async () => {
      const strict = baseSchema.extend({ never_present: z.string() });
      await expect(loadMarkdownFile(dir, 'sample.md', strict)).rejects.toThrow();
    });
  });

  describe('listMarkdownFiles', () => {
    it('returns only .md files', async () => {
      const files = await listMarkdownFiles(dir);
      expect(files).toEqual(['sample.md']);
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
