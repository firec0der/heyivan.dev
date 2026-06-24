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
bun run build   # → out/
```

## Dev env

Run `next dev` and Storybook in containers — only Docker required, no local Node or bun. Works on macOS and Linux. Copy the committed defaults to a local `.env` once (gitignored):

```
cp .env.example .env
```

```
docker compose up -d     # build (first run) + start both services in the background
docker compose logs -f   # tail logs from both services
docker compose down      # stop (named volumes persist — fast next start)
docker compose down -v   # stop + wipe node_modules volumes (clean reinstall on next up)
```

- Next.js dev: http://localhost:3344 (override with `WEB_PORT`)
- Storybook: http://localhost:3345 (override with `STORYBOOK_PORT`)

`node_modules` lives in named volumes kept off the host bridge (avoids VirtioFS overhead and install conflicts on macOS). The host project is bind-mounted in, so source edits are visible to the containers immediately.

### Live reload (HMR)

Both dev servers hot-reload on save. The catch in Docker is that the file watcher and the HMR socket both cross the container boundary:

- **File watching.** On macOS (VirtioFS) inotify events generally reach the container, so polling stays off. On Linux they don't cross the bind-mount namespace, so Storybook's Vite watcher needs `CHOKIDAR_USEPOLLING=true` (shipped enabled in `.env.example`). Next.js uses `WATCHPACK_POLLING` (default `false`) — turn it on if HMR feels sluggish on macOS. Polling is heavier on CPU, so it's left off wherever events work natively.
- **Storybook HMR WebSocket.** The browser opens Storybook's HMR socket against the host port (3345), not the container's internal `6006`. `STORYBOOK_HMR_CLIENT_PORT` (set to `STORYBOOK_PORT` in compose) is wired into Vite's `server.hmr.clientPort` in `.storybook/main.ts` so the socket connects to the mapped port — without it, live reload silently fails to connect.

### Dependency changes

`bun add` on the host rewrites `bun.lock`, which an `inotifywait` watcher in the running containers picks up — it reruns `bun install` automatically, no restart needed. This is separate from HMR: HMR reloads code, the watcher reconciles dependencies.

After changing the `Dockerfile` or the pinned bun version, reseed the volumes with a clean rebuild:

```
docker compose down -v && docker compose up -d --build
```
