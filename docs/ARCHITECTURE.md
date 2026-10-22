# Architecture

## Vue d'ensemble

```
┌────────────────┐        ┌───────────────────────┐
│  Web (TanStack │──HTTP──▶                       │
│  Start, SSR)   │        │   API (NestJS)        │
└────────────────┘        │   /api/v1/*           │──▶ Repository ──▶ Drizzle
┌────────────────┐        │                       │     (SQLite · Postgres · MySQL)
│ Mobile (KMP)   │──HTTP──▶   /api/health         │
│ Android · iOS  │        └───────────────────────┘
└────────────────┘
```

Les trois apps sont **indépendantes** (chacune son gestionnaire de dépendances et son build) mais partagent un **contrat d'API** unique.

## Contrat d'API

Préfixe : `/api`, versionnement par URI (`/api/v1`). La documentation OpenAPI est générée sur `/api/docs`.

| Méthode | Route | Réponse |
|---------|-------|---------|
| `GET` | `/api/health` | état Terminus |
| `GET` | `/api/v1/items?page=1&limit=20` | `Paginated<Item>` |
| `GET` | `/api/v1/items/:id` | `Item` |
| `POST` | `/api/v1/items` | `Item` (201) |
| `PATCH` | `/api/v1/items/:id` | `Item` |
| `DELETE` | `/api/v1/items/:id` | 204 |

### Formats communs

```jsonc
// Liste paginée
{ "data": [ /* T */ ], "meta": { "page": 1, "limit": 20, "total": 42 } }

// Erreur (toutes les erreurs passent par AllExceptionsFilter)
{ "statusCode": 400, "message": ["name should not be empty"], "path": "/api/v1/items", "timestamp": "…" }
```

Dates en ISO 8601 (UTC). Identifiants en UUID v7 (triables par date de création).

## Patterns par couche

| Couche | API (NestJS) | Web (TanStack Start) | Mobile (KMP) |
|--------|--------------|---------------|--------------|
| Transport | Controller | `lib/api-client.ts` + `lib/<domaine>.ts` | `KtorItemsApi` |
| Validation | DTO + `ValidationPipe` | `validateSearch` des routes, formulaires | — |
| Orchestration | Service | Loader de route + TanStack Query (`queryOptions`, hooks de mutation) | ViewModel (`StateFlow`) |
| Accès données | Repository (token) → Drizzle | — (l'API possède la base) | Repository (interface domaine) |
| Erreurs | `AllExceptionsFilter` | `ApiError` + `defaultErrorComponent` / `notFound()` | `safeApiCall` → `AppResult` |
| DI | Modules Nest | Contexte du router (`queryClient`) | Koin |

### Principes

- **Structure par domaine** : `modules/item/` côté API, `components/items/` + `lib/items.ts` + `routes/items/` côté web, `features/items/` côté mobile.
- **Dépendre d'abstractions** : les services/ViewModels consomment des interfaces (repository), jamais l'implémentation concrète.
- **Couches fines** : controllers / composants / écrans ne contiennent pas de logique ; ils délèguent.
- **Erreurs centralisées** : un seul endroit par app pour transformer une erreur en message utilisateur.
- **Pas de logique métier dans le template** : `items` n'est qu'un exemple à remplacer.

## Base de données

Drizzle ORM, provider configurable (`DB_PROVIDER`), **SQLite par défaut**. Voir [DATABASE.md](DATABASE.md).

## Références d'organisation

- API : [Clean Folder & File Naming Guide for NestJS](https://medium.com/@nairi.abgaryan/stop-the-chaos-clean-folder-file-naming-guide-for-backend-nest-js-and-node-331fdc6400cb), détaillé dans [API.md](API.md)
- Web : [TanStack Start project structure](https://royportas.com/posts/tanstack-start-project-structure), détaillé dans [WEB.md](WEB.md)
