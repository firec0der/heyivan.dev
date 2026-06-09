import { z } from 'zod';

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
  hero: z
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
      start: z.union([z.number(), z.string()]),
      end: z.union([z.number(), z.string()]),
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
      start: z.number(),
      end: z.number()
    })
  ),
  cv_pdf: z.string()
});

export const siteSchema = z.object({
  name: z.string(),
  wordmark: z.string(),
  role: z.string(),
  hero_greeting: z.string(),
  social: z.object({
    github: z.string().url(),
    linkedin: z.string().url(),
    email: z.string().email()
  })
});

export const aboutFrontmatter = z.object({
  title: z.string()
});
