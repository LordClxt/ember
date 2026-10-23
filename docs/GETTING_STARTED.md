# Getting started

## Prérequis

| Outil | Version | Pour |
|-------|---------|------|
| Node.js | 24+ | Runtime de l'API et du serveur web |
| Bun | 1.4+ | Gestionnaire de paquets et scripts (`packageManager` : `bun@1.4.4`) |
| JDK | 21 | Mobile |
| Android Studio | récent + SDK 37 | Android |
| Xcode | 16+ | iOS (macOS uniquement) |

## Installation

```bash
bun install
bun run install:all
cp apps/api/.env.example apps/api/.env
cp apps/web/.env.example apps/web/.env
bun run dev
```

## Lancer le mobile

L'app mobile appelle l'API locale :

- **Android (émulateur)** : `http://10.0.2.2:3000/api/v1`
- **iOS (simulateur)** : `http://localhost:3000/api/v1`

Ces valeurs sont définies dans `shared/src/{androidMain,iosMain}/.../core/config/AppConfig.*.kt`.

```bash
cd apps/mobile
./gradlew :androidApp:installDebug   # émulateur Android démarré
open iosApp/iosApp.xcodeproj          # puis Run dans Xcode
```

## Renommer le projet

Après avoir créé ton repo depuis le template :

1. **Nom global** : remplace `Ember` / `ember` dans `README.md`, `package.json` (racine, `apps/api`, `apps/web`).
2. **Web** : `title` dans `apps/web/src/routes/__root.tsx`, marque dans `src/components/header.tsx`, couleurs dans `src/global.css`.
3. **API** : titre Swagger dans `apps/api/src/main.ts`.
4. **Mobile**
   - `rootProject.name` dans `apps/mobile/settings.gradle.kts`
   - `namespace` / `applicationId` dans `androidApp/build.gradle.kts` et `shared/build.gradle.kts`
   - package Kotlin `com.ember` → renommer les dossiers `com/ember` (Refactor → Rename dans Android Studio)
   - `BUNDLE_ID` / `APP_NAME` / `TEAM_ID` dans `iosApp/Configuration/Config.xcconfig`
   - `app_name` dans `androidApp/src/main/res/values/strings.xml`
5. **Licence** : mets à jour le copyright dans `LICENSE`.
6. **Base de données** : garde SQLite ou choisis ton provider ([DATABASE.md](DATABASE.md)).
7. Supprime la feature d'exemple `item` / `items` quand tu as créé la tienne (voir les guides).
