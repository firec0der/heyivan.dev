import { z } from 'zod';

const YEAR_MIN = 1900;
const YEAR_MAX = 2200;

// Coerce numeric strings to numbers; leave anything else for the schema to reject.
const stringToNumber = (val: unknown): unknown => {
  if (typeof val === 'string') {
    const n = Number(val);
    if (!Number.isNaN(n)) return n;
  }
  return val;
};

// Accepts a number or a numeric string; rejects out-of-range, fractional, or non-numeric input.
export const year = z.preprocess(stringToNumber, z.number().int().min(YEAR_MIN).max(YEAR_MAX));

// Accepts a year or the literal string 'present' (case-insensitive); normalizes to lowercase.
export const yearOrPresent = z.preprocess(
  (val) => {
    if (typeof val === 'string' && val.toLowerCase() === 'present') return 'present';
    return stringToNumber(val);
  },
  z.union([z.number().int().min(YEAR_MIN).max(YEAR_MAX), z.literal('present')])
);

// 'YYYY-MM' month string (month 01–12). YAML parses unquoted YYYY-MM as a
// string, so no numeric coercion is needed.
export const monthYear = z.string().regex(/^\d{4}-(0[1-9]|1[0-2])$/, 'expected YYYY-MM');

// Accepts a 'YYYY-MM' month or the literal 'present' (case-insensitive); normalizes to lowercase.
export const monthYearOrPresent = z.preprocess(
  (val) => (typeof val === 'string' && val.toLowerCase() === 'present' ? 'present' : val),
  z.union([z.string().regex(/^\d{4}-(0[1-9]|1[0-2])$/), z.literal('present')])
);

export const articleFrontmatter = z.object({
  title: z.string().min(1),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  description: z
    .string()
    .nullish()
    .transform((v) => v ?? null),
  draft: z.boolean().default(false)
});

export const projectFrontmatter = z.object({
  title: z.string().min(1),
  tagline: z.string().min(1),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  status: z.enum(['live', 'archived', 'wip']),
  coverImage: z
    .string()
    .nullish()
    .transform((v) => v ?? null),
  stack: z.array(z.string()).default([]),
  links: z
    .object({
      live: z.string().url().optional(),
      appstore: z.string().url().optional(),
      playstore: z.string().url().optional(),
      source: z.string().url().optional()
    })
    .default({})
});

export const workSchema = z.object({
  roles: z.array(
    z.object({
      company: z.string(),
      role: z.string(),
      start: monthYear,
      end: monthYearOrPresent,
      blurb: z.string(),
      description: z.string(),
      skills: z.array(z.string())
    })
  ),
  skills: z.record(z.string(), z.string()),
  education: z.array(
    z.object({
      degree: z.string(),
      institution: z.string(),
      start: year,
      end: year
    })
  ),
  cv_pdf: z.string()
});

export const siteSchema = z.object({
  name: z.string(),
  wordmark: z.string(),
  role: z.string(),
  greeting: z.string(),
  social: z.object({
    github: z.string().url(),
    linkedin: z.string().url(),
    email: z.string().email()
  })
});
