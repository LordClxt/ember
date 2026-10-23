# @ember/contracts

Everything the API and the web app must agree on, written once: types of the HTTP
requests and responses, validation limits, defaults and enumerations.

```ts
import { ITEM_NAME_MAX_LENGTH, PAGINATION, type CreateItemInput } from '@ember/contracts'
```

- **Plain TypeScript, no dependencies**: constants, interfaces, `as const` arrays and
  their union types. No framework imports, so both NestJS and the browser can load it.
- **Validation stays in each app**: the API keeps NestJS-native class-validator DTOs
  (`@MaxLength(ITEM_NAME_MAX_LENGTH)`, `implements CreateItemInput`); the web app uses
  the same constants in its forms and routes. Only the rules' values are shared, never
  hard-coded in an app.
- **Wire format**: types describe the JSON, so dates are ISO 8601 `string`s (API
  entities use `Date` and are checked with `SerializedAs`).
- **Build**: `tsc` compiles `src/` to `dist/` (what both apps import). The root
  `postinstall` and every api/web script (`pre*`) rebuild it; `bun run dev` at the root
  watches it.
- **Mobile**: Kotlin cannot import it; mirror changes in the `*Dto.kt` files and
  constants such as `ItemsRepository.PAGE_SIZE`.

## Adding to the contract

1. `src/<domain>/<domain>.contract.ts` (singular domain, like `modules/<domain>` in the API).
2. Re-export it from `src/index.ts`.
3. API: DTOs `implements` the request types and use the constants in their decorators;
   the entity is checked against the response type with `SerializedAs`
   (see `apps/api/src/modules/item/entities/item.entity.ts`).
4. Web: import the types and constants in `src/lib/<domain>.ts`, components and routes.
