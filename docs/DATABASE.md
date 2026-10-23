# Base de données — Drizzle ORM

L'API utilise [Drizzle ORM](https://orm.drizzle.team). Le **provider se choisit par configuration** et vaut **SQLite par défaut**, donc le projet démarre sans aucun serveur de base de données.

| `DB_PROVIDER` | Driver | `DATABASE_URL` (exemple) |
|---------------|--------|--------------------------|
| `sqlite` *(défaut)* | `@libsql/client` | `file:./data/ember.db` (défaut), `:memory:`, ou une URL Turso `libsql://…` |
| `postgres` | `pg` | `postgres://ember:ember@localhost:5432/ember` |
| `mysql` | `mysql2` | `mysql://ember:ember@localhost:3306/ember` |

Seul le driver du provider choisi est chargé : les imports sont dynamiques dans `database.factory.ts`.

## Changer de provider

Dans `apps/api/.env` :

```dotenv
DB_PROVIDER=postgres
DATABASE_URL=postgres://ember:ember@localhost:5432/ember
```

Avec Docker Compose, des services Postgres et MySQL sont prêts derrière des profils :

```bash
docker compose up --build                                   # SQLite (volume api-data)
DB_PROVIDER=postgres DATABASE_URL=postgres://ember:ember@postgres:5432/ember \
  docker compose --profile postgres up --build
DB_PROVIDER=mysql DATABASE_URL=mysql://ember:ember@mysql:3306/ember \
  docker compose --profile mysql up --build
```

## Fonctionnement

```
src/core/database/
├── database.constants.ts   # token DATABASE, liste des providers
├── database.types.ts       # DatabaseConnection { provider, db, schema, migrate, close }
├── database.factory.ts     # createDatabase(): ouvre la connexion du provider choisi
├── database.module.ts      # module global : connexion + migrations au boot + fermeture
└── schemas/
    ├── sqlite/   index.ts, item.schema.ts
    ├── postgres/ index.ts, item.schema.ts
    └── mysql/    index.ts, item.schema.ts
```

- Les schémas Drizzle dépendent du dialecte, d'où **un dossier par provider**. Les trois définissent les mêmes tables, les mêmes colonnes et les mêmes types JS.
- Les repositories injectent `@Inject(DATABASE)` et n'utilisent que le sous-ensemble du query builder commun aux trois dialectes. Ils n'utilisent pas `.returning()`, que MySQL ne supporte pas : les lignes sont relues après écriture.
- Les **identifiants** sont des **UUID v7** générés côté application (`common/utils/uuid.util.ts`). Ils sont triés par date de création, ce qui donne une pagination stable même pour des lignes créées dans la même milliseconde.
- Les **dates** sont générées côté application (`createdAt`, `updatedAt`), pour un comportement identique sur les trois providers.

## Migrations

Les migrations SQL sont **générées** par `drizzle-kit` dans `apps/api/drizzle/<provider>/` et **versionnées**.
Elles s'appliquent automatiquement au démarrage si `DB_AUTO_MIGRATE=true` (la valeur par défaut).

```bash
# Après modification d'un schéma : générer pour les 3 providers
MIGRATION_NAME=add_product bun run db:generate:all

# Un seul provider
DB_PROVIDER=postgres bun run db:generate

# Appliquer manuellement (si DB_AUTO_MIGRATE=false)
DB_PROVIDER=postgres DATABASE_URL=postgres://… bun run db:migrate

# Explorer les données
bun run db:studio
```

> Modifie toujours les **trois** schémas ensemble, puis régénère pour les trois providers. Sinon ils divergent.

## Tests

- `test/utils/test-database.ts` fournit une base **SQLite en mémoire** et une base **Postgres en mémoire** ([PGlite](https://pglite.dev), en WebAssembly), migrées à chaque test.
- Les specs de repository tournent sur les deux (`describe.each`), ce qui vérifie aussi les migrations Postgres sans serveur.
- Les e2e utilisent `DB_PROVIDER=sqlite` et `DATABASE_URL=:memory:` (`vitest.config.e2e.ts`).

## Ne garder qu'un provider

Si ton projet n'utilisera jamais MySQL, par exemple :

1. Supprime `schemas/mysql/`, `drizzle/mysql/` et le `case 'mysql'` de `database.factory.ts`.
2. Retire `mysql` de `DATABASE_PROVIDERS` et de `drizzle.config.ts`, puis désinstalle `mysql2`.
