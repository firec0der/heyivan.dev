import { afterAll, beforeAll, describe, expect, it } from 'vitest';

import { getAllProjects, getProjectSlugs, makeProjectLoaders } from './projects';
import { cleanupFixtureDir, setupFixtureDir } from './test-utils';

describe('projects (hermetic)', () => {
  let dir: string;
  let loaders: ReturnType<typeof makeProjectLoaders>;

  beforeAll(async () => {
    dir = await setupFixtureDir({
      'alpha.mdx': `---
title: Alpha
tagline: First project.
date: 2025-09-01
status: live
hero: /images/projects/alpha/hero.png
stack: [TypeScript, React]
links:
  live: https://alpha.example.com
  source: https://github.com/example/alpha
---

Alpha project body.
`,
      'beta.mdx': `---
title: Beta
tagline: Second project.
date: 2024-02-10
status: archived
stack: [Go]
links:
  source: https://github.com/example/beta
---

Beta project body.
`
    });
    loaders = makeProjectLoaders(dir);
  });

  afterAll(() => cleanupFixtureDir(dir));

  it('lists projects sorted by date desc', async () => {
    const projects = await loaders.getAllProjects();
    expect(projects.length).toBe(2);
    expect(projects[0]!.slug).toBe('alpha');
    expect(projects[1]!.slug).toBe('beta');
  });

  it('loads a project by slug', async () => {
    const p = await loaders.getProjectBySlug('alpha');
    expect(p?.slug).toBe('alpha');
    expect(p?.title).toBe('Alpha');
    expect(p?.tagline).toBe('First project.');
    expect(p?.status).toBe('live');
    expect(p?.stack).toEqual(['TypeScript', 'React']);
    expect(p?.links.live).toBe('https://alpha.example.com');
    expect(p?.body).toContain('Alpha project body.');
  });

  it('returns null for unknown slug', async () => {
    expect(await loaders.getProjectBySlug('does-not-exist')).toBeNull();
  });

  it('lists slugs matching getAllProjects', async () => {
    const projects = await loaders.getAllProjects();
    const slugs = await loaders.getProjectSlugs();
    expect(slugs).toEqual(projects.map((p) => p.slug));
  });
});

describe('projects (smoke — production content)', () => {
  it('production content loads and parses', async () => {
    const projects = await getAllProjects();
    expect(Array.isArray(projects)).toBe(true);
  });

  it('production content has no slug collisions', async () => {
    const slugs = await getProjectSlugs();
    expect(new Set(slugs).size).toBe(slugs.length);
  });
});
