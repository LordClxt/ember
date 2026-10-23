# @ember/contracts

Types of the HTTP API (requests, responses, errors), written once and imported by
`apps/api` and `apps/web` with `import type { … } from '@ember/contracts'`.

- **Types only**: files are `.d.ts`, so they hold interfaces and type aliases, never
  runtime code (no `enum`, constants or functions). They are erased at compile time:
  no build step, nothing to install.
- **Wire format**: types describe the JSON, so dates are ISO 8601 `string`s
  (the API entities use `Date`).
- Resolved through the `@ember/contracts` path alias in `apps/api/tsconfig.json` and
  `apps/web/tsconfig.json`.
- The mobile app (Kotlin) cannot import them: mirror every change in its `*Dto.kt`.

## Adding a contract

1. `src/<domain>/<domain>.type.d.ts` (singular domain, like `modules/<domain>` in the API).
2. Re-export it from `src/index.d.ts`.
3. API: DTOs `implements` the request types, and the entity is checked against the
   response type with `SerializedAs` (see `apps/api/src/modules/item/entities/item.entity.ts`).
4. Web: import the types in `src/lib/<domain>.ts` and components.
