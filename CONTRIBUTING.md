# Contribuer

1. Crée une branche depuis `main` (`feat/…`, `fix/…`), puis lance `npm install` à la racine : il installe les hooks Git (Husky).
2. Respecte les [conventions](docs/CONVENTIONS.md).
3. Vérifie localement :
   ```bash
   npm run lint && npm test
   (cd apps/mobile && ./gradlew :shared:testAndroidHostTest)
   ```
4. Ouvre une PR en remplissant le template. La CI (API, Web, Android, iOS) doit être verte.

## Formatage

| Langage | Outil | Config |
|---------|-------|--------|
| TS, JS, JSON, YAML, CSS, HTML | Prettier | `.prettierrc` le plus proche (racine, `apps/api`, `apps/web`) |
| Kotlin (`.kt`, `.kts`) | ktlint via Spotless | `apps/mobile/.editorconfig` (style `intellij_idea`, comme Android Studio) |

Les hooks Git s'en chargent :

- **`git commit`** : `lint-staged` formate les fichiers indexés (Spotless est lancé si un fichier Kotlin est indexé, ce qui demande un JDK).
- **`git push`** : `npm run format:check` bloque le push si un fichier n'est pas formaté (par exemple après un `--no-verify`).

À la main :

```bash
npm run format               # Prettier + Spotless
npm run format:check         # vérification Prettier (aussi en CI)
npm run format:kotlin:check  # vérification Kotlin (aussi en CI, job android)
```
