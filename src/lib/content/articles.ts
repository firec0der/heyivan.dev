import path from 'node:path';

import readingTime from 'reading-time';

import type { Locale } from '@/lib/i18n/config';

import { listContentFiles, loadContentPage, resolveLocalizedFile, sortByDateDesc } from './loader';
import { articleFrontmatter } from './schemas';
import type { Article } from './types';

const ARTICLES_DIR = path.join(process.cwd(), 'content', 'writing');

export function isPublishable(article: Article, now: Date): boolean {
  if (article.draft) return false;
  const today = now.toISOString().slice(0, 10);
  return article.date <= today;
}

export function makeArticleLoaders(dir: string = ARTICLES_DIR) {
  async function loadArticle(slug: string, locale: Locale): Promise<Article> {
    const { filename, fallback } = await resolveLocalizedFile(dir, slug, locale);
    const { frontmatter, body } = await loadContentPage(
      path.join(dir, filename),
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
      readingTimeMinutes: Math.max(1, Math.ceil(stats.minutes)),
      fallback
    };
  }

  async function getAllArticles(locale: Locale = 'en'): Promise<Article[]> {
    const files = await listContentFiles(dir);
    const slugs = files.map((f) => f.replace(/\.mdx$/, ''));
    const all = await Promise.all(slugs.map((s) => loadArticle(s, locale)));
    const now = new Date();
    return sortByDateDesc(all.filter((a) => isPublishable(a, now)));
  }

  async function getArticleBySlug(slug: string, locale: Locale = 'en'): Promise<Article | null> {
    try {
      return await loadArticle(slug, locale);
    } catch {
      return null;
    }
  }

  async function getArticleSlugs(): Promise<string[]> {
    const articles = await getAllArticles();
    return articles.map((a) => a.slug);
  }

  async function getRecentArticles(limit: number, locale: Locale = 'en'): Promise<Article[]> {
    const articles = await getAllArticles(locale);
    return articles.slice(0, limit);
  }

  return { getAllArticles, getArticleBySlug, getArticleSlugs, getRecentArticles };
}

const production = makeArticleLoaders();
export const getAllArticles = production.getAllArticles;
export const getArticleBySlug = production.getArticleBySlug;
export const getArticleSlugs = production.getArticleSlugs;
export const getRecentArticles = production.getRecentArticles;
