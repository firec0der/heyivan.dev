# Match .nvmrc (Node 24 LTS). Slim base keeps the image small.
FROM node:24-bookworm-slim

# Pin bun to match package.json#packageManager. Bump both in lockstep.
ARG BUN_VERSION=1.3.14

ENV BUN_INSTALL=/usr/local/bun \
    PATH=/usr/local/bun/bin:$PATH

# inotify-tools provides inotifywait for the bun.lock watcher in entrypoint.sh.
RUN apt-get update \
    && apt-get install -y --no-install-recommends ca-certificates curl unzip inotify-tools \
    && rm -rf /var/lib/apt/lists/* \
    && curl -fsSL https://bun.sh/install \
       | bash -s "bun-v${BUN_VERSION}" \
    && bun --version

COPY docker/entrypoint.sh /usr/local/bin/entrypoint.sh
RUN chmod +x /usr/local/bin/entrypoint.sh

USER node

WORKDIR /app

# Cache deps in their own layer. At runtime, a named volume shadows /app/node_modules
# (see docker-compose.yml). On first `docker compose up`, Docker copies the image's
# node_modules into the empty named volume automatically.
COPY package.json bun.lock ./
RUN bun install --frozen-lockfile

EXPOSE 3000 6006

ENTRYPOINT ["/usr/local/bin/entrypoint.sh"]
