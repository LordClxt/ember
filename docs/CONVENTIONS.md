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

| Élément | API | Web | Mobile |
|---------|-----|-----|--------|
| Fichiers | `kebab-case.type.ts` (`items.service.ts`) | `kebab-case.type.ts` (`items.store.ts`, `items.page.ts`) | `PascalCase.kt` |
| Classes | `ItemsService` | `ItemsStore`, `ItemsPage` | `ItemsViewModel` |
| DTO | `CreateItemDto` | `CreateItem` (interface) | `CreateItemDto` |
| Tests | `*.spec.ts` à côté du code, e2e dans `test/` | `*.spec.ts` à côté du code | `commonTest/` (même package) |

## Code

- TypeScript `strict`. Pas de `any` sauf justification.
- Angular : composants standalone, `ChangeDetectionStrategy.OnPush`, `inject()`, signals, control flow (`@if`, `@for`).
- Pages routées en `export default` pour un lazy-loading concis.
- NestJS : un module par feature, DTO validés, aucune logique dans les controllers.
- Kotlin : `StateFlow` immuable exposé par les ViewModels, repositories qui retournent `AppResult` au lieu de lever des exceptions.
- Formatage : Prettier (TS), style officiel Kotlin (`.editorconfig`).

## Tests

- Chaque service / store / repository a au moins un test unitaire.
- Chaque endpoint public a un test e2e (`apps/api/test`).
