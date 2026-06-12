import type { MetadataRoute } from 'next';

import { getAllArticles } from '@/lib/content/articles';
import { getAllProjects } from '@/lib/content/projects';

export const dynamic = 'force-static';

const BASE = 'https://heyivan.dev';

const sitemap = async (): Promise<MetadataRoute.Sitemap> => {
  const [articles, projects] = await Promise.all([getAllArticles(), getAllProjects()]);

  const staticRoutes: MetadataRoute.Sitemap = ['', '/about', '/work', '/projects', '/writing'].map(
    (path) => ({
      url: `${BASE}${path}`,
      lastModified: new Date()
    })
  );

  const articleRoutes = articles.map((a) => ({
    url: `${BASE}/writing/${a.slug}`,
    lastModified: new Date(a.date)
  }));

  const projectRoutes = projects.map((p) => ({
    url: `${BASE}/projects/${p.slug}`,
    lastModified: new Date(p.date)
  }));

  return [...staticRoutes, ...articleRoutes, ...projectRoutes];
};

export default sitemap;
