# API — NestJS

```
apps/api/src/
├── main.ts                 # bootstrap + Swagger
├── setup-app.ts            # pipeline HTTP partagé (main + e2e)
├── app.module.ts
├── config/                 # configuration typée + validation des variables d'env
├── common/
│   ├── dto/                # PaginationQueryDto
│   ├── filters/            # AllExceptionsFilter (format d'erreur unique)
│   ├── interceptors/       # LoggingInterceptor
│   ├── interfaces/         # Paginated<T>
│   └── repositories/       # Repository<T> + InMemoryRepository<T>
└── modules/
    ├── health/             # /api/health (Terminus)
    └── items/              # exemple CRUD
        ├── dto/
        ├── entities/
        ├── repositories/   # token ITEMS_REPOSITORY + impl in-memory
        ├── items.controller.ts
        ├── items.service.ts
        ├── items.service.spec.ts
        └── items.module.ts
```

## Commandes

```bash
npm run start:dev    # watch mode
npm test             # unit (Vitest)
npm run test:e2e     # e2e (supertest)
npm run lint         # oxlint
npm run build
```

## Configuration

Variables (voir `.env.example`) validées au démarrage par `config/env.validation.ts` :

| Variable | Défaut | Description |
|----------|--------|-------------|
| `NODE_ENV` | `development` | Swagger désactivé en `production` |
| `PORT` | `3000` | Port HTTP |
| `CORS_ORIGINS` | `http://localhost:4200` | Origines autorisées, séparées par des virgules |

Lecture typée : `configService.get('app', { infer: true })`.

## Ajouter un module

```bash
npx nest g module modules/products
npx nest g controller modules/products --no-spec
npx nest g service modules/products
```

Puis reproduis le pattern `items` :

1. `entities/product.entity.ts` (+ décorateurs `@ApiProperty`)
2. `dto/create-product.dto.ts` (class-validator) et `update-product.dto.ts` (`PartialType`)
3. `repositories/products.repository.ts` (token + type) et une implémentation
4. Service injectant `@Inject(PRODUCTS_REPOSITORY)`
5. Controller fin, `@Controller({ path: 'products', version: '1' })`
6. Tests : `products.service.spec.ts` + cas e2e

## Docker

```bash
docker compose up --build
```
