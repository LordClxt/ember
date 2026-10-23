FROM node:24-alpine AS build
# Bun installs dependencies and runs scripts; Node stays the runtime.
COPY --from=oven/bun:1.4.4-alpine /usr/local/bin/bun /usr/local/bin/bun
WORKDIR /app
COPY package.json bun.lock ./
RUN bun install --frozen-lockfile
COPY . .
RUN bun run build && rm -rf node_modules && bun install --frozen-lockfile --production

FROM node:24-alpine
WORKDIR /app
ENV NODE_ENV=production
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist
# Migrations are applied at boot when DB_AUTO_MIGRATE=true.
COPY --from=build /app/drizzle ./drizzle
COPY package.json ./
# SQLite database lives here; mount a volume to persist it.
RUN mkdir -p data && chown node:node data
EXPOSE 3000
USER node
CMD ["node", "dist/main.js"]
