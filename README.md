# 🔥 Ember

> Boilerplate full-stack **TanStack Start · NestJS · Kotlin Multiplatform** : des bases propres, sans logique métier.

Ember fournit une structure prête à l'emploi pour démarrer un produit web + mobile avec une seule API.
Un module d'exemple **`items`** (CRUD minimal) traverse les trois applications pour illustrer les patterns ; supprime-le ou duplique-le pour créer tes propres features.

| App | Stack | Dossier |
|-----|-------|---------|
| **API** | NestJS 12, Drizzle ORM (SQLite par défaut · Postgres · MySQL), Swagger, Vitest | [`apps/api`](apps/api) |
| **Web** | TanStack Start (React 19, SSR), TanStack Router & Query, Tailwind 4, Vitest | [`apps/web`](apps/web) |
| **Mobile** | Kotlin Multiplatform + Compose Multiplatform (Android & iOS), Ktor, Koin | [`apps/mobile`](apps/mobile) |

## Utiliser ce template

Sur GitHub : **Use this template → Create a new repository**, ou :

```bash
gh repo create mon-projet --template LordClxt/ember --private --clone
```

Puis suis la [checklist de renommage](docs/GETTING_STARTED.md#renommer-le-projet).

## Démarrage rapide

Prérequis : Node 24+, Bun 1.4+, JDK 21, Android Studio (Android), Xcode 16+ (iOS). Aucune base de données à installer : SQLite est utilisé par défaut.

```bash
bun install            # outils racine (concurrently)
bun run install:all    # dépendances api + web
bun run dev            # API sur :3000 + Web sur :3001
```

| URL | Description |
|-----|-------------|
| http://localhost:3001 | Application web (TanStack Start) |
| http://localhost:3000/api/docs | Swagger UI |
| http://localhost:3000/api/health | Health check |

Mobile : ouvre `apps/mobile` dans Android Studio (config *androidApp*) ou `apps/mobile/iosApp/iosApp.xcodeproj` dans Xcode.

## Scripts racine

| Script | Effet |
|--------|-------|
| `bun run dev` | Lance API + Web en parallèle |
| `bun run build` | Build API + Web |
| `bun run test` | Tests API (unit + e2e) + Web |
| `bun run lint` | Lint API (oxlint) + Web (ESLint, tsc) |
| `bun run mobile:android` | Build l'APK debug |
| `bun run mobile:test` | Tests du module partagé KMP |

## Structure

```
ember/
├── apps/
│   ├── api/       # NestJS : REST /api/v1, Drizzle
│   ├── web/       # TanStack Start : SSR, consomme l'API
│   └── mobile/    # KMP — shared (logique + UI Compose), androidApp, iosApp
├── docs/          # Architecture, conventions, guides par app
├── .github/       # CI, templates d'issues / PR
└── docker-compose.yml
```

## Documentation

- [Getting started & renommage](docs/GETTING_STARTED.md)
- [Architecture & contrat d'API](docs/ARCHITECTURE.md)
- [Conventions](docs/CONVENTIONS.md)
- Guides : [API](docs/API.md) · [Base de données](docs/DATABASE.md) · [Web](docs/WEB.md) · [Mobile](docs/MOBILE.md)
- [Contribuer](CONTRIBUTING.md) · [Changelog](CHANGELOG.md)

## Licence

[MIT](LICENSE). La structure Gradle/Xcode du dossier mobile est dérivée de [Kotlin/KMP-App-Template](https://github.com/Kotlin/KMP-App-Template) (Apache 2.0).
