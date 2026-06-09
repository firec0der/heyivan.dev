import path from 'node:path';

import { describe, expect, it } from 'vitest';
import { z } from 'zod';

import { listMarkdownFiles, loadMarkdownFile, sortByDateDesc } from './loader';

const WRITING_DIR = path.join(process.cwd(), 'content', 'writing');

const articleSchema = z.object({
  title: z.string(),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/)
});

describe('loader', () => {
  describe('loadMarkdownFile', () => {
    it('returns the slug derived from the filename', async () => {
      const file = await loadMarkdownFile(WRITING_DIR, 'hello-world.md', articleSchema);
      expect(file.slug).toBe('hello-world');
    });

    it('coerces YAML Date objects to ISO strings before schema validation', async () => {
      const file = await loadMarkdownFile(WRITING_DIR, 'hello-world.md', articleSchema);
      expect(file.frontmatter.date).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    });

    it('renders the body to HTML and exposes the raw body', async () => {
      const file = await loadMarkdownFile(WRITING_DIR, 'hello-world.md', articleSchema);
      expect(file.bodyHtml).toContain('<p>');
      expect(file.body.length).toBeGreaterThan(0);
    });

    it('throws when the schema rejects the frontmatter', async () => {
      const strict = articleSchema.extend({ never_present: z.string() });
      await expect(loadMarkdownFile(WRITING_DIR, 'hello-world.md', strict)).rejects.toThrow();
    });
  });

  describe('listMarkdownFiles', () => {
    it('returns only .md files', async () => {
      const files = await listMarkdownFiles(WRITING_DIR);
      expect(files.length).toBeGreaterThan(0);
      for (const f of files) expect(f.endsWith('.md')).toBe(true);
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
