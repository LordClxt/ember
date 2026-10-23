# Web — TanStack Start

Application React full-stack (SSR) avec [TanStack Start](https://tanstack.com/start), TanStack Router (routage par fichiers), TanStack Query et Tailwind CSS 4.
La structure suit [*TanStack Start project structure*](https://royportas.com/posts/tanstack-start-project-structure) de Roy Portas.

## Structure

```
apps/web/
├── public/                     # fichiers statiques (favicon…)
├── src/
│   ├── components/
│   │   ├── ui/                 # primitives d'interface (conventions shadcn/ui) : button, input
│   │   ├── items/              # composants du domaine « items »
│   │   ├── header.tsx          # composants partagés entre plusieurs routes
│   │   ├── error-message.tsx
│   │   └── not-found.tsx
│   ├── hooks/                  # hooks React : use-item-mutations.ts
│   ├── lib/                    # utilitaires non-UI, accès aux données
│   │   ├── api-client.ts       # wrapper fetch → API NestJS, ApiError
│   │   ├── items.ts            # endpoints, query keys, queryOptions
│   │   ├── query-client.ts     # configuration TanStack Query
│   │   ├── env.ts              # variables VITE_*
│   │   └── utils.ts            # cn()
│   ├── routes/
│   │   ├── __root.tsx          # shell HTML, header, devtools, global.css
│   │   ├── index.tsx           # /
│   │   ├── items/
│   │   │   ├── route.tsx       # layout de /items et de ses enfants
│   │   │   ├── index.tsx       # /items?page=n
│   │   │   └── $id.tsx         # /items/:id
│   │   └── $.tsx               # catch-all → 404
│   ├── global.css              # styles globaux + thème Tailwind
│   ├── router.tsx              # création du router + intégration SSR de Query
│   └── routeTree.gen.ts        # GÉNÉRÉ, ne pas modifier
├── vite.config.ts              # plugins : tanstackStart, nitro, tailwind, react
└── vitest.config.ts
```

### Règles de routage

| Fichier | Rôle |
|---------|------|
| `__root.tsx` | Racine : tout s'affiche dans son outlet. On y met le shell HTML SSR, les providers, la navigation globale et l'import de `global.css`. |
| `dossier/route.tsx` | Layout du segment et de ses enfants (`items/route.tsx` enveloppe `/items/*`) |
| `index.tsx` | Page affichée au chemin du dossier (`items/index.tsx` → `/items`) |
| `_prefix/` | Layout **sans segment d'URL** (`_account/orders.tsx` → `/orders`) |
| `$param.tsx` | Segment dynamique (`$id.tsx` → `params.id`) |
| `robots[.]txt.ts` | Point échappé : route serveur pour `/robots.txt` |
| `$.tsx` | Catch-all, utilisé ici pour la 404 |
| `routeTree.gen.ts` | Généré par le plugin Vite (ou `bun run generate-routes`), versionné, jamais édité à la main |

### Écart avec l'article : pas de `src/db/`

L'article place le client Drizzle dans `src/db/`. Dans Ember, **la base de données appartient à l'API NestJS** (voir [DATABASE.md](DATABASE.md)) et le front n'y accède jamais directement. Ce rôle est tenu par `lib/api-client.ts` et `lib/<domaine>.ts`.

## Flux de données

```
routes/items/index.tsx
  loader  ──▶ queryClient.ensureQueryData(itemsQueryOptions(page))   (serveur au 1er rendu, client ensuite)
  component ─▶ useSuspenseQuery(itemsQueryOptions(page))              (lit le cache hydraté)
             ─▶ useItemMutations()  ──▶ itemsApi.create / remove ──▶ invalidate ['items']
lib/items.ts ──▶ lib/api-client.ts (fetch) ──▶ NestJS /api/v1/items
```

- **Lecture** : le loader de la route pré-remplit le cache de TanStack Query. Le rendu SSR contient donc déjà les données, sans flash de chargement.
- **Écriture** : chaque mutation est déclarée dans un hook de `hooks/` et invalide les query keys du domaine.
- **Erreurs** : `apiFetch` transforme les erreurs de l'API en `ApiError` (avec le statut et le message du serveur). Le router affiche `defaultErrorComponent`. Un 404 ou 400 sur `/items/$id` déclenche `notFound()`.

## Commandes

```bash
bun run dev          # http://localhost:3001
bun run test             # Vitest + Testing Library
bun run lint         # ESLint (@tanstack/eslint-config)
bun run typecheck
bun run build        # client + serveur Nitro dans .output/
bun run start            # node .output/server/index.mjs
```

Variable d'environnement (voir `.env.example`) :

| Variable | Défaut | Description |
|----------|--------|-------------|
| `VITE_API_URL` | `http://localhost:3000/api/v1` | URL de l'API, utilisée par le navigateur et pendant le SSR. Elle est intégrée au build. |

## Ajouter une feature

Exemple pour `products` :

1. `lib/products.ts` : `productsApi`, `productKeys`, `productsQueryOptions`, typés avec `import type { Product } from '@ember/contracts'` (le type est créé côté contrats, pas ici)
2. `hooks/use-product-mutations.ts`
3. `components/products/` : composants du domaine
4. `routes/products/route.tsx`, `index.tsx`, `$id.tsx` (loader + `useSuspenseQuery`)
5. Un lien dans `components/header.tsx`
6. Tests `*.test.ts(x)` à côté du code
