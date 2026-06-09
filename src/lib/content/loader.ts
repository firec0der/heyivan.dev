import { promises as fs } from 'node:fs';
import path from 'node:path';

import matter from 'gray-matter';
import type { ZodType } from 'zod';

import { renderMarkdown } from './markdown';

export type LoadedFile<T> = {
  slug: string;
  frontmatter: T;
  body: string;
  bodyHtml: string;
};

export async function loadMarkdownFile<T>(
  dir: string,
  filename: string,
  schema: ZodType<T>
): Promise<LoadedFile<T>> {
  const slug = filename.replace(/\.md$/, '');
  const raw = await fs.readFile(path.join(dir, filename), 'utf-8');
  const { data, content } = matter(raw);
  // gray-matter parses YAML dates as Date objects; coerce to ISO string for Zod
  if (data.date instanceof Date) {
    data.date = data.date.toISOString().slice(0, 10);
  }
  const frontmatter = schema.parse(data);
  const bodyHtml = await renderMarkdown(content);
  return { slug, frontmatter, body: content, bodyHtml };
}

export async function listMarkdownFiles(dir: string): Promise<string[]> {
  const entries = await fs.readdir(dir);
  return entries.filter((f) => f.endsWith('.md'));
}

export function sortByDateDesc<T extends { date: string }>(items: T[]): T[] {
  return [...items].sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0));
}
