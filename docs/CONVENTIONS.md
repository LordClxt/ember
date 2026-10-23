# Conventions

## Language

Everything in the repository is written in **English**: code, comments, documentation, commit messages, PR descriptions and UI strings.

## Git

- Default branch: `main`. Branches: `feat/…`, `fix/…`, `chore/…`, `docs/…`.
- Commits: [Conventional Commits](https://www.conventionalcommits.org/) with an app scope.

```
feat(web): add items pagination
fix(api): return 404 on unknown item
chore(mobile): bump ktor to 3.5.1
```

## Naming

| Element | API (NestJS) | Web (TanStack Start) | Mobile (KMP) |
|---------|--------------|----------------------|--------------|
| Domain folder | singular: `modules/item/` | plural, like the URL: `routes/items/`, `components/items/` | `features/items/` |
| Files | `[name].[type].ts`: `item.service.ts`, `create-item.dto.ts` | `kebab-case.tsx`: `item-list.tsx`, `use-item-mutations.ts` | `PascalCase.kt` |
| Classes / components | `ItemService`, `CreateItemDto` | `ItemList`, `useItemMutations` | `ItemsViewModel` |
| Tests | `*.spec.ts` next to the code, e2e in `test/*.e2e-spec.ts` | `*.test.ts(x)` next to the code | `commonTest/` (same package) |

Details: [API.md](API.md#naming-conventions), [WEB.md](WEB.md#routing-rules).

## Code

- TypeScript `strict`. No `any` unless justified.
- Types exchanged over HTTP live in `packages/contracts` and are imported with `import type` (see [ARCHITECTURE.md](ARCHITECTURE.md#shared-types-packagescontracts)).
- Web: React function components, data through `queryOptions` + route loaders, never a direct `fetch` in a component.
- `routeTree.gen.ts` is generated: never edit it.
- NestJS: one module per feature, validated DTOs, no logic in controllers.
- Kotlin: ViewModels expose an immutable `StateFlow`, repositories return `AppResult` instead of throwing.
- Formatting: Prettier (API: semicolons, web: none) and ktlint through Spotless (Kotlin), applied by the Git hooks — see [CONTRIBUTING](../CONTRIBUTING.md#formatting).

## Tests

- Every service, repository and `lib/` utility has at least one unit test.
- Every public endpoint has an e2e test (`apps/api/test`).
