import path from 'node:path';

import type { Locale } from '@/lib/i18n/config';

import { loadContentPage, resolveLocalizedFile } from './loader';
import { aboutFrontmatter } from './schemas';

const ABOUT_DIR = path.join(process.cwd(), 'content');

export type AboutContent = { title: string; body: string; fallback: boolean };

export function makeAboutLoader(dir: string = ABOUT_DIR) {
  return async function getAboutContent(locale: Locale = 'en'): Promise<AboutContent> {
    const { filename, fallback } = await resolveLocalizedFile(dir, 'about', locale);
    const { frontmatter, body } = await loadContentPage(path.join(dir, filename), aboutFrontmatter);
    return { title: frontmatter.title, body, fallback };
  };
}

export const getAboutContent = makeAboutLoader();
