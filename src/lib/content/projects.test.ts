import { describe, expect, it } from 'vitest';

import { getAllProjects, getProjectBySlug, getProjectSlugs } from './projects';

describe('projects', () => {
  it('lists projects sorted by date desc', async () => {
    const projects = await getAllProjects();
    expect(projects.length).toBeGreaterThan(0);
    for (let i = 1; i < projects.length; i++) {
      expect(projects[i - 1]!.date >= projects[i]!.date).toBe(true);
    }
  });

  it('loads a project by slug', async () => {
    const p = await getProjectBySlug('example-app');
    expect(p?.slug).toBe('example-app');
    expect(p?.title).toBe('Example App');
    expect(p?.tagline.length).toBeGreaterThan(0);
    expect(p?.status).toBe('live');
    expect(p?.stack.length).toBeGreaterThan(0);
    expect(p?.bodyHtml).toContain('<p>');
  });

  it('returns null for unknown slug', async () => {
    expect(await getProjectBySlug('does-not-exist')).toBeNull();
  });

  it('lists slugs matching getAllProjects', async () => {
    const projects = await getAllProjects();
    const slugs = await getProjectSlugs();
    expect(slugs).toEqual(projects.map((p) => p.slug));
  });
});
