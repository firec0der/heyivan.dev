# heyivan.dev — Design Spec

**Date:** 2026-06-08
**Status:** Draft for review
**Owner:** Ivan Stetsenko
**Figma:** https://www.figma.com/design/l4Zcba47fC7l6JSa7JSUMg

---

## 1. Overview

A personal website for Ivan Stetsenko — IC software engineer. Blog-first; secondary surfaces for about/work/projects.

**Aesthetic direction:** warm minimal (à la ivan.dev) — cream background, IBM Plex everywhere, single amber accent. Restrained, longevity-friendly. No decorative flourishes.

## 2. Goals & non-goals

**Goals**

- A blog-first personal site that holds up over years without redesign.
- Readable at every viewport (mobile, tablet, desktop).
- Light and dark themes with manual toggle + OS-default first paint.
- Zero-JS-by-default rendering for static content. Hydration only where interactivity is required.
- WCAG 2.1 AA contrast on every meaningful text pair.
- One-command static export; deployable to any static host.

**Non-goals (v1)**

- CMS / dynamic backend.
- Newsletter, search, comments, analytics, RSS feed.
- Per-post OG image generation.
- Animation-heavy or WebGL surfaces.
- Internationalization.
- Code Connect integration with Figma (deferred).

## 3. Information architecture

```
/                       Homepage
/about                  Bio + Now
/work                   Resume (expandable roles + skills + education)
/projects               Projects index (preview rows with hero crop)
/projects/<slug>        Project detail (rich body with visuals)
/writing                Writing index (year-grouped)
/writing/<slug>         Article
```

**Header nav (every page):** `ivan.` wordmark + `about · work · projects · writing` + theme toggle. Mobile: wordmark + theme toggle + hamburger; hamburger opens a full-screen overlay with the nav links + theme row.

**Footer (every page):** `github · linkedin · email` + `© 2026`. No RSS. No Twitter (per explicit decision).

**Removed from v1 scope:** RSS feed (no `/feed.xml` or `/atom.xml` generated). Reconsider if a subscription channel is wanted later.

## 4. Tech stack & hosting

- **Framework:** Next.js (latest stable), App Router.
- **Output:** static export (`output: 'export'`).
- **Styling:** Tailwind CSS. Token bindings backed by CSS variables.
- **Fonts:** IBM Plex Sans / Serif / Mono, self-hosted via `next/font/google` (downloads at build, no runtime CDN call).
- **Markdown rendering:** remark/rehype pipeline at build time (gfm, smartypants, slug, autolink-headings, pretty-code with Shiki). No MDX in v1 — plain `.md`. Migration to `.mdx` later is a rename, no content change.
- **Hosting:** Cloudflare Pages. Connect GitHub repo → build `next build` → publish `out/`. Push-to-deploy. Cloudflare DNS for `heyivan.dev`.
- **Why no Vercel:** explicit user preference. Static export is portable to any static host.

## 5. Content model

### Layout

```
content/
  pages/
    about.md                   # /about page body (bio + Now)
  data/
    site.yaml                  # name, social links, hero copy
    work.yaml                  # roles, skills, education
  projects/
    <slug>.md                  # one per project
  writing/
    <slug>.md                  # one per article
public/
  images/
    avatar.jpg
    og-default.png
    projects/<slug>/*.png      # per-project media (hero + screenshots)
    writing/<slug>/*.png       # per-article media
```

### Article frontmatter

```yaml
---
title: An essay title goes here
date: 2026-05-22
description: One-line blurb for meta + listing fallback.
draft: false
---
Body in plain Markdown.
```

| Field         | Required            | Notes                                         |
| ------------- | ------------------- | --------------------------------------------- |
| `title`       | yes                 | Used in `<title>`, `<meta og:title>`, listing |
| `date`        | yes                 | Sort order, displayed on listing and article  |
| `description` | no                  | Falls back to auto-excerpt if missing         |
| `draft`       | no, default `false` | If `true`, excluded from production build     |

**Slug** = filename (without `.md`). URLs are date-free: `/writing/the-monorepo-trap`. Future-dated posts are excluded from production until the date passes.

### Project frontmatter

```yaml
---
title: App Name
tagline: One-line pitch — what it is and who it's for.
date: 2024-03-15
status: live # live | archived | wip
hero: /images/projects/app-name/hero.png
stack: [React Native, TypeScript, Postgres]
links:
  live: https://...
  appstore: https://...
  playstore: https://...
  source: https://...
---
Long-form body with embedded images.
```

### Structured data (work.yaml)

```yaml
roles:
  - company: Company Name
    role: Senior Engineer
    start: 2024
    end: present
    blurb: One-line of what you do there.
    description: |
      Longer paragraph(s) — shown when the role is expanded.
    skills: [Go, Python, Postgres, Kubernetes, AWS]
  # ...
skills:
  Backend: Go, Python, Postgres
  Frontend: TypeScript, React
  Infra: Docker, Kubernetes, AWS
education:
  - degree: MSc Computer Science
    institution: University Name
    start: 2018
    end: 2020
```

**Expandable role behavior:** custom disclosure (button + region) with **smooth height animation**. The top/current role is open by default; older roles are collapsed. Clicking the trigger animates the expanded section open/closed.

Pattern (button + `aria-expanded` + `aria-controls`, _not_ native `<details>` — native disclosure can't be smoothly animated with pure CSS because the spec hides closed content with `display: none`):

```html
<article class="role-card">
  <button class="role-trigger" aria-expanded="false" aria-controls="role-1">
    <span class="role-date">2024 — Present</span>
    <span class="role-chevron" aria-hidden="true">▸</span>
    <span class="role-title">Senior Engineer · [Company]</span>
    <span class="role-blurb">One-line description.</span>
  </button>
  <div id="role-1" class="role-expanded" role="region" inert>
    <div class="role-expanded-inner">
      <p>Longer description…</p>
      <p class="role-skills">SKILLS Go · Python · Postgres · …</p>
    </div>
  </div>
</article>
```

```css
/* The grid-template-rows trick: animate 0fr → 1fr for a no-measure height animation */
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

/* Chevron rotates */
.role-chevron {
  display: inline-block;
  transition: transform var(--motion-duration-base) var(--motion-easing-standard);
}
.role-trigger[aria-expanded='true'] .role-chevron {
  transform: rotate(90deg);
}
```

```js
// ~12 lines of progressive enhancement
document.querySelectorAll('.role-trigger').forEach((btn) => {
  btn.addEventListener('click', () => {
    const expanded = btn.getAttribute('aria-expanded') === 'true';
    btn.setAttribute('aria-expanded', String(!expanded));
    const region = document.getElementById(btn.getAttribute('aria-controls'));
    if (expanded) region.setAttribute('inert', '');
    else region.removeAttribute('inert');
  });
});
```

**Without JS:** spec defaults to all roles expanded (`aria-expanded="true"`, no `inert`) — page degrades to a long-form list. No broken interactions, all content reachable.

**Reduced motion:** the global `prefers-reduced-motion` media query (§10) drops transition durations to 1ms — animation snaps instantly without breaking state.

**`inert`** keeps closed-state content non-focusable and non-interactive (required because the grid trick leaves DOM nodes present but visually clipped).

### Reading time

Computed at build (`words / 220`). Not stored in frontmatter.

## 6. Design system (Figma)

Built out as a complete system in the Figma file. Implementation reads tokens via CSS variables and components map 1:1 to React components.

### Token collections

| Collection | Tokens                                                                | Modes       |
| ---------- | --------------------------------------------------------------------- | ----------- |
| Primitives | 7 palette colors + 16 numeric sizes (4–999, content-/article-width)   | Value       |
| Color      | 7 semantic tokens (`color/bg`, `color/text`, `color/accent`, etc.)    | Light, Dark |
| Spacing    | 11 tokens (`spacing/4xs`–`spacing/5xl`, aliased to size primitives)   | Value       |
| Radius     | 3 tokens (`radius/sm`, `radius/md`, `radius/full`)                    | Value       |
| Layout     | 2 tokens (`layout/content-width` = 640, `layout/article-width` = 680) | Value       |
| Motion     | 3 durations (100/180/300ms) + 2 easings                               | Value       |

All variables have explicit scopes (no `ALL_SCOPES`) and web code syntax (`var(--token-name)`).

### Typography

16 text styles in three families:

| Style                 | Family | Weight   | Size | Line-height |
| --------------------- | ------ | -------- | ---- | ----------- |
| display/project-title | Sans   | SemiBold | 38   | 120%        |
| display/article-title | Sans   | SemiBold | 34   | 125%        |
| heading/page          | Sans   | SemiBold | 28   | 130%        |
| heading/article-h2    | Serif  | SemiBold | 22   | 140%        |
| body/large            | Sans   | Regular  | 18   | 150%        |
| body/article          | Serif  | Regular  | 17   | 175%        |
| body/default          | Sans   | Regular  | 16   | 160%        |
| body/small            | Sans   | Regular  | 14   | 160%        |
| body/caption          | Sans   | Regular  | 13   | 160%        |
| mono/date             | Mono   | Regular  | 13   | 150%        |
| mono/code             | Mono   | Regular  | 14   | 165%        |
| label/section         | Sans   | Medium   | 12   | 130% +1.2px |
| label/footer          | Sans   | Regular  | 12   | 150%        |
| label/pill            | Sans   | Medium   | 10   | 130% +1.0px |
| nav/link              | Sans   | Regular  | 14   | 150%        |
| nav/wordmark          | Sans   | Medium   | 16   | 150%        |

**Family role:** Sans for UI and most body; Serif **only** on `/writing/<slug>` article body (and `body/article` + `heading/article-h2`); Mono for dates, code blocks, and structured CV metadata.

### Color (Light mode anchors)

| Token              | Hex       | Role                                                                                                                                                     |
| ------------------ | --------- | -------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `color/bg`         | `#FAF7F2` | Page background                                                                                                                                          |
| `color/bg-subtle`  | `#F2EDE5` | Code block background                                                                                                                                    |
| `color/border`     | `#E8E2D6` | Hairlines and dividers                                                                                                                                   |
| `color/text`       | `#1F1B16` | Primary text                                                                                                                                             |
| `color/text-muted` | `#6E665A` | Subtitles, captions, footer                                                                                                                              |
| `color/text-faint` | `#9D9588` | Inactive nav, decorative dates                                                                                                                           |
| `color/accent`     | `#7A5F2E` | Links and hover state. Dark mode: `palette/amber-light` `#C9A86A` (re-aliased after Phase 4 audit revealed `#7A5F2E` failed contrast on `color/bg` Dark) |

**Dark mode** values are inverted-alias placeholders for v1. The mode is wired and switchable; values are tunable without restructuring. Specifically still placeholder: `color/bg-subtle`, `color/border`, `color/text-muted`, `color/text-faint`.

### Components (15)

| #   | Component           | Variants                                          | Notes                                                  |
| --- | ------------------- | ------------------------------------------------- | ------------------------------------------------------ |
| 1   | Status Pill         | status = Live, Archived, WIP                      | Border-outlined pill + uppercase label                 |
| 2   | Section Label       | — (`label` TEXT property)                         | Hairline + uppercase muted label                       |
| 3   | Link Arrow          | direction = Forward, Back (`label` TEXT property) | `Label →` and `← Label` in accent                      |
| 4   | Avatar              | size = 96, 120                                    | Circle with image fill                                 |
| 5   | Page Header         | — (`title`, `subtitle` TEXT properties)           | H1 + muted one-liner                                   |
| 6   | Nav                 | active = About, Work, Projects, Writing, None     | Includes Theme Toggle instance                         |
| 7   | Footer              | —                                                 | Stacked socials + © with border-top                    |
| 8   | Writing List Item   | — (`date`, `title` TEXT properties)               | Mono date + sans title                                 |
| 9   | Education Row       | — (`date`, `degree` TEXT properties)              | Mono date range + degree                               |
| 10  | Project Card        | status = Live, Archived, WIP                      | Preview row: hero crop + name + pill + tagline + links |
| 11  | Role Card           | expanded = True, False                            | Chevron, role/company, optional description + skills   |
| 12  | Theme Toggle        | mode = Light, Dark                                | ☽ swaps to ☼ at 22px                                   |
| 13  | Mobile Nav          | —                                                 | Wordmark + toggle + hamburger                          |
| 14  | Mobile Footer       | —                                                 | Same as desktop, narrower width                        |
| 15  | Mobile Menu Overlay | —                                                 | Full-drawer with × close, big nav links, theme row     |

Every component binds fills/strokes to `color/*`, padding/gap to `spacing/*`, corners to `radius/*`. Text uses `textStyleId`. No hardcoded values inside components.

## 7. Pages — layout structure

All page bodies use a single centered content column. Width: 640px for index/content pages; 680px for `/writing/<slug>` and `/projects/<slug>` (the slightly wider article column).

### `/` Homepage

```
Nav
Hero
  Avatar (96px)
  Hi, I'm Ivan.
  Software engineer.
── Latest writing
  [5 entries: mono date + title, vertically stacked]
  All writing →
Footer
```

### `/about`

```
Nav
About (H1)
Photo (120px circle)
Bio paragraphs (2–3)
── Now
  [What you're focused on this season]
── Elsewhere
  github · linkedin · email   (inline, amber)
Footer
```

### `/work`

```
Nav
Page header (Work + one-line subtitle)
Download CV (PDF) →   (at top, right after header)
── Role 1 (expanded by default — current role)
  Mono date · chevron
  Senior Staff Engineer · [Company]
  One-line blurb
  Description paragraph(s)
  SKILLS  Go · Python · Postgres · ...
── Role 2 (collapsed)
── Role 3 (collapsed)
── Role 4 (collapsed)
── Education
  Mono date · MSc Computer Science, [University]
  Mono date · BSc Computer Science, [University]
Footer
```

### `/projects` (index)

```
Nav
Page header (Projects + one-line subtitle)
── Project card (preview row)
  [Hero 160×120 left] [Name + status pill, tagline, action links]
── Project card
── Project card
Footer
```

### `/projects/<slug>`

```
Nav
← All projects        (top, mirrors article back link)
Title
Tagline
Status pill · Released March 2024
Hero image (680 × 380)
Body paragraphs
Inline screenshot + caption
More body
── Stack
  React Native · TypeScript · Postgres · Supabase
── Links
  live · App Store · Play Store · Source  (Link Arrows)
Footer
```

Body uses `body/default` (sans) — products feel product-y; serif is reserved for `/writing`.

### `/writing` (index)

```
Nav
Page header (Writing + one-line subtitle)
── 2026
  [Entries: mono date + title, vertically stacked]
── 2025
  [Entries]
Footer
```

Year headers double as section labels (hairline + uppercase mono year).

### `/writing/<slug>` (article)

```
Nav
← All writing         (top)
Title (display/article-title, serif optional — currently sans)
Date · N min read     (mono metadata)
Body paragraphs (body/article — serif)
Subheading (heading/article-h2 — serif)
Body
Code block (bg-subtle, monospace, build-time syntax highlighted via Shiki)
More body
Footer
```

## 8. Responsive design

### Breakpoints

Tailwind defaults — no customization.

| Prefix    | Min-width | Layout                          |
| --------- | --------- | ------------------------------- |
| `0–767px` | —         | Mobile                          |
| `md:`     | **768px** | Desktop layout switches on here |
| `lg:`     | 1024px    | (no specific behavior change)   |
| `xl:`     | 1280px    | (no specific behavior change)   |

### Mobile (0–767px)

- Viewport designed at **390px** baseline.
- Page padding: 24px sides.
- Content column fills width minus padding (342px max).
- Nav: wordmark + theme toggle + hamburger. Hamburger opens Mobile Menu Overlay (full-screen drawer with stacked 28px Sans Medium nav links + theme row).
- Footer: stacks vertically (`github · linkedin · email` line 1, `© 2026` line 2).
- Display type sizes shrink: project-title 38→30, article-title 34→28, heading/page 28→24, article body 17→16.
- Writing list rows stack vertically (date on top, title below) instead of horizontally.
- Project Cards stack the hero image above the text instead of side-by-side.

### Tablet (768–1023px) — "md:"

- Viewport designed at **768px**.
- Uses the desktop layout (no hamburger, full inline nav).
- Page padding via Nav/Footer internal 64px sides (effective 640 content + 64 gutter each side).
- Content column stays 640px; article column 680px. Centered.
- Same desktop component instances; instances are `layoutSizingHorizontal: FILL` so they resize cleanly.

### Desktop (≥1024px)

- Viewport designed at **1440px**.
- Same content column widths (640 / 680). Lots of side whitespace at wider viewports — intentional.

### Long-text wrap behavior

Critical: text nodes inside horizontal containers (writing-list rows, work-role lines) must `flex: 1; min-width: 0;` to wrap rather than overflow. In Tailwind: parent uses `flex`, long-text child uses `flex-1 min-w-0`. Verified in Figma with 2-line writing title and 3-line article H1.

## 9. Theme (dark mode)

- **Toggle:** sun/moon glyph in the nav (right side). Single button.
- **First paint:** read `localStorage.theme` if set; else respect `prefers-color-scheme`. Set `data-theme="dark"` (or absence for light) on `<html>` via inline `<script>` in `<head>` **before React hydration** to avoid flash.
- **Toggle behavior:** click swaps `data-theme`, writes to `localStorage.theme`.
- **CSS:** `html[data-theme="dark"]` overrides every `--color-*` variable to the Dark mode value.
- **No third "system" state in v1** (per explicit decision). Two states only.

## 10. Accessibility

Full spec on the Figma "Accessibility" page. Highlights:

### Keyboard navigation

- Skip link is first focusable element. `href="#main"` → focuses `<main>`.
- Nav links and Theme Toggle are inline tab stops; Theme Toggle is a `<button>`.
- Writing list rows: whole row is one `<a>`; date and title sit inside.
- Project Cards: whole card is one `<a>` (consistent with writing rows).
- Role Card: `<button aria-expanded>` trigger + adjacent `<div role="region">` region (see §5). Enter/Space toggles. Inner links are tabbable only when expanded (the region carries `inert` while closed).

### ARIA & semantic HTML

| Surface        | Element                                                                    | Notes                                                                  |
| -------------- | -------------------------------------------------------------------------- | ---------------------------------------------------------------------- |
| Header         | `<header>`                                                                 |                                                                        |
| Nav            | `<nav aria-label="Primary">`                                               | Active page: `aria-current="page"`                                     |
| Theme Toggle   | `<button>`                                                                 | `aria-label="Switch to dark mode"` (swaps to "Switch to light mode")   |
| Main content   | `<main id="main">`                                                         | Skip link target                                                       |
| Section labels | `<h2 class="label">`                                                       | Styled as small uppercase; semantically h2                             |
| Writing entry  | `<article>`                                                                | `<time datetime="YYYY-MM-DD">` for date                                |
| Status Pill    | `<span aria-label="Status: Live">`                                         |                                                                        |
| Role Card      | `<button aria-expanded>` + `<div role="region" aria-labelledby="…" inert>` | Custom disclosure for smooth animation. `inert` removed when expanded. |
| Footer         | `<footer>`                                                                 |                                                                        |

### Focus ring

- Effect style `focus/ring` documented in Figma: 2px amber outer ring, 0 offset (CSS: `outline: 2px solid var(--color-accent); outline-offset: 2px;`).
- Applied via `focus-visible:` (not `focus:`) — visible only on keyboard focus.

### Contrast (verified)

| Pair             | Light  | Dark   | Verdict                                                                                 |
| ---------------- | ------ | ------ | --------------------------------------------------------------------------------------- |
| text on bg       | 16.0:1 | 16.0:1 | AAA                                                                                     |
| text-muted on bg | 5.3:1  | 5.8:1  | AA                                                                                      |
| accent on bg     | 5.6:1  | 7.6:1  | AA (Dark uses amber-light)                                                              |
| text-faint on bg | 2.8:1  | 3.0:1  | **Intentionally low** — use ONLY for inactive nav and decorative dates, never body text |

### Reduced motion

```css
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

(1ms, not 0ms — some libraries treat 0 as "skip end state.")

### Interactive states recipe

Per States & Motion doc page. Each interactive surface implements `hover`, `focus-visible`, `active` via Tailwind modifiers using the Motion variables for transitions.

## 11. Performance budget

For a static text site this should be effortless:

- HTML: <20KB gzipped per page
- CSS: <15KB gzipped (Tailwind purged)
- JS: <2KB total across the site. Three small handlers: Theme Toggle (~20 lines), Mobile Menu Overlay open/close (~15 lines), Role Card disclosure (~12 lines). Everything else is zero JS.
- LCP: <1s on slow 3G
- Lighthouse: target 100/100/100/100

Static export + Cloudflare Pages CDN edge caching makes these targets straightforward.

## 12. Build & deploy

### Local dev

```
pnpm install
pnpm dev          # http://localhost:3000
pnpm build        # produces out/
```

### CI (GitHub Actions, optional)

On PR + push to `main`:

- `pnpm install --frozen-lockfile`
- `pnpm typecheck` (`tsc --noEmit`)
- `pnpm lint` (eslint)
- `pnpm build`

Cloudflare Pages handles its own deploy via the GitHub integration — every push to `main` deploys production; every PR gets a preview URL.

### Domain

- `heyivan.dev` already registered.
- Cloudflare for DNS. Custom domain added in Pages dashboard; CNAME / A records handled automatically.
- HTTPS automatic via Cloudflare.

## 13. Out of scope (v1)

- RSS / Atom feeds
- Newsletter signup
- Search
- Comments
- Analytics
- Per-post OG image generation (single static fallback)
- Code Connect Figma↔code mapping
- Dark mode "follow system" third state
- Internationalization
- Mobile menu open animation (CSS transition is fine, no Framer Motion)

## 14. Open questions / future work

- **Real dark mode color values** for `bg-subtle`, `border`, `text-muted`, `text-faint` — currently placeholder inverted-aliases. Tune before launch.
- **`/now` page** — folded into `/about` in v1. If it becomes substantial, split out as `/now` (and submit to nownownow.com).
- **Search** — when archive grows past ~30 posts, evaluate a static client-side index (Pagefind or similar).
- **Comments** — explicit reject for v1. Reconsider if discoverability needs a boost.
- **Newsletter** — explicit reject. May add if a subscription channel becomes necessary.
- **Mobile menu animation** — instant open/close in v1. Could add a 180ms slide-in transition.
- **Per-post OG images** — generate at build with `@vercel/og` or `satori` when a post strategy emerges.
- **Tablet portrait nav** — at 768–900px the desktop nav fits but feels tight. Consider micro-adjustments to padding if visual review reveals issues.
- **Mobile menu overlay backdrop** — currently the overlay fills the viewport solid. Could add a backdrop-blur on the underlying page if desired.

## 15. References

- Figma file (all artifacts): https://www.figma.com/design/l4Zcba47fC7l6JSa7JSUMg
  - **Cover** — versioning, contents
  - **Foundations** — color, typography, spacing, radius swatches
  - **States & Motion** — interactive recipes per component, focus ring, motion tokens, reduced-motion
  - **Accessibility** — keyboard, ARIA, semantic HTML, contrast, skip link
  - **Components** — 15 components with bindings and variants
  - **Mockups** — 7 pages × 3 viewports × 2 modes (42 frames + 2 mobile menu overlay frames)
