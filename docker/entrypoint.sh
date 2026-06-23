#!/bin/sh
set -e

echo "[entrypoint] bun install..."
bun install

echo "[entrypoint] starting: $*"
"$@" &
SVC_PID=$!

# Watch /app for bun.lock changes.
# Use moved_to in addition to close_write to catch atomic saves
# (editors that write to a temp file then rename into place).
# bun install does not rewrite bun.lock when deps are already satisfied,
# so there is no reinstall loop.
inotifywait -m -q -e close_write,moved_to /app --format '%f' 2>/dev/null \
  | grep --line-buffered '^bun\.lock$' \
  | while IFS= read -r _; do
      echo "[entrypoint] bun.lock changed — reinstalling..."
      bun install || echo "[entrypoint] bun install failed — check logs"
    done &

wait "$SVC_PID"
