import path from 'node:path';

import { listMarkdownFiles, loadMarkdownFile, sortByDateDesc } from './loader';
import { projectFrontmatter } from './schemas';
import type { Project } from './types';

const PROJECTS_DIR = path.join(process.cwd(), 'content', 'projects');

async function loadProject(filename: string): Promise<Project> {
  const { slug, frontmatter, bodyHtml } = await loadMarkdownFile(
    PROJECTS_DIR,
    filename,
    projectFrontmatter
  );
  return {
    slug,
    title: frontmatter.title,
    tagline: frontmatter.tagline,
    date: frontmatter.date,
    status: frontmatter.status,
    hero: frontmatter.hero,
    stack: frontmatter.stack,
    links: frontmatter.links,
    bodyHtml
  };
}

export async function getAllProjects(): Promise<Project[]> {
  const files = await listMarkdownFiles(PROJECTS_DIR);
  const all = await Promise.all(files.map(loadProject));
  return sortByDateDesc(all);
}

export async function getProjectBySlug(slug: string): Promise<Project | null> {
  try {
    return await loadProject(`${slug}.md`);
  } catch {
    return null;
  }
}

export async function getProjectSlugs(): Promise<string[]> {
  const projects = await getAllProjects();
  return projects.map((p) => p.slug);
}
