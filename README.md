# 🔥 Ember

> Full-stack **TanStack Start · NestJS · Kotlin Multiplatform** boilerplate: clean foundations, no business logic.

Ember gives you a ready-to-use structure to start a web + mobile product with a single API.
A sample **`items`** module (minimal CRUD) runs through all three apps to show the patterns; delete it or copy it to build your own features.

| App | Stack | Folder |
|-----|-------|--------|
| **API** | NestJS 12, Drizzle ORM (SQLite by default · Postgres · MySQL), Swagger, Vitest | [`apps/api`](apps/api) |
| **Web** | TanStack Start (React 19, SSR), TanStack Router & Query, Tailwind 4, Vitest | [`apps/web`](apps/web) |
| **Mobile** | Kotlin Multiplatform + Compose Multiplatform (Android & iOS), Ktor, Koin | [`apps/mobile`](apps/mobile) |

## Use this template

On GitHub: **Use this template → Create a new repository**, or:

```bash
gh repo create my-project --template LordClxt/ember --private --clone
```

Then follow the [renaming checklist](docs/GETTING_STARTED.md#rename-the-project).

## Quick start

Prerequisites: Node 24+, Bun 1.4+, JDK 21, Android Studio (Android), Xcode 16+ (iOS). No database to install: SQLite is used by default.

```bash
bun install            # root tooling (concurrently, Husky)
bun run install:all    # api + web dependencies
bun run dev            # API on :3000 + web on :3001
```

| URL | Description |
|-----|-------------|
| http://localhost:3001 | Web app (TanStack Start) |
| http://localhost:3000/api/docs | Swagger UI |
| http://localhost:3000/api/health | Health check |

Mobile: open `apps/mobile` in Android Studio (*androidApp* configuration) or `apps/mobile/iosApp/iosApp.xcodeproj` in Xcode.

## Root scripts

| Script | Effect |
|--------|--------|
| `bun run dev` | Runs API + web in parallel |
| `bun run build` | Builds API + web |
| `bun run test` | API tests (unit + e2e) + web tests |
| `bun run lint` | Lints API (oxlint) + web (ESLint, tsc) |
| `bun run format` | Formats everything (Prettier + Spotless) |
| `bun run mobile:android` | Builds the debug APK |
| `bun run mobile:test` | Tests the shared KMP module |

## Structure

```
ember/
├── apps/
│   ├── api/       # NestJS: REST /api/v1, Drizzle
│   ├── web/       # TanStack Start: SSR, consumes the API
│   └── mobile/    # KMP: shared (logic + Compose UI), androidApp, iosApp
├── packages/
│   └── contracts/ # API types shared by api and web (@ember/contracts)
├── docs/          # Architecture, conventions, per-app guides
├── .github/       # CI, issue / PR templates
└── docker-compose.yml
```

## Documentation

- [Getting started & renaming](docs/GETTING_STARTED.md)
- [Architecture & API contract](docs/ARCHITECTURE.md)
- [Conventions](docs/CONVENTIONS.md)
- Guides: [API](docs/API.md) · [Database](docs/DATABASE.md) · [Web](docs/WEB.md) · [Mobile](docs/MOBILE.md)
- [Contributing](CONTRIBUTING.md) · [Changelog](CHANGELOG.md)

## License

[MIT](LICENSE). The Gradle/Xcode structure of the mobile folder is derived from [Kotlin/KMP-App-Template](https://github.com/Kotlin/KMP-App-Template) (Apache 2.0).
