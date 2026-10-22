# Web — Angular

```
apps/web/src/app/
├── app.config.ts           # providers globaux (router, HttpClient + interceptors)
├── app.routes.ts           # routes lazy-loadées
├── core/                   # singletons, chargés une seule fois
│   ├── config/             # APP_CONFIG (InjectionToken ← environment)
│   ├── http/               # ApiService, errorInterceptor
│   ├── models/             # Paginated<T>, ApiError
│   └── services/           # LoggerService, NotificationService
├── shared/                 # composants réutilisables, sans état métier
│   └── components/toast-container/
├── layout/shell/           # header + <router-outlet> + toasts
└── features/
    ├── home/
    └── items/
        ├── data/
        │   ├── item.model.ts
        │   ├── items.api.ts      # accès HTTP, sans état
        │   └── items.store.ts    # état (signals) + actions
        ├── items.page.ts
        └── items.routes.ts       # fournit ItemsStore au niveau de la route
```

## Flux de données

```
ItemsPage ──appelle──▶ ItemsStore ──appelle──▶ ItemsApi ──▶ ApiService ──▶ HttpClient
    ▲                       │
    └──── lit les signals ──┘
```

- Les **composants** ne lisent que des signals du store et appellent ses méthodes.
- Le **store** est fourni par la route : son état vit tant que la feature est affichée.
- Les erreurs HTTP sont notifiées par `errorInterceptor` → `NotificationService` → `<app-toast-container>`.

## Commandes

```bash
npm start            # ng serve, proxy /api → localhost:3000
npm test             # Vitest
npm run build
```

Le proxy est défini dans `proxy.conf.json` ; `environment.apiUrl` vaut `/api/v1` en dev comme en prod (servir le front derrière le même domaine que l'API, ou modifier `environment.ts`).

## Ajouter une feature

```bash
npx ng g component features/products/products-page --type=page --flat
```

1. `features/products/data/` : `product.model.ts`, `products.api.ts`, `products.store.ts`
2. `products.routes.ts` avec `providers: [ProductsStore]`
3. Déclare la route lazy dans `app.routes.ts`
4. Test du store avec un `ProductsApi` mocké (voir `items.store.spec.ts`)
