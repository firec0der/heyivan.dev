import path from 'node:path';

import readingTime from 'reading-time';

import { listMarkdownFiles, loadMarkdownFile, sortByDateDesc } from './loader';
import { articleFrontmatter } from './schemas';
import type { Article } from './types';

const ARTICLES_DIR = path.join(process.cwd(), 'content', 'writing');

export function isPublishable(article: Article, now: Date): boolean {
  if (article.draft) return false;
  const today = now.toISOString().slice(0, 10);
  return article.date <= today;
}

export function makeArticleLoaders(dir: string = ARTICLES_DIR) {
  async function loadArticle(filename: string): Promise<Article> {
    const { slug, frontmatter, body, bodyHtml } = await loadMarkdownFile(
      dir,
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

  async function getAllArticles(): Promise<Article[]> {
    const files = await listMarkdownFiles(dir);
    const all = await Promise.all(files.map(loadArticle));
    const now = new Date();
    return sortByDateDesc(all.filter((a) => isPublishable(a, now)));
  }

  async function getArticleBySlug(slug: string): Promise<Article | null> {
    try {
      return await loadArticle(`${slug}.md`);
    } catch {
      return null;
    }
  }

  async function getArticleSlugs(): Promise<string[]> {
    const articles = await getAllArticles();
    return articles.map((a) => a.slug);
  }

  return { getAllArticles, getArticleBySlug, getArticleSlugs };
}

const production = makeArticleLoaders();
export const getAllArticles = production.getAllArticles;
export const getArticleBySlug = production.getArticleBySlug;
export const getArticleSlugs = production.getArticleSlugs;
