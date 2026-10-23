# Getting started

## Prerequisites

| Tool | Version | For |
|------|---------|-----|
| Node.js | 24+ | Runtime of the API and the web server |
| Bun | 1.4+ | Package manager and scripts (`packageManager`: `bun@1.4.4`) |
| JDK | 21 | Mobile |
| Android Studio | recent + SDK 37 | Android |
| Xcode | 16+ | iOS (macOS only) |

## Installation

```bash
bun install   # whole workspace; also builds @ember/contracts
cp apps/api/.env.example apps/api/.env
cp apps/web/.env.example apps/web/.env
bun run dev
```

## Running the mobile app

The mobile app calls the local API:

- **Android (emulator)**: `http://10.0.2.2:3000/api/v1`
- **iOS (simulator)**: `http://localhost:3000/api/v1`

These values are defined in `shared/src/{androidMain,iosMain}/.../core/config/AppConfig.*.kt`.

```bash
cd apps/mobile
./gradlew :androidApp:installDebug   # with an Android emulator running
open iosApp/iosApp.xcodeproj          # then Run in Xcode
```

## Rename the project

After creating your repository from the template:

1. **Global name**: replace `Ember` / `ember` in `README.md` and `package.json` (root, `apps/api`, `apps/web`).
2. **Web**: `title` in `apps/web/src/routes/__root.tsx`, brand in `src/components/header.tsx`, colours in `src/global.css`.
3. **API**: Swagger title in `apps/api/src/main.ts`.
4. **Mobile**
   - `rootProject.name` in `apps/mobile/settings.gradle.kts`
   - `namespace` / `applicationId` in `androidApp/build.gradle.kts` and `shared/build.gradle.kts`
   - Kotlin package `com.ember` → rename the `com/ember` folders (Refactor → Rename in Android Studio)
   - `BUNDLE_ID` / `APP_NAME` / `TEAM_ID` in `iosApp/Configuration/Config.xcconfig`
   - `app_name` in `androidApp/src/main/res/values/strings.xml`
5. **Contracts**: package name `@ember/contracts` in `packages/contracts/package.json`, the `@ember/contracts` dependency of `apps/api` / `apps/web`, and the imports.
6. **License**: update the copyright in `LICENSE`.
7. **Database**: keep SQLite or pick your provider ([DATABASE.md](DATABASE.md)).
8. Delete the sample `item` / `items` feature once you have created your own (see the guides).
