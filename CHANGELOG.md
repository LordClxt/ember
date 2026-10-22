# Changelog

Format : [Keep a Changelog](https://keepachangelog.com/fr/1.1.0/) · versionnement [SemVer](https://semver.org/lang/fr/).

## [Unreleased]

### Modifié
- **Web** : Angular remplacé par **TanStack Start** (React 19, SSR, TanStack Router & Query, Tailwind 4, build Node via Nitro), structure de [Roy Portas](https://royportas.com/posts/tanstack-start-project-structure).
- **API** : réorganisation selon le [guide de nommage NestJS](https://medium.com/@nairi.abgaryan/stop-the-chaos-clean-folder-file-naming-guide-for-backend-nest-js-and-node-331fdc6400cb) : `core/` (config, database, health), `common/`, `integrations/`, `events/`, `commands/`, domaines au singulier (`modules/item`, `ItemService`…).

### Corrigé
- **API** : pagination instable pour des items créés dans la même milliseconde. Les ids sont désormais des UUID v7 et le tri se fait par id.

### Documentation
- Nouveau guide [DATABASE.md](docs/DATABASE.md) (Drizzle, providers, migrations). API.md, WEB.md, ARCHITECTURE.md et CONVENTIONS.md mis à jour.

## [0.1.0] - 2026-10-22

### Ajouté
- API NestJS 12 : config validée, Swagger, health check, filtre d'erreurs, logging, pattern repository, module `items`.
- Web Angular 22 : core (ApiService, interceptor, logger, notifications), shell, store à base de signals, feature `items`.
- Mobile KMP + Compose Multiplatform : Ktor, Koin, MVVM, `AppResult`, feature `items`, apps Android et iOS.
- Documentation, CI GitHub Actions, templates d'issues et de PR.
