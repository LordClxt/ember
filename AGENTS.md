# AGENTS.md

Guide for AI assistants (Claude Code, Copilot, Cursor…) working on this repository.

## Project

**Ember** monorepo: `apps/api` (NestJS + Drizzle), `apps/web` (TanStack Start), `apps/mobile` (KMP), and `packages/contracts` (`@ember/contracts`: API constants and types shared by the API and the web app). `apps/api`, `apps/web` and `packages/contracts` form a **Bun workspace** (one root `bun.lock`); the mobile app builds with Gradle. There is no monorepo task runner.

**Language: everything in the repository is written in English** (code, comments, docs, commit messages, UI strings).

## Commands

Package manager: **Bun** (a single root `bun.lock`, never `package-lock.json`). Node stays the runtime. Install everything once from the root with `bun install`; its `postinstall` builds `@ember/contracts`, and every api/web script rebuilds it first (`pre*` scripts).

| App | Install | Test | Build |
|-----|---------|------|-------|
| contracts | `bun install` (root) | `bun run --cwd packages/contracts typecheck` | `bun run --cwd packages/contracts build` |
| api | `bun install` (root) | `bun run --cwd apps/api test && bun run --cwd apps/api test:e2e` | `bun run --cwd apps/api build` |
| web | `bun install` (root) | `bun run --cwd apps/web test && bun run --cwd apps/web typecheck` | `bun run --cwd apps/web build` |
| mobile | — | `cd apps/mobile && ./gradlew :shared:testAndroidHostTest` | `./gradlew :androidApp:assembleDebug` |

## Shared by front and back: `@ember/contracts`

Anything the API and the web app must agree on is written **once** in [`packages/contracts`](packages/contracts/README.md) and imported on both sides. **Never duplicate it** in `apps/api` or `apps/web`: import it, and add it to the contracts if it is missing.

| What | Example | API | Web |
|------|---------|-----|-----|
| Types of HTTP requests / responses / errors | `Item`, `CreateItemInput`, `Paginated<T>`, `ApiErrorBody` | DTOs `implements` them, entity checked with `SerializedAs` | `lib/`, components, hooks |
| Validation limits and defaults | `ITEM_NAME_MAX_LENGTH`, `PAGINATION.MAX_LIMIT` | class-validator decorators (`@MaxLength(ITEM_NAME_MAX_LENGTH)`), Swagger, Drizzle column lengths | form attributes (`maxLength`), default query values |
| Enumerations exchanged over HTTP | `export const ITEM_STATUSES = ['draft', 'published'] as const` + `type ItemStatus = (typeof ITEM_STATUSES)[number]` | `@IsIn(ITEM_STATUSES)` | selects, labels |

```ts
import { ITEM_NAME_MAX_LENGTH, type CreateItemInput } from '@ember/contracts'
```

- **Validation stays NestJS-native**: DTOs are class-validator classes in `apps/api`; they take every number and list from the contracts and `implements` the contract type. Do not hard-code a limit, a default or an allowed value that exists (or should exist) in the contracts.
- **File**: `packages/contracts/src/<domain>/<domain>.contract.ts` (singular domain), re-exported from `src/index.ts`.
- **Plain TypeScript, no dependencies**: constants, interfaces, `as const` arrays and their union types. No framework imports (no Nest, React, class-validator, Drizzle) so both apps can load it.
- **JSON format**: dates are ISO 8601 `string`s (API entities use `Date`); `AssertTrue<SerializedAs<Entity, Contract>>` (`apps/api/src/common/types/serialized.type.ts`) breaks the build if they drift.
- **Mobile**: Kotlin cannot import the package; mirror changes in `*Dto.kt` and constants such as `ItemsRepository.PAGE_SIZE` (their comments point to the contract).
- Anything that is **not** shared stays local (React props, Drizzle-only types, form state, Nest-only helpers).

## Rules

- Read [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) and [docs/CONVENTIONS.md](docs/CONVENTIONS.md) before changing the structure.
- Every new feature follows the `item` (API) / `items` (web, mobile) pattern of the app concerned.
- API: follow the structure and naming of [docs/API.md](docs/API.md) (`core/`, `common/`, `modules/<singular>/`, `[action]-[entity].dto.ts`…).
- Web: follow [docs/WEB.md](docs/WEB.md) (file-based routes, `components/ui` + `components/<domain>`, `lib/`, `hooks/`). Never edit `routeTree.gen.ts`.
- Database: change **all three** schemas (`sqlite`, `postgres`, `mysql`), then run `bun run db:generate:all` ([docs/DATABASE.md](docs/DATABASE.md)).
- An API contract change starts in `packages/contracts`, then goes into the NestJS DTOs, the KMP `*Dto.kt` files and `docs/ARCHITECTURE.md` (the web app follows through `@ember/contracts`).
- The API is ESM: relative imports end with `.js`.
- Add or update tests with every change.
