# AGENTS.md

Guide for AI assistants (Claude Code, Copilot, Cursor…) working on this repository.

## Project

**Ember** monorepo: `apps/api` (NestJS + Drizzle), `apps/web` (TanStack Start), `apps/mobile` (KMP), and `packages/contracts` (API types shared by the API and the web app). Each app has its own build; there is no monorepo tool.

**Language: everything in the repository is written in English** (code, comments, docs, commit messages, UI strings).

## Commands

Package manager: **Bun** (`bun.lock` lockfiles, never `package-lock.json`). Node stays the runtime.

| App | Install | Test | Build |
|-----|---------|------|-------|
| api | `bun install --cwd apps/api` | `bun run --cwd apps/api test && bun run --cwd apps/api test:e2e` | `bun run --cwd apps/api build` |
| web | `bun install --cwd apps/web` | `bun run --cwd apps/web test && bun run --cwd apps/web typecheck` | `bun run --cwd apps/web build` |
| mobile | — | `cd apps/mobile && ./gradlew :shared:testAndroidHostTest` | `./gradlew :androidApp:assembleDebug` |

## Types shared by front and back: `@ember/contracts`

Types that travel as JSON between the API and the web app (request bodies, responses, pagination, errors) are declared **once** in [`packages/contracts`](packages/contracts/README.md) and imported on both sides:

```ts
import type { CreateItemInput, Item, Paginated } from '@ember/contracts'
```

- **Never redeclare** in the API or the web app an interface that already exists in the contracts: import it.
- **New exchanged type** → `packages/contracts/src/<domain>/<domain>.type.d.ts`, re-exported from `src/index.d.ts`.
- **Types only**: `.d.ts` files (interfaces, `type`, literal unions). No `enum`, constants or functions; always `import type` (lint and typecheck reject a value import).
- **JSON format**: dates are ISO 8601 `string`s (API entities use `Date`).
- **API**: DTOs `implements` the request type (`CreateItemDto implements CreateItemInput`); the entity is checked against the response type with `AssertTrue<SerializedAs<Item, ItemContract>>` (`common/types/serialized.type.ts`): any drift breaks the build.
- **Web**: `lib/<domain>.ts`, components and hooks import types from `@ember/contracts`.
- **Mobile**: Kotlin cannot import these types; mirror every change in `*Dto.kt`.
- Anything that is **not** an HTTP exchange stays local (React props, Drizzle types, form state).

## Rules

- Read [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) and [docs/CONVENTIONS.md](docs/CONVENTIONS.md) before changing the structure.
- Every new feature follows the `item` (API) / `items` (web, mobile) pattern of the app concerned.
- API: follow the structure and naming of [docs/API.md](docs/API.md) (`core/`, `common/`, `modules/<singular>/`, `[action]-[entity].dto.ts`…).
- Web: follow [docs/WEB.md](docs/WEB.md) (file-based routes, `components/ui` + `components/<domain>`, `lib/`, `hooks/`). Never edit `routeTree.gen.ts`.
- Database: change **all three** schemas (`sqlite`, `postgres`, `mysql`), then run `bun run db:generate:all` ([docs/DATABASE.md](docs/DATABASE.md)).
- An API contract change starts in `packages/contracts`, then goes into the NestJS DTOs, the KMP `*Dto.kt` files and `docs/ARCHITECTURE.md` (the web app follows automatically through `@ember/contracts`).
- The API is ESM: relative imports end with `.js`.
- Add or update tests with every change.
