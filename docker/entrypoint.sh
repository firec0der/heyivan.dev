#!/bin/sh
set -e

echo "[entrypoint] bun install..."
bun install --frozen-lockfile || { echo "[entrypoint] bun install failed — check logs"; exit 1; }

echo "[entrypoint] starting: $*"

trap 'kill -TERM "$SVC_PID" "$WATCHER_PID" 2>/dev/null; wait "$SVC_PID"' TERM INT

"$@" &
SVC_PID=$!

# Watch /app for bun.lock changes via atomic rename (moved_to).
# --frozen-lockfile prevents the watcher's install from rewriting bun.lock
# and triggering a feedback loop.
inotifywait -m -q -e moved_to /app --format '%f' \
  | grep --line-buffered '^bun\.lock$' \
  | while IFS= read -r _; do
      echo "[entrypoint] bun.lock changed — reinstalling..."
      bun install --frozen-lockfile || echo "[entrypoint] bun install failed — check logs"
    done &
WATCHER_PID=$!

wait "$SVC_PID"
