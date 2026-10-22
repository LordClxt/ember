FROM node:24-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build && npm prune --omit=dev

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
