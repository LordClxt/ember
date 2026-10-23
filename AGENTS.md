# AGENTS.md

Guide pour les assistants IA (Claude Code, Copilot, Cursor…) travaillant sur ce dépôt.

## Projet

Monorepo **Ember** : `apps/api` (NestJS + Drizzle), `apps/web` (TanStack Start), `apps/mobile` (KMP). Chaque app a son propre build ; il n'y a pas d'outil de monorepo.

## Commandes

| App | Install | Test | Build |
|-----|---------|------|-------|
| api | `npm --prefix apps/api ci` | `npm --prefix apps/api test && npm --prefix apps/api run test:e2e` | `npm --prefix apps/api run build` |
| web | `npm --prefix apps/web ci` | `npm --prefix apps/web test && npm --prefix apps/web run typecheck` | `npm --prefix apps/web run build` |
| mobile | — | `cd apps/mobile && ./gradlew :shared:testAndroidHostTest` | `./gradlew :androidApp:assembleDebug` |

## Règles

- Lire [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) et [docs/CONVENTIONS.md](docs/CONVENTIONS.md) avant de modifier la structure.
- Toute nouvelle feature reproduit le pattern `item` (API) / `items` (web, mobile) de l'app concernée.
- API : respecter la structure et le nommage de [docs/API.md](docs/API.md) (`core/`, `common/`, `modules/<singulier>/`, `[action]-[entity].dto.ts`…).
- Web : respecter [docs/WEB.md](docs/WEB.md) (routes par fichiers, `components/ui` + `components/<domaine>`, `lib/`, `hooks/`). Ne jamais éditer `routeTree.gen.ts`.
- Base de données : modifier les **trois** schémas (`sqlite`, `postgres`, `mysql`) puis `npm run db:generate:all` ([docs/DATABASE.md](docs/DATABASE.md)).
- Un changement de contrat d'API doit être répercuté dans les trois apps (DTO NestJS, types de `apps/web/src/lib/<domaine>.ts`, `*Dto.kt` KMP) et dans `docs/ARCHITECTURE.md`.
- L'API est en ESM : les imports relatifs se terminent par `.js`.
- Ajouter ou mettre à jour les tests avec chaque changement.
