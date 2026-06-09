import { promises as fs } from 'node:fs';
import path from 'node:path';

import matter from 'gray-matter';

import { renderMarkdown } from './markdown';
import { projectFrontmatter } from './schemas';
import type { Project } from './types';

const PROJECTS_DIR = path.join(process.cwd(), 'content', 'projects');

async function loadProjectFile(filename: string): Promise<Project> {
  const slug = filename.replace(/\.md$/, '');
  const raw = await fs.readFile(path.join(PROJECTS_DIR, filename), 'utf-8');
  const { data, content } = matter(raw);
  // gray-matter parses YAML dates as Date objects; coerce to ISO string for Zod
  if (data.date instanceof Date) {
    data.date = data.date.toISOString().slice(0, 10);
  }
  const f = projectFrontmatter.parse(data);
  const bodyHtml = await renderMarkdown(content);
  return {
    slug,
    title: f.title,
    tagline: f.tagline,
    date: f.date,
    status: f.status,
    hero: f.hero,
    stack: f.stack,
    links: f.links,
    bodyHtml
  };
}

export async function getAllProjects(): Promise<Project[]> {
  const entries = await fs.readdir(PROJECTS_DIR);
  const files = entries.filter((f) => f.endsWith('.md'));
  const all = await Promise.all(files.map(loadProjectFile));
  return all.sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0));
}

export async function getProjectBySlug(slug: string): Promise<Project | null> {
  try {
    return await loadProjectFile(`${slug}.md`);
  } catch {
    return null;
  }
}

export async function getProjectSlugs(): Promise<string[]> {
  const projects = await getAllProjects();
  return projects.map((p) => p.slug);
}
