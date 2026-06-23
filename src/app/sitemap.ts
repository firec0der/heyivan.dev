import type { MetadataRoute } from 'next';

import { getAllArticles } from '@/lib/content/articles';
import { getAllProjects } from '@/lib/content/projects';
import { localizePath } from '@/lib/i18n/config';

export const dynamic = 'force-static';

const BASE = 'https://heyivan.dev';

// Emit both the English and the /uk URL for a path, each carrying the hreflang pair.
const localize = (path: string, lastModified: Date): MetadataRoute.Sitemap => {
  const languages = {
    en: `${BASE}${path}`,
    uk: `${BASE}${localizePath(path, 'uk')}`,
    'x-default': `${BASE}${path}`
  };
  return [
    { url: languages.en, lastModified, alternates: { languages } },
    { url: languages.uk, lastModified, alternates: { languages } }
  ];
};

const sitemap = async (): Promise<MetadataRoute.Sitemap> => {
  const [articles, projects] = await Promise.all([getAllArticles(), getAllProjects()]);
  const now = new Date();

  const staticRoutes = ['/', '/about', '/work', '/projects', '/writing'].flatMap((path) =>
    localize(path, now)
  );

  const articleRoutes = articles.flatMap((a) => localize(`/writing/${a.slug}`, new Date(a.date)));

  const projectRoutes = projects.flatMap((p) => localize(`/projects/${p.slug}`, new Date(p.date)));

  return [...staticRoutes, ...articleRoutes, ...projectRoutes];
};

export default sitemap;
