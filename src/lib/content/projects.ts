import path from 'node:path';

import { listContentFiles, loadContentFile, sortByDateDesc } from './loader';
import { projectFrontmatter } from './schemas';
import type { Project } from './types';

const PROJECTS_DIR = path.join(process.cwd(), 'content', 'projects');

export function makeProjectLoaders(dir: string = PROJECTS_DIR) {
  async function loadProject(filename: string): Promise<Project> {
    const { slug, frontmatter, body } = await loadContentFile(dir, filename, projectFrontmatter);
    return {
      slug,
      title: frontmatter.title,
      tagline: frontmatter.tagline,
      date: frontmatter.date,
      status: frontmatter.status,
      coverImage: frontmatter.coverImage,
      stack: frontmatter.stack,
      links: frontmatter.links,
      body
    };
  }

  async function getAllProjects(): Promise<Project[]> {
    const files = await listContentFiles(dir);
    const all = await Promise.all(files.map(loadProject));
    return sortByDateDesc(all);
  }

  async function getProjectBySlug(slug: string): Promise<Project | null> {
    try {
      return await loadProject(`${slug}.mdx`);
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
