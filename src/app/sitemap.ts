import type { MetadataRoute } from 'next';

import { getAllArticles } from '@/lib/content/articles';
import { getAllProjects } from '@/lib/content/projects';

export const dynamic = 'force-static';

const BASE = 'https://heyivan.dev';

const localize = (path: string, lastModified: Date): MetadataRoute.Sitemap => {
  const suffix = path === '/' ? '' : path;
  const languages = {
    en: `${BASE}/en${suffix}`,
    uk: `${BASE}/uk${suffix}`,
    'x-default': `${BASE}/en${suffix}`
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
