# Build from the repo root: docker build -f apps/api/Dockerfile .
FROM node:24-alpine AS build
# Bun installs dependencies and runs scripts; Node stays the runtime.
COPY --from=oven/bun:1.4.4-alpine /usr/local/bin/bun /usr/local/bin/bun
WORKDIR /repo/apps/api
COPY apps/api/package.json apps/api/bun.lock ./
RUN bun install --frozen-lockfile
# API types shared with the web app (`@ember/contracts` path alias).
COPY packages/contracts /repo/packages/contracts
COPY apps/api ./
RUN bun run build && rm -rf node_modules && bun install --frozen-lockfile --production

FROM node:24-alpine
WORKDIR /app
ENV NODE_ENV=production
COPY --from=build /repo/apps/api/node_modules ./node_modules
COPY --from=build /repo/apps/api/dist ./dist
# Migrations are applied at boot when DB_AUTO_MIGRATE=true.
COPY --from=build /repo/apps/api/drizzle ./drizzle
COPY apps/api/package.json ./
# SQLite database lives here; mount a volume to persist it.
RUN mkdir -p data && chown node:node data
EXPOSE 3000
USER node
CMD ["node", "dist/main.js"]
