import path from 'node:path';

import type { Locale } from '@/lib/i18n/config';

import { listContentFiles, loadContentPage, resolveLocalizedFile, sortByDateDesc } from './loader';
import { projectFrontmatter } from './schemas';
import type { Project } from './types';

const PROJECTS_DIR = path.join(process.cwd(), 'content', 'projects');

export function makeProjectLoaders(dir: string = PROJECTS_DIR) {
  async function loadProject(slug: string, locale: Locale): Promise<Project> {
    const { filename, fallback } = await resolveLocalizedFile(dir, slug, locale);
    const { frontmatter, body } = await loadContentPage(
      path.join(dir, filename),
      projectFrontmatter
    );
    return {
      slug,
      title: frontmatter.title,
      tagline: frontmatter.tagline,
      date: frontmatter.date,
      status: frontmatter.status,
      coverImage: frontmatter.coverImage,
      stack: frontmatter.stack,
      links: frontmatter.links,
      body,
      fallback
    };
  }

  async function getAllProjects(locale: Locale = 'en'): Promise<Project[]> {
    const files = await listContentFiles(dir);
    const slugs = files.map((f) => f.replace(/\.mdx$/, ''));
    const all = await Promise.all(slugs.map((s) => loadProject(s, locale)));
    return sortByDateDesc(all);
  }

  async function getProjectBySlug(slug: string, locale: Locale = 'en'): Promise<Project | null> {
    try {
      return await loadProject(slug, locale);
    } catch {
      return null;
    }
  }

  async function getProjectSlugs(): Promise<string[]> {
    const projects = await getAllProjects();
    return projects.map((p) => p.slug);
  }

  return { getAllProjects, getProjectBySlug, getProjectSlugs };
}

const production = makeProjectLoaders();
export const getAllProjects = production.getAllProjects;
export const getProjectBySlug = production.getProjectBySlug;
export const getProjectSlugs = production.getProjectSlugs;
