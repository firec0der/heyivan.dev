import { promises as fs } from 'node:fs';
import path from 'node:path';

import matter from 'gray-matter';
import yaml from 'js-yaml';
import type { ZodType } from 'zod';

import type { Locale } from '@/lib/i18n/config';

const LOCALE_SUFFIX = /\.[a-z]{2}\.mdx$/; // matches `<slug>.<locale>.mdx`

export type LoadedFile<T> = {
  slug: string;
  frontmatter: T;
  body: string;
};

export type LocalizedFile = { filename: string; fallback: boolean };

async function fileExists(p: string): Promise<boolean> {
  try {
    await fs.access(p);
    return true;
  } catch {
    return false;
  }
}

/** Resolve which file to load for `slug` in `locale`, falling back to the English source. */
export async function resolveLocalizedFile(
  dir: string,
  slug: string,
  locale: Locale
): Promise<LocalizedFile> {
  if (locale === 'en') return { filename: `${slug}.mdx`, fallback: false };
  const localized = `${slug}.${locale}.mdx`;
  if (await fileExists(path.join(dir, localized))) return { filename: localized, fallback: false };
  return { filename: `${slug}.mdx`, fallback: true };
}

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

const isPlainObject = (v: unknown): v is Record<string, unknown> =>
  typeof v === 'object' && v !== null && !Array.isArray(v);

/** Recursively merge `override` onto `base`. Arrays and scalars in `override` replace wholesale. */
function deepMerge(base: unknown, override: unknown): unknown {
  if (!isPlainObject(base) || !isPlainObject(override)) return override ?? base;
  const out: Record<string, unknown> = { ...base };
  for (const [k, v] of Object.entries(override)) out[k] = deepMerge(base[k], v);
  return out;
}

/** Load `<base>.yaml`, deep-merging `<base>.<locale>.yaml` over it when present, then validate. */
export async function loadLocalizedYaml<T>(
  basePath: string,
  locale: Locale,
  schema: ZodType<T>
): Promise<T> {
  const baseRaw = yaml.load(await fs.readFile(basePath, 'utf-8'));
  if (locale === 'en') return schema.parse(baseRaw);
  const localizedPath = basePath.replace(/\.yaml$/, `.${locale}.yaml`);
  if (!(await fileExists(localizedPath))) return schema.parse(baseRaw);
  const overrideRaw = yaml.load(await fs.readFile(localizedPath, 'utf-8'));
  return schema.parse(deepMerge(baseRaw, overrideRaw));
}

export async function listContentFiles(dir: string): Promise<string[]> {
  const entries = await fs.readdir(dir).catch((e: NodeJS.ErrnoException) => {
    if (e.code === 'ENOENT') return [] as string[];
    throw e;
  });
  return entries.filter((f) => f.endsWith('.mdx') && !LOCALE_SUFFIX.test(f));
}

export function sortByDateDesc<T extends { date: string }>(items: T[]): T[] {
  return [...items].sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0));
}
