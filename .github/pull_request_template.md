## What

<!-- Short description of the change -->

## Why

<!-- Context / linked issue -->

## Scope

- [ ] `packages/contracts` — `@ember/contracts` (shared API types and constants)
- [ ] `apps/api` — NestJS + Drizzle ORM
- [ ] `apps/web` — TanStack Start (React, TanStack Router/Query, Tailwind)
- [ ] `apps/mobile` — Kotlin Multiplatform (Android / iOS)

## Checklist

- [ ] Tests added or updated
- [ ] `bun run format:check` passes
- [ ] Contracts: `bun run --cwd packages/contracts typecheck`
- [ ] API: `bun run --cwd apps/api lint && bun run --cwd apps/api test && bun run --cwd apps/api test:e2e`
- [ ] Web: `bun run --cwd apps/web lint && bun run --cwd apps/web typecheck && bun run --cwd apps/web test`
- [ ] Mobile: `./gradlew :shared:testAndroidHostTest` (if touched)
- [ ] DB: the three Drizzle schemas (sqlite, postgres, mysql) updated + `bun run db:generate:all` (if touched)
- [ ] API contract change starts in `packages/contracts`, then NestJS DTOs and KMP `*Dto.kt`
- [ ] `routeTree.gen.ts` not edited by hand
- [ ] Docs updated if behaviour changed (`docs/ARCHITECTURE.md`, `docs/API.md`, `docs/WEB.md`…)
