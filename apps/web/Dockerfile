FROM node:24-alpine AS build
# Bun installs dependencies and runs scripts; Node stays the runtime.
COPY --from=oven/bun:1.4.4-alpine /usr/local/bin/bun /usr/local/bin/bun
WORKDIR /app
COPY package.json bun.lock ./
RUN bun install --frozen-lockfile
COPY . .
# Public env vars are inlined at build time.
ARG VITE_API_URL=http://localhost:3000/api/v1
ENV VITE_API_URL=$VITE_API_URL
RUN bun run build

FROM node:24-alpine
WORKDIR /app
ENV NODE_ENV=production PORT=3001
# Nitro bundles the server and its dependencies into .output.
COPY --from=build /app/.output ./.output
EXPOSE 3001
USER node
CMD ["node", ".output/server/index.mjs"]
