# Build from the repo root (Bun workspace): docker build -f apps/api/Dockerfile .
FROM node:24-alpine AS build
# Bun installs dependencies and runs scripts; Node stays the runtime.
COPY --from=oven/bun:1.4.4-alpine /usr/local/bin/bun /usr/local/bin/bun
WORKDIR /repo
COPY package.json bun.lock ./
COPY apps/api/package.json apps/api/
COPY apps/web/package.json apps/web/
COPY packages/contracts/package.json packages/contracts/
RUN bun install --frozen-lockfile --filter ember-api
COPY packages/contracts packages/contracts
COPY apps/api apps/api
# `prebuild` compiles @ember/contracts first.
RUN cd apps/api && bun run build
RUN rm -rf node_modules && bun install --frozen-lockfile --production --filter ember-api --ignore-scripts

FROM node:24-alpine
# Same layout as the workspace: node_modules/@ember/contracts links to packages/contracts.
WORKDIR /repo
ENV NODE_ENV=production
COPY --from=build /repo/node_modules ./node_modules
COPY --from=build /repo/packages/contracts/package.json packages/contracts/
COPY --from=build /repo/packages/contracts/dist packages/contracts/dist
COPY --from=build /repo/apps/api/package.json apps/api/
COPY --from=build /repo/apps/api/dist apps/api/dist
# Migrations are applied at boot when DB_AUTO_MIGRATE=true.
COPY --from=build /repo/apps/api/drizzle apps/api/drizzle
WORKDIR /repo/apps/api
# SQLite database lives here; mount a volume to persist it.
RUN mkdir -p data && chown node:node data
EXPOSE 3000
USER node
CMD ["node", "dist/main.js"]
