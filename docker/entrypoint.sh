#!/bin/sh
set -e

echo "[entrypoint] bun install..."
bun install --frozen-lockfile

echo "[entrypoint] starting: $*"
"$@" &
SVC_PID=$!

trap 'kill -TERM "$SVC_PID" 2>/dev/null; wait "$SVC_PID"' TERM INT

# Watch /app for bun.lock changes via atomic rename (moved_to).
# --frozen-lockfile prevents the watcher's install from rewriting bun.lock
# and triggering a feedback loop.
inotifywait -m -q -e moved_to /app --format '%f' 2>/dev/null \
  | grep --line-buffered '^bun\.lock$' \
  | while IFS= read -r _; do
      echo "[entrypoint] bun.lock changed — reinstalling..."
      bun install --frozen-lockfile || echo "[entrypoint] bun install failed — check logs"
    done &

wait "$SVC_PID"
