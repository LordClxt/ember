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

The three apps are **independent** (each has its own dependencies and build) but share a single **API contract**. Its types are written once in `packages/contracts` (`@ember/contracts`) and imported by the API and the web app; the mobile app (Kotlin) mirrors them in its `*Dto.kt` files.

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

### Shared types (`packages/contracts`)

```
packages/contracts/src/
├── index.d.ts                  # re-exports everything
├── common/
│   ├── api-error.type.d.ts     # ApiErrorBody
│   └── paginated.type.d.ts     # PaginationQuery, PaginationMeta, Paginated<T>
└── item/
    └── item.type.d.ts          # Item, CreateItemInput, UpdateItemInput
```

| Side | Usage |
|------|-------|
| API | `CreateItemDto implements CreateItemInput`, `PaginationQueryDto implements PaginationQuery`, error body typed as `ApiErrorBody`, entity checked against `Item` at compile time (`SerializedAs`) |
| Web | `lib/items.ts`, `lib/api-client.ts`, components and hooks import the types |
| Mobile | manual mirror in `ItemDto.kt` |

The files are `.d.ts` (types only, erased at compile time) resolved through the `@ember/contracts` alias in both `tsconfig.json` files: no extra build or install. Details: [packages/contracts/README.md](../packages/contracts/README.md).

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
