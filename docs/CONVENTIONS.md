# Conventions

## Git

- Branche par défaut : `main`. Branches : `feat/…`, `fix/…`, `chore/…`, `docs/…`.
- Commits : [Conventional Commits](https://www.conventionalcommits.org/) avec scope d'app.

```
feat(web): add items pagination
fix(api): return 404 on unknown item
chore(mobile): bump ktor to 3.5.1
```

## Nommage

| Élément | API (NestJS) | Web (TanStack Start) | Mobile (KMP) |
|---------|--------------|----------------------|--------------|
| Dossier de domaine | singulier : `modules/item/` | pluriel, comme l'URL : `routes/items/`, `components/items/` | `features/items/` |
| Fichiers | `[name].[type].ts` : `item.service.ts`, `create-item.dto.ts` | `kebab-case.tsx` : `item-list.tsx`, `use-item-mutations.ts` | `PascalCase.kt` |
| Classes / composants | `ItemService`, `CreateItemDto` | `ItemList`, `useItemMutations` | `ItemsViewModel` |
| Tests | `*.spec.ts` à côté du code, e2e dans `test/*.e2e-spec.ts` | `*.test.ts(x)` à côté du code | `commonTest/` (même package) |

Détails : [API.md](API.md#conventions-de-nommage), [WEB.md](WEB.md#règles-de-routage).

## Code

- TypeScript `strict`. Pas de `any` sauf justification.
- Web : composants fonctionnels React, données via `queryOptions` + loader de route, jamais de `fetch` direct dans un composant.
- `routeTree.gen.ts` est généré : ne jamais l'éditer.
- NestJS : un module par feature, DTO validés, aucune logique dans les controllers.
- Kotlin : `StateFlow` immuable exposé par les ViewModels, repositories qui retournent `AppResult` au lieu de lever des exceptions.
- Formatage : Prettier (API : point-virgules, web : sans) et ktlint via Spotless (Kotlin), appliqués par les hooks Git — voir [CONTRIBUTING](../CONTRIBUTING.md#formatage).

## Tests

- Chaque service, repository et utilitaire `lib/` a au moins un test unitaire.
- Chaque endpoint public a un test e2e (`apps/api/test`).
