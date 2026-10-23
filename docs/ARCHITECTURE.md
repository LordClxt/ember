# Architecture

## Overview

```
┌────────────────┐        ┌───────────────────────┐
│  Web (TanStack │──HTTP──▶                       │
│  Start, SSR)   │        │   API (NestJS)        │
└────────────────┘        │   /api/v1/*           │──▶ Repository ──▶ Drizzle
┌────────────────┐        │                       │     (SQLite · Postgres · MySQL)
│ Mobile (KMP)   │──HTTP──▶   /api/health         │
│ Android · iOS  │        └───────────────────────┘
└────────────────┘
```

The API and the web app form a **Bun workspace** with `packages/contracts`; the mobile app builds on its own with Gradle. All three share a single **API contract**: its types and rules (limits, defaults) are written once in `packages/contracts` (`@ember/contracts`) and imported by the API and the web app; the mobile app (Kotlin) mirrors them in its `*Dto.kt` files.

## API contract

Prefix: `/api`, URI versioning (`/api/v1`). The OpenAPI documentation is generated at `/api/docs`.

| Method | Route | Response |
|--------|-------|----------|
| `GET` | `/api/health` | Terminus status |
| `GET` | `/api/v1/items?page=1&limit=20` | `Paginated<Item>` |
| `GET` | `/api/v1/items/:id` | `Item` |
| `POST` | `/api/v1/items` | `Item` (201) |
| `PATCH` | `/api/v1/items/:id` | `Item` |
| `DELETE` | `/api/v1/items/:id` | 204 |

### Common formats

```jsonc
// Paginated list
{ "data": [ /* T */ ], "meta": { "page": 1, "limit": 20, "total": 42 } }

// Error (every error goes through AllExceptionsFilter)
{ "statusCode": 400, "message": ["name should not be empty"], "path": "/api/v1/items", "timestamp": "…" }
```

Dates are ISO 8601 (UTC). Ids are UUID v7 (sortable by creation time).

### Shared contract (`packages/contracts`)

```
packages/contracts/src/
├── index.ts                    # re-exports everything
├── common/
│   ├── api-error.contract.ts   # ApiErrorBody
│   └── pagination.contract.ts  # PAGINATION, PaginationQuery, PaginationMeta, Paginated<T>
└── item/
    └── item.contract.ts        # ITEM_NAME_MAX_LENGTH, ITEM_DESCRIPTION_MAX_LENGTH, Item, CreateItemInput, UpdateItemInput
```

| Side | Usage |
|------|-------|
| API | class-validator DTOs `implements` the types and take their limits from the constants (`@MaxLength(ITEM_NAME_MAX_LENGTH)`, `@Max(PAGINATION.MAX_LIMIT)`); Swagger and Drizzle column lengths use the same constants; error body typed as `ApiErrorBody`; entity checked against `Item` at compile time (`SerializedAs`) |
| Web | `lib/`, components and hooks import the types; the form uses `ITEM_NAME_MAX_LENGTH`, the client and routes use `PAGINATION` |
| Mobile | manual mirror in `ItemDto.kt` and `ItemsRepository.PAGE_SIZE` |

`@ember/contracts` is a Bun workspace package written in plain TypeScript (no dependencies), compiled to `dist/` by `tsc`. The root `postinstall` builds it and every api/web script rebuilds it first. Details: [packages/contracts/README.md](../packages/contracts/README.md).

## Patterns per layer

| Layer | API (NestJS) | Web (TanStack Start) | Mobile (KMP) |
|-------|--------------|----------------------|--------------|
| Transport | Controller | `lib/api-client.ts` + `lib/<domain>.ts` | `KtorItemsApi` |
| Validation | DTO + `ValidationPipe` | route `validateSearch`, forms | — |
| Orchestration | Service | Route loader + TanStack Query (`queryOptions`, mutation hooks) | ViewModel (`StateFlow`) |
| Data access | Repository (token) → Drizzle | — (the API owns the database) | Repository (domain interface) |
| Errors | `AllExceptionsFilter` | `ApiError` + `defaultErrorComponent` / `notFound()` | `safeApiCall` → `AppResult` |
| DI | Nest modules | Router context (`queryClient`) | Koin |

### Principles

- **Structure by domain**: `modules/item/` in the API, `components/items/` + `lib/items.ts` + `routes/items/` in the web app, `features/items/` in the mobile app.
- **Depend on abstractions**: services / ViewModels consume interfaces (repositories), never the concrete implementation.
- **Thin layers**: controllers / components / screens hold no logic; they delegate.
- **Centralised errors**: one place per app turns an error into a user message.
- **No business logic in the template**: `items` is only an example to replace.

## Database

Drizzle ORM, configurable provider (`DB_PROVIDER`), **SQLite by default**. See [DATABASE.md](DATABASE.md).

## Organisation references

- API: [Clean Folder & File Naming Guide for NestJS](https://medium.com/@nairi.abgaryan/stop-the-chaos-clean-folder-file-naming-guide-for-backend-nest-js-and-node-331fdc6400cb), detailed in [API.md](API.md)
- Web: [TanStack Start project structure](https://royportas.com/posts/tanstack-start-project-structure), detailed in [WEB.md](WEB.md)
