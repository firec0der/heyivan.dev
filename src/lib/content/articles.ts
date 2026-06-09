import { promises as fs } from 'node:fs';
import path from 'node:path';

import matter from 'gray-matter';
import readingTime from 'reading-time';

import { renderMarkdown } from './markdown';
import { articleFrontmatter } from './schemas';
import type { Article } from './types';

const ARTICLES_DIR = path.join(process.cwd(), 'content', 'writing');

async function loadArticleFile(filename: string): Promise<Article> {
  const slug = filename.replace(/\.md$/, '');
  const raw = await fs.readFile(path.join(ARTICLES_DIR, filename), 'utf-8');
  const { data, content } = matter(raw);
  // gray-matter parses YAML dates as Date objects; coerce to ISO string for Zod
  if (data.date instanceof Date) {
    data.date = data.date.toISOString().slice(0, 10);
  }
  const frontmatter = articleFrontmatter.parse(data);
  const bodyHtml = await renderMarkdown(content);
  const stats = readingTime(content);
  return {
    slug,
    title: frontmatter.title,
    date: frontmatter.date,
    description: frontmatter.description,
    draft: frontmatter.draft,
    body: content,
    bodyHtml,
    readingTimeMinutes: Math.max(1, Math.ceil(stats.minutes))
  };
}

function isPublishable(article: Article, now: Date): boolean {
  if (article.draft) return false;
  const today = now.toISOString().slice(0, 10);
  return article.date <= today;
}

export async function getAllArticles(): Promise<Article[]> {
  const entries = await fs.readdir(ARTICLES_DIR);
  const files = entries.filter((f) => f.endsWith('.md'));
  const all = await Promise.all(files.map(loadArticleFile));
  const now = new Date();
  return all
    .filter((a) => isPublishable(a, now))
    .sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0));
}

export async function getArticleBySlug(slug: string): Promise<Article | null> {
  try {
    return await loadArticleFile(`${slug}.md`);
  } catch {
    return null;
  }
}

export async function getArticleSlugs(): Promise<string[]> {
  const articles = await getAllArticles();
  return articles.map((a) => a.slug);
}
