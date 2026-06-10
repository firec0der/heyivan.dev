import { promises as fs } from 'node:fs';
import path from 'node:path';

import matter from 'gray-matter';
import yaml from 'js-yaml';
import type { ZodType } from 'zod';

export type LoadedFile<T> = {
  slug: string;
  frontmatter: T;
  body: string;
};

export type LoadedPage<T> = {
  frontmatter: T;
  body: string;
};

export async function loadContentPage<T>(
  filePath: string,
  schema: ZodType<T>
): Promise<LoadedPage<T>> {
  const raw = await fs.readFile(filePath, 'utf-8');
  const { data, content } = matter(raw);
  // gray-matter parses YAML dates as Date objects; coerce to ISO string for Zod.
  if (data.date instanceof Date) {
    data.date = data.date.toISOString().slice(0, 10);
  }
  const frontmatter = schema.parse(data);
  return { frontmatter, body: content };
}

export async function loadContentFile<T>(
  dir: string,
  filename: string,
  schema: ZodType<T>
): Promise<LoadedFile<T>> {
  const slug = filename.replace(/\.mdx$/, '');
  const page = await loadContentPage(path.join(dir, filename), schema);
  return { slug, ...page };
}

export async function loadYamlFile<T>(filePath: string, schema: ZodType<T>): Promise<T> {
  const raw = await fs.readFile(filePath, 'utf-8');
  const parsed = yaml.load(raw);
  return schema.parse(parsed);
}

export async function listContentFiles(dir: string): Promise<string[]> {
  const entries = await fs.readdir(dir);
  return entries.filter((f) => f.endsWith('.mdx'));
}

export function sortByDateDesc<T extends { date: string }>(items: T[]): T[] {
  return [...items].sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0));
}
