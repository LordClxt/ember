# AGENTS.md

Guide pour les assistants IA (Claude Code, Copilot, Cursor…) travaillant sur ce dépôt.

## Projet

Monorepo **Ember** : `apps/api` (NestJS + Drizzle), `apps/web` (TanStack Start), `apps/mobile` (KMP), et `packages/contracts` (types de l'API partagés par l'API et le web). Chaque app a son propre build ; il n'y a pas d'outil de monorepo.

## Commandes

Gestionnaire de paquets : **Bun** (lockfiles `bun.lock`, jamais `package-lock.json`). Node reste le runtime.

| App | Install | Test | Build |
|-----|---------|------|-------|
| api | `bun install --cwd apps/api` | `bun run --cwd apps/api test && bun run --cwd apps/api test:e2e` | `bun run --cwd apps/api build` |
| web | `bun install --cwd apps/web` | `bun run --cwd apps/web test && bun run --cwd apps/web typecheck` | `bun run --cwd apps/web build` |
| mobile | — | `cd apps/mobile && ./gradlew :shared:testAndroidHostTest` | `./gradlew :androidApp:assembleDebug` |

## Types partagés front / back : `@ember/contracts`

Les types qui transitent en JSON entre l'API et le web (corps de requête, réponses, pagination, erreurs) sont déclarés **une seule fois** dans [`packages/contracts`](packages/contracts/README.md) et importés des deux côtés :

```ts
import type { CreateItemInput, Item, Paginated } from '@ember/contracts'
```

- **Ne jamais redéclarer** côté API ou web une interface qui existe déjà dans les contrats : l'importer.
- **Nouveau type d'échange** → `packages/contracts/src/<domaine>/<domaine>.type.d.ts`, réexporté par `src/index.d.ts`.
- **Types uniquement** : fichiers `.d.ts` (interfaces, `type`, unions de littéraux). Pas d'`enum`, de constantes ni de fonctions ; toujours `import type` (le lint et le typecheck refusent un import de valeur).
- **Format JSON** : les dates sont des `string` ISO 8601 (les entités de l'API utilisent `Date`).
- **API** : les DTO `implements` le type de requête (`CreateItemDto implements CreateItemInput`) ; l'entité est vérifiée contre le type de réponse avec `AssertTrue<SerializedAs<Item, ItemContract>>` (`common/types/serialized.type.ts`) : un écart casse la compilation.
- **Web** : `lib/<domaine>.ts`, composants et hooks importent les types depuis `@ember/contracts`.
- **Mobile** : Kotlin ne peut pas importer ces types ; reporter chaque changement dans `*Dto.kt`.
- Ce qui n'est **pas** un échange HTTP reste local (props React, types Drizzle, état de formulaire).

## Règles

- Lire [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) et [docs/CONVENTIONS.md](docs/CONVENTIONS.md) avant de modifier la structure.
- Toute nouvelle feature reproduit le pattern `item` (API) / `items` (web, mobile) de l'app concernée.
- API : respecter la structure et le nommage de [docs/API.md](docs/API.md) (`core/`, `common/`, `modules/<singulier>/`, `[action]-[entity].dto.ts`…).
- Web : respecter [docs/WEB.md](docs/WEB.md) (routes par fichiers, `components/ui` + `components/<domaine>`, `lib/`, `hooks/`). Ne jamais éditer `routeTree.gen.ts`.
- Base de données : modifier les **trois** schémas (`sqlite`, `postgres`, `mysql`) puis `bun run db:generate:all` ([docs/DATABASE.md](docs/DATABASE.md)).
- Un changement de contrat d'API commence dans `packages/contracts`, puis est répercuté dans les DTO NestJS, les `*Dto.kt` KMP et `docs/ARCHITECTURE.md` (le web suit automatiquement via `@ember/contracts`).
- L'API est en ESM : les imports relatifs se terminent par `.js`.
- Ajouter ou mettre à jour les tests avec chaque changement.
