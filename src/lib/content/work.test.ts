import path from 'node:path';

import { afterAll, beforeAll, describe, expect, it } from 'vitest';

import { cleanupFixtureDir, setupFixtureDir } from './test-utils';
import { getWorkData } from './work';

describe('work (hermetic)', () => {
  let dir: string;

  beforeAll(async () => {
    dir = await setupFixtureDir({
      'work.yaml': `roles:
  - company: Test Co.
    role: Engineer
    start: 2020-03
    end: present
    blurb: Built things.
    description: |
      Did engineering work.
    skills: [TypeScript, Go]
skills:
  Backend: Go
  Frontend: TypeScript
education:
  - degree: BSc CS
    institution: University
    start: 2014
    end: 2018
cv_pdf: /cv.pdf
`
    });
  });

  afterAll(() => cleanupFixtureDir(dir));

  it('parses roles, skills, education, cv_pdf', async () => {
    const work = await getWorkData(path.join(dir, 'work.yaml'));
    expect(work.roles).toHaveLength(1);
    expect(work.roles[0]!.company).toBe('Test Co.');
    expect(work.roles[0]!.end).toBe('present');
    expect(work.skills.Backend).toBe('Go');
    expect(work.education).toHaveLength(1);
    expect(work.cv_pdf).toBe('/cv.pdf');
  });
});

describe('work (smoke — production content)', () => {
  it('production work.yaml loads and parses', async () => {
    const work = await getWorkData();
    expect(Array.isArray(work.roles)).toBe(true);
    expect(typeof work.cv_pdf).toBe('string');
  });
});
