# API — NestJS

L'organisation des dossiers et le nommage suivent le guide
[*Stop the Chaos: Clean Folder & File Naming Guide for Backend (NestJS & Node.js)*](https://medium.com/@nairi.abgaryan/stop-the-chaos-clean-folder-file-naming-guide-for-backend-nest-js-and-node-331fdc6400cb).
La base de données est décrite dans [DATABASE.md](DATABASE.md).

## Structure

```
apps/api/
├── drizzle/                        # migrations SQL générées, une par provider
│   ├── sqlite/  postgres/  mysql/
├── drizzle.config.ts               # config drizzle-kit (lit DB_PROVIDER)
├── src/
│   ├── core/                       # infrastructure transverse de l'app
│   │   ├── config/                 # configuration.ts, env.validation.ts
│   │   ├── database/               # DatabaseModule, factory multi-provider
│   │   │   └── schemas/            # tables Drizzle : sqlite/ postgres/ mysql/
│   │   └── health/                 # /api/health (Terminus)
│   ├── common/                     # utilitaires génériques, sans logique métier
│   │   ├── decorators/             # api-paginated-response.decorator.ts
│   │   ├── dtos/                   # pagination-query.dto.ts
│   │   ├── filters/                # http-exception.filter.ts
│   │   ├── interceptors/           # logging.interceptor.ts
│   │   ├── repositories/           # repository.interface.ts
│   │   ├── types/                  # paginated.type.ts, base-entity.type.ts
│   │   └── utils/                  # uuid.util.ts (UUID v7)
│   ├── integrations/               # clients de services externes (Stripe, AWS…)
│   ├── modules/                    # features métier, un dossier par domaine
│   │   └── item/
│   │       ├── dto/                # create-item.dto.ts, update-item.dto.ts
│   │       ├── entities/           # item.entity.ts
│   │       ├── repositories/       # item.repository.ts (token), drizzle-item.repository.ts
│   │       ├── item.controller.ts
│   │       ├── item.module.ts
│   │       ├── item.service.ts
│   │       └── item.service.spec.ts
│   ├── events/                     # publishers / listeners d'événements de domaine
│   ├── commands/                   # jobs CLI, CRON
│   ├── app.module.ts
│   ├── setup-app.ts                # pipeline HTTP partagé par main.ts et les e2e
│   └── main.ts
└── test/
    ├── item.e2e-spec.ts
    └── utils/test-database.ts
```

`integrations/`, `events/` et `commands/` sont vides ; chacun contient un `README.md` qui montre la forme attendue.

## Rôle des dossiers

| Dossier | Contenu | Exemples |
|---------|---------|----------|
| `core/` | Infrastructure interne partagée par toute l'app | `config/`, `database/`, `health/`, plus tard `auth/`, `redis/`, `logger/` |
| `common/` | Petits utilitaires réutilisables, sans dépendance à un domaine | `pipes/`, `decorators/`, `types/`, `utils/` |
| `integrations/` | Clients pour des systèmes externes ou internes | `stripe/`, `aws/` |
| `modules/` | Features métier | `item/`, `account/`, `payment/` |
| `events/` | Architecture événementielle | `item-created/`, `payment-failed/` |
| `commands/` | Jobs ponctuels ou récurrents | `purge-items.command.ts` |

## Conventions de nommage

| Élément | Convention | Exemple |
|---------|------------|---------|
| Dossier de domaine | **singulier** | `modules/item/`, `modules/account/` |
| Dossier de code réutilisable | **pluriel** | `common/pipes/`, `common/utils/`, `schemas/` |
| Service | `[name].service.ts` | `item.service.ts` → `ItemService` |
| Module | `[name].module.ts` | `item.module.ts` → `ItemModule` |
| Controller | `[name].controller.ts` | `item.controller.ts` → `ItemController` |
| DTO | `[action]-[entity].dto.ts` | `create-item.dto.ts` → `CreateItemDto` |
| Repository | `[impl]-[entity].repository.ts` | `drizzle-item.repository.ts` → `DrizzleItemRepository` |
| Schéma Drizzle | `[entity].schema.ts` | `item.schema.ts` |
| Client externe | `[provider]-[entity].client.ts` | `stripe-payment.client.ts` |
| Guard / Pipe | `[name].guard.ts` / `[name].pipe.ts` | `jwt.guard.ts` |
| Type partagé | `[name].type.ts` | `paginated.type.ts` |
| Utilitaire | `[name].util.ts` | `uuid.util.ts` |
| Test unitaire | à côté du fichier, `.spec.ts` | `item.service.spec.ts` |
| Test e2e | dans `test/`, `.e2e-spec.ts` | `test/item.e2e-spec.ts` |

Les **routes HTTP** restent au pluriel (`/api/v1/items`) : c'est la convention REST, indépendante du nom du dossier.

## Où ranger un fichier ?

- Une feature métier ? → `modules/[feature]/`
- Un DTO ? → `modules/[feature]/dto/`
- Un décorateur ou un utilitaire ?
  - propre à un module → `modules/[feature]/utils/`
  - global → `common/utils/` (ou `common/decorators/`)
- De la config, l'auth, Redis, la base de données ? → `core/`
- Un wrapper de service externe ? → `integrations/`
- Un job CLI ou CRON ? → `commands/`

> Cohérence plutôt que perfection : une structure définie à l'avance évite les débats.

## Commandes

```bash
bun run start:dev    # watch mode
bun run test             # tests unitaires (Vitest)
bun run test:e2e     # tests e2e (supertest, SQLite en mémoire)
bun run lint         # oxlint
bun run build
bun run db:generate  # voir DATABASE.md
```

## Configuration

Variables (voir `.env.example`) validées au démarrage par `core/config/env.validation.ts` :

| Variable | Défaut | Description |
|----------|--------|-------------|
| `NODE_ENV` | `development` | Swagger désactivé en `production` |
| `PORT` | `3000` | Port HTTP |
| `CORS_ORIGINS` | `http://localhost:3001` | Origines autorisées, séparées par des virgules |
| `DB_PROVIDER` | `sqlite` | `sqlite`, `postgres` ou `mysql` |
| `DATABASE_URL` | `file:./data/ember.db` | Obligatoire si le provider n'est pas `sqlite` |
| `DB_AUTO_MIGRATE` | `true` | Applique les migrations au démarrage |

Lecture typée : `configService.get('database', { infer: true })`.

## Ajouter un module

```bash
bunx nest g module modules/product
bunx nest g controller modules/product --no-spec
bunx nest g service modules/product
```

Puis reproduis le pattern `item` :

1. `entities/product.entity.ts` (+ `@ApiProperty`)
2. `dto/create-product.dto.ts` (class-validator) et `dto/update-product.dto.ts` (`PartialType`)
3. Tables dans `core/database/schemas/{sqlite,postgres,mysql}/product.schema.ts`, exportées par chaque `index.ts`, puis `MIGRATION_NAME=add_product bun run db:generate:all`
4. `repositories/product.repository.ts` (token `PRODUCT_REPOSITORY` + type) et `repositories/drizzle-product.repository.ts`
5. `ProductService` injectant `@Inject(PRODUCT_REPOSITORY)`
6. `ProductController` fin, `@Controller({ path: 'products', version: '1' })`
7. Tests : `product.service.spec.ts`, `drizzle-product.repository.spec.ts`, `test/product.e2e-spec.ts`

## Docker

```bash
docker compose up --build api
```
