import path from 'node:path';

import { loadMarkdownPage } from './loader';
import { aboutFrontmatter } from './schemas';
import type { AboutPage } from './types';

const ABOUT_PATH = path.join(process.cwd(), 'content', 'pages', 'about.md');

export async function getAboutPage(filePath: string = ABOUT_PATH): Promise<AboutPage> {
  const { frontmatter, bodyHtml } = await loadMarkdownPage(filePath, aboutFrontmatter);
  return {
    title: frontmatter.title,
    bodyHtml
  };
}
