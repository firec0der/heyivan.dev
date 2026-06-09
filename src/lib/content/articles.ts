import path from 'node:path';

import readingTime from 'reading-time';

import { listMarkdownFiles, loadMarkdownFile, sortByDateDesc } from './loader';
import { articleFrontmatter } from './schemas';
import type { Article } from './types';

const ARTICLES_DIR = path.join(process.cwd(), 'content', 'writing');

async function loadArticle(filename: string): Promise<Article> {
  const { slug, frontmatter, body, bodyHtml } = await loadMarkdownFile(
    ARTICLES_DIR,
    filename,
    articleFrontmatter
  );
  const stats = readingTime(body);
  return {
    slug,
    title: frontmatter.title,
    date: frontmatter.date,
    description: frontmatter.description,
    draft: frontmatter.draft,
    body,
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
  const files = await listMarkdownFiles(ARTICLES_DIR);
  const all = await Promise.all(files.map(loadArticle));
  const now = new Date();
  return sortByDateDesc(all.filter((a) => isPublishable(a, now)));
}

export async function getArticleBySlug(slug: string): Promise<Article | null> {
  try {
    return await loadArticle(`${slug}.md`);
  } catch {
    return null;
  }
}

export async function getArticleSlugs(): Promise<string[]> {
  const articles = await getAllArticles();
  return articles.map((a) => a.slug);
}
