# AGENTS.md

Guide pour les assistants IA (Claude Code, Copilot, Cursor…) travaillant sur ce dépôt.

## Projet

Monorepo **Ember** : `apps/api` (NestJS), `apps/web` (Angular), `apps/mobile` (KMP). Chaque app a son propre build ; il n'y a pas d'outil de monorepo.

## Commandes

| App | Install | Test | Build |
|-----|---------|------|-------|
| api | `npm --prefix apps/api ci` | `npm --prefix apps/api test && npm --prefix apps/api run test:e2e` | `npm --prefix apps/api run build` |
| web | `npm --prefix apps/web ci` | `npm --prefix apps/web test -- --watch=false` | `npm --prefix apps/web run build` |
| mobile | — | `cd apps/mobile && ./gradlew :shared:testAndroidHostTest` | `./gradlew :androidApp:assembleDebug` |

## Règles

- Lire [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) et [docs/CONVENTIONS.md](docs/CONVENTIONS.md) avant de modifier la structure.
- Toute nouvelle feature reproduit le pattern du module `items` dans l'app concernée.
- Un changement de contrat d'API doit être répercuté dans les trois apps (DTO NestJS, `*.model.ts` Angular, `*Dto.kt` KMP) et dans `docs/ARCHITECTURE.md`.
- L'API est en ESM : les imports relatifs se terminent par `.js`.
- Ajouter ou mettre à jour les tests avec chaque changement.
