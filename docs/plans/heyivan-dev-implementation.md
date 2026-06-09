# heyivan.dev Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the static personal site specified in [`docs/specs/heyivan-dev-design.md`](../specs/heyivan-dev-design.md) — Next.js App Router static export with IBM Plex, cream/warm-minimal aesthetic, light/dark theme, 7 pages, full WCAG AA accessibility — and deploy to Cloudflare Pages at `heyivan.dev`.

**Architecture:** Next.js (App Router) with `output: 'export'` produces a static `out/` directory deployed to Cloudflare Pages. Tailwind generates utility classes backed by CSS custom properties so `data-theme="dark"` on `<html>` flips every token without re-rendering. Markdown content lives under `content/`, parsed at build time through a remark/rehype pipeline (gfm, smartypants, slug, autolink-headings, pretty-code with Shiki). Three small client islands handle interactivity: theme toggle, mobile menu overlay, and per-role disclosure (grid-template-rows trick + `inert`). Everything else is server-rendered with zero JS.

**Tech Stack:**

- Next.js 15 (App Router) + React 19 + TypeScript 5
- Tailwind CSS 4 with CSS-variable token layer
- `next/font/google` for IBM Plex Sans / Serif / Mono (self-hosted at build)
- `gray-matter` for frontmatter, `remark` + `remark-gfm` + `remark-smartypants` + `remark-rehype` + `rehype-slug` + `rehype-autolink-headings` + `rehype-pretty-code` (Shiki) for markdown
- `js-yaml` for structured data (`work.yaml`, `site.yaml`)
- `reading-time` for article reading time
- `zod` for frontmatter validation
- bun for package management (no pnpm — see `feedback_package_manager` in memory)
- ESLint + Prettier with `eslint-plugin-simple-import-sort` and `prettier-plugin-tailwindcss`
- Lefthook for git pre-commit (eslint + prettier on staged files) and pre-push (typecheck)
- Vitest for unit tests
- Cloudflare Pages for hosting

---

## Phase 1 — Project Bootstrap

### Task 1: Initialize repository and Next.js project

**Files:**

- Create: `.gitignore`
- Create: `package.json`
- Create: `tsconfig.json`
- Create: `next.config.mjs`
- Create: `README.md`

- [ ] **Step 1: Create package.json**

```json
{
  "name": "heyivan-dev",
  "version": "0.0.0",
  "private": true,
  "type": "module",
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "typecheck": "tsc --noEmit",
    "lint": "next lint",
    "test": "vitest run",
    "test:watch": "vitest"
  },
  "engines": {
    "node": ">=20.0.0"
  }
}
```

- [ ] **Step 2: Install runtime deps**

Run:

```bash
bun add next@^15 react@^19 react-dom@^19
bun add gray-matter js-yaml reading-time zod
bun add unified remark-parse remark-gfm remark-smartypants remark-rehype rehype-slug rehype-autolink-headings rehype-pretty-code rehype-stringify shiki
```

- [ ] **Step 3: Install dev deps**

Run:

```bash
bun add -d typescript @types/react @types/react-dom @types/node @types/js-yaml
bun add -d tailwindcss@^4 @tailwindcss/postcss postcss
bun add -d eslint@^9 eslint-config-next
bun add -d vitest @vitest/ui
```

(Pin ESLint to v9 — see note on Task 3 for why.)

- [ ] **Step 4: Create tsconfig.json**

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["dom", "dom.iterable", "ES2022"],
    "allowJs": false,
    "skipLibCheck": true,
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "forceConsistentCasingInFileNames": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [{ "name": "next" }],
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules", "out", ".next"]
}
```

- [ ] **Step 5: Create next.config.mjs**

```js
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  trailingSlash: false,
  images: {
    unoptimized: true
  },
  experimental: {}
};

export default nextConfig;
```

- [ ] **Step 6: Create .gitignore**

```
node_modules/
.next/
out/
dist/
.DS_Store
*.log
.env*.local
.vercel
.cache/
.idea/
.vscode/
coverage/
.vitest-cache/
```

- [ ] **Step 7: Create minimal README.md**

```markdown
# heyivan.dev

Personal site for Ivan Stetsenko. Built with Next.js (static export) and deployed to Cloudflare Pages.

- Design spec: [`docs/specs/heyivan-dev-design.md`](docs/specs/heyivan-dev-design.md)
- Implementation plan: [`docs/plans/heyivan-dev-implementation.md`](docs/plans/heyivan-dev-implementation.md)

## Dev
```

bun install
bun dev

```

## Build

```

bun run build # → out/

```

```

- [ ] **Step 8: Init git and first commit**

Run:

```bash
git init
git add .gitignore package.json bun.lock tsconfig.json next.config.mjs README.md
git commit -m "chore: bootstrap Next.js static export project"
```

---

### Task 2: Configure Tailwind 4 with PostCSS

**Files:**

- Create: `postcss.config.mjs`
- Create: `src/app/globals.css` (skeleton — tokens added later)

- [ ] **Step 1: Create postcss.config.mjs**

```js
const config = {
  plugins: {
    '@tailwindcss/postcss': {}
  }
};

export default config;
```

(Named-then-exported form silences `import/no-anonymous-default-export`.)

- [ ] **Step 2: Create src/app/globals.css with Tailwind v4 import**

```css
@import 'tailwindcss';

@theme {
  --font-sans: var(--font-ibm-plex-sans), system-ui, sans-serif;
  --font-serif: var(--font-ibm-plex-serif), Georgia, serif;
  --font-mono: var(--font-ibm-plex-mono), ui-monospace, monospace;
}
```

- [ ] **Step 3: Commit**

```bash
git add postcss.config.mjs src/app/globals.css
git commit -m "chore: wire Tailwind 4 + PostCSS"
```

---

### Task 3: Configure ESLint (flat config)

**Note:** ESLint 9+ removed legacy `.eslintrc.*` support — we use flat config (`eslint.config.mjs`). Pin to ESLint 9 specifically: ESLint 10's rule-context API change is incompatible with the version of `eslint-plugin-react` pulled in by `eslint-config-next@16`. Also: `next lint` is deprecated in Next.js 16; the `lint` script invokes `eslint` directly.

**Files:**

- Create: `eslint.config.mjs`
- Modify: `package.json` — change `"lint"` script to `"eslint ."`

- [ ] **Step 1: Create eslint.config.mjs**

```js
import nextCoreWebVitals from 'eslint-config-next/core-web-vitals';
import nextTypescript from 'eslint-config-next/typescript';

/** @type {import("eslint").Linter.Config[]} */
const config = [
  ...nextCoreWebVitals,
  ...nextTypescript,
  {
    rules: {
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }]
    }
  }
];

export default config;
```

- [ ] **Step 2: Update the lint script in package.json**

Change:

```json
"lint": "next lint",
```

to:

```json
"lint": "eslint .",
```

- [ ] **Step 3: Verify lint runs**

Run: `bun run lint`
Expected: "No ESLint warnings or errors" (or no output / exit 0).

- [ ] **Step 4: Commit**

```bash
git add eslint.config.mjs package.json
git commit -m "chore: add eslint flat config"
```

---

### Task 3a: Prettier + import sorting + Tailwind class sorting

**Files:**

- Create: `.prettierrc.json`
- Create: `.prettierignore`
- Modify: `eslint.config.mjs`
- Modify: `package.json` (add `format` and `format:check` scripts)

- [ ] **Step 1: Install dev deps**

Run:

```bash
bun add -d prettier eslint-config-prettier eslint-plugin-simple-import-sort prettier-plugin-tailwindcss
```

`eslint-config-prettier` disables ESLint rules that conflict with Prettier formatting. `eslint-plugin-simple-import-sort` enforces a deterministic import order. `prettier-plugin-tailwindcss` sorts Tailwind class names inside `className` strings — recommended by the Tailwind team and required for stable diffs.

- [ ] **Step 2: Create .prettierrc.json**

```json
{
  "semi": true,
  "singleQuote": true,
  "trailingComma": "none",
  "printWidth": 100,
  "tabWidth": 2,
  "useTabs": false,
  "bracketSpacing": true,
  "arrowParens": "always",
  "endOfLine": "lf",
  "plugins": ["prettier-plugin-tailwindcss"]
}
```

- [ ] **Step 3: Create .prettierignore**

```
node_modules/
.next/
out/
dist/
coverage/
bun.lock
*.lock
public/
content/
```

(Content is excluded so author-formatted Markdown isn't reflowed.)

- [ ] **Step 4: Update eslint.config.mjs**

Replace the file's contents with:

```js
import nextCoreWebVitals from 'eslint-config-next/core-web-vitals';
import nextTypescript from 'eslint-config-next/typescript';
import simpleImportSort from 'eslint-plugin-simple-import-sort';
import prettierConfig from 'eslint-config-prettier';

/** @type {import("eslint").Linter.Config[]} */
const config = [
  ...nextCoreWebVitals,
  ...nextTypescript,
  {
    plugins: {
      'simple-import-sort': simpleImportSort
    },
    rules: {
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      'simple-import-sort/imports': 'error',
      'simple-import-sort/exports': 'error'
    }
  },
  prettierConfig
];

export default config;
```

Order matters: `prettierConfig` must come last so it overrides conflicting formatting rules from `next/*`.

- [ ] **Step 5: Add format scripts to package.json**

Open `package.json` and add these two scripts inside the existing `"scripts"` block (keep the others as-is):

```json
"format": "prettier --write .",
"format:check": "prettier --check ."
```

- [ ] **Step 6: Verify**

Run:

```bash
bun run format:check
```

Expected: prettier reports the files it would change (or all files already formatted). Either is fine — Task 1 files weren't authored through prettier so a "would change" output is expected.

Then run:

```bash
bun run format
```

Expected: prettier writes the files. Confirm `git diff` shows only whitespace/quote changes.

Run:

```bash
bun run lint
```

Expected: passes (or surfaces only import-sort fixes — re-run with `bunx eslint . --fix` to auto-fix, then verify clean).

- [ ] **Step 7: Commit**

```bash
git add .prettierrc.json .prettierignore eslint.config.mjs package.json bun.lock
git add -u
git commit -m "chore: prettier + import sort + tailwind class sort"
```

---

### Task 3b: Lefthook precommit hook (lint + format on staged files)

**Files:**

- Create: `lefthook.yml`

- [ ] **Step 1: Install lefthook**

Run:

```bash
bun add -d lefthook
```

- [ ] **Step 2: Create lefthook.yml**

```yaml
pre-commit:
  parallel: true
  commands:
    eslint:
      glob: '*.{ts,tsx,js,jsx,mjs,cjs}'
      run: bunx eslint --fix {staged_files}
      stage_fixed: true
    prettier:
      glob: '*.{ts,tsx,js,jsx,mjs,cjs,css,json,md,yml,yaml}'
      run: bunx prettier --write {staged_files}
      stage_fixed: true

pre-push:
  commands:
    typecheck:
      run: bun run typecheck
```

`stage_fixed: true` re-stages any auto-fixed files so the commit captures them. Typecheck runs only on `pre-push` because it's whole-project, not per-file — keeps commits fast.

- [ ] **Step 3: Install the git hooks**

Run:

```bash
bunx lefthook install
```

Expected: lefthook writes `.git/hooks/pre-commit` and `.git/hooks/pre-push`. Output: "SYNCING".

- [ ] **Step 4: Smoke-test the hook**

Run:

```bash
echo "// touch" >> next.config.mjs
git add next.config.mjs
git commit -m "test: lefthook smoke"
```

Expected: lefthook runs eslint + prettier on `next.config.mjs`. If clean, commit succeeds.

Then undo the smoke commit:

```bash
git reset --hard HEAD~1
```

(Safe — the only change was the throwaway smoke commit just made.)

- [ ] **Step 5: Commit lefthook config**

```bash
git add lefthook.yml package.json bun.lock
git commit -m "chore: lefthook precommit (eslint + prettier) and prepush typecheck"
```

---

### Task 4: Configure Vitest

**Files:**

- Create: `.nvmrc` (pin Node 24)
- Create: `vitest.config.ts`
- Modify: `package.json` — bump `engines.node` to `>=24.0.0`

**Note:** Vitest 4.x's `rolldown` dep uses `node:util.styleText`, available in Node 22+. We pin Node 24 (current LTS) via `.nvmrc`.

- [ ] **Step 1: Create `.nvmrc`**

```
24
```

- [ ] **Step 2: Switch to Node 24**

```bash
nvm install 24 && nvm use
node -v   # → v24.x
```

- [ ] **Step 3: Bump engines.node**

In `package.json` change:

```json
"engines": { "node": ">=20.0.0" }
```

to:

```json
"engines": { "node": ">=24.0.0" }
```

- [ ] **Step 4: Create vitest.config.ts**

```ts
import path from 'node:path';

import { defineConfig } from 'vitest/config';

export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(import.meta.dirname, './src')
    }
  },
  test: {
    environment: 'node',
    include: ['src/**/*.test.ts', 'src/**/*.test.tsx'],
    globals: true
  }
});
```

(`import.meta.dirname` is ESM-safe; `__dirname` doesn't exist with `"type": "module"`.)

- [ ] **Step 5: Verify vitest discovers no tests yet**

Run: `bun run test`
Expected: "No test files found" (exit 0 or 1 — fine either way for now).

- [ ] **Step 6: Commit**

```bash
git add .nvmrc vitest.config.ts package.json
git commit -m "chore: add vitest config and pin Node 24"
```

---

## Phase 2 — Design Tokens

### Task 5: CSS variables — light + dark token layer

**Files:**

- Modify: `src/app/globals.css`

- [ ] **Step 1: Replace globals.css with the full token layer**

```css
@import 'tailwindcss';

@theme {
  --font-sans: var(--font-ibm-plex-sans), system-ui, sans-serif;
  --font-serif: var(--font-ibm-plex-serif), Georgia, serif;
  --font-mono: var(--font-ibm-plex-mono), ui-monospace, monospace;

  --color-bg: var(--bg);
  --color-bg-subtle: var(--bg-subtle);
  --color-border: var(--border);
  --color-text: var(--text);
  --color-text-muted: var(--text-muted);
  --color-text-faint: var(--text-faint);
  --color-accent: var(--accent);

  --spacing-4xs: 2px;
  --spacing-3xs: 4px;
  --spacing-2xs: 8px;
  --spacing-xs: 12px;
  --spacing-sm: 16px;
  --spacing-md: 20px;
  --spacing-lg: 24px;
  --spacing-xl: 32px;
  --spacing-2xl: 40px;
  --spacing-3xl: 48px;
  --spacing-4xl: 64px;
  --spacing-5xl: 96px;

  --radius-sm: 4px;
  --radius-md: 8px;
  --radius-full: 9999px;

  --width-content: 640px;
  --width-article: 680px;

  --motion-duration-fast: 100ms;
  --motion-duration-base: 180ms;
  --motion-duration-slow: 300ms;
  --motion-easing-standard: cubic-bezier(0.2, 0, 0, 1);
  --motion-easing-emphasized: cubic-bezier(0.2, 0, 0, 1.2);
}

:root {
  --bg: #faf7f2;
  --bg-subtle: #f2ede5;
  --border: #e8e2d6;
  --text: #1f1b16;
  --text-muted: #6e665a;
  --text-faint: #9d9588;
  --accent: #7a5f2e;
}

html[data-theme='dark'] {
  --bg: #161310;
  --bg-subtle: #1f1b17;
  --border: #2d2820;
  --text: #f2ede5;
  --text-muted: #a89f8e;
  --text-faint: #6e665a;
  --accent: #c9a86a;
}

html,
body {
  background-color: var(--bg);
  color: var(--text);
  font-family: var(--font-sans);
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-rendering: optimizeLegibility;
}

*:focus-visible {
  outline: 2px solid var(--accent);
  outline-offset: 2px;
  border-radius: 2px;
}

::selection {
  background: var(--accent);
  color: var(--bg);
}

@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 1ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 1ms !important;
    scroll-behavior: auto !important;
  }
}
```

- [ ] **Step 2: Commit**

```bash
git add src/app/globals.css
git commit -m "feat(tokens): css variable token layer with light/dark modes"
```

---

### Task 6: Load IBM Plex fonts via next/font

**Files:**

- Create: `src/app/fonts.ts`

- [ ] **Step 1: Create fonts module**

```ts
import { IBM_Plex_Sans, IBM_Plex_Serif, IBM_Plex_Mono } from 'next/font/google';

export const sans = IBM_Plex_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-ibm-plex-sans',
  display: 'swap'
});

export const serif = IBM_Plex_Serif({
  subsets: ['latin'],
  weight: ['400', '600'],
  variable: '--font-ibm-plex-serif',
  display: 'swap'
});

export const mono = IBM_Plex_Mono({
  subsets: ['latin'],
  weight: ['400'],
  variable: '--font-ibm-plex-mono',
  display: 'swap'
});
```

- [ ] **Step 2: Commit**

```bash
git add src/app/fonts.ts
git commit -m "feat(fonts): load IBM Plex Sans/Serif/Mono via next/font"
```

---

## Phase 3 — Content Infrastructure

### Task 7: Content directory + sample data

**Files:**

- Create: `content/data/site.yaml`
- Create: `content/data/work.yaml`
- Create: `content/pages/about.md`
- Create: `content/writing/hello-world.md`
- Create: `content/writing/the-monorepo-trap.md`
- Create: `content/projects/example-app.md`

- [ ] **Step 1: Create content/data/site.yaml**

```yaml
name: Ivan Stetsenko
wordmark: ivan.
role: Software engineer.
hero_greeting: "Hi, I'm Ivan."
social:
  github: https://github.com/firec0der
  linkedin: https://www.linkedin.com/in/ivan-stetsenko/
  email: i.stetsenko1@gmail.com
copyright_year: 2026
```

- [ ] **Step 2: Create content/data/work.yaml**

```yaml
roles:
  - company: Example Co.
    role: Senior Software Engineer
    start: 2024
    end: present
    blurb: Building scaled web platform infrastructure.
    description: |
      Lead engineer on the core platform team. Design and ship the services that
      back the product surface area used by every other team in the company.
    skills: [Go, Python, Postgres, Kubernetes, AWS, gRPC]
  - company: Previous Co.
    role: Software Engineer
    start: 2020
    end: 2024
    blurb: Full-stack feature work across the product surface.
    description: |
      Worked across the stack on the core product. Owned several user-facing
      features end-to-end from design to release.
    skills: [TypeScript, React, Node, Postgres, AWS]
skills:
  Backend: Go, Python, Postgres
  Frontend: TypeScript, React
  Infra: Docker, Kubernetes, AWS
education:
  - degree: MSc Computer Science
    institution: University Name
    start: 2018
    end: 2020
  - degree: BSc Computer Science
    institution: University Name
    start: 2014
    end: 2018
cv_pdf: /cv.pdf
```

- [ ] **Step 3: Create content/pages/about.md**

```markdown
---
title: About
---

I'm a software engineer with a decade of backend and distributed systems
experience. I write about the engineering work I find interesting and the
mistakes I learn from along the way.

I currently live somewhere on the internet. Before that, I lived somewhere
else. The constants have been long-form writing, a serious tea habit, and
trying to leave the codebase better than I found it.

## Now

Building the infrastructure team at my current company, writing more, and
slowly chipping away at a side project that has refused to ship for two
years.

## Elsewhere

You can find me on [GitHub](https://github.com/firec0der), [LinkedIn](https://www.linkedin.com/in/ivan-stetsenko/), or by [email](mailto:i.stetsenko1@gmail.com).
```

- [ ] **Step 4: Create content/writing/hello-world.md**

```markdown
---
title: Hello, world.
date: 2026-01-04
description: The obligatory first post.
draft: false
---

Welcome. This is the first post on this site.

I built the site because I wanted a place to think out loud that wasn't
inside someone else's algorithm. The format is going to be unpolished
notes, longer essays, and the occasional bug post-mortem when something
goes wrong that I want to remember.

If you want to follow along, bookmark it. There's no newsletter.
```

- [ ] **Step 5: Create content/writing/the-monorepo-trap.md**

```markdown
---
title: The monorepo trap, and how an engineering org of forty people walked right into it
date: 2026-03-22
description: Why "just put it all in one repo" stops scaling and what to do instead.
draft: false
---

A monorepo is a single source-controlled tree containing many packages.
The pitch is appealing: shared tooling, atomic cross-cutting changes, and
no version drift between internal libraries.

The reality, once your team passes a certain size, is more nuanced.

## The problem

CI times balloon. Builds that should take ninety seconds take twenty
minutes. Engineers learn to wait, and waiting kills momentum.

## What I'd do differently

Start with separate repos. Move to a monorepo when the cross-cutting
change overhead becomes the dominant cost, not before.
```

- [ ] **Step 6: Create content/projects/example-app.md**

```markdown
---
title: Example App
tagline: A native mobile app for tracking long-running side projects.
date: 2024-03-15
status: live
hero: /images/projects/example-app/hero.png
stack: [React Native, TypeScript, Postgres, Supabase]
links:
  live: https://example-app.com
  appstore: https://apps.apple.com/app/example-app/id000
  source: https://github.com/firec0der/example-app
---

A small native app for keeping track of side projects that never seem to
finish. Built over a few weekends as an exercise in shipping something
small and complete.

The interesting part of building this was the sync engine — I needed
offline-first behaviour with real-time updates when online. I ended up
using a CRDT-based approach.

## What I learned

Shipping a real native app, even a small one, exposes you to a lot of
operational concerns you don't deal with in web work: app review,
provisioning, crash reporting, ratings prompts. None of it was hard,
but all of it was new.
```

- [ ] **Step 7: Commit**

```bash
git add content/
git commit -m "feat(content): scaffold sample content and site data"
```

---

### Task 8: Content types

**Files:**

- Create: `src/lib/content/types.ts`

- [ ] **Step 1: Create types**

```ts
export type Article = {
  slug: string;
  title: string;
  date: string;
  description: string | null;
  draft: boolean;
  body: string;
  bodyHtml: string;
  readingTimeMinutes: number;
};

export type Project = {
  slug: string;
  title: string;
  tagline: string;
  date: string;
  status: 'live' | 'archived' | 'wip';
  hero: string | null;
  stack: string[];
  links: {
    live?: string;
    appstore?: string;
    playstore?: string;
    source?: string;
  };
  bodyHtml: string;
};

export type Role = {
  company: string;
  role: string;
  start: number | string;
  end: number | string;
  blurb: string;
  description: string;
  skills: string[];
};

export type Education = {
  degree: string;
  institution: string;
  start: number;
  end: number;
};

export type WorkData = {
  roles: Role[];
  skills: Record<string, string>;
  education: Education[];
  cv_pdf: string;
};

export type SiteData = {
  name: string;
  wordmark: string;
  role: string;
  hero_greeting: string;
  social: {
    github: string;
    linkedin: string;
    email: string;
  };
  copyright_year: number;
};

export type AboutPage = {
  title: string;
  bodyHtml: string;
};
```

- [ ] **Step 2: Commit**

```bash
git add src/lib/content/types.ts
git commit -m "feat(content): content type definitions"
```

---

### Task 9: Frontmatter validation schemas

**Files:**

- Create: `src/lib/content/schemas.ts`

- [ ] **Step 1: Create zod schemas**

```ts
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
  }),
  copyright_year: z.number()
});

export const aboutFrontmatter = z.object({
  title: z.string()
});
```

- [ ] **Step 2: Commit**

```bash
git add src/lib/content/schemas.ts
git commit -m "feat(content): zod schemas for frontmatter validation"
```

---

### Task 10: Markdown rendering pipeline

**Files:**

- Create: `src/lib/content/markdown.ts`
- Create: `src/lib/content/markdown.test.ts`

- [ ] **Step 1: Write failing test**

````ts
import { describe, it, expect } from 'vitest';
import { renderMarkdown } from './markdown';

describe('renderMarkdown', () => {
  it('renders basic paragraphs', async () => {
    const html = await renderMarkdown('Hello, world.');
    expect(html).toContain('<p>Hello, world.</p>');
  });

  it('renders headings with id slugs', async () => {
    const html = await renderMarkdown('## Now\n\nbody');
    expect(html).toContain('<h2 id="now">');
  });

  it('applies smart typography', async () => {
    const html = await renderMarkdown(`It's "fine"`);
    expect(html).toMatch(/[‘’]/);
    expect(html).toMatch(/[“”]/);
  });

  it('highlights fenced code blocks', async () => {
    const html = await renderMarkdown('```js\nconst x = 1;\n```');
    expect(html).toContain('data-language="js"');
  });
});
````

- [ ] **Step 2: Run test, expect fail**

Run: `bun run test src/lib/content/markdown.test.ts`
Expected: FAIL — module not found.

- [ ] **Step 3: Implement markdown pipeline**

```ts
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkGfm from 'remark-gfm';
import remarkSmartypants from 'remark-smartypants';
import remarkRehype from 'remark-rehype';
import rehypeSlug from 'rehype-slug';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import rehypePrettyCode from 'rehype-pretty-code';
import rehypeStringify from 'rehype-stringify';

const processor = unified()
  .use(remarkParse)
  .use(remarkGfm)
  .use(remarkSmartypants)
  .use(remarkRehype, { allowDangerousHtml: false })
  .use(rehypeSlug)
  .use(rehypeAutolinkHeadings, {
    behavior: 'wrap',
    properties: { className: ['heading-anchor'] }
  })
  .use(rehypePrettyCode, {
    theme: { light: 'github-light', dark: 'github-dark' },
    keepBackground: false
  })
  .use(rehypeStringify);

export async function renderMarkdown(source: string): Promise<string> {
  const file = await processor.process(source);
  return String(file);
}
```

- [ ] **Step 4: Run test, expect pass**

Run: `bun run test src/lib/content/markdown.test.ts`
Expected: all 4 tests PASS.

- [ ] **Step 5: Commit**

```bash
git add src/lib/content/markdown.ts src/lib/content/markdown.test.ts
git commit -m "feat(content): markdown pipeline with smartypants, slugs, shiki"
```

---

### Task 11: Article loader

**Files:**

- Create: `src/lib/content/articles.ts`
- Create: `src/lib/content/articles.test.ts`

- [ ] **Step 1: Write failing test**

```ts
import { describe, it, expect } from 'vitest';
import { getAllArticles, getArticleBySlug } from './articles';

describe('articles', () => {
  it('lists non-draft non-future articles sorted by date desc', async () => {
    const articles = await getAllArticles();
    expect(articles.length).toBeGreaterThan(0);
    for (let i = 1; i < articles.length; i++) {
      expect(articles[i - 1].date >= articles[i].date).toBe(true);
    }
  });

  it('loads an article by slug', async () => {
    const a = await getArticleBySlug('hello-world');
    expect(a?.title).toBe('Hello, world.');
    expect(a?.slug).toBe('hello-world');
    expect(a?.bodyHtml).toContain('<p>');
    expect(a?.readingTimeMinutes).toBeGreaterThanOrEqual(1);
  });

  it('returns null for unknown slug', async () => {
    expect(await getArticleBySlug('does-not-exist')).toBeNull();
  });
});
```

- [ ] **Step 2: Run test, expect fail**

Run: `bun run test src/lib/content/articles.test.ts`
Expected: FAIL — module not found.

- [ ] **Step 3: Implement loader**

```ts
import { promises as fs } from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';
import readingTime from 'reading-time';
import { articleFrontmatter } from './schemas';
import { renderMarkdown } from './markdown';
import type { Article } from './types';

const ARTICLES_DIR = path.join(process.cwd(), 'content', 'writing');

async function loadArticleFile(filename: string): Promise<Article> {
  const slug = filename.replace(/\.md$/, '');
  const raw = await fs.readFile(path.join(ARTICLES_DIR, filename), 'utf-8');
  const { data, content } = matter(raw);
  const frontmatter = articleFrontmatter.parse(data);
  const bodyHtml = await renderMarkdown(content);
  const stats = readingTime(content);
  return {
    slug,
    title: frontmatter.title,
    date: frontmatter.date,
    description: frontmatter.description,
    draft: frontmatter.draft,
    body: content,
    bodyHtml,
    readingTimeMinutes: Math.max(1, Math.ceil(stats.minutes))
  };
}

function isPublishable(article: Article, now: Date): boolean {
  if (article.draft) return false;
  const today = now.toISOString().slice(0, 10);
  return article.date <= today;
}

export async function getAllArticles(): Promise<Article[]> {
  const entries = await fs.readdir(ARTICLES_DIR);
  const files = entries.filter((f) => f.endsWith('.md'));
  const all = await Promise.all(files.map(loadArticleFile));
  const now = new Date();
  return all
    .filter((a) => isPublishable(a, now))
    .sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0));
}

export async function getArticleBySlug(slug: string): Promise<Article | null> {
  try {
    return await loadArticleFile(`${slug}.md`);
  } catch {
    return null;
  }
}

export async function getArticleSlugs(): Promise<string[]> {
  const articles = await getAllArticles();
  return articles.map((a) => a.slug);
}
```

- [ ] **Step 4: Run test, expect pass**

Run: `bun run test src/lib/content/articles.test.ts`
Expected: all 3 tests PASS.

- [ ] **Step 5: Commit**

```bash
git add src/lib/content/articles.ts src/lib/content/articles.test.ts
git commit -m "feat(content): article loader with draft + future-date filtering"
```

---

### Task 12: Project loader

**Files:**

- Create: `src/lib/content/projects.ts`

- [ ] **Step 1: Implement loader**

```ts
import { promises as fs } from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';
import { projectFrontmatter } from './schemas';
import { renderMarkdown } from './markdown';
import type { Project } from './types';

const PROJECTS_DIR = path.join(process.cwd(), 'content', 'projects');

async function loadProjectFile(filename: string): Promise<Project> {
  const slug = filename.replace(/\.md$/, '');
  const raw = await fs.readFile(path.join(PROJECTS_DIR, filename), 'utf-8');
  const { data, content } = matter(raw);
  const f = projectFrontmatter.parse(data);
  const bodyHtml = await renderMarkdown(content);
  return {
    slug,
    title: f.title,
    tagline: f.tagline,
    date: f.date,
    status: f.status,
    hero: f.hero,
    stack: f.stack,
    links: f.links,
    bodyHtml
  };
}

export async function getAllProjects(): Promise<Project[]> {
  const entries = await fs.readdir(PROJECTS_DIR);
  const files = entries.filter((f) => f.endsWith('.md'));
  const all = await Promise.all(files.map(loadProjectFile));
  return all.sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0));
}

export async function getProjectBySlug(slug: string): Promise<Project | null> {
  try {
    return await loadProjectFile(`${slug}.md`);
  } catch {
    return null;
  }
}

export async function getProjectSlugs(): Promise<string[]> {
  const projects = await getAllProjects();
  return projects.map((p) => p.slug);
}
```

- [ ] **Step 2: Commit**

```bash
git add src/lib/content/projects.ts
git commit -m "feat(content): project loader"
```

---

### Task 13: Work, site, about loaders

**Files:**

- Create: `src/lib/content/work.ts`
- Create: `src/lib/content/site.ts`
- Create: `src/lib/content/about.ts`

- [ ] **Step 1: Create work loader**

```ts
import { promises as fs } from 'node:fs';
import path from 'node:path';
import yaml from 'js-yaml';
import { workSchema } from './schemas';
import type { WorkData } from './types';

const WORK_PATH = path.join(process.cwd(), 'content', 'data', 'work.yaml');

export async function getWorkData(): Promise<WorkData> {
  const raw = await fs.readFile(WORK_PATH, 'utf-8');
  const parsed = yaml.load(raw);
  return workSchema.parse(parsed);
}
```

- [ ] **Step 2: Create site loader**

```ts
import { promises as fs } from 'node:fs';
import path from 'node:path';
import yaml from 'js-yaml';
import { siteSchema } from './schemas';
import type { SiteData } from './types';

const SITE_PATH = path.join(process.cwd(), 'content', 'data', 'site.yaml');

export async function getSiteData(): Promise<SiteData> {
  const raw = await fs.readFile(SITE_PATH, 'utf-8');
  const parsed = yaml.load(raw);
  return siteSchema.parse(parsed);
}
```

- [ ] **Step 3: Create about loader**

```ts
import { promises as fs } from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';
import { aboutFrontmatter } from './schemas';
import { renderMarkdown } from './markdown';
import type { AboutPage } from './types';

const ABOUT_PATH = path.join(process.cwd(), 'content', 'pages', 'about.md');

export async function getAboutPage(): Promise<AboutPage> {
  const raw = await fs.readFile(ABOUT_PATH, 'utf-8');
  const { data, content } = matter(raw);
  const f = aboutFrontmatter.parse(data);
  return {
    title: f.title,
    bodyHtml: await renderMarkdown(content)
  };
}
```

- [ ] **Step 4: Commit**

```bash
git add src/lib/content/work.ts src/lib/content/site.ts src/lib/content/about.ts
git commit -m "feat(content): site/work/about YAML and markdown loaders"
```

---

### Task 14: Date formatters

**Files:**

- Create: `src/lib/format.ts`
- Create: `src/lib/format.test.ts`

- [ ] **Step 1: Write test**

```ts
import { describe, it, expect } from 'vitest';
import { formatArticleDate, formatYearRange } from './format';

describe('format', () => {
  it('formats an ISO article date as YYYY-MM-DD', () => {
    expect(formatArticleDate('2026-03-22')).toBe('2026-03-22');
  });

  it('extracts year from ISO date', () => {
    expect(formatArticleDate('2026-03-22').slice(0, 4)).toBe('2026');
  });

  it('renders year range with present', () => {
    expect(formatYearRange(2024, 'present')).toBe('2024 — Present');
  });

  it('renders numeric year range', () => {
    expect(formatYearRange(2020, 2024)).toBe('2020 — 2024');
  });
});
```

- [ ] **Step 2: Implement**

```ts
export function formatArticleDate(isoDate: string): string {
  return isoDate;
}

export function formatYearRange(start: number | string, end: number | string): string {
  const endLabel =
    typeof end === 'string' && end.toLowerCase() === 'present' ? 'Present' : String(end);
  return `${start} — ${endLabel}`;
}

export function groupByYear<T extends { date: string }>(items: T[]): Map<string, T[]> {
  const map = new Map<string, T[]>();
  for (const item of items) {
    const year = item.date.slice(0, 4);
    const list = map.get(year) ?? [];
    list.push(item);
    map.set(year, list);
  }
  return map;
}
```

- [ ] **Step 3: Run test, expect pass**

Run: `bun run test src/lib/format.test.ts`
Expected: all 4 tests PASS.

- [ ] **Step 4: Commit**

```bash
git add src/lib/format.ts src/lib/format.test.ts
git commit -m "feat(format): date and year-range helpers"
```

---

## Phase 4 — Theme System

### Task 15: No-flash theme initializer script

**Files:**

- Create: `src/lib/theme/init-script.ts`

- [ ] **Step 1: Create the inline script string**

```ts
export const THEME_INIT_SCRIPT = `
(function() {
  try {
    var stored = localStorage.getItem('theme');
    var systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    var dark = stored ? stored === 'dark' : systemDark;
    if (dark) document.documentElement.setAttribute('data-theme', 'dark');
  } catch (e) {}
})();
`.trim();
```

- [ ] **Step 2: Commit**

```bash
git add src/lib/theme/init-script.ts
git commit -m "feat(theme): inline first-paint theme initializer"
```

---

### Task 16: useTheme hook

**Files:**

- Create: `src/lib/theme/use-theme.ts`

- [ ] **Step 1: Implement hook**

```ts
'use client';

import { useEffect, useState, useCallback } from 'react';

export type Theme = 'light' | 'dark';

function readCurrentTheme(): Theme {
  if (typeof document === 'undefined') return 'light';
  return document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
}

export function useTheme(): {
  theme: Theme;
  toggle: () => void;
  setTheme: (t: Theme) => void;
} {
  const [theme, setThemeState] = useState<Theme>('light');

  useEffect(() => {
    setThemeState(readCurrentTheme());
  }, []);

  const setTheme = useCallback((next: Theme) => {
    if (next === 'dark') {
      document.documentElement.setAttribute('data-theme', 'dark');
    } else {
      document.documentElement.removeAttribute('data-theme');
    }
    try {
      localStorage.setItem('theme', next);
    } catch {
      // localStorage unavailable; theme persists for session only.
    }
    setThemeState(next);
  }, []);

  const toggle = useCallback(() => {
    setTheme(readCurrentTheme() === 'dark' ? 'light' : 'dark');
  }, [setTheme]);

  return { theme, toggle, setTheme };
}
```

- [ ] **Step 2: Commit**

```bash
git add src/lib/theme/use-theme.ts
git commit -m "feat(theme): useTheme hook"
```

---

## Phase 5 — Atom Components

### Task 17: StatusPill

**Files:**

- Create: `src/components/StatusPill.tsx`

- [ ] **Step 1: Create component**

```tsx
type Status = 'live' | 'archived' | 'wip';

const LABEL: Record<Status, string> = {
  live: 'Live',
  archived: 'Archived',
  wip: 'WIP'
};

export function StatusPill({ status }: { status: Status }) {
  return (
    <span
      aria-label={`Status: ${LABEL[status]}`}
      className="inline-flex items-center rounded-full border border-[color:var(--color-border)] px-2 py-0.5 text-[10px] font-medium tracking-[1px] text-[color:var(--color-text-muted)] uppercase"
    >
      {LABEL[status]}
    </span>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/StatusPill.tsx
git commit -m "feat(ui): StatusPill atom"
```

---

### Task 18: SectionLabel

**Files:**

- Create: `src/components/SectionLabel.tsx`

- [ ] **Step 1: Create component**

```tsx
export function SectionLabel({
  children,
  as: As = 'h2'
}: {
  children: React.ReactNode;
  as?: 'h2' | 'h3' | 'div';
}) {
  return (
    <div className="flex items-center gap-3 pt-10 pb-4">
      <span className="h-px flex-1 bg-[color:var(--color-border)]" aria-hidden="true" />
      <As className="text-[12px] font-medium tracking-[1.2px] text-[color:var(--color-text-muted)] uppercase">
        {children}
      </As>
      <span className="h-px flex-1 bg-[color:var(--color-border)]" aria-hidden="true" />
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/SectionLabel.tsx
git commit -m "feat(ui): SectionLabel atom"
```

---

### Task 19: LinkArrow

**Files:**

- Create: `src/components/LinkArrow.tsx`

- [ ] **Step 1: Create component**

```tsx
import Link from 'next/link';

type Props = {
  href: string;
  direction?: 'forward' | 'back';
  external?: boolean;
  children: React.ReactNode;
  className?: string;
};

export function LinkArrow({
  href,
  direction = 'forward',
  external = false,
  children,
  className
}: Props) {
  const arrow = direction === 'back' ? '← ' : null;
  const arrowAfter = direction === 'forward' ? ' →' : null;

  const content = (
    <>
      {arrow}
      {children}
      {arrowAfter}
    </>
  );

  const classes =
    `inline-flex items-center gap-1 text-[color:var(--color-accent)] hover:underline underline-offset-2 ${className ?? ''}`.trim();

  if (external) {
    return (
      <a href={href} className={classes} rel="noopener noreferrer">
        {content}
      </a>
    );
  }
  return (
    <Link href={href as any} className={classes}>
      {content}
    </Link>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/LinkArrow.tsx
git commit -m "feat(ui): LinkArrow with forward/back direction"
```

---

### Task 20: Avatar

**Files:**

- Create: `src/components/Avatar.tsx`

- [ ] **Step 1: Create component**

```tsx
type Props = {
  src: string;
  alt: string;
  size: 96 | 120;
};

export function Avatar({ src, alt, size }: Props) {
  return (
    <img
      src={src}
      alt={alt}
      width={size}
      height={size}
      className="rounded-full object-cover"
      style={{ width: size, height: size }}
    />
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/Avatar.tsx
git commit -m "feat(ui): Avatar atom"
```

---

### Task 21: PageHeader

**Files:**

- Create: `src/components/PageHeader.tsx`

- [ ] **Step 1: Create component**

```tsx
export function PageHeader({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <header className="pt-2 pb-8">
      <h1 className="text-[28px] leading-[130%] font-semibold tracking-tight md:text-[28px]">
        {title}
      </h1>
      {subtitle ? (
        <p className="mt-2 text-[16px] leading-[160%] text-[color:var(--color-text-muted)]">
          {subtitle}
        </p>
      ) : null}
    </header>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/PageHeader.tsx
git commit -m "feat(ui): PageHeader atom"
```

---

## Phase 6 — Layout Chrome

### Task 22: SkipLink

**Files:**

- Create: `src/components/SkipLink.tsx`

- [ ] **Step 1: Create component**

```tsx
export function SkipLink() {
  return (
    <a
      href="#main"
      className="absolute top-2 left-2 z-50 -translate-y-[200%] rounded bg-[color:var(--color-bg)] px-3 py-2 text-sm text-[color:var(--color-accent)] underline focus-visible:translate-y-0"
    >
      Skip to content
    </a>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/SkipLink.tsx
git commit -m "feat(a11y): SkipLink — first focusable, jumps to <main>"
```

---

### Task 23: ThemeToggle

**Files:**

- Create: `src/components/ThemeToggle.tsx`

- [ ] **Step 1: Create component**

```tsx
'use client';

import { useTheme } from '@/lib/theme/use-theme';

export function ThemeToggle() {
  const { theme, toggle } = useTheme();
  const isDark = theme === 'dark';
  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      className="inline-flex h-9 w-9 items-center justify-center rounded-full text-[22px] text-[color:var(--color-text-muted)] transition-colors hover:text-[color:var(--color-text)]"
    >
      <span aria-hidden="true">{isDark ? '☼' : '☽'}</span>
    </button>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/ThemeToggle.tsx
git commit -m "feat(theme): ThemeToggle button with sun/moon glyph"
```

---

### Task 24: Nav (desktop + mobile combined)

**Files:**

- Create: `src/components/Nav.tsx`
- Create: `src/components/MobileMenuOverlay.tsx`

- [ ] **Step 1: Create MobileMenuOverlay**

```tsx
'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { ThemeToggle } from './ThemeToggle';

const LINKS = [
  { href: '/about', label: 'about' },
  { href: '/work', label: 'work' },
  { href: '/projects', label: 'projects' },
  { href: '/writing', label: 'writing' }
] as const;

type Props = {
  open: boolean;
  onClose: () => void;
  activePath: string;
};

export function MobileMenuOverlay({ open, onClose, activePath }: Props) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Site navigation"
      className="fixed inset-0 z-40 flex flex-col bg-[color:var(--color-bg)] px-6 pt-6"
    >
      <div className="flex items-center justify-between">
        <span className="text-[16px] font-medium">ivan.</span>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close menu"
          className="inline-flex h-9 w-9 items-center justify-center text-[22px] text-[color:var(--color-text-muted)]"
        >
          ×
        </button>
      </div>
      <nav aria-label="Primary" className="mt-12 flex flex-col gap-6">
        {LINKS.map(({ href, label }) => {
          const active = activePath === href || activePath.startsWith(href + '/');
          return (
            <Link
              key={href}
              href={href}
              onClick={onClose}
              aria-current={active ? 'page' : undefined}
              className={`text-[28px] font-medium ${
                active ? 'text-[color:var(--color-text)]' : 'text-[color:var(--color-text-muted)]'
              }`}
            >
              {label}
            </Link>
          );
        })}
      </nav>
      <div className="mt-12 flex items-center justify-between border-t border-[color:var(--color-border)] pt-6">
        <span className="text-[14px] text-[color:var(--color-text-muted)]">Theme</span>
        <ThemeToggle />
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Create Nav**

```tsx
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ThemeToggle } from './ThemeToggle';
import { MobileMenuOverlay } from './MobileMenuOverlay';

const LINKS = [
  { href: '/about', label: 'about' },
  { href: '/work', label: 'work' },
  { href: '/projects', label: 'projects' },
  { href: '/writing', label: 'writing' }
] as const;

export function Nav() {
  const pathname = usePathname() ?? '/';
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="border-b border-[color:var(--color-border)]">
      <div className="mx-auto flex w-full max-w-[1440px] items-center justify-between px-6 py-5 md:px-16">
        <Link href="/" className="text-[16px] font-medium text-[color:var(--color-text)]">
          ivan.
        </Link>

        <nav aria-label="Primary" className="hidden items-center gap-8 md:flex">
          {LINKS.map(({ href, label }) => {
            const active = pathname === href || pathname.startsWith(href + '/');
            return (
              <Link
                key={href}
                href={href}
                aria-current={active ? 'page' : undefined}
                className={`text-[14px] transition-colors ${
                  active
                    ? 'text-[color:var(--color-text)]'
                    : 'text-[color:var(--color-text-faint)] hover:text-[color:var(--color-text-muted)]'
                }`}
              >
                {label}
              </Link>
            );
          })}
          <ThemeToggle />
        </nav>

        <div className="flex items-center gap-2 md:hidden">
          <ThemeToggle />
          <button
            type="button"
            onClick={() => setMenuOpen(true)}
            aria-label="Open menu"
            aria-expanded={menuOpen}
            className="inline-flex h-9 w-9 items-center justify-center text-[22px] text-[color:var(--color-text-muted)]"
          >
            ☰
          </button>
        </div>
      </div>

      <MobileMenuOverlay open={menuOpen} onClose={() => setMenuOpen(false)} activePath={pathname} />
    </header>
  );
}
```

- [ ] **Step 3: Commit**

```bash
git add src/components/Nav.tsx src/components/MobileMenuOverlay.tsx
git commit -m "feat(chrome): Nav with mobile menu overlay"
```

---

### Task 25: Footer

**Files:**

- Create: `src/components/Footer.tsx`

- [ ] **Step 1: Create component**

```tsx
import type { SiteData } from '@/lib/content/types';

export function Footer({ site }: { site: SiteData }) {
  return (
    <footer className="mt-24 border-t border-[color:var(--color-border)]">
      <div className="mx-auto flex w-full max-w-[1440px] flex-col items-start gap-3 px-6 py-8 text-[12px] text-[color:var(--color-text-muted)] md:flex-row md:items-center md:justify-between md:px-16">
        <div className="flex flex-wrap items-center gap-4">
          <a
            href={site.social.github}
            rel="noopener noreferrer"
            className="hover:text-[color:var(--color-text)]"
          >
            github
          </a>
          <span aria-hidden="true">·</span>
          <a
            href={site.social.linkedin}
            rel="noopener noreferrer"
            className="hover:text-[color:var(--color-text)]"
          >
            linkedin
          </a>
          <span aria-hidden="true">·</span>
          <a href={`mailto:${site.social.email}`} className="hover:text-[color:var(--color-text)]">
            email
          </a>
        </div>
        <div>© {site.copyright_year}</div>
      </div>
    </footer>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/Footer.tsx
git commit -m "feat(chrome): Footer with social links and copyright"
```

---

### Task 26: Root layout

**Files:**

- Create: `src/app/layout.tsx`
- Create: `src/components/Container.tsx`

- [ ] **Step 1: Create Container**

```tsx
type Props = {
  children: React.ReactNode;
  width?: 'content' | 'article';
  className?: string;
};

export function Container({ children, width = 'content', className }: Props) {
  const max = width === 'article' ? 'max-w-[680px]' : 'max-w-[640px]';
  return (
    <div className={`mx-auto w-full ${max} px-6 md:px-0 ${className ?? ''}`.trim()}>{children}</div>
  );
}
```

- [ ] **Step 2: Create root layout**

```tsx
import type { Metadata } from 'next';
import { sans, serif, mono } from './fonts';
import { THEME_INIT_SCRIPT } from '@/lib/theme/init-script';
import { Nav } from '@/components/Nav';
import { Footer } from '@/components/Footer';
import { SkipLink } from '@/components/SkipLink';
import { getSiteData } from '@/lib/content/site';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL('https://heyivan.dev'),
  title: {
    default: 'Ivan Stetsenko',
    template: '%s · Ivan Stetsenko'
  },
  description: 'Personal site of Ivan Stetsenko — software engineer.',
  openGraph: {
    type: 'website',
    siteName: 'Ivan Stetsenko',
    images: ['/images/og-default.png']
  },
  twitter: { card: 'summary_large_image' }
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const site = await getSiteData();
  return (
    <html
      lang="en"
      className={`${sans.variable} ${serif.variable} ${mono.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
      </head>
      <body className="flex min-h-screen flex-col">
        <SkipLink />
        <Nav />
        <main id="main" className="flex-1 pt-10 md:pt-16">
          {children}
        </main>
        <Footer site={site} />
      </body>
    </html>
  );
}
```

- [ ] **Step 3: Verify build**

Run: `bun run typecheck`
Expected: passes (or shows missing route — fine; next task adds the home page).

- [ ] **Step 4: Commit**

```bash
git add src/app/layout.tsx src/components/Container.tsx
git commit -m "feat(layout): root layout, container, no-flash theme bootstrap"
```

---

## Phase 7 — Content Components

### Task 27: WritingListItem

**Files:**

- Create: `src/components/WritingListItem.tsx`

- [ ] **Step 1: Create component**

```tsx
import Link from 'next/link';
import { formatArticleDate } from '@/lib/format';

type Props = {
  slug: string;
  title: string;
  date: string;
};

export function WritingListItem({ slug, title, date }: Props) {
  return (
    <li className="border-b border-[color:var(--color-border)] last:border-b-0">
      <Link
        href={`/writing/${slug}` as any}
        className="block py-4 transition-colors hover:bg-[color:var(--color-bg-subtle)]"
      >
        <article>
          <div className="flex flex-col gap-1 md:flex-row md:items-baseline md:gap-6">
            <time
              dateTime={date}
              className="shrink-0 text-[13px] text-[color:var(--color-text-faint)]"
              style={{ fontFamily: 'var(--font-mono)' }}
            >
              {formatArticleDate(date)}
            </time>
            <span className="min-w-0 flex-1 text-[16px] leading-[160%] text-[color:var(--color-text)]">
              {title}
            </span>
          </div>
        </article>
      </Link>
    </li>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/WritingListItem.tsx
git commit -m "feat(ui): WritingListItem — mono date + title, wraps on overflow"
```

---

### Task 28: EducationRow

**Files:**

- Create: `src/components/EducationRow.tsx`

- [ ] **Step 1: Create component**

```tsx
import { formatYearRange } from '@/lib/format';

type Props = {
  start: number;
  end: number;
  degree: string;
  institution: string;
};

export function EducationRow({ start, end, degree, institution }: Props) {
  return (
    <li className="flex flex-col gap-1 border-b border-[color:var(--color-border)] py-4 last:border-b-0 md:flex-row md:items-baseline md:gap-6">
      <span
        className="shrink-0 text-[13px] text-[color:var(--color-text-faint)]"
        style={{ fontFamily: 'var(--font-mono)' }}
      >
        {formatYearRange(start, end)}
      </span>
      <span className="min-w-0 flex-1 text-[16px]">
        {degree}, <span className="text-[color:var(--color-text-muted)]">{institution}</span>
      </span>
    </li>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/EducationRow.tsx
git commit -m "feat(ui): EducationRow"
```

---

### Task 29: ProjectCard

**Files:**

- Create: `src/components/ProjectCard.tsx`

- [ ] **Step 1: Create component**

```tsx
import Link from 'next/link';
import { StatusPill } from './StatusPill';
import type { Project } from '@/lib/content/types';

export function ProjectCard({ project }: { project: Project }) {
  return (
    <li className="border-b border-[color:var(--color-border)] last:border-b-0">
      <Link
        href={`/projects/${project.slug}` as any}
        className="flex flex-col gap-4 py-6 transition-colors hover:bg-[color:var(--color-bg-subtle)] md:flex-row md:gap-6"
      >
        {project.hero ? (
          <img
            src={project.hero}
            alt=""
            width={160}
            height={120}
            className="h-[120px] w-full shrink-0 rounded object-cover md:w-[160px]"
          />
        ) : (
          <div
            aria-hidden="true"
            className="h-[120px] w-full shrink-0 rounded bg-[color:var(--color-bg-subtle)] md:w-[160px]"
          />
        )}
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-3">
            <h3 className="text-[18px] font-semibold text-[color:var(--color-text)]">
              {project.title}
            </h3>
            <StatusPill status={project.status} />
          </div>
          <p className="mt-1 text-[16px] leading-[160%] text-[color:var(--color-text-muted)]">
            {project.tagline}
          </p>
        </div>
      </Link>
    </li>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/ProjectCard.tsx
git commit -m "feat(ui): ProjectCard preview row"
```

---

### Task 30: RoleCard with disclosure animation

**Files:**

- Create: `src/components/RoleCard.tsx`
- Create: `src/components/RoleCard.css`

- [ ] **Step 1: Create RoleCard.css**

```css
.role-trigger {
  display: grid;
  grid-template-columns: auto auto 1fr;
  align-items: baseline;
  column-gap: var(--spacing-sm);
  row-gap: var(--spacing-3xs);
  width: 100%;
  padding: var(--spacing-sm) 0;
  background: none;
  border: none;
  cursor: pointer;
  text-align: left;
  color: inherit;
  font: inherit;
}

.role-date {
  font-family: var(--font-mono);
  font-size: 13px;
  color: var(--color-text-faint);
}

.role-chevron {
  display: inline-block;
  font-size: 12px;
  color: var(--color-text-muted);
  transition: transform var(--motion-duration-base) var(--motion-easing-standard);
}

.role-trigger[aria-expanded='true'] .role-chevron {
  transform: rotate(90deg);
}

.role-title {
  grid-column: 1 / -1;
  font-size: 18px;
  font-weight: 600;
  color: var(--color-text);
}

.role-blurb {
  grid-column: 1 / -1;
  font-size: 16px;
  color: var(--color-text-muted);
}

.role-expanded {
  display: grid;
  grid-template-rows: 0fr;
  transition: grid-template-rows var(--motion-duration-slow) var(--motion-easing-standard);
}

.role-trigger[aria-expanded='true'] + .role-expanded {
  grid-template-rows: 1fr;
}

.role-expanded-inner {
  overflow: hidden;
}

.role-expanded-inner > div {
  padding-bottom: var(--spacing-lg);
}

.role-description p {
  font-size: 16px;
  line-height: 160%;
  color: var(--color-text);
  margin: 0 0 var(--spacing-sm);
}

.role-skills {
  margin-top: var(--spacing-md);
  font-family: var(--font-mono);
  font-size: 13px;
  color: var(--color-text-muted);
}

.role-skills-label {
  color: var(--color-text-faint);
  letter-spacing: 1px;
  margin-right: var(--spacing-sm);
}
```

- [ ] **Step 2: Create RoleCard component**

```tsx
'use client';

import { useState, useId } from 'react';
import { formatYearRange } from '@/lib/format';
import type { Role } from '@/lib/content/types';
import './RoleCard.css';

type Props = {
  role: Role;
  defaultOpen?: boolean;
};

export function RoleCard({ role, defaultOpen = false }: Props) {
  const [open, setOpen] = useState(defaultOpen);
  const regionId = useId();

  return (
    <article className="border-b border-[color:var(--color-border)] last:border-b-0">
      <button
        type="button"
        className="role-trigger"
        aria-expanded={open}
        aria-controls={regionId}
        onClick={() => setOpen((v) => !v)}
      >
        <span className="role-date">{formatYearRange(role.start, role.end)}</span>
        <span className="role-chevron" aria-hidden="true">
          ▸
        </span>
        <span className="role-title">
          {role.role} · {role.company}
        </span>
        <span className="role-blurb">{role.blurb}</span>
      </button>
      <div
        id={regionId}
        role="region"
        aria-label={`${role.role} at ${role.company} details`}
        className="role-expanded"
        inert={!open}
      >
        <div className="role-expanded-inner">
          <div>
            <div className="role-description">
              {role.description.split(/\n\n+/).map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
            {role.skills.length > 0 ? (
              <p className="role-skills">
                <span className="role-skills-label">SKILLS</span>
                {role.skills.join(' · ')}
              </p>
            ) : null}
          </div>
        </div>
      </div>
    </article>
  );
}
```

- [ ] **Step 3: Commit**

```bash
git add src/components/RoleCard.tsx src/components/RoleCard.css
git commit -m "feat(ui): RoleCard with grid-template-rows disclosure + inert"
```

---

## Phase 8 — Pages

### Task 31: Homepage

**Files:**

- Create: `src/app/page.tsx`

- [ ] **Step 1: Create homepage**

```tsx
import { Container } from '@/components/Container';
import { Avatar } from '@/components/Avatar';
import { SectionLabel } from '@/components/SectionLabel';
import { WritingListItem } from '@/components/WritingListItem';
import { LinkArrow } from '@/components/LinkArrow';
import { getSiteData } from '@/lib/content/site';
import { getAllArticles } from '@/lib/content/articles';

export default async function HomePage() {
  const [site, articles] = await Promise.all([getSiteData(), getAllArticles()]);
  const latest = articles.slice(0, 5);

  return (
    <Container>
      <section className="flex flex-col items-start gap-4 pt-6 pb-12">
        <Avatar src="/images/avatar.jpg" alt="" size={96} />
        <div>
          <h1 className="text-[28px] leading-[130%] font-semibold">{site.hero_greeting}</h1>
          <p className="text-[18px] leading-[150%] text-[color:var(--color-text-muted)]">
            {site.role}
          </p>
        </div>
      </section>

      <SectionLabel>Latest writing</SectionLabel>
      <ul className="list-none p-0">
        {latest.map((a) => (
          <WritingListItem key={a.slug} slug={a.slug} title={a.title} date={a.date} />
        ))}
      </ul>

      <div className="pt-6">
        <LinkArrow href="/writing">All writing</LinkArrow>
      </div>
    </Container>
  );
}
```

- [ ] **Step 2: Verify build runs**

Run: `bun run build`
Expected: succeeds (warnings about missing `/images/avatar.jpg` are fine — placeholder added next).

- [ ] **Step 3: Add avatar placeholder**

```bash
mkdir -p public/images
```

Create `public/images/avatar.jpg` — for now, a 1x1 transparent PNG is fine until a real photo is added. Use the tiniest placeholder:

```bash
printf '\x89PNG\r\n\x1a\n\x00\x00\x00\rIHDR\x00\x00\x00\x01\x00\x00\x00\x01\x08\x06\x00\x00\x00\x1f\x15\xc4\x89\x00\x00\x00\rIDATx\x9cc\xf8\xff\xff?\x03\x00\x06\xfd\x02\xfd\xa3\x9aN\xdd\x00\x00\x00\x00IEND\xaeB`\x82' > public/images/avatar.jpg
```

- [ ] **Step 4: Commit**

```bash
git add src/app/page.tsx public/images/avatar.jpg
git commit -m "feat(home): homepage with hero and latest 5 articles"
```

---

### Task 32: About page

**Files:**

- Create: `src/app/about/page.tsx`

- [ ] **Step 1: Create about page**

```tsx
import type { Metadata } from 'next';
import { Container } from '@/components/Container';
import { Avatar } from '@/components/Avatar';
import { getAboutPage } from '@/lib/content/about';

export const metadata: Metadata = { title: 'About' };

export default async function AboutPage() {
  const about = await getAboutPage();
  return (
    <Container>
      <h1 className="text-[28px] leading-[130%] font-semibold">{about.title}</h1>
      <div className="mt-6">
        <Avatar src="/images/avatar.jpg" alt="" size={120} />
      </div>
      <div className="prose-content mt-8" dangerouslySetInnerHTML={{ __html: about.bodyHtml }} />
    </Container>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/app/about/page.tsx
git commit -m "feat(about): about page"
```

---

### Task 33: Work page

**Files:**

- Create: `src/app/work/page.tsx`

- [ ] **Step 1: Create work page**

```tsx
import type { Metadata } from 'next';
import { Container } from '@/components/Container';
import { PageHeader } from '@/components/PageHeader';
import { SectionLabel } from '@/components/SectionLabel';
import { LinkArrow } from '@/components/LinkArrow';
import { RoleCard } from '@/components/RoleCard';
import { EducationRow } from '@/components/EducationRow';
import { getWorkData } from '@/lib/content/work';

export const metadata: Metadata = { title: 'Work' };

export default async function WorkPage() {
  const work = await getWorkData();
  return (
    <Container>
      <PageHeader title="Work" subtitle="A decade of engineering work, most recent first." />
      <div className="pb-2">
        <LinkArrow href={work.cv_pdf} external>
          Download CV (PDF)
        </LinkArrow>
      </div>

      <section className="pt-4">
        {work.roles.map((role, i) => (
          <RoleCard key={`${role.company}-${i}`} role={role} defaultOpen={i === 0} />
        ))}
      </section>

      <SectionLabel>Education</SectionLabel>
      <ul className="list-none p-0">
        {work.education.map((e, i) => (
          <EducationRow key={`${e.institution}-${i}`} {...e} />
        ))}
      </ul>
    </Container>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/app/work/page.tsx
git commit -m "feat(work): work page with expandable roles and education"
```

---

### Task 34: Projects index page

**Files:**

- Create: `src/app/projects/page.tsx`

- [ ] **Step 1: Create projects index**

```tsx
import type { Metadata } from 'next';
import { Container } from '@/components/Container';
import { PageHeader } from '@/components/PageHeader';
import { ProjectCard } from '@/components/ProjectCard';
import { getAllProjects } from '@/lib/content/projects';

export const metadata: Metadata = { title: 'Projects' };

export default async function ProjectsIndexPage() {
  const projects = await getAllProjects();
  return (
    <Container>
      <PageHeader title="Projects" subtitle="Side projects and the occasional product." />
      <ul className="list-none p-0">
        {projects.map((p) => (
          <ProjectCard key={p.slug} project={p} />
        ))}
      </ul>
    </Container>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/app/projects/page.tsx
git commit -m "feat(projects): projects index"
```

---

### Task 35: Project detail page

**Files:**

- Create: `src/app/projects/[slug]/page.tsx`

- [ ] **Step 1: Create project detail page**

```tsx
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { Container } from '@/components/Container';
import { LinkArrow } from '@/components/LinkArrow';
import { StatusPill } from '@/components/StatusPill';
import { SectionLabel } from '@/components/SectionLabel';
import { getAllProjects, getProjectBySlug, getProjectSlugs } from '@/lib/content/projects';

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  const slugs = await getProjectSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  if (!project) return {};
  return {
    title: project.title,
    description: project.tagline,
    openGraph: { title: project.title, description: project.tagline }
  };
}

export default async function ProjectDetailPage({ params }: Props) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  if (!project) notFound();

  return (
    <Container width="article">
      <div className="pb-6">
        <LinkArrow href="/projects" direction="back">
          All projects
        </LinkArrow>
      </div>

      <header className="pb-8">
        <h1 className="text-[38px] leading-[120%] font-semibold">{project.title}</h1>
        <p className="mt-2 text-[18px] text-[color:var(--color-text-muted)]">{project.tagline}</p>
        <div className="mt-4 flex items-center gap-3">
          <StatusPill status={project.status} />
          <span
            className="text-[13px] text-[color:var(--color-text-faint)]"
            style={{ fontFamily: 'var(--font-mono)' }}
          >
            {project.date}
          </span>
        </div>
      </header>

      {project.hero ? <img src={project.hero} alt="" className="mb-10 w-full rounded" /> : null}

      <div className="prose-content" dangerouslySetInnerHTML={{ __html: project.bodyHtml }} />

      {project.stack.length > 0 ? (
        <>
          <SectionLabel>Stack</SectionLabel>
          <p
            className="text-[16px] text-[color:var(--color-text-muted)]"
            style={{ fontFamily: 'var(--font-mono)' }}
          >
            {project.stack.join(' · ')}
          </p>
        </>
      ) : null}

      {Object.keys(project.links).length > 0 ? (
        <>
          <SectionLabel>Links</SectionLabel>
          <ul className="flex list-none flex-col gap-2 p-0">
            {project.links.live ? (
              <li>
                <LinkArrow href={project.links.live} external>
                  Live
                </LinkArrow>
              </li>
            ) : null}
            {project.links.appstore ? (
              <li>
                <LinkArrow href={project.links.appstore} external>
                  App Store
                </LinkArrow>
              </li>
            ) : null}
            {project.links.playstore ? (
              <li>
                <LinkArrow href={project.links.playstore} external>
                  Play Store
                </LinkArrow>
              </li>
            ) : null}
            {project.links.source ? (
              <li>
                <LinkArrow href={project.links.source} external>
                  Source
                </LinkArrow>
              </li>
            ) : null}
          </ul>
        </>
      ) : null}
    </Container>
  );
}

export const dynamicParams = false;
```

- [ ] **Step 2: Commit**

```bash
git add src/app/projects/\[slug\]/page.tsx
git commit -m "feat(projects): project detail page with static params"
```

---

### Task 36: Writing index page

**Files:**

- Create: `src/app/writing/page.tsx`

- [ ] **Step 1: Create writing index**

```tsx
import type { Metadata } from 'next';
import { Container } from '@/components/Container';
import { PageHeader } from '@/components/PageHeader';
import { SectionLabel } from '@/components/SectionLabel';
import { WritingListItem } from '@/components/WritingListItem';
import { getAllArticles } from '@/lib/content/articles';
import { groupByYear } from '@/lib/format';

export const metadata: Metadata = { title: 'Writing' };

export default async function WritingIndexPage() {
  const articles = await getAllArticles();
  const byYear = groupByYear(articles);
  const years = [...byYear.keys()].sort((a, b) => (a < b ? 1 : -1));

  return (
    <Container>
      <PageHeader title="Writing" subtitle="Essays, notes, and post-mortems." />

      {years.map((year) => (
        <section key={year}>
          <SectionLabel>{year}</SectionLabel>
          <ul className="list-none p-0">
            {byYear.get(year)!.map((a) => (
              <WritingListItem key={a.slug} slug={a.slug} title={a.title} date={a.date} />
            ))}
          </ul>
        </section>
      ))}
    </Container>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/app/writing/page.tsx
git commit -m "feat(writing): year-grouped writing index"
```

---

### Task 37: Article page

**Files:**

- Create: `src/app/writing/[slug]/page.tsx`

- [ ] **Step 1: Create article page**

```tsx
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { Container } from '@/components/Container';
import { LinkArrow } from '@/components/LinkArrow';
import { getArticleBySlug, getArticleSlugs } from '@/lib/content/articles';

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  const slugs = await getArticleSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const a = await getArticleBySlug(slug);
  if (!a) return {};
  return {
    title: a.title,
    description: a.description ?? undefined,
    openGraph: {
      title: a.title,
      description: a.description ?? undefined,
      type: 'article',
      publishedTime: a.date
    }
  };
}

export default async function ArticlePage({ params }: Props) {
  const { slug } = await params;
  const a = await getArticleBySlug(slug);
  if (!a) notFound();

  return (
    <Container width="article">
      <div className="pb-6">
        <LinkArrow href="/writing" direction="back">
          All writing
        </LinkArrow>
      </div>

      <header className="pb-8">
        <h1 className="text-[34px] leading-[125%] font-semibold">{a.title}</h1>
        <p
          className="mt-3 text-[13px] text-[color:var(--color-text-faint)]"
          style={{ fontFamily: 'var(--font-mono)' }}
        >
          <time dateTime={a.date}>{a.date}</time>
          {' · '}
          {a.readingTimeMinutes} min read
        </p>
      </header>

      <div className="prose-article" dangerouslySetInnerHTML={{ __html: a.bodyHtml }} />
    </Container>
  );
}

export const dynamicParams = false;
```

- [ ] **Step 2: Commit**

```bash
git add src/app/writing/\[slug\]/page.tsx
git commit -m "feat(writing): single article page"
```

---

## Phase 9 — Markdown Styling & Polish

### Task 38: Article markdown styles

**Files:**

- Modify: `src/app/globals.css`

- [ ] **Step 1: Append article body styles to globals.css**

Add to the end of `src/app/globals.css`:

```css
.prose-article {
  font-family: var(--font-serif);
  font-size: 17px;
  line-height: 175%;
  color: var(--color-text);
}

.prose-article p {
  margin: 0 0 var(--spacing-lg);
}

.prose-article h2 {
  font-family: var(--font-serif);
  font-size: 22px;
  font-weight: 600;
  line-height: 140%;
  margin: var(--spacing-2xl) 0 var(--spacing-sm);
  color: var(--color-text);
}

.prose-article h3 {
  font-family: var(--font-serif);
  font-size: 18px;
  font-weight: 600;
  line-height: 140%;
  margin: var(--spacing-xl) 0 var(--spacing-2xs);
}

.prose-article a {
  color: var(--color-accent);
  text-decoration: underline;
  text-underline-offset: 2px;
}

.prose-article ul,
.prose-article ol {
  margin: 0 0 var(--spacing-lg) var(--spacing-lg);
  padding: 0;
}

.prose-article li {
  margin: 0 0 var(--spacing-2xs);
}

.prose-article blockquote {
  border-left: 2px solid var(--color-border);
  padding-left: var(--spacing-md);
  margin: var(--spacing-lg) 0;
  color: var(--color-text-muted);
}

.prose-article code:not(pre code) {
  font-family: var(--font-mono);
  font-size: 14px;
  background: var(--color-bg-subtle);
  padding: 1px 6px;
  border-radius: var(--radius-sm);
}

.prose-article pre {
  background: var(--color-bg-subtle);
  border-radius: var(--radius-md);
  padding: var(--spacing-lg);
  margin: var(--spacing-lg) 0;
  overflow-x: auto;
  font-family: var(--font-mono);
  font-size: 14px;
  line-height: 165%;
}

.prose-article pre code {
  font-family: inherit;
}

.prose-article img {
  width: 100%;
  border-radius: var(--radius-md);
  margin: var(--spacing-lg) 0;
}

.prose-article .heading-anchor {
  color: inherit;
  text-decoration: none;
}

.prose-content {
  font-family: var(--font-sans);
  font-size: 16px;
  line-height: 160%;
  color: var(--color-text);
}

.prose-content p {
  margin: 0 0 var(--spacing-lg);
}

.prose-content h2 {
  font-size: 18px;
  font-weight: 600;
  margin: var(--spacing-2xl) 0 var(--spacing-sm);
}

.prose-content a {
  color: var(--color-accent);
  text-decoration: underline;
  text-underline-offset: 2px;
}

.prose-content ul,
.prose-content ol {
  margin: 0 0 var(--spacing-lg) var(--spacing-lg);
}

.prose-content code:not(pre code) {
  font-family: var(--font-mono);
  font-size: 14px;
  background: var(--color-bg-subtle);
  padding: 1px 6px;
  border-radius: var(--radius-sm);
}

.prose-content pre {
  background: var(--color-bg-subtle);
  border-radius: var(--radius-md);
  padding: var(--spacing-lg);
  margin: var(--spacing-lg) 0;
  overflow-x: auto;
  font-family: var(--font-mono);
  font-size: 14px;
}
```

- [ ] **Step 2: Commit**

```bash
git add src/app/globals.css
git commit -m "feat(prose): article (serif) + content (sans) markdown styles"
```

---

### Task 39: Mobile type scale tweaks

**Files:**

- Modify: `src/app/globals.css`

- [ ] **Step 1: Append mobile overrides at the end of globals.css**

```css
@media (max-width: 767px) {
  .prose-article {
    font-size: 16px;
  }

  .prose-article h1 {
    font-size: 28px;
  }
}
```

- [ ] **Step 2: Commit**

```bash
git add src/app/globals.css
git commit -m "feat(responsive): mobile article type adjustments"
```

---

### Task 40: 404 page

**Files:**

- Create: `src/app/not-found.tsx`

- [ ] **Step 1: Create not-found page**

```tsx
import { Container } from '@/components/Container';
import { LinkArrow } from '@/components/LinkArrow';

export default function NotFound() {
  return (
    <Container>
      <div className="py-16">
        <h1 className="text-[34px] leading-[125%] font-semibold">Not found.</h1>
        <p className="mt-3 text-[16px] text-[color:var(--color-text-muted)]">
          The page you’re looking for doesn’t exist (or has moved).
        </p>
        <div className="mt-8">
          <LinkArrow href="/">Back home</LinkArrow>
        </div>
      </div>
    </Container>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/app/not-found.tsx
git commit -m "feat(404): not-found page"
```

---

### Task 41: Sitemap

**Files:**

- Create: `src/app/sitemap.ts`

- [ ] **Step 1: Create sitemap generator**

```ts
import type { MetadataRoute } from 'next';
import { getAllArticles } from '@/lib/content/articles';
import { getAllProjects } from '@/lib/content/projects';

const BASE = 'https://heyivan.dev';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
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
}
```

- [ ] **Step 2: Commit**

```bash
git add src/app/sitemap.ts
git commit -m "feat(seo): sitemap covering static and dynamic routes"
```

---

### Task 42: robots.txt

**Files:**

- Create: `src/app/robots.ts`

- [ ] **Step 1: Create robots.ts**

```ts
import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: '*', allow: '/' }],
    sitemap: 'https://heyivan.dev/sitemap.xml'
  };
}
```

- [ ] **Step 2: Commit**

```bash
git add src/app/robots.ts
git commit -m "feat(seo): robots.txt allow-all + sitemap pointer"
```

---

### Task 43: Default OG image placeholder

**Files:**

- Create: `public/images/og-default.png` (placeholder)

- [ ] **Step 1: Add a placeholder OG image**

Run:

```bash
mkdir -p public/images
printf '\x89PNG\r\n\x1a\n\x00\x00\x00\rIHDR\x00\x00\x00\x01\x00\x00\x00\x01\x08\x06\x00\x00\x00\x1f\x15\xc4\x89\x00\x00\x00\rIDATx\x9cc\xf8\xff\xff?\x03\x00\x06\xfd\x02\xfd\xa3\x9aN\xdd\x00\x00\x00\x00IEND\xaeB`\x82' > public/images/og-default.png
```

(Real 1200×630 image to be authored later — placeholder unblocks the build.)

- [ ] **Step 2: Commit**

```bash
git add public/images/og-default.png
git commit -m "feat(seo): placeholder default OG image"
```

---

## Phase 10 — Build Verification

### Task 44: Verify full production build

- [ ] **Step 1: Run typecheck**

Run: `bun run typecheck`
Expected: passes with no errors.

- [ ] **Step 2: Run lint**

Run: `bun run lint`
Expected: passes (or warns only — fix any errors).

- [ ] **Step 3: Run tests**

Run: `bun run test`
Expected: all unit tests PASS.

- [ ] **Step 4: Run full build**

Run: `bun run build`
Expected: succeeds, produces `out/` directory.

- [ ] **Step 5: Verify static export structure**

Run: `ls out/`
Expected: contains `index.html`, `about.html`, `work.html`, `projects/`, `writing/`, `sitemap.xml`, `robots.txt`, `_next/`.

- [ ] **Step 6: Smoke-test the build locally**

Run: `bunx serve out` (or `python3 -m http.server -d out 4000`)
Manually verify in a browser:

- Home renders with avatar, hero, and latest 5 writing entries
- /about renders bio + Now + Elsewhere
- /work renders with first role expanded, others collapsed; clicking a collapsed role smoothly expands it
- /projects/example-app renders with back link, hero, body, stack, links
- /writing/hello-world renders article in serif body
- Theme toggle in nav switches the entire color scheme without flash on reload
- Mobile viewport (<768px): nav collapses to wordmark + toggle + hamburger; tapping hamburger opens overlay
- All keyboard tab stops are visible (focus-visible ring is amber)

- [ ] **Step 7: Commit build verification (no code changes — skip if clean)**

If anything failed, fix it before continuing.

---

## Phase 11 — Deploy

### Task 45: GitHub Actions CI

**Note:** Brought forward from Phase 11 so PRs land with automated checks from the start. The workflow uses `hashFiles()` guards so test/build steps run only once the relevant files exist.

**Files:**

- Create: `.github/workflows/ci.yml`

- [ ] **Step 1: Create CI workflow**

```yaml
name: CI

on:
  push:
    branches: [master]
  pull_request:

jobs:
  check:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - uses: oven-sh/setup-bun@v2
        with:
          bun-version: latest

      - uses: actions/setup-node@v4
        with:
          node-version-file: '.nvmrc'

      - run: bun install --frozen-lockfile

      - name: Typecheck
        if: hashFiles('src/**/*.ts', 'src/**/*.tsx', 'vitest.config.ts') != ''
        run: bun run typecheck

      - name: Lint
        run: bun run lint

      - name: Format check
        run: bun run format:check

      - name: Test
        if: hashFiles('vitest.config.ts') != ''
        run: bun run test

      - name: Build
        if: hashFiles('src/app/page.tsx', 'src/app/page.ts') != ''
        run: bun run build
```

- [ ] **Step 2: Commit**

```bash
git add .github/workflows/ci.yml
git commit -m "ci: typecheck, lint, format, test, build on push/PR"
```

---

### Task 46: Cloudflare Pages setup notes

**Files:**

- Create: `docs/deploy/cloudflare-pages.md`

- [ ] **Step 1: Create deploy notes**

```markdown
# Cloudflare Pages deploy

## One-time setup

1. Push the repo to GitHub (`firec0der/heyivan.dev`).
2. In Cloudflare dashboard → Workers & Pages → Create application → Pages → Connect to Git.
3. Select the GitHub repo.
4. Configure build:
   - Production branch: `main`
   - Framework preset: **None** (do NOT pick "Next.js" — that triggers Pages Functions for the Vercel-style adapter; we ship a pure static export instead).
   - Build command: `bun install --frozen-lockfile && bun run build`
   - Build output directory: `out`
   - Root directory: `/`
   - Environment variables:
     - `NODE_VERSION` = `24`
     - `BUN_VERSION` = `1`
5. Save and Deploy. First deploy produces a `*.pages.dev` URL.

## Custom domain

1. In the Pages project → Custom domains → Set up a custom domain → `heyivan.dev`.
2. Cloudflare DNS automatically configures the CNAME/A records if DNS is already on Cloudflare.
3. HTTPS auto-provisioned by Cloudflare.

## Per-push behaviour

- Every push to `main` deploys to production (`heyivan.dev`).
- Every PR gets a preview at `<commit-hash>.<project>.pages.dev`.
```

- [ ] **Step 2: Commit**

```bash
git add docs/deploy/cloudflare-pages.md
git commit -m "docs(deploy): cloudflare pages setup notes"
```

---

### Task 47: Verify deploy

- [ ] **Step 1: Push to GitHub**

Run:

```bash
git remote add origin git@github.com:firec0der/heyivan.dev.git
git branch -M main
git push -u origin main
```

(Skip the remote-add if it already exists.)

- [ ] **Step 2: Watch the Cloudflare Pages deploy**

In the Pages dashboard, watch the first deploy. Expected: success in <2 minutes.

- [ ] **Step 3: Verify production**

Visit `https://heyivan.dev` once the custom domain is attached. Verify:

- All pages load
- Theme toggle persists across navigation
- Dark mode renders the dark token set (no flash on reload)
- Article rendered with serif body
- Sitemap reachable at `/sitemap.xml`
- robots.txt reachable at `/robots.txt`

---

## Self-review checklist

Before marking the plan complete, the implementer should verify:

- **Spec coverage:** every section of [`docs/specs/heyivan-dev-design.md`](../specs/heyivan-dev-design.md) maps to at least one task above. Cross-reference:
  - §3 IA → Tasks 31–37 (one task per page in spec's IA)
  - §4 Tech stack → Tasks 1–2 (Next.js export, Tailwind, fonts in 6)
  - §5 Content model → Tasks 7–14
  - §6 Design system tokens → Tasks 5–6
  - §6 Components (15) → Tasks 17–30 (StatusPill, SectionLabel, LinkArrow, Avatar, PageHeader, SkipLink, ThemeToggle, Nav, MobileMenuOverlay, Footer, WritingListItem, EducationRow, ProjectCard, RoleCard) — Mobile Nav/Mobile Footer/Page Header are folded into responsive treatment of the desktop primitives via Tailwind `md:` prefixes, matching spec §8.
  - §7 Page layouts → Tasks 31–37
  - §8 Responsive → handled inline via `md:` and `Task 39`
  - §9 Theme (dark mode) → Tasks 15, 16, 23, 5
  - §10 Accessibility → SkipLink (22), focus-visible ring (5), Nav `aria-current` (24), RoleCard `aria-expanded`+`inert` (30), reduced-motion media query (5)
  - §11 Performance budget → static export (1) and three client islands only (16, 24, 30)
  - §12 Build & deploy → Tasks 45–47
  - §13 Out of scope → respected: no RSS, no analytics, no animation libs

- **Placeholder scan:** no "TODO", "TBD", "implement later", "fill in" anywhere. All code blocks are complete.

- **Type consistency:** `Article`, `Project`, `Role`, `Education`, `WorkData`, `SiteData`, `AboutPage` types defined in Task 8 are used consistently across loaders (11–13) and components (27–37).

- **Method-name consistency:** `getAllArticles`, `getArticleBySlug`, `getArticleSlugs`, `getAllProjects`, `getProjectBySlug`, `getProjectSlugs`, `getWorkData`, `getSiteData`, `getAboutPage`, `renderMarkdown`, `formatArticleDate`, `formatYearRange`, `groupByYear` — names match between definition and call sites.

- **Token consistency:** color, spacing, radius, motion, font tokens defined in Task 5 are the same names referenced by component CSS (Task 30), prose styles (Task 38), and Tailwind utilities (CSS-variable shorthand).

- **Commit cadence:** every task ends in a commit step. No batched commits.

---

## Out-of-scope (post-launch)

Items intentionally deferred per spec §13 — do not implement in this plan:

- RSS / Atom feeds
- Newsletter signup
- Search index
- Comments
- Analytics
- Per-post OG image generation (placeholder only)
- Code Connect Figma ↔ code mapping
- Three-state theme (light/dark/system)
- Internationalization
- Mobile menu open animation (instant in v1)
