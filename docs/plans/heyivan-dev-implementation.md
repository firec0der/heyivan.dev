# heyivan.dev — Implementation Architecture

**Spec:** [`docs/specs/heyivan-dev-design.md`](../specs/heyivan-dev-design.md)
**Issues:** https://github.com/firec0der/heyivan.dev/issues
**Project board:** https://github.com/users/firec0der/projects/4
**Status:** in-progress (single-PR-per-task workflow)

> This doc describes **how the codebase is shaped** — the architecture, the tooling, the conventions. It is intentionally short. The step-by-step plan now lives in GitHub Issues (`Task N: <title>`). Each issue is one PR, one commit (modulo lefthook auto-fixes).

---

## 1. Goal

Static personal site at `heyivan.dev`, deployed to Cloudflare Pages, built from Next.js App Router with `output: 'export'`. Blog-first IA, light + dark theme, IBM Plex typography, three small client islands, the rest zero-JS server-rendered.

## 2. Architecture in one paragraph

`next build` produces `out/` — a directory of HTML/CSS/JS/static assets that Cloudflare Pages serves. Content lives under `content/` (markdown + YAML), is loaded by server components at build time, and rendered through a remark/rehype pipeline (gfm, smartypants, slug, autolink-headings, pretty-code with Shiki). Tokens flow through CSS custom properties: a single `:root` set for light, an `html[data-theme="dark"]` override for dark. Tailwind 4's `@theme` block exposes those CSS variables as utility classes so components can mix Tailwind utilities (`text-[color:var(--color-text)]`, `gap-(--spacing-md)`) with raw CSS variables interchangeably. Three components ship to the client: `ThemeToggle`, `MobileMenuOverlay`, `RoleCard` (disclosure with `grid-template-rows` animation + `inert`).

## 3. Tech stack

| Layer           | Choice                          | Notes                                                                                        |
| --------------- | ------------------------------- | -------------------------------------------------------------------------------------------- |
| Framework       | Next.js 15, App Router          | `output: 'export'`, `trailingSlash: false`                                                   |
| Runtime         | Node 24 (LTS)                   | Pinned via `.nvmrc`; `engines.node >= 24`                                                    |
| Package manager | bun                             | `bun.lock` checked in; CI uses `oven-sh/setup-bun@v2`                                        |
| Styling         | Tailwind CSS 4 (PostCSS)        | Tokens live in CSS variables, exposed via `@theme`                                           |
| Fonts           | `next/font/google`              | IBM Plex Sans/Serif/Mono, self-hosted at build                                               |
| Markdown        | unified + remark + rehype       | gfm, smartypants, slug, autolink-headings, pretty-code (Shiki)                               |
| Data            | `gray-matter`, `js-yaml`, `zod` | Schemas validate every frontmatter and YAML file                                             |
| Reading time    | `reading-time`                  | Computed at build (`words / 220`)                                                            |
| Lint            | ESLint 9 (flat config)          | `next/core-web-vitals` + `next/typescript` + `simple-import-sort` + `eslint-config-prettier` |
| Format          | Prettier 3                      | `prettier-plugin-tailwindcss` for class sorting; `content/` is ignored                       |
| Tests           | Vitest 4                        | `passWithNoTests: true`; `@` alias resolves to `src/`                                        |
| Git hooks       | Lefthook                        | Pre-commit: eslint + prettier on staged files (`stage_fixed: true`); pre-push: typecheck     |
| CI              | GitHub Actions                  | typecheck (gated), lint, format:check, test (gated), build (gated)                           |
| Hosting         | Cloudflare Pages                | Build: `bun install --frozen-lockfile && bun run build`; output dir: `out`                   |
| Domain          | `heyivan.dev` on Cloudflare DNS | HTTPS auto-provisioned                                                                       |

## 4. File structure

```
content/
  data/
    site.yaml             # name, socials, wordmark, hero copy (no copyright_year — computed)
    work.yaml             # roles, skills, education, cv_pdf
  pages/
    about.md              # /about body
  projects/
    <slug>.md             # one per project
  writing/
    <slug>.md             # one per article (date-free URL; future-dated posts excluded)
public/
  images/
    avatar.jpg
    og-default.png
    projects/<slug>/*
    writing/<slug>/*
src/
  app/
    fonts.ts              # IBM Plex Sans/Serif/Mono via next/font
    globals.css           # CSS variable tokens (light + dark), focus ring, reduced-motion reset
    layout.tsx            # root layout — html lang, font className, no-flash script, Nav, main, Footer
    page.tsx              # /
    about/page.tsx
    work/page.tsx
    projects/page.tsx
    projects/[slug]/page.tsx
    writing/page.tsx
    writing/[slug]/page.tsx
    not-found.tsx
    sitemap.ts
    robots.ts
  components/             # atoms + content + chrome (see §5)
  lib/
    content/              # loaders + schemas + types (see §6)
    format.ts             # date and year-range helpers, group-by-year
    theme/                # init-script (string) + use-theme hook
.github/workflows/ci.yml
.nvmrc                    # 24
eslint.config.mjs
lefthook.yml
next.config.mjs           # output: 'export'
package.json
postcss.config.mjs
.prettierrc.json / .prettierignore
tsconfig.json
vitest.config.ts
```

## 5. Component inventory

15 components map 1:1 to the Figma file. Each component binds fills/strokes/spacing/radius to CSS variables — no hardcoded values inside components.

**Atoms** — `StatusPill`, `SectionLabel`, `LinkArrow`, `Avatar`, `PageHeader`, `SkipLink`, `Container`

**Chrome** — `Nav` (desktop + mobile both in one component, switched via `md:` prefix), `MobileMenuOverlay`, `Footer`, `ThemeToggle`

**Content** — `WritingListItem`, `EducationRow`, `ProjectCard`, `RoleCard`

Only `Nav`/`MobileMenuOverlay`, `ThemeToggle`, and `RoleCard` need `'use client'`. Everything else is server-rendered.

## 6. Content pipeline

```
content/<kind>/<slug>.md
        │
        ▼
gray-matter splits frontmatter ↔ body
        │
        ▼
zod schema validates frontmatter ───── (throws at build if bad)
        │
        ▼
unified pipeline renders body to HTML
  remark-parse → remark-gfm → remark-smartypants
  → remark-rehype → rehype-slug → rehype-autolink-headings
  → rehype-pretty-code (Shiki, github-light + github-dark) → rehype-stringify
        │
        ▼
Loader returns typed object (Article | Project | …) consumed by a server component
```

Articles are filtered through `isPublishable(article, now)` which drops `draft: true` and any post whose `date` is in the future.

## 7. Theme system

Two-state toggle (light/dark), no "system" third state.

- **Token layer** lives in `globals.css`: `:root` sets light values; `html[data-theme='dark']` overrides them. Tailwind's `@theme` block aliases CSS variables to color/spacing/radius utilities so components can use either form.
- **First paint** runs a synchronous inline script in `<head>`, before React hydrates, that reads `localStorage.theme` (falling back to `prefers-color-scheme: dark`) and sets `data-theme` on `<html>`. This is the only thing that prevents the dark-mode flash.
- **Toggle** is a tiny client component (`useTheme` hook) that flips `data-theme` and writes `localStorage.theme`.

## 8. Role disclosure animation

Native `<details>` can't animate height smoothly because the spec hides closed content with `display: none`. We use a custom disclosure: `<button aria-expanded aria-controls>` + adjacent `<div role="region" inert={!open}>`. The region uses the `grid-template-rows: 0fr ↔ 1fr` trick with `overflow: hidden` on the inner div — no JS measurement needed, transitions cleanly under `prefers-reduced-motion: reduce` (the global reset clamps duration to 1ms, snapping the state).

`inert` keeps closed content non-focusable and non-interactive. Without JS the page degrades gracefully: all roles default to `aria-expanded="true"`, content is reachable, no broken state.

## 9. Conventions

**Branching:** one branch per task — `task/<N>-<short-kebab-title>`. Branch off `master`. Open PR, link the issue (`Closes #N`). CI must pass before merge. Squash-merge into master.

**Commits:** Conventional-ish prefixes (`feat:`, `chore:`, `docs:`, `ci:`, `refactor:`). Never include a Claude signature or co-authored-by. Lefthook auto-fixes formatting and re-stages — that's expected.

**Tests:** TDD for the markdown pipeline, loaders, and date helpers (anything with logic). UI components are not unit-tested; they're verified by reading the rendered page in dev.

**Don't:** mock the file system in content-loader tests — read real fixtures from `content/`. The whole point of those tests is to catch frontmatter drift.

## 10. Phase outline → issue map

The 49 implementation issues are grouped into phases. The board view at https://github.com/users/firec0der/projects/4 reflects current progress.

| Phase                  | What it builds                                                                                                                     | Issues    |
| ---------------------- | ---------------------------------------------------------------------------------------------------------------------------------- | --------- |
| 1 — Bootstrap          | Next.js + Tailwind + TS + ESLint flat config + Prettier (with import sort + Tailwind class sort) + Lefthook + Vitest + Node 24 pin | #1 → #6   |
| 2 — Tokens             | CSS variable token layer (light + dark) + IBM Plex via `next/font`                                                                 | #7 → #8   |
| 3 — Content infra      | Sample content, types, zod schemas, markdown renderer, loaders for articles/projects/work/site/about, date helpers                 | #9 → #16  |
| 4 — Theme              | No-flash inline script + `useTheme` hook                                                                                           | #17 → #18 |
| 5 — Atoms              | StatusPill, SectionLabel, LinkArrow, Avatar, PageHeader                                                                            | #19 → #23 |
| 6 — Chrome             | SkipLink, ThemeToggle, Nav (with MobileMenuOverlay), Footer, root layout + Container                                               | #24 → #28 |
| 7 — Content components | WritingListItem, EducationRow, ProjectCard, RoleCard                                                                               | #29 → #32 |
| 8 — Pages              | Home, About, Work, Projects index + detail, Writing index + article                                                                | #33 → #39 |
| 9 — Polish             | Prose markdown styles, mobile type tweaks, 404, sitemap, robots, OG fallback, build verification                                   | #40 → #46 |
| 10 — Deploy            | CI (brought forward to Phase 1 territory), Cloudflare Pages setup notes, deploy verification                                       | #47 → #49 |

Each issue contains the original task body (file paths, code, commit message). Treat the issue as the spec for that PR.

## 11. CI gates

The workflow at `.github/workflows/ci.yml` runs on push to master and on every PR:

1. `bun install --frozen-lockfile`
2. `bun run typecheck` — gated by `hashFiles('src/**/*.ts', 'src/**/*.tsx', 'vitest.config.ts')`
3. `bun run lint`
4. `bun run format:check`
5. `bun run test` — gated by `hashFiles('vitest.config.ts')`
6. `bun run build` — gated by `hashFiles('src/app/page.tsx', 'src/app/page.ts')`

The gates let earlier PRs land green before the gated files exist. Once `src/app/page.tsx` lands the build gate fires automatically.

## 12. Performance budget

- HTML < 20 KB gzipped per page
- CSS < 15 KB gzipped (Tailwind purged)
- JS < 2 KB total across the site (three client islands only)
- LCP < 1s on slow 3G
- Lighthouse target: 100/100/100/100

Static export + Cloudflare edge cache makes these targets easy.

## 13. Out of scope (v1)

RSS, newsletter, search, comments, analytics, per-post OG image generation, Code Connect, three-state theme, i18n, mobile menu animation. Listed in spec §13 — preserved here as a single reminder; do not implement any of these as side scope.

## 14. Open questions

Live tracker in spec §14. As of writing: dark-mode token tuning, eventual `/now` page split, search index once archive grows, mobile menu open transition. None block v1.
