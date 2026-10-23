# Build from the repo root (Bun workspace): docker build -f apps/web/Dockerfile .
FROM node:24-alpine AS build
# Bun installs dependencies and runs scripts; Node stays the runtime.
COPY --from=oven/bun:1.4.4-alpine /usr/local/bin/bun /usr/local/bin/bun
WORKDIR /repo
COPY package.json bun.lock ./
COPY apps/api/package.json apps/api/
COPY apps/web/package.json apps/web/
COPY packages/contracts/package.json packages/contracts/
RUN bun install --frozen-lockfile --filter ember-web
COPY packages/contracts packages/contracts
COPY apps/web apps/web
# Public env vars are inlined at build time.
ARG VITE_API_URL=http://localhost:3000/api/v1
ENV VITE_API_URL=$VITE_API_URL
# `prebuild` compiles @ember/contracts first; Nitro inlines it into .output.
RUN cd apps/web && bun run build

FROM node:24-alpine
WORKDIR /app
ENV NODE_ENV=production PORT=3001
# Nitro bundles the server and its dependencies into .output.
COPY --from=build /repo/apps/web/.output ./.output
EXPOSE 3001
USER node
CMD ["node", ".output/server/index.mjs"]
