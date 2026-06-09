# Match .nvmrc (Node 24 LTS). Slim base keeps the image small.
FROM node:24-bookworm-slim

# Pin bun to match local + CI. Bump in lockstep with package.json's engines.bun (if added).
ARG BUN_VERSION=1.3.14

ENV BUN_INSTALL=/usr/local/bun \
    PATH=/usr/local/bun/bin:$PATH

# bun's installer needs curl + unzip; ca-certificates for HTTPS to npm registry.
RUN apt-get update \
    && apt-get install -y --no-install-recommends ca-certificates curl unzip \
    && rm -rf /var/lib/apt/lists/* \
    && curl -fsSL https://bun.sh/install \
       | bash -s "bun-v${BUN_VERSION}" \
    && bun --version

WORKDIR /app

# Cache deps in their own layer so source changes don't bust the install.
# Source is bind-mounted at runtime (see docker-compose.yml) — no COPY here.
COPY package.json bun.lock ./
RUN bun install --frozen-lockfile

EXPOSE 3000 6006
