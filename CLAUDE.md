# CLAUDE.md

Conventions for any AI coding assistant working on this repo. Read this before opening a PR.

## Project

`heyivan.dev` — personal site for Ivan Stetsenko. Static export (`output: 'export'`) deployed to Cloudflare Pages.

Single source of truth for structural decisions is `docs/plans/heyivan-dev-implementation.md`. Don't restate architecture in PRs, commits, or issues — link to that doc instead.

## Tech stack

- Next.js 15 (App Router, `output: 'export'`)
- React 19, TypeScript 6
- Tailwind CSS 4 — semantic color tokens in the `@theme` block of `src/app/globals.css`; utilities like `bg-canvas` / `text-fg` / `border-border`
- MDX content via `next-mdx-remote-client/rsc` (loader returns raw `body`; routes render via `<MDXRemote>`)
- Storybook 9 with `@storybook/nextjs-vite`
- Vitest, ESLint, Prettier
- bun (package manager) — pinned via `bun.lock`. `pnpm` is not installed locally; never use it
- Node 24 — pinned via `.nvmrc`

## Daily commands

Source nvm + Node 24 before every bun command:

```bash
source ~/.nvm/nvm.sh && nvm use
```

Then:

```bash
bun install
bun run dev            # next dev
bun run build          # static export to ./out
bun run test           # vitest run
bun run typecheck      # tsc --noEmit
bun run lint           # eslint .
bun run format         # prettier --write .
bun run format:check   # prettier --check .
bun run storybook      # storybook dev -p 6006
bun run build-storybook
```

Lefthook runs `typecheck` on pre-push. Don't bypass with `--no-verify`.

## Docker

A `docker-compose.yml` ships the dev server and Storybook with identical Node 24 + bun runtimes so anyone cloning the repo gets the same environment without installing bun locally.

```bash
docker compose up             # both services
docker compose up web         # just the dev server
docker compose up storybook   # just Storybook
docker compose up --build     # after package.json / bun.lock changes
```

| Service     | Host URL                | Container port | Command                            |
| ----------- | ----------------------- | -------------- | ---------------------------------- |
| `web`       | <http://localhost:3344> | 3000           | `bun run dev`                      |
| `storybook` | <http://localhost:3345> | 6006           | `bun run storybook --ci --no-open` |

**Image** — `Dockerfile` uses `node:24-bookworm-slim` (matches `.nvmrc`) and installs bun at the version pinned by `BUN_VERSION` (currently 1.3.14 — bump in lockstep with the local bun). `bun install --frozen-lockfile` is baked into the image so cold start doesn't reinstall deps. Source code is bind-mounted at runtime, not copied at build time.

**Volumes** — each service has an anonymous `/app/node_modules` volume that masks the host's install with the image's. Per-service (not shared) to avoid a race when both services first init together. Named volumes cache `/app/.next` (web) and `/app/node_modules/.cache` (storybook) across restarts.

**Hot reload on macOS** — Docker on macOS doesn't propagate inotify events across volume mounts, so the env vars `WATCHPACK_POLLING=true` (Next) and `CHOKIDAR_USEPOLLING=true` (Storybook / Vite) enable polling. Slightly higher CPU but reliable file-change detection.

**Host ports** — `3344` / `3345` instead of the upstream defaults `3000` / `6006` so the services coexist with other projects running on the standard ports.

Native (host) commands stay the same — lint, typecheck, test, build all run faster on the host than through Docker. Use Docker for long-running servers (web / storybook) and the host for everything else.

## Git workflow

- One PR per logical change. Issues track work; PRs close issues.
- Branch naming: `task/<short-slug>`.
- The author reviews and merges every PR via the GitHub UI. Agents never run `gh pr review` / `gh pr merge` / `gh pr approve`.
- Never push directly to `master`.
- Never force-push or rewrite shared history without explicit go-ahead. Local-only branches before the first push are fair game.
- Never skip hooks (`--no-verify`) or bypass signing.

### Commit approval workflow

Every commit goes through review before it lands:

1. Stage the files (`git add …`).
2. Propose: list the staged files and the exact commit message.
3. **Wait for explicit approval from the author** ("ok", "yes", "approved", "go", etc.).
4. Only then run `git commit`.

If the author asks for changes, revise the message or unstage / restage files and propose again. Never amend or commit on your own initiative — even for tiny fixes, formatting passes, or "obvious" follow-ups.

## Commit messages

Conventional-commits prefix on every commit. Reference: <https://gist.github.com/joshbuchea/6f47e86d2510bce28f8e7f42ae84c716>

| Prefix      | Use for                                                                     |
| ----------- | --------------------------------------------------------------------------- |
| `feat:`     | User-facing feature.                                                        |
| `fix:`      | Bug fix.                                                                    |
| `refactor:` | Code change that neither adds a feature nor fixes a bug.                    |
| `perf:`     | Performance improvement.                                                    |
| `test:`     | Add or correct tests only.                                                  |
| `docs:`     | Docs / comments only.                                                       |
| `style:`    | Whitespace, formatting — no behavior change.                                |
| `chore:`    | Tooling, deps, file moves, anything that doesn't modify src logic or tests. |
| `build:`    | Build system or external dependency changes.                                |
| `ci:`       | CI config changes.                                                          |
| `revert:`   | Reverts a prior commit.                                                     |

Optional scope: `refactor(content):`, `feat(ui):`, `chore(deps):` — use when it adds clarity.

Subject: imperative mood, lowercase after the prefix, no trailing period.

```
refactor(content): drop bodyHtml from Article and Project
```

Body: voice-neutral (see [Voice in written artifacts](#voice-in-written-artifacts)). End with `Refs #<n>` or `Closes #<n>` when relevant.

Don't add `Co-authored-by: Claude` or any AI signature.

## PR titles

Plain descriptive text. **No semantic prefix** on PR titles (the inner commits carry the prefix).

```
✅ MDX setup: deps + mdxOptions + components registry
❌ feat: MDX setup
```

## PR descriptions

Fixed shape:

```markdown
Closes #<N>.

## What

One-paragraph narrative or short bulleted list. Bullets use bold-inline filenames:

- **deps** — `package-a`, `package-b`.
- **`src/path/to/file.ts`** — one-sentence description.

## <focused sub-sections when useful — Tests, Components, Stories, Drive-by, Storybook wiring, …>

Use a Was / Now table for diffs.

## Notes

Quirks, gotchas, intentional choices, dep-version notes.

## Verified locally

- `bun run lint`, `bun run format:check`, `bun run typecheck`, `bun run test` (N passed)
- `bun run build` succeeds
```

Don't include:

- `## Commits` — GitHub shows commits inline.
- `## What lands` — say `## What`.
- `## Why this PR` — context speaks for itself.
- `## Verification` — say `## Verified locally`.

### Authoring issue / PR bodies via `gh`

Single-quoted heredocs skip backslash processing, so backslash-escaped backticks end up literal in the rendered markdown:

```bash
# ❌ Renders as literal \`code\` on GitHub
gh pr create --body "$(cat <<'EOF'
- **\`src/foo.ts\`** — broken inline code.
EOF
)"
```

Two safe forms:

```bash
# ✅ Raw backticks inside single-quoted heredoc
gh pr create --body "$(cat <<'EOF'
- **`src/foo.ts`** — proper inline code.
EOF
)"

# ✅ Preferred — write the body to a file, point gh at it
gh pr create --body-file /tmp/pr-body.md
gh pr edit  N --body-file /tmp/pr-body.md
gh issue create --body-file /tmp/issue-body.md
gh issue edit  N --body-file /tmp/issue-body.md
```

`--body-file` is the default — heredocs are easy to get wrong (backslash-backticks, multi-line strings, accidental shell expansion). Verify after pushing:

```bash
gh pr view N --json body --jq .body | grep -c '\\`'   # must return 0
```

Anything other than `0` means escapes leaked through. Fix with `sed -i '' 's/\\\`/\`/g' file.md`and re-push via`--body-file`.

## Voice in written artifacts

PR descriptions, commit bodies, issue bodies, plan files, design docs — anything that lands in the repo or GitHub — avoid first-person pronouns (`I`, `we`, `my`, `our`, `let's`). Use imperative, passive, or subject-as-thing instead.

| Avoid                                           | Use                                               |
| ----------------------------------------------- | ------------------------------------------------- |
| "I renamed X" / "We renamed X"                  | "Rename X" / "X was renamed" / "The PR renames X" |
| "While I was in globals.css" / "While we were…" | "Folded in:" or describe what happened            |
| "Let's also…"                                   | "Also …" or "Drive-by: …"                         |
| "I noticed…"                                    | "Note:" or describe the observation directly      |

Chat replies are unaffected — natural pronouns are fine there.

## Session-only labels

Don't use temporary labels like `PR A` / `PR B` / `Phase 1` in any persistent artifact. Reference issues and PRs by number directly: `#82`, `#80`, `#81`. A one-line descriptor is fine when context helps: `#82 (deps + mdxOptions)`.

## React component style

- Arrow function expressions. Never `function` declarations.
- Components that take children use `PropsWithChildren<T>` (or just `PropsWithChildren` when there are no extra props).
- Pass-through HTML attributes via `HTMLPassThrough<E>` from `src/lib/cn.ts`.
- Compose classNames via `cn()` from `src/lib/cn.ts` (clsx + tailwind-merge) — caller `className` always wins thanks to `tailwind-merge`.

```tsx
import type { PropsWithChildren } from 'react';
import { type ClassName, cn } from '@/lib/cn';

type Tone = 'default' | 'muted';

export const Body = ({
  children,
  className,
  tone = 'default'
}: PropsWithChildren<{ tone?: Tone }> & ClassName) => (
  <p className={cn('text-[16px] leading-[160%]', tone === 'muted' && 'text-muted', className)}>
    {children}
  </p>
);
```

## Content pipeline

Long-form content lives in `content/` as `.mdx` files with YAML frontmatter:

```
content/
  writing/<slug>.mdx     # articles
  projects/<slug>.mdx    # project pages
  data/                  # yaml (site.yaml, work.yaml)
```

The loader at `src/lib/content/loader.ts` parses frontmatter via gray-matter, validates via Zod schemas in `schemas.ts`, and returns the raw MDX `body` string. Routes render content via:

```tsx
import { MDXRemote } from 'next-mdx-remote-client/rsc';
import { mdxComponents } from '@/lib/content/mdx-components';
import { mdxOptions } from '@/lib/content/mdx-options';

<MDXRemote
  source={article.body}
  components={mdxComponents}
  options={{ mdxOptions, parseFrontmatter: false }}
/>;
```

Where to put what:

- **`src/lib/content/mdx-options.ts`** — shared remark + rehype plugin config (single source of truth).
- **`src/lib/content/mdx-components.tsx`** — registry of React components callable inside any MDX article. Add interactive demos (event-loop visualizer, callouts, etc.) here.

## Reference docs

- Architecture: `docs/plans/heyivan-dev-implementation.md`
- Design spec: `docs/specs/heyivan-dev-design.md`
- Storybook design system docs: `.storybook/Colors.mdx`
- Typography stories: `src/components/typography/*.stories.tsx`
