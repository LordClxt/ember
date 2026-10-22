# Architecture

## Vue d'ensemble

```
┌────────────────┐        ┌───────────────────────┐
│  Web (Angular) │──HTTP──▶                       │
└────────────────┘        │   API (NestJS)        │
┌────────────────┐        │   /api/v1/*           │──▶ Repository (in-memory → DB)
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

Dates en ISO 8601 (UTC). Identifiants en UUID v4.

## Patterns par couche

| Couche | API (NestJS) | Web (Angular) | Mobile (KMP) |
|--------|--------------|---------------|--------------|
| Transport | Controller | `ApiService` + `*.api.ts` | `KtorItemsApi` |
| Validation | DTO + `ValidationPipe` | Reactive Forms | — |
| Orchestration | Service | Store (signals) | ViewModel (`StateFlow`) |
| Accès données | Repository (token d'injection) | — | Repository (interface domaine) |
| Erreurs | `AllExceptionsFilter` | `errorInterceptor` + `NotificationService` | `safeApiCall` → `AppResult` |
| DI | Modules Nest | `inject()` / providers de route | Koin |

### Principes

- **Feature-first** : tout ce qui concerne une feature vit dans son dossier (`modules/items`, `features/items`).
- **Dépendre d'abstractions** : les services/ViewModels consomment des interfaces (repository), jamais l'implémentation concrète.
- **Couches fines** : controllers / composants / écrans ne contiennent pas de logique ; ils délèguent.
- **Erreurs centralisées** : un seul endroit par app pour transformer une erreur en message utilisateur.
- **Pas de logique métier dans le template** : `items` n'est qu'un exemple à remplacer.

## Ajouter une base de données (API)

Le module `items` utilise `InMemoryItemsRepository`. Pour persister :

1. Ajoute ton ORM (Prisma, TypeORM, Drizzle…).
2. Crée `PrismaItemsRepository implements ItemsRepository`.
3. Remplace `useClass` dans `items.module.ts`. Le service et le controller ne changent pas.
