# Changelog

Format: [Keep a Changelog](https://keepachangelog.com/en/1.1.0/) · versioning: [SemVer](https://semver.org/).

## [Unreleased]

### Changed
- **Web**: Angular replaced by **TanStack Start** (React 19, SSR, TanStack Router & Query, Tailwind 4, Node build through Nitro), following [Roy Portas' structure](https://royportas.com/posts/tanstack-start-project-structure).
- **API**: reorganised following the [NestJS naming guide](https://medium.com/@nairi.abgaryan/stop-the-chaos-clean-folder-file-naming-guide-for-backend-nest-js-and-node-331fdc6400cb): `core/` (config, database, health), `common/`, `integrations/`, `events/`, `commands/`, singular domains (`modules/item`, `ItemService`…).

- **API**: HTTP platform switched from Express to **Fastify** (`@nestjs/platform-fastify`, `@fastify/helmet`). Fastify errors (invalid JSON, unknown route) use the same error format.

### Fixed
- **API**: unstable pagination for items created within the same millisecond. Ids are now UUID v7 and rows are sorted by id.

### Documentation
- New [DATABASE.md](docs/DATABASE.md) guide (Drizzle, providers, migrations). API.md, WEB.md, ARCHITECTURE.md and CONVENTIONS.md updated.

## [0.1.0] - 2026-10-22

### Added
- NestJS 12 API: validated config, Swagger, health check, error filter, logging, repository pattern, `items` module.
- Angular 22 web app: core (ApiService, interceptor, logger, notifications), shell, signal-based store, `items` feature.
- KMP + Compose Multiplatform mobile app: Ktor, Koin, MVVM, `AppResult`, `items` feature, Android and iOS apps.
- Documentation, GitHub Actions CI, issue and PR templates.
