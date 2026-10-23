# API — NestJS

Folder layout and naming follow the guide
[*Stop the Chaos: Clean Folder & File Naming Guide for Backend (NestJS & Node.js)*](https://medium.com/@nairi.abgaryan/stop-the-chaos-clean-folder-file-naming-guide-for-backend-nest-js-and-node-331fdc6400cb).
The database is described in [DATABASE.md](DATABASE.md).

## Structure

```
apps/api/
├── drizzle/                        # generated SQL migrations, one folder per provider
│   ├── sqlite/  postgres/  mysql/
├── drizzle.config.ts               # drizzle-kit config (reads DB_PROVIDER)
├── src/
│   ├── core/                       # app-wide infrastructure
│   │   ├── config/                 # configuration.ts, env.validation.ts
│   │   ├── database/               # DatabaseModule, multi-provider factory
│   │   │   └── schemas/            # Drizzle tables: sqlite/ postgres/ mysql/
│   │   └── health/                 # /api/health (Terminus)
│   ├── common/                     # generic helpers, no business logic
│   │   ├── decorators/             # api-paginated-response.decorator.ts
│   │   ├── dtos/                   # pagination-query.dto.ts
│   │   ├── filters/                # http-exception.filter.ts
│   │   ├── interceptors/           # logging.interceptor.ts
│   │   ├── repositories/           # repository.interface.ts
│   │   ├── types/                  # base-entity.type.ts, serialized.type.ts
│   │   └── utils/                  # uuid.util.ts (UUID v7)
│   ├── integrations/               # clients for external services (Stripe, AWS…)
│   ├── modules/                    # business features, one folder per domain
│   │   └── item/
│   │       ├── dto/                # create-item.dto.ts, update-item.dto.ts
│   │       ├── entities/           # item.entity.ts
│   │       ├── repositories/       # item.repository.ts (token), drizzle-item.repository.ts
│   │       ├── item.controller.ts
│   │       ├── item.module.ts
│   │       ├── item.service.ts
│   │       └── item.service.spec.ts
│   ├── events/                     # domain event publishers / listeners
│   ├── commands/                   # CLI jobs, CRON
│   ├── app.module.ts
│   ├── setup-app.ts                # HTTP pipeline shared by main.ts and the e2e tests
│   └── main.ts
└── test/
    ├── item.e2e-spec.ts
    └── utils/test-database.ts
```

`integrations/`, `events/` and `commands/` are empty; each one holds a `README.md` showing the expected shape.

## Folder roles

| Folder | Content | Examples |
|--------|---------|----------|
| `core/` | Internal infrastructure shared by the whole app | `config/`, `database/`, `health/`, later `auth/`, `redis/`, `logger/` |
| `common/` | Small reusable helpers, independent of any domain | `pipes/`, `decorators/`, `types/`, `utils/` |
| `integrations/` | Clients for external or internal systems | `stripe/`, `aws/` |
| `modules/` | Business features | `item/`, `account/`, `payment/` |
| `events/` | Event-driven architecture | `item-created/`, `payment-failed/` |
| `commands/` | One-off or recurring jobs | `purge-items.command.ts` |

## Naming conventions

| Element | Convention | Example |
|---------|------------|---------|
| Domain folder | **singular** | `modules/item/`, `modules/account/` |
| Reusable code folder | **plural** | `common/pipes/`, `common/utils/`, `schemas/` |
| Service | `[name].service.ts` | `item.service.ts` → `ItemService` |
| Module | `[name].module.ts` | `item.module.ts` → `ItemModule` |
| Controller | `[name].controller.ts` | `item.controller.ts` → `ItemController` |
| DTO | `[action]-[entity].dto.ts` | `create-item.dto.ts` → `CreateItemDto` |
| Repository | `[impl]-[entity].repository.ts` | `drizzle-item.repository.ts` → `DrizzleItemRepository` |
| Drizzle schema | `[entity].schema.ts` | `item.schema.ts` |
| External client | `[provider]-[entity].client.ts` | `stripe-payment.client.ts` |
| Guard / Pipe | `[name].guard.ts` / `[name].pipe.ts` | `jwt.guard.ts` |
| Shared type (API-internal) | `[name].type.ts` | `serialized.type.ts` |
| HTTP exchange type | in `packages/contracts`, `[domain].type.d.ts` | `item.type.d.ts` |
| Utility | `[name].util.ts` | `uuid.util.ts` |
| Unit test | next to the file, `.spec.ts` | `item.service.spec.ts` |
| E2E test | in `test/`, `.e2e-spec.ts` | `test/item.e2e-spec.ts` |

**HTTP routes** stay plural (`/api/v1/items`): that is the REST convention, independent of the folder name.

## Where does a file go?

- A business feature? → `modules/[feature]/`
- A DTO? → `modules/[feature]/dto/`
- A decorator or a utility?
  - specific to one module → `modules/[feature]/utils/`
  - global → `common/utils/` (or `common/decorators/`)
- Config, auth, Redis, the database? → `core/`
- A wrapper around an external service? → `integrations/`
- A CLI or CRON job? → `commands/`

> Consistency over perfection: a structure agreed upfront avoids debates.

## Commands

```bash
bun run start:dev    # watch mode
bun run test         # unit tests (Vitest)
bun run test:e2e     # e2e tests (supertest, in-memory SQLite)
bun run lint         # oxlint
bun run build
bun run db:generate  # see DATABASE.md
```

## Configuration

Variables (see `.env.example`) are validated at boot by `core/config/env.validation.ts`:

| Variable | Default | Description |
|----------|---------|-------------|
| `NODE_ENV` | `development` | Swagger is disabled in `production` |
| `PORT` | `3000` | HTTP port |
| `CORS_ORIGINS` | `http://localhost:3001` | Allowed origins, comma-separated |
| `DB_PROVIDER` | `sqlite` | `sqlite`, `postgres` or `mysql` |
| `DATABASE_URL` | `file:./data/ember.db` | Required when the provider is not `sqlite` |
| `DB_AUTO_MIGRATE` | `true` | Applies migrations at boot |

Typed access: `configService.get('database', { infer: true })`.

## Adding a module

```bash
bunx nest g module modules/product
bunx nest g controller modules/product --no-spec
bunx nest g service modules/product
```

Then follow the `item` pattern:

0. Exchanged types in `packages/contracts/src/product/product.type.d.ts` (`Product`, `CreateProductInput`, `UpdateProductInput`), re-exported from `src/index.d.ts`
1. `entities/product.entity.ts` (+ `@ApiProperty`) and `export type ProductMatchesContract = AssertTrue<SerializedAs<Product, ProductContract>>`
2. `dto/create-product.dto.ts` (class-validator, `implements CreateProductInput`) and `dto/update-product.dto.ts` (`PartialType`, `implements UpdateProductInput`)
3. Tables in `core/database/schemas/{sqlite,postgres,mysql}/product.schema.ts`, exported by each `index.ts`, then `MIGRATION_NAME=add_product bun run db:generate:all`
4. `repositories/product.repository.ts` (`PRODUCT_REPOSITORY` token + type) and `repositories/drizzle-product.repository.ts`
5. `ProductService` injecting `@Inject(PRODUCT_REPOSITORY)`
6. A thin `ProductController`, `@Controller({ path: 'products', version: '1' })`
7. Tests: `product.service.spec.ts`, `drizzle-product.repository.spec.ts`, `test/product.e2e-spec.ts`

## Docker

```bash
docker compose up --build api
```

The image builds from the **repository root** (`docker build -f apps/api/Dockerfile .`) so that it includes `packages/contracts`; `apps/api/Dockerfile.dockerignore` limits the context to `apps/api` and the contracts.
