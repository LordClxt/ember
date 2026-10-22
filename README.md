# 🔥 Ember

> Boilerplate full-stack **Angular · NestJS · Kotlin Multiplatform** — des bases propres, sans logique métier.

Ember fournit une structure prête à l'emploi pour démarrer un produit web + mobile avec une seule API.
Un module d'exemple **`items`** (CRUD minimal) traverse les trois applications pour illustrer les patterns ; supprime-le ou duplique-le pour créer tes propres features.

| App | Stack | Dossier |
|-----|-------|---------|
| **API** | NestJS 12, class-validator, Swagger, Terminus, Vitest | [`apps/api`](apps/api) |
| **Web** | Angular 22 (standalone, signals, zoneless), Vitest | [`apps/web`](apps/web) |
| **Mobile** | Kotlin Multiplatform + Compose Multiplatform (Android & iOS), Ktor, Koin | [`apps/mobile`](apps/mobile) |

## Utiliser ce template

Sur GitHub : **Use this template → Create a new repository**, ou :

```bash
gh repo create mon-projet --template LordClxt/ember --private --clone
```

Puis suis la [checklist de renommage](docs/GETTING_STARTED.md#renommer-le-projet).

## Démarrage rapide

Prérequis : Node 24+, JDK 21, Android Studio (Android), Xcode 16+ (iOS).

```bash
npm install            # outils racine (concurrently)
npm run install:all    # dépendances api + web
npm run dev            # API sur :3000 + Web sur :4200
```

| URL | Description |
|-----|-------------|
| http://localhost:4200 | Application Angular |
| http://localhost:3000/api/docs | Swagger UI |
| http://localhost:3000/api/health | Health check |

Mobile : ouvre `apps/mobile` dans Android Studio (config *androidApp*) ou `apps/mobile/iosApp/iosApp.xcodeproj` dans Xcode.

## Scripts racine

| Script | Effet |
|--------|-------|
| `npm run dev` | Lance API + Web en parallèle |
| `npm run build` | Build API + Web |
| `npm test` | Tests API + Web |
| `npm run lint` | Lint API (oxlint) |
| `npm run mobile:android` | Build l'APK debug |
| `npm run mobile:test` | Tests du module partagé KMP |

## Structure

```
ember/
├── apps/
│   ├── api/       # NestJS — REST /api/v1
│   ├── web/       # Angular — consomme l'API via proxy
│   └── mobile/    # KMP — shared (logique + UI Compose), androidApp, iosApp
├── docs/          # Architecture, conventions, guides par app
├── .github/       # CI, templates d'issues / PR
└── docker-compose.yml
```

## Documentation

- [Getting started & renommage](docs/GETTING_STARTED.md)
- [Architecture & contrat d'API](docs/ARCHITECTURE.md)
- [Conventions](docs/CONVENTIONS.md)
- Guides : [API](docs/API.md) · [Web](docs/WEB.md) · [Mobile](docs/MOBILE.md)
- [Contribuer](CONTRIBUTING.md) · [Changelog](CHANGELOG.md)

## Licence

[MIT](LICENSE). La structure Gradle/Xcode du dossier mobile est dérivée de [Kotlin/KMP-App-Template](https://github.com/Kotlin/KMP-App-Template) (Apache 2.0).
